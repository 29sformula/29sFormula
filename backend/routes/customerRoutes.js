import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

router.get("/api/customers/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    
    // Search by email or phone
    const customer = await Customer.findOne({
      $or: [
        { email: new RegExp(`^${query}$`, 'i') },
        { phone: query }
      ]
    });
    
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    
    res.json(customer);
  } catch (error) {
    console.error("Failed to search customer:", error);
    res.status(500).json({ error: "Failed to search customer" });
  }
});

router.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ totalSpend: -1 });
    res.json(customers);
  } catch (error) {
    console.error("Failed to retrieve customers:", error);
    res.status(500).json({ error: "Failed to retrieve customers" });
  }
});

router.delete("/api/customers/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

export default router;
