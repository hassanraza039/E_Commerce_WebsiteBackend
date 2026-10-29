import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "General" },
    price: { type: Number, required: true },
    cut_price: Number,
    discount: String,
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 4 },
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);