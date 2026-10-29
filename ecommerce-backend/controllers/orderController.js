import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { orderView, ordersView } from "../views/orderView.js";

export const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: 1 });
  res.json(ordersView(orders));
};

export const createOrder = async (req, res) => {
  const items = req.body.items || [];

  // pehle stock check karo
  for (const item of items) {
    if (!item.productId) continue;

    const product = await Product.findById(item.productId);

    if (!product) {
      return res.status(400).json({ message: `${item.name} ab available nahi hai` });
    }
    if (product.stock < item.qty) {
      return res.status(400).json({
        message: `${product.name}: sirf ${product.stock} available hain`,
      });
    }
  }

  const last = await Order.findOne().sort({ createdAt: -1 });
  const next = last ? Number(last.orderId.split("-")[1]) + 1 : 1001;

  const order = await Order.create({ ...req.body, orderId: `ORD-${next}` });

  for (const item of order.items) {
    if (!item.productId) continue;
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.qty, sold: item.qty },
    });
  }
  res.status(201).json(orderView(order));
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { orderId: req.params.orderId },
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(orderView(order));
};

export const deleteOrder = async (req, res) => {
  const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ message: "Order deleted" });
};