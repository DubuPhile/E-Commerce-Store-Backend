import AllowedOrigin from "./AllowedOrigin.js";

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (AllowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
