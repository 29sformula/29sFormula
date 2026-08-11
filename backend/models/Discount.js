import mongoose from "mongoose";

// Define Discount Schema
const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, default: "percentage" }, // "percentage" or "fixed"
  value: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Discount = mongoose.models.Discount || mongoose.model("Discount", discountSchema);

export default Discount;
