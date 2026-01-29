import productsModel from "../models/productsModel.js";

export const addProduct = async (req, res) => {
  const { name, imageUrl, price, category } = req.body;

  if (!name || !imageUrl || !price || !category) {
    return res
      .status(400)
      .json({ message: "Name, ImageUrl, Price and category is required" });
  }
  try {
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

export const productController = { addProduct, getAllProducts };
