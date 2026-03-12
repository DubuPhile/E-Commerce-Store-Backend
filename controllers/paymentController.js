import Stripe from "stripe";
import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import user from "../models/user.js";
import CartModel from "../models/CartModel.js";

export const createPaymentIntent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    const foundUser = await user.findOne({ _id: userId });
    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const amount = order.totalPrice;
    const currency = "usd";

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    });

    const payment = await Payment.create({
      user: userId,
      order: orderId,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: "pending",
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const confirmPayment = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    });

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (paymentIntent.status === "succeeded") {
      payment.status = "succeeded";
      payment.paymentMethod = paymentIntent.payment_method_types[0];
      await payment.save();
    } else if (paymentIntent.status === "requires_payment_method") {
      payment.status = "failed";
      await payment.save();
    }

    res.json({ success: true, status: payment.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
