import express from "express";
import Order from "../models/Order.js";
import { Product } from "../models/Product.js";
import Customer from "../models/Customer.js";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/api/admin/dashboard-stats", async (req, res) => {
  try {
    const [totalProducts, latestArrivalsCount, bestSellersCount, totalCustomers, orders, topProducts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ category: "Latest Arrivals" }),
      Product.countDocuments({ category: "Best Seller" }),
      Customer.countDocuments(),
      Order.find({}, "totalAmount status deletedByAdmin createdAt cartItems").lean(),
      Order.aggregate([
        { $match: { deletedByAdmin: false, status: { $nin: ["Cancelled"] } } },
        { $unwind: "$cartItems" },
        { $group: { _id: "$cartItems.productId", totalSold: { $sum: "$cartItems.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ]).then(async (topSales) => {
        const productIds = topSales.map(t => t._id);
        const products = await Product.find({ _id: { $in: productIds } }).lean();
        return topSales.map(t => products.find(p => String(p._id) === String(t._id))).filter(Boolean);
      })
    ]);

    const activeOrders = orders.filter(o => 
      !o.deletedByAdmin && 
      !["Cancelled", "Delivered", "Return Requested", "Return Approved", "Return Rejected"].includes(o.status)
    );
    const activeOrdersCount = activeOrders.length;
    
    const nonDeletedOrders = orders.filter(o => !o.deletedByAdmin);
    
    // Only count completed/valid orders for income
    const revenueOrders = nonDeletedOrders.filter(o => o.status !== "Cancelled" && o.status !== "Return Approved");
    const totalIncome = revenueOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalSalesCount = revenueOrders.length;

    const historicalDataMap = {};
    const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = formatter.format(d);
      historicalDataMap[dateString] = { date: dateString, sales: 0, orders: 0, profit: 0 };
    }

    const allValidOrders = orders.filter(o => !o.deletedByAdmin && o.status !== "Cancelled");
    allValidOrders.forEach(o => {
      if (!o.createdAt) return;
      const dateString = formatter.format(new Date(o.createdAt));
      if (historicalDataMap[dateString]) {
        historicalDataMap[dateString].sales += (o.totalAmount || 0);
        historicalDataMap[dateString].orders += 1;
        
        let orderProfit = 0;
        if (o.cartItems && Array.isArray(o.cartItems)) {
          o.cartItems.forEach(item => {
            const itemPrice = item.price || 0;
            const itemMakingPrice = item.makingPrice || 0;
            orderProfit += (itemPrice - itemMakingPrice) * (item.quantity || 1);
          });
        }
        historicalDataMap[dateString].profit += orderProfit;
      }
    });

    const historicalData = Object.values(historicalDataMap);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let totalProfitThisMonth = 0;
    const thisMonthRevenue = allValidOrders.reduce((acc, o) => {
      if (o.createdAt) {
        const orderDate = new Date(o.createdAt);
        if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
          if (o.cartItems && Array.isArray(o.cartItems)) {
            o.cartItems.forEach(item => {
              const itemPrice = item.price || 0;
              const itemMakingPrice = item.makingPrice || 0;
              totalProfitThisMonth += (itemPrice - itemMakingPrice) * (item.quantity || 1);
            });
          }
          return acc + (o.totalAmount || 0);
        }
      }
      return acc;
    }, 0);

    res.json({
      totalSales: totalSalesCount,
      totalIncome,
      activeOrders: activeOrdersCount,
      totalProducts,
      latestArrivalsCount,
      bestSellersCount,
      totalCustomers,
      topProducts,
      historicalData,
      totalProfitThisMonth
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

router.get("/api/admin/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Failed to fetch admin reviews:", error);
    res.status(500).json({ error: "Failed to fetch admin reviews" });
  }
});

router.delete("/api/admin/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Failed to delete review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

router.put("/api/admin/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, author, location } = req.body;

    const updatedData = {};
    if (rating !== undefined) updatedData.rating = rating;
    if (title !== undefined) updatedData.title = title;
    if (comment !== undefined) updatedData.comment = comment;
    if (author !== undefined) updatedData.author = author;
    if (location !== undefined) updatedData.location = location;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: "No fields to update provided." });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Invalidate product cache to ensure updated reviews show immediately on the storefront
    invalidateProductsCache(review.productId);

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Failed to update review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

export default router;
