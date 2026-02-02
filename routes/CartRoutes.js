import express from "express";
import {
  addToCart,
  getMyCart,
  deleteItem,
  changeQuantity,
} from "../controllers/cartController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.post("/add-to-cart", verifyJWT, addToCart);
router.get("/get-my-cart", verifyJWT, getMyCart);

router.delete("/delete-item/:productId", verifyJWT, deleteItem);

router.put("/changeQty/:itemId", verifyJWT, changeQuantity);

export default router;
