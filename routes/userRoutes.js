import express from "express";
import userController from "../controllers/userController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.LoginUser);

router.post("/logout", userController.logoutUser);

router.get("/getUser", verifyJWT, userController.getUser);

router.put("/updateUser", verifyJWT, userController.updateUser);

export default router;
