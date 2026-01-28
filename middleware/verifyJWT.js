import jwt from "jsonwebtoken";

const verifyJWT = (res, req, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = {
      id: decoded.UserInfo._id,
      user: decoded.UserInfo.user,
      roles: decoded.UserInfo.roles,
    };
    next();
  });
};

export default verifyJWT;
