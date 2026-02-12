import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { bucket } from "../config/firebase.js";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//Register Controller
const registerUser = async (req, res) => {
  try {
    const { user, email, password } = req.body;

    if (!USER_REGEX.test(user))
      return res.status(400).json({ message: "Invalid username" });

    if (!PWD_REGEX.test(password))
      return res.status(400).json({ message: "Invalid password" });

    if (!EMAIL_REGEX.test(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!user || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      user,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: `New user ${newUser.user} has been created!`,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

//Login Controller
const LoginUser = async (req, res) => {
  try {
    const { user, password } = req.body;
    const foundUser = await User.findOne({
      $or: [{ user: user }, { email: user }],
    })
      .select("+password +refreshToken")
      .exec();
    if (!foundUser) {
      return res.sendStatus(401);
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const roles = Object.values(foundUser.roles).filter(Boolean);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            _id: foundUser._id.toString(),
            user: foundUser.user,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" },
      );
      const refreshToken = jwt.sign(
        { user: foundUser.user },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1h" },
      );
      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();
      console.log(result);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken, user: foundUser.user, roles });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Failed to Login: ${err.message}` });
  }
};

const logoutUser = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        samesite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    foundUser.refreshToken = "";
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie("jwt", { httpOnly: true, samesite: "None", secure: true });
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Logout Failed" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const foundUser = await User.findOne({ _id: userId });
    if (!foundUser) {
      return res.sendStatus(401);
    }

    res.status(200).json({ success: true, data: foundUser });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, messsage: "Error getting User details" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const updateData = { ...req.body };

    const file = req.file;
    if (file) {
      if (user.image) {
        const filePath = user.image.split(
          `https://storage.googleapis.com/${bucket.name}/`,
        )[1];
        const oldFile = bucket.file(filePath);
        await oldFile
          .delete()
          .catch(() => console.log("No old file to delete"));
      }
      const fileName = `Users/${userId}/${Date.now()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true,
      });

      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      updateData.image = imageUrl;
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      {
        new: true,
      },
    );
    res.status(200).json({
      success: true,
      message: "Update Successfully!",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error Updating User Status" });
  }
};
export default { registerUser, LoginUser, logoutUser, getUser, updateUser };
