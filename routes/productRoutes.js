import express from "express";
import { upload } from "../middleware/multer.js";
import {
  addProduct,
  getAllProducts,
} from "../controllers/productController.js";
const router = express.Router();

router.post("/add", upload.single("image"), addProduct);

router.get("/", getAllProducts);

export default router;
