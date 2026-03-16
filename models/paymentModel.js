import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userOrder",
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "php",
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
    },
    expireAt: { type: Date },
  },
  { timestamps: true },
);
paymentSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Payment", paymentSchema);
