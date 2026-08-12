import express from "express";
import axios from "axios";
import crypto from "crypto";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import { Product, ProductVariant } from "../models/Product.js";
import { invalidateProductsCache } from "../utils/cache.js";
import nodemailer from "nodemailer";

const router = express.Router();

const sendOrderUpdateEmail = async (order, customerEmail, customerName) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn("Skipping order update email: EMAIL_USER or EMAIL_PASS not configured.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    let subject = `Order Update - ${order.orderId}`;
    let heading = "An Update on Your Order";
    let message = `The status of your order is now: <strong style="font-weight: 600; color: #111;">${order.status}</strong>`;

    if (order.status === "Shipped") {
      subject = `Your 29sFORMULA Order is on its way - ${order.orderId}`;
      heading = "Your fragrance is en route.";
      message = "Your artisanal perfume has been carefully packaged and handed over to our shipping partners. It is currently making its way to you.";
    } else if (order.status === "Delivered") {
      subject = `Your 29sFORMULA Order has arrived - ${order.orderId}`;
      heading = "Your fragrance has been delivered.";
      message = "Your order has been successfully delivered. We hope you enjoy the exquisite scent and the journey it takes you on.";
    } else if (order.status === "Cancelled") {
      subject = `Order Cancelled - ${order.orderId}`;
      heading = "Your order has been cancelled";
      message = "Your recent order has been cancelled. If this was a mistake or you require assistance, our concierge is here to help.";
    }

    const mailOptions = {
      from: `"29sFORMULA" <${emailUser}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; padding: 40px 30px; border: 1px solid #e5e5e5; border-radius: 4px; background-color: #fafafa;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="letter-spacing: 2px; font-weight: 300; margin: 0; color: #000;">29sFORMULA</h1>
            <p style="text-transform: uppercase; letter-spacing: 1.5px; font-size: 11px; color: #666; margin-top: 5px;">Fine Artisan Perfumery</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-bottom: 30px;" />
          
          <h2 style="color: #222; text-align: center; font-weight: 400; letter-spacing: 1px;">Thank You for Your Order</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #444;">Dear ${customerName},</p>
          <p style="font-size: 15px; line-height: 1.6; color: #444;">We have successfully received your order <strong>${order.orderId}</strong>. Our artisans will now begin preparing your exquisite fragrances with the utmost care.</p>
          
          <div style="margin-top: 30px; border: 1px solid #eee; border-radius: 4px; background-color: #fff; padding: 20px;">
            <h3 style="margin-top: 0; color: #333; font-weight: 500; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
              ${itemsHtml}
            </table>
            <div style="margin-top: 15px; text-align: right; font-size: 16px;">
              <strong>Total Paid: ₹${order.totalAmount}</strong>
            </div>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="http://localhost:3000/track?order_id=${order.orderId}" style="display: inline-block; padding: 14px 35px; background-color: #000; color: #fff; text-decoration: none; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">Track Your Order</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 40px; margin-bottom: 30px;" />
          <p style="font-size: 13px; line-height: 1.6; color: #888; text-align: center;">We will notify you again once your package has been shipped.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order update email sent for ${order.orderId}`);
  } catch (error) {
    console.error("Error sending order update email:", error);
  }
};


