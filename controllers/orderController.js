import orderModel from "../models/orderModel.js";
import user from "../models/user.js";
import CartModel from "../models/CartModel.js";
import checkOutModel from "../models/checkOutModel.js";
import { getNextOrderNumber } from "../utils/generateOrderNumber.js";

export const checkoutOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalPrice, products } = req.body;
    const foundUser = await user.findOne({ _id: userId });
    if (!foundUser)
      return res.status(401).json({ sucess: false, message: "Unauthorized" });

    const checkOutOrder = await checkOutModel.create({
      user: userId,
      products: products,
      totalPrice: totalPrice,
    });
    res.status(201).json({
      success: true,
      message: "Order Successfully!",
      data: checkOutOrder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error Check Out Order" });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalPrice, products } = req.body;
    const orderNumber = await getNextOrderNumber();

    const foundUser = await user.findOne({ _id: userId });
    if (!foundUser)
      return res.status(401).json({ sucess: false, message: "Unauthorized" });

    const order = await orderModel.create({
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
    res
      .status(201)
      .json({ success: true, message: "Order Successfully!", data: order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error Confirming Order" });
  }
};

export const GetOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const foundOrders = await orderModel.find({
      user: userId,
    });
    if (!foundOrders)
      res.status(404).json({ success: false, message: "No Order found" });
    res
      .status(200)
      .json({ success: true, message: "found Order", data: foundOrders });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, messsage: "Invalid getting Orders" });
  }
};
