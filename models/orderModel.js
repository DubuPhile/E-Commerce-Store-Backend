import mongoose from "mongoose";
const schema = mongoose.Schema;

const userOrderSchema = new schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    products: [],
    totalPrice: number,
    tracking: {
      courier: String,
      trackingNumber: String,
      status: {
        type: String,
        enum: ["Processing", "Shipped", "Out for Delivery", "Delivered"],
        default: "Processing",
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("userOrder", userOrderSchema);
