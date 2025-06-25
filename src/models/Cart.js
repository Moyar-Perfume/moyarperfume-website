import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  slug: { type: String, required: true }, // Sản phẩm
  variant: {
    id: { type: String, required: true }, // _id của variant từ Product
    capacity: String, // Dùng để hiển thị
    price: Number,
  },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    cartId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isGuest: { type: Boolean, default: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
