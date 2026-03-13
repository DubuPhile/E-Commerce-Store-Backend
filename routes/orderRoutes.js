import express from "express";
import {
  checkoutOrder,
  confirmOrder,
  GetOrders,
} from "../controllers/orderController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.post("/checkout-order", verifyJWT, checkoutOrder);

router.post("/confirm-order", verifyJWT, confirmOrder);

router.get("/get-orders", verifyJWT, GetOrders);

export default router;
