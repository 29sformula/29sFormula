import mongoose from "mongoose";

// Define Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: false, index: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      makingPrice: { type: Number, default: 0 },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  status: { type: String, default: "Processing" },
  deletedByAdmin: { type: Boolean, default: false },
  refundStatus: { type: String, default: "Not Refunded" }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
