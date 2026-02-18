import mongoose from "mongoose";
const schema = mongoose.Schema;

const otpSchema = new schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["FORGOT_PASSWORD", "CHANGE_PASSWORD"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model("OTP", otpSchema);
