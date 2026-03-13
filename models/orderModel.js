import mongoose from "mongoose";
const schema = mongoose.Schema;

const userOrderSchema = new schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },
    products: [],
    totalPrice: Number,
    tracking: {
      courier: String,
      trackingNumber: String,
      status: {
        type: String,
        enum: ["Processing", "Shipped", "Out for Delivery", "Delivered"],
        default: "Processing",
      },
    },
    paymentMethod: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("userOrder", userOrderSchema);
