import mongoose from "mongoose";

// Define Review Schema
const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  author: { type: String, required: true },
  avatar: { type: String },
  avatarBg: { type: String, default: "#f1f5f9" },
  avatarColor: { type: String, default: "#334155" },
  location: { type: String, default: "IN" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  title: { type: String },
  images: { type: [String], default: [] },
  verified: { type: Boolean, default: true },
  helpful: { type: Number, default: 0 }
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
