import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.LoginUser);

router.post("/logout", userController.logoutUser);

export default router;
