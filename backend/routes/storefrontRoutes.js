import express from "express";
import { Product } from "../models/Product.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Settings from "../models/Settings.js";
import { cachedProducts, cachedSettings } from "../utils/cache.js";

const router = express.Router();

router.get("/api/storefront/shop", async (req, res) => {
  try {
    const [settings, products] = await Promise.all([
      Settings.findOne().lean(),
      Product.find({}).sort({ createdAt: -1 }).lean()
    ]);

    res.json({
      settings: settings || {},
      products
    });
  } catch (error) {
    console.error("Failed to fetch shop data:", error);
    res.status(500).json({ error: "Failed to fetch shop data" });
  }
});

router.get("/api/storefront/home", async (req, res) => {
  try {
    const [settings, arrivals, bestSellers, reviews] = await Promise.all([
      Settings.findOne().lean(),
      Product.find({ category: "Latest Arrivals" }).sort({ createdAt: -1 }).lean(),
      Product.find({ category: "Best Seller" }).sort({ createdAt: -1 }).lean(),
      Review.find({}).sort({ createdAt: -1 }).lean()
    ]);

    res.json({
      settings: settings || {},
      arrivals,
      bestSellers,
      reviews
    });
  } catch (error) {
    console.error("Failed to fetch storefront data:", error);
    res.status(500).json({ error: "Failed to fetch storefront data" });
  }
});

export default router;
