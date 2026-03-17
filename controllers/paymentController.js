import Stripe from "stripe";
import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";
import user from "../models/user.js";
import checkOutModel from "../models/checkOutModel.js";
import paymentModel from "../models/paymentModel.js";

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
      metadata: {
        checkoutId: checkout._id.toString(),
        userId: userId.toString(),
      },
    });

    const expireTime = new Date(Date.now() + 30 * 60 * 1000);
    const payment = await Payment.create({
      user: userId,
      checkout: checkout._id,
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
    const checkoutId = paymentIntent.metadata.checkoutId;
    const userId = paymentIntent.metadata.userId;

    try {
      const updated = await Order.findOneAndUpdate(
        { checkout: checkoutId },
        {
          paymentStatus: "paid",
          paymentIntentId: paymentIntent.id,
        },
      );
      const payment = await paymentModel.findOneAndUpdate(
        {
          checkout: checkoutId,
          user: userId,
          stripePaymentIntentId: paymentIntent.id,
        },
        { expireAt: null, status: "succeeded", paymentMethod: "Card" },
      );
      if (!updated && !payment)
        return res.status(400).json({ message: `Faild to Update` });
      console.log(`Order ${checkoutId} marked as paid.`);
    } catch (err) {
      console.log(`Failed to update order ${checkoutId}:`, err.message);
    }
  }

  res.json({ received: true });
};
