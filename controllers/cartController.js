import CartModel from "../models/CartModel.js";

export const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;
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

export const deleteItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const updatedCart = await CartModel.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { _id: productId } } },
      { new: true },
    );
    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(updatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const changeQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    const updateCart = await CartModel.findOneAndUpdate(
      { user: userId, "items._id": itemId },
      { $set: { "items.$.quantity": quantity } },
      { new: true },
    );
    if (!updateCart) {
      return res.status(404).json({ message: "Cart or item not found" });
    }

    res.status(200).json(updateCart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Change Quantity" });
  }
};

export const CartController = {
  addToCart,
  getMyCart,
  deleteItem,
  changeQuantity,
};
