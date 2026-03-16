import mongoose from "mongoose";

const CheckoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: Object, required: true }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date },
});

CheckoutSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("checkout", CheckoutSchema);
