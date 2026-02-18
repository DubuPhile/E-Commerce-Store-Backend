import express from "express";
import userController from "../controllers/userController.js";
import verifyJWT from "../middleware/verifyJWT.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.LoginUser);

router.post("/logout", userController.logoutUser);

router.get("/getUser", verifyJWT, userController.getUser);

router.put(
  "/updateUser",
  upload.single("image"),
  verifyJWT,
  userController.updateUser,
);

router.patch("/changePwd", verifyJWT, userController.changePwd);

//OTP routes
router.post("/change-password/send-otp", verifyJWT, userController.sendOTP);

router.post("/verify-otp", verifyJWT, userController.verifyOTP);

export default router;
