import mongoose from "mongoose";
const schema = mongoose.Schema;

const addressSchema = new schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullName: String,
    phone: String,
    street: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Address", addressSchema);
