import orderModel from "../models/orderModel.js";
import user from "../models/user.js";
import CartModel from "../models/CartModel.js";
import { getNextOrderNumber } from "../utils/generateOrderNumber.js";

export const confirmOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalPrice, products } = req.body;
    const orderNumber = await getNextOrderNumber();

    const foundUser = await user.findOne({ _id: userId });
    if (!foundUser)
      return res.status(401).json({ sucess: false, message: "Unauthorized" });

    await orderModel.create({
      orderNumber,
      user: userId,
      products: products,
      totalPrice: totalPrice,
      tracking: {
        courier: req.body.courier || "",
      },
    });
    const mycart = await CartModel.findOne({ user: userId }).populate(
      "items.product",
    );
    if (mycart) {
      mycart.items = mycart.items.filter((item) => item.checkBox === false);
      await mycart.save();
    }
    if (mycart.items.length === 0) {
      await CartModel.deleteOne({ user: userId });
    }
    res.status(200).json({ success: true, message: "Order Successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error Confirming Order" });
  }
};
