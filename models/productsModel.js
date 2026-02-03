import mongoose from "mongoose";
const schema = mongoose.Schema;

const productSchema = new schema(
  {
    name: String,
    imageUrl: {
      type: String,
    },
    category: String,
    price: Number,
    description: String,
  },
  { timestamps: true },
);

export default mongoose.model("product", productSchema);
