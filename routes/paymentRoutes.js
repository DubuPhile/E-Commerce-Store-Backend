import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.post("/payment-intent", verifyJWT, createPaymentIntent);

export default router;
