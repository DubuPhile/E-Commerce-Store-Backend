import express from "express";
import { confirmOrder, GetOrders } from "../controllers/orderController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.post("/confirm-order", verifyJWT, confirmOrder);

router.get("/get-orders", verifyJWT, GetOrders);

export default router;
