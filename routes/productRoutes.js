import express from "express";
import { upload } from "../middleware/multer.js";
import {
  addProduct,
  getAllProducts,
  searchProducts,
  getProductDetails,
} from "../controllers/productController.js";
const router = express.Router();

router.post("/add", upload.single("image"), addProduct);

router.get("/", getAllProducts);

router.get("/search", searchProducts);

router.get("/get-product/:Id", getProductDetails);

export default router;