const sendOrderConfirmationEmail = async (order, customerEmail, customerName) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn("Skipping order confirmation email: EMAIL_USER or EMAIL_PASS not configured.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const itemsHtml = order.cartItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.size})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price * item.quantity}</td>
      </tr>
    `).join("");

    const mailOptions = {
      from: `"29sFORMULA" <${emailUser}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #4f46e5;">Thank you for your order, ${customerName}!</h2>
          <p>We've received your order and are currently processing it. Here are the details:</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Order ID:</strong> ${order.orderId}<br>
            <strong>Total Amount:</strong> ₹${order.totalAmount}<br>
            <strong>Payment Method:</strong> ${order.paymentMethod}<br>
            <strong>Status:</strong> ${order.status}
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <p>You can track your order status anytime on our website.</p>
          <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
            Best regards,<br>
            <strong>29sFORMULA Team</strong>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${customerEmail} for order ${order.orderId}`);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
};

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

    // Send confirmation email asynchronously (does not block checkout)
    sendOrderConfirmationEmail(newOrder, email, customerName);

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

    // Send update email
    if (mappedOrder.customerEmail) {
      sendOrderUpdateEmail(updatedOrder, mappedOrder.customerEmail, mappedOrder.customerName);
    }

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
router.post("/api/orders/:id/return", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({ error: `Cannot return order. Status is currently '${order.status}' (must be Delivered)` });
    }

    order.status = "Return Requested";
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Order return request failed:", error);
    res.status(500).json({ error: "Failed to request return" });
  }
});


// CASHFREE INTEGRATION ROUTES
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || "TEST_APP_ID";
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || "TEST_SECRET_KEY";
const CASHFREE_ENV = process.env.CASHFREE_ENVIRONMENT || "sandbox";

const getCashfreeUrl = () => {
  return CASHFREE_ENV === "production" 
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";
};

router.post("/api/orders/cashfree-init", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, cartItems } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Missing required order details" });
    }

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

    const secureTotalAmount = calculatedTotal;

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

    // Create Cashfree Order
    const cfPayload = {
      order_id: orderId,
      order_amount: secureTotalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: "CUST_" + Date.now(),
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_name: customerName
      },
      order_meta: {
        return_url: "http://localhost:3000/track?order_id={order_id}"
      }
    };

    let paymentSessionId = "simulated_session_123";
    
    if (CASHFREE_APP_ID !== "TEST_APP_ID") {
      const response = await axios.post(getCashfreeUrl(), cfPayload, {
        headers: {
          "x-api-version": "2023-08-01",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      paymentSessionId = response.data.payment_session_id;
    }

    // Save pending order
    const email = customerEmail.toLowerCase().trim();
    let customer = await Customer.findOne({ email });
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        email,
        phone: customerPhone,
        address: shippingAddress,
        totalOrders: 0,
        totalSpend: 0
      });
    }

    const newOrder = new Order({
      orderId,
      customerId: customer._id,
      cartItems: resolvedCartItems,
      totalAmount: secureTotalAmount,
      paymentMethod: "UPI",
      status: "Payment Pending"
    });

    await newOrder.save();

    res.json({ payment_session_id: paymentSessionId, order_id: orderId, _id: newOrder._id });
  } catch (error) {
    console.error("Cashfree init failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initialize payment gateway", details: error.message });
  }
});

router.post("/api/orders/cashfree-verify", async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ error: "order_id is required" });

    const order = await Order.findOne({ orderId: order_id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status !== "Payment Pending") {
      return res.json({ success: true, order });
    }

    let isPaid = true;

    if (CASHFREE_APP_ID !== "TEST_APP_ID") {
      const response = await axios.get(`${getCashfreeUrl()}/${order_id}`, {
        headers: {
          "x-api-version": "2023-08-01",
          "x-client-id": CASHFREE_APP_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "Accept": "application/json"
        }
      });
      if (response.data.order_status !== "PAID") {
        isPaid = false;
      }
    }

    if (isPaid) {
      order.status = "Processing";
      await order.save();

      // Reduce stock
      for (const item of order.cartItems) {
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
      invalidateProductsCache();

      // Update customer stats
      const customer = await Customer.findById(order.customerId);
      if (customer) {
        customer.totalOrders += 1;
        customer.totalSpend += order.totalAmount;
        await customer.save();
      }

      // Send Email
      if (customer) {
        sendOrderConfirmationEmail(order, customer.email, customer.name);
      }

      return res.json({ success: true, order });
    } else {
      return res.status(400).json({ error: "Payment not verified or pending" });
    }
  } catch (error) {
    console.error("Cashfree verify failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

export default router;
