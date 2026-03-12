import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/dbConnect.js";
import credentials from "./middleware/credentials.js";
import corsOptions from "./config/corsOptions.js";
import userRoutes from "./routes/userRoutes.js";
import refreshTokenRoutes from "./routes/refreshTokenRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import CartRoutes from "./routes/CartRoutes.js";
import { fileURLToPath } from "url";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3500;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));

//middleware
app.use(credentials);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

//routes
app.use("/user", userRoutes);
app.use("/refresh", refreshTokenRoutes);
app.use("/product", productRoutes);
app.use("/cart", CartRoutes);
app.use("/order", orderRoutes);
app.use("/pay", paymentRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
