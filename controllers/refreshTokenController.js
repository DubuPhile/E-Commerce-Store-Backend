import User from "../models/user.js";
import jwt from "jsonwebtoken";

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.user !== decoded.user) return res.sendStatus(403);
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
      { expiresIn: "1h" },
    );
    res.json({ accessToken, user: foundUser.user, roles });
  });
};

export default { handleRefreshToken };
