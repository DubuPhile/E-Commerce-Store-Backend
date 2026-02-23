import admin from "../config/firebase.js";
import user from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { bucket } from "../config/firebase.js";
import otpModel from "../models/otpModel.js";

export const firebaseLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;
    console.log(decodedToken);

    let foundUser = await user.findOne({ email }).select("+password");
    if (!foundUser) {
      let uploadImageUrl = null;

      if (picture) {
        const response = await fetch(picture);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filename = `Users/${name}/${Date.now()}-${name}`;
        const file = bucket.file(filename);

        await file.save(buffer, {
          metadata: {
            contentType: "image/jpeg",
          },
          public: true,
        });

        uploadImageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      }

      foundUser = await user.create({
        user: name,
        email,
        image: uploadImageUrl,
        authProviderId: uid,
        authProvider: "firebase",
      });
    }
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
    res.json({
      accessToken,
      user: foundUser.user,
      roles,
      hasLocalPassword: !!foundUser.password,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Firebase Login Failed." });
  }
};

export const setPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "New Password and Confirm Password do not Match!",
      });
    }
    const foundUser = await user.findOne({ _id: userId });
    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verOTP = await otpModel.findOne({
      userId: foundUser._id,
      isVerified: true,
    });

    if (!verOTP) return res.status(400).json({ message: "OTP not verified" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.findOneAndUpdate(
      { _id: userId },
      { $set: { password: hashedPassword } },
      { new: true },
    );

    await otpModel.deleteOne({ _id: verOTP._id });
    res
      .status(200)
      .json({ success: true, message: "Password Set Successfully!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error setting Password!" });
  }
};
