import express from "express";
import { confirmOrder } from "../controllers/orderController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.post("/confirm-order", verifyJWT, confirmOrder);

export default router;
