import { bucket } from "../config/firebase.js";
import productsModel from "../models/productsModel.js";

export const addProduct = async (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !category || !price || !req.file) {
    return res
      .status(400)
      .json({ message: "Name, Image, Price and category is required" });
  }
  try {
    const file = req.file;
    const fileName = `Products/${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      public: true,
    });

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    const result = await productsModel.create({
      name: name,
      imageUrl: imageUrl,
      price: price,
      category: category,
    });
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    if (!products)
      return res.sendStatus(204).json({ message: "No Products Found." });
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) return res.status(400).json({ message: "Query is Required!" });

    const products = await productsModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const productId = req.params.Id;
    if (!productId)
      return res.status(400).json({ message: "Product not Found!" });

    const product = await productsModel.findById(productId);

    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invalid getting Products" });
  }
};
export const productController = {
  addProduct,
  getAllProducts,
  searchProducts,
  getProductDetails,
};
