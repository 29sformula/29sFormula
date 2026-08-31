import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import { Product } from "../models/Product.js";

const router = express.Router();

router.get("/api/reviews/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    let objId;
    try {
      objId = new mongoose.Types.ObjectId(productId);
    } catch (e) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const reviews = await Review.find({ productId: objId }).sort({ createdAt: -1 });

    const total = reviews.length;
    if (total === 0) {
      return res.json({
        reviews: [],
        average: 0,
        total: 0,
        breakdown: [
          { stars: 5, percentage: 0, count: 0 },
          { stars: 4, percentage: 0, count: 0 },
          { stars: 3, percentage: 0, count: 0 },
          { stars: 2, percentage: 0, count: 0 },
          { stars: 1, percentage: 0, count: 0 },
        ]
      });
    }

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
      sum += r.rating;
    });

    const average = parseFloat((sum / total).toFixed(1));
    const breakdown = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: counts[stars],
      percentage: Math.round((counts[stars] / total) * 100)
    }));

    res.json({
      reviews,
      average,
      total,
      breakdown
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post("/api/reviews", async (req, res) => {
  try {
    const { productId, author, rating, comment, title, location, images } = req.body;
    if (!productId || !author || !rating || !comment) {
      return res.status(400).json({ error: "productId, author, rating, and comment are required." });
    }

    let objId;
    try {
      objId = new mongoose.Types.ObjectId(productId);
    } catch (e) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const avatarBgs = ["#fef08a", "#ffe4e6", "#ffedd5", "#f1f5f9", "#e0f2fe", "#f3e8ff"];
    const avatarColors = ["#854d0e", "#9f1239", "#9a3412", "#334155", "#0369a1", "#6b21a8"];
    const randomIndex = Math.floor(Math.random() * avatarBgs.length);

    const authorName = String(author).trim();
    const avatarInitial = authorName.charAt(0).toUpperCase();

    const newReview = new Review({
      productId: objId,
      author: authorName,
      avatar: avatarInitial,
      avatarBg: avatarBgs[randomIndex],
      avatarColor: avatarColors[randomIndex],
      location: location || "IN",
      rating: numRating,
      comment: String(comment).trim(),
      title: title ? String(title).trim() : "",
      images: Array.isArray(images) ? images : [],
      verified: true,
      helpful: 0
    });

    await newReview.save();
    console.log(`Saved new review for product ${productId} by ${authorName}`);

    const reviews = await Review.find({ productId: objId }).sort({ createdAt: -1 });
    const total = reviews.length;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
      sum += r.rating;
    });

    const average = parseFloat((sum / total).toFixed(1));
    const breakdown = [5, 4, 3, 2, 1].map(stars => ({
      stars,
      count: counts[stars],
      percentage: Math.round((counts[stars] / total) * 100)
    }));

    res.status(201).json({
      message: "Review added successfully",
      newReview,
      reviews,
      average,
      total,
      breakdown
    });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ error: "Failed to save review" });
  }
});

router.post("/api/reviews/:reviewId/helpful", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { increment } = req.body;
    const change = increment === false ? -1 : 1;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: change } },
      { returnDocument: "after" }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Helpful count updated", helpful: Math.max(0, review.helpful) });
  } catch (error) {
    console.error("Error updating helpful count:", error);
    res.status(500).json({ error: "Failed to update helpful count" });
  }
});

export default router;
