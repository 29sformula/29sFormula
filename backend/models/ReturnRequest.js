import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  orderObjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  reason: { type: String, required: true },
  images: [{ type: String }],
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
  adminNotes: { type: String, default: "" }
}, { timestamps: true });

const ReturnRequest = mongoose.models.ReturnRequest || mongoose.model("ReturnRequest", returnRequestSchema);
export default ReturnRequest;
