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
  gender: String,
  date: String,
  image: String,
  roles: {
    User: {
      type: Number,
      default: 700,
    },
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  refreshToken: {
    type: String,
    select: false,
  },
});

export default mongoose.model("user", userSchema);
