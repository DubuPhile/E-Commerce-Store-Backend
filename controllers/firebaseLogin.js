import admin from "../config/firebase.js";
import user from "../models/user.js";
import jwt from "jsonwebtoken";

export const firebaseLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;
    console.log(decodedToken);

    let foundUser = await user.findOne({ email }).select("+password");
    if (!foundUser) {
      foundUser = await user.create({
        user: name,
        email,
        image: picture,
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
