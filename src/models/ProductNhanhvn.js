import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  capacity: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  available: { type: Boolean, default: true },
  nhanhID: { type: String, required: true },
});

const ProductNhanhvnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mainImage: { type: String, required: false },
    subImages: [{ type: String }],
    slug: { type: String, required: true, unique: true },
    tags: { type: [String] },
    available: { type: Boolean, default: true },
    variants: [VariantSchema],
    description: { type: String },
    content: { type: String },
    nhanhBrandID: { type: String },
    showHot: { type: Boolean, default: false },
    showNew: { type: Boolean, default: false },
    showHome: { type: Boolean, default: false },
    brandID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: false,
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ProductNhanhvn ||
  mongoose.model("ProductNhanhvn", ProductNhanhvnSchema);
