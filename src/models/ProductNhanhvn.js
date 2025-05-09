import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  capacity: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  available: { type: Boolean, default: true },
  nhanhID: { type: String, required: true },
});

// Define image schema for more structured image data
const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, default: "main" },
});

const ProductNhanhvnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [ImageSchema],
    slug: { type: String, required: true, unique: true },
    tags: { type: [String] },
    available: { type: Boolean, default: true },
    variants: [VariantSchema],
    description: { type: String },
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
