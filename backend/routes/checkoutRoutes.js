import express from "express";
import { ProductVariant } from "../models/Product.js";
import Discount from "../models/Discount.js";
import crypto from "crypto";

const router = express.Router();

router.post("/api/gokwik/create-checkout", async (req, res) => {
  try {
    const { cartItems, discountCode } = req.body;
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate order pricing
    let totalItemsPrice = 0;
    const productsPayload = cartItems.map((item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      totalItemsPrice += price * quantity;
      
      return {
        id: item._id || `${Date.now()}`,
        title: `${item.name} (${item.size || "Default Size"})`,
        price: price,
        quantity: quantity,
        image: item.imageFront || ""
      };
    });

    // Mock discount logic
    let discountAmount = 0;
    if (discountCode) {
      discountAmount = Math.round(totalItemsPrice * 0.1); // 10% off for testing
    }
    const finalAmount = totalItemsPrice - discountAmount;

    const merchantOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const gokwikMerchantId = process.env.GOKWIK_MERCHANT_ID;
    const gokwikAppSecretKey = process.env.GOKWIK_APP_SECRET_KEY;
    const gokwikAppToken = process.env.GOKWIK_APP_TOKEN;
    const isProd = process.env.GOKWIK_ENVIRONMENT === "production";

    // If keys are fully configured, hit GoKwik API
    if (gokwikMerchantId && gokwikAppSecretKey && gokwikAppToken) {
      const gokwikUrl = isProd
        ? "https://api.gokwik.co/v2/order/create"
        : "https://sandbox.gokwik.co/v2/order/create";

      const headers = {
        "Content-Type": "application/json",
        "merchant-id": gokwikMerchantId,
        "app-secret-key": gokwikAppSecretKey,
        "app-token": gokwikAppToken
      };

      const requestPayload = {
        merchant_id: gokwikMerchantId,
        merchant_order_id: merchantOrderId,
        total_price: finalAmount,
        discount_amount: discountAmount,
        currency: "INR",
        products: productsPayload
      };

      try {
        const response = await fetch(gokwikUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestPayload)
        });

        const data = await response.json();
        
        if (response.ok && data.redirect_url) {
          return res.json({
            status: "success",
            redirect_url: data.redirect_url,
            merchant_order_id: merchantOrderId
          });
        } else {
          console.error("GoKwik API returned error:", data);
          // Fallback if GoKwik API errors to prevent checkout blocking
          return res.json({
            status: "fallback",
            redirect_url: `https://sandbox.gokwik.co/checkout/session?merchant_id=${gokwikMerchantId}&order_id=${merchantOrderId}&amount=${finalAmount}`,
            merchant_order_id: merchantOrderId
          });
        }
      } catch (apiErr) {
        console.error("GoKwik API connection failed:", apiErr);
      }
    }

    // Default Sandbox fallback redirect if keys are not present
    const sandboxMerchantId = gokwikMerchantId || "mock_merchant_29sformula";
    const fallbackRedirect = `https://sandbox.gokwik.co/checkout/session?merchant_id=${sandboxMerchantId}&order_id=${merchantOrderId}&amount=${finalAmount}`;
    res.json({
      status: "mock",
      redirect_url: fallbackRedirect,
      merchant_order_id: merchantOrderId,
      note: "Running in Sandbox/Mock mode. Configure GOKWIK keys in your .env file to enable live API checkout."
    });
  } catch (error) {
    console.error("GoKwik checkout initialization failed:", error);
    res.status(500).json({ error: "Failed to initialize checkout session with GoKwik" });
  }
});

export default router;
