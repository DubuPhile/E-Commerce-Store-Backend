import AllowedOrigin from "../config/AllowedOrigin.js";

const credentials = (req, res, next) => {
  const origin = req.header.origin;

  if (AllowedOrigin.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

export default credentials;
