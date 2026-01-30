import CartModel from "../models/CartModel.js";
import productsModel from "../models/productsModel.js";
import user from "../models/user.js";

export const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const mycart = await CartModel.findOne({ user: userId }).populate(
      "items.product",
    );

    res.status(200).json(mycart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error to get your Cart!" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = await CartModel.create({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    const populatedCart = await CartModel.findOne({ user: userId }).populate(
      "items.product",
    );

    res.status(200).json(populatedCart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

export const CartController = { addToCart };
