import mongoose from "mongoose";
const schema = mongoose.Schema;

const userSchema = new schema({
  user: {
    type: String,
    required: [true, "User is required"],
  },
  email: {
    type: String,
    required: true,
  },
  gender: { type: String, default: "Other" },
  date: String,
  image: String,
  roles: {
    User: {
      type: Number,
      default: 700,
    },
    Admin: Number,
  },
  authProviderId: {
    type: String,
    select: false,
  },
  authProvider: {
    type: String,
    enum: ["local", "firebase"],
    default: "local",
  },
  password: {
    type: String,
    required: function () {
      return this.provider === "local";
    },
    select: false,
  },
  refreshToken: {
    type: String,
    select: false,
  },
});

export default mongoose.model("user", userSchema);
