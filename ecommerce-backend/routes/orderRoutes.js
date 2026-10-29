import express from "express";
import {
  getOrders, createOrder, updateOrderStatus, deleteOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(protect, getOrders).post(createOrder);
router.route("/:orderId").patch(protect, updateOrderStatus).delete(protect, deleteOrder);

export default router;