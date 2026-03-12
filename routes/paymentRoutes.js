import express from "express";
import {
  confirmPayment,
  createPaymentIntent,
} from "../controllers/paymentController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.post("/payment-intent", verifyJWT, createPaymentIntent);

router.patch("/payment-confirm", verifyJWT, confirmPayment);

export default router;
