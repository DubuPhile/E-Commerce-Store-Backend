import mongoose from "mongoose";
const schema = mongoose.Schema;

const cartSchema = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      product: {
        type: schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
