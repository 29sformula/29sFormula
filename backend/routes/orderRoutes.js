import express from "express";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import { Product, ProductVariant } from "../models/Product.js";

const router = express.Router();

router.post("/api/orders", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, cartItems, totalAmount, paymentMethod } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Missing required order details" });
    }

    const email = customerEmail.toLowerCase().trim();

    let calculatedTotal = 0;
    const resolvedCartItems = [];
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      
      let actualPrice = product.price || 0;
      let actualMakingPrice = product.makingPrice || 0;
      const variant = await ProductVariant.findOne({ productId: item.productId, size: item.size });
      if (variant && variant.price) {
        actualPrice = variant.price;
        actualMakingPrice = variant.makingPrice || 0;
      } else {
        // Fallback to embedded options if variants aren't extracted
        const embeddedOpt = product.options?.find(o => o.size === item.size);
        if (embeddedOpt && embeddedOpt.price) {
          actualPrice = embeddedOpt.price;
          actualMakingPrice = embeddedOpt.makingPrice || 0;
        }
      }

      resolvedCartItems.push({
        productId: item.productId,
        variantId: variant ? variant._id : null,
        name: product.name || item.name,
        price: actualPrice,
        makingPrice: actualMakingPrice,
        size: item.size,
        quantity: item.quantity,
        image: product.imageFront || item.image
      });
      calculatedTotal += actualPrice * item.quantity;
    }
    
    // Override client's totalAmount with the securely calculated server total
    const secureTotalAmount = calculatedTotal;

    let customer = await Customer.findOne({ email });
    if (customer) {
      customer.totalOrders += 1;
      customer.totalSpend += secureTotalAmount;
      customer.name = customerName;
      customer.phone = customerPhone;
      if (shippingAddress) customer.address = shippingAddress;
      await customer.save();
    } else {
      customer = await Customer.create({
        name: customerName,
        email,
        phone: customerPhone,
        address: shippingAddress,
        totalOrders: 1,
        totalSpend: secureTotalAmount
      });
    }

    let orderIdNum = 1001;
    const lastOrder = await Order.findOne({ orderId: /^ORD-\d+$/ }).sort({ _id: -1 });
    if (lastOrder && lastOrder.orderId) {
      const parts = lastOrder.orderId.split("-");
      const lastNum = parseInt(parts[1], 10);
      if (!isNaN(lastNum)) {
        orderIdNum = lastNum + 1;
      }
    }
    const orderId = `ORD-${orderIdNum}`;

    const newOrder = new Order({
      orderId,
      customerId: customer._id,
      cartItems: resolvedCartItems,
      totalAmount: secureTotalAmount,
      paymentMethod: paymentMethod || "COD",
      status: "Processing"
    });

    await newOrder.save();

    // Reduce stock for each product variant and base product
    for (const item of resolvedCartItems) {
      if (item.productId) {
        await ProductVariant.updateOne(
          { productId: item.productId, size: item.size },
          { $inc: { quantity: -item.quantity } }
        );
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { quantity: -item.quantity } }
        );
      }
    }

    // Invalidate products cache
    invalidateProductsCache();

    const orderJson = newOrder.toJSON();
    orderJson.customerName = customerName;
    orderJson.customerEmail = customerEmail;
    orderJson.customerPhone = customerPhone;
    orderJson.shippingAddress = shippingAddress;

    res.status(201).json(orderJson);
  } catch (error) {
    console.error("Failed to place order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).populate("customerId").sort({ createdAt: -1 }).lean();
    const mappedOrders = orders.map(order => {
      const customer = order.customerId;
      return {
        ...order,
        customerName: customer ? customer.name : (order.customerName || "Unknown Customer"),
        customerEmail: customer ? customer.email : (order.customerEmail || ""),
        customerPhone: customer ? customer.phone : (order.customerPhone || ""),
        shippingAddress: customer ? customer.address : (order.shippingAddress || "")
      };
    });
    res.json(mappedOrders);
  } catch (error) {
    console.error("Failed to retrieve orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

router.put("/api/orders/:id", async (req, res) => {
  try {
    const { status, refundStatus } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (refundStatus !== undefined) updateData.refundStatus = refundStatus;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Fulfillment status or refund status is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    ).populate("customerId").lean();

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const customer = updatedOrder.customerId;
    const mappedOrder = {
      ...updatedOrder,
      customerName: customer ? customer.name : (updatedOrder.customerName || "Unknown Customer"),
      customerEmail: customer ? customer.email : (updatedOrder.customerEmail || ""),
      customerPhone: customer ? customer.phone : (updatedOrder.customerPhone || ""),
      shippingAddress: customer ? customer.address : (updatedOrder.shippingAddress || "")
    };

    res.json(mappedOrder);
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

router.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const wasAlreadyCancelled = order.status === "Cancelled";

    // Mark as deleted by admin and cancel order
    order.deletedByAdmin = true;
    order.status = "Cancelled";
    await order.save();

    // Restore stock for variants and base product if not already cancelled
    if (!wasAlreadyCancelled && order.cartItems && Array.isArray(order.cartItems)) {
      for (const item of order.cartItems) {
        if (item.productId) {
          await ProductVariant.updateOne(
            { productId: item.productId, size: item.size },
            { $inc: { quantity: item.quantity } }
          );
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { quantity: item.quantity } }
          );
        }
      }
      invalidateProductsCache();
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Order deletion failed:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

router.get("/api/orders/track", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const trimmedQuery = query.trim();
    const email = trimmedQuery.toLowerCase();
    const phone = trimmedQuery;

    // Search for a customer matching the query first
    const customer = await Customer.findOne({
      $or: [
        { email },
        { phone }
      ]
    });

    let currentOrder = null;
    let history = [];

    // First try: query is an Order ID
    currentOrder = await Order.findOne({ orderId: trimmedQuery }).populate("customerId").lean();

    // If query was not an order ID but matches a customer or flat contact info
    if (!currentOrder) {
      if (customer) {
        // Find most recent order for this customer
        currentOrder = await Order.findOne({ customerId: customer._id }).populate("customerId").sort({ createdAt: -1 }).lean();
      } else {
        // Find by flat legacy customer details
        currentOrder = await Order.findOne({
          $or: [
            { customerEmail: email },
            { customerPhone: phone }
          ]
        }).populate("customerId").sort({ createdAt: -1 }).lean();
      }
    }

    if (!currentOrder) {
      return res.status(404).json({ error: "No matching order found for this query." });
    }

    // Standardize currentOrder customer fields
    const activeCustomer = currentOrder.customerId || customer;
    currentOrder.customerName = activeCustomer ? activeCustomer.name : (currentOrder.customerName || "Unknown Customer");
    currentOrder.customerEmail = activeCustomer ? activeCustomer.email : (currentOrder.customerEmail || "");
    currentOrder.customerPhone = activeCustomer ? activeCustomer.phone : (currentOrder.customerPhone || "");
    currentOrder.shippingAddress = activeCustomer ? activeCustomer.address : (currentOrder.shippingAddress || "");

    // Fetch full order history (all other orders by this customer)
    if (activeCustomer) {
      history = await Order.find({
        customerId: activeCustomer._id,
        _id: { $ne: currentOrder._id }
      }).sort({ createdAt: -1 }).lean();
    } else {
      history = await Order.find({
        $or: [
          { customerEmail: currentOrder.customerEmail },
          { customerPhone: currentOrder.customerPhone }
        ],
        _id: { $ne: currentOrder._id }
      }).sort({ createdAt: -1 }).lean();
    }

    // Standardize history items too
    history = history.map(h => {
      const hCust = h.customerId || activeCustomer;
      return {
        ...h,
        customerName: hCust ? hCust.name : (h.customerName || "Unknown Customer"),
        customerEmail: hCust ? hCust.email : (h.customerEmail || ""),
        customerPhone: hCust ? hCust.phone : (h.customerPhone || ""),
        shippingAddress: hCust ? hCust.address : (h.shippingAddress || "")
      };
    });

    res.json({
      currentOrder,
      history
    });
  } catch (error) {
    console.error("Order tracking query failed:", error);
    res.status(500).json({ error: "Failed to track order" });
  }
});

router.post("/api/orders/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "Processing") {
      return res.status(400).json({ error: `Cannot cancel order. Status is already '${order.status}'` });
    }

    order.status = "Cancelled";
    await order.save();

    // Restore stock for each product in the cancelled order
    if (order.cartItems && Array.isArray(order.cartItems)) {
      for (const item of order.cartItems) {
        if (item.productId) {
          await ProductVariant.updateOne(
            { productId: item.productId, size: item.size },
            { $inc: { quantity: item.quantity } }
          );
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { quantity: item.quantity } }
          );
        }
      }
    }
    // Invalidate products cache
    invalidateProductsCache();

    res.json(order);
  } catch (error) {
    console.error("Order cancellation failed:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

export default router;
