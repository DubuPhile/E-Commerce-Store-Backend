import express from "express";
import { addToCart, getMyCart } from "../controllers/cartController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.post("/add-to-cart", verifyJWT, addToCart);
router.get("/get-my-cart", verifyJWT, getMyCart);

export default router;
