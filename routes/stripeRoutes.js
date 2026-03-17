import express from "express";
import { stripeWebhookController } from "../controllers/paymentController.js";
const router = express.Router();
router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController,
);

export default router;
