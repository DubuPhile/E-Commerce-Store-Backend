import Stripe from "stripe";
import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import user from "../models/user.js";
import CartModel from "../models/CartModel.js";
import checkOutModel from "../models/checkOutModel.js";

export const createPaymentIntent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    const foundUser = await user.findOne({ _id: userId });
    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const checkout = await checkOutModel.findById(orderId);
    if (!checkout)
      return res.status(404).json({ message: "Checkout not found" });

    const amount = checkout.totalPrice;
    const currency = "usd";

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    });

    const expireTime = new Date(Date.now() + 30 * 60 * 1000);
    const payment = await Payment.create({
      user: userId,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: "pending",
      expireAt: expireTime,
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

export const stripeWebhookController = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    try {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        paymentIntentId: paymentIntent.id,
      });
      console.log(`Order ${orderId} marked as paid.`);
    } catch (err) {
      console.log(`Failed to update order ${orderId}:`, err.message);
    }
  }

  res.json({ received: true });
};
