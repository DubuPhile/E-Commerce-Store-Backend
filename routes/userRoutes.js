import express from "express";
import userController from "../controllers/userController.js";
import verifyJWT from "../middleware/verifyJWT.js";
import { upload } from "../middleware/multer.js";
import { firebaseLogin, setPassword } from "../controllers/firebaseLogin.js";
const router = express.Router();

router.post("/register", userController.registerUser); //register User Routes

router.post("/login", userController.LoginUser); //Login Routes

router.post("/firebase-login", firebaseLogin); //Social Media/firebase Login Routes

router.post("/logout", userController.logoutUser); //log out routes

router.get("/getUser", verifyJWT, userController.getUser); //Get User Details Routes

router.put(
  "/updateUser",
  upload.single("image"),
  verifyJWT,
  userController.updateUser,
); // Update User ROutes

router.patch("/changePwd", verifyJWT, userController.changePwd); //change Password Routes

router.patch("/set-password", verifyJWT, setPassword); //Set Password Routes

//OTP routes
router.post("/change-password/send-otp", verifyJWT, userController.sendOTP); // Send OTP

router.post("/verify-otp", verifyJWT, userController.verifyOTP); // Verify OTP

router.post("/add-address", verifyJWT, userController.addAddress);

export default router;
