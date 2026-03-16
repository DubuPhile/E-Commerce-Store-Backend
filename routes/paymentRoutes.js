import express from "express";
import {
  confirmPayment,
  createPaymentIntent,
  stripeWebhookController,
} from "../controllers/paymentController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.post("/payment-intent", verifyJWT, createPaymentIntent);

router.patch("/payment-confirm", verifyJWT, confirmPayment);

router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController,
);

export default router;
