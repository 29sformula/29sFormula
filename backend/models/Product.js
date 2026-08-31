import mongoose from "mongoose";

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageFront: { type: String, required: true },
  imageBack: { type: String },
  images: { type: [String], default: [] },
  additionalInformation: { type: String, default: "" },
  artOfWrapping: { type: String, default: "" },
  onlineOrder: { type: String, default: "" },
  
  // Denormalized computed values for fast storefront query rendering
  price: { type: Number },
  strikePrice: { type: Number },
  makingPrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  category: { type: [String], default: [] },
  sizes: { type: [String], default: [] }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const productVariantSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  strikePrice: { type: Number },
  makingPrice: { type: Number, default: 0 },
  category: { type: [String], default: [] }
}, { timestamps: true });

productVariantSchema.index({ productId: 1, size: 1 }, { unique: true });

const ProductVariant = mongoose.models.ProductVariant || mongoose.model("ProductVariant", productVariantSchema);

export { Product, ProductVariant };
