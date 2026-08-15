import express from "express";
import { Product, ProductVariant } from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import { cachedProducts, setCachedProducts, cachedProductDetails, invalidateProductsCache } from "../utils/cache.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

const enforceLatestArrivalsLimit = async () => {
  try {
    const limit = 10;
    const latestProducts = await Product.find({ category: "Latest Arrivals" })
      .sort({ createdAt: -1 })
      .select('_id');
    
    if (latestProducts.length > limit) {
      const idsToRemove = latestProducts.slice(limit).map(p => p._id);
      await Product.updateMany(
        { _id: { $in: idsToRemove } },
        { $pull: { category: "Latest Arrivals" } }
      );
      await ProductVariant.updateMany(
        { productId: { $in: idsToRemove } },
        { $pull: { category: "Latest Arrivals" } }
      );
    }
  } catch (error) {
    console.error("Error enforcing Latest Arrivals limit:", error);
  }
};

router.get("/api/products", async (req, res) => {
  try {
    if (cachedProducts) {
      return res.json(cachedProducts);
    }
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    const productIds = products.map(p => p._id);
    const variants = await ProductVariant.find({ productId: { $in: productIds } }).lean();
    
    const variantsMap = {};
    variants.forEach(v => {
      const pid = String(v.productId);
      if (!variantsMap[pid]) variantsMap[pid] = [];
      variantsMap[pid].push(v);
    });

    products.forEach(p => {
      p.variants = variantsMap[String(p._id)] || [];
    });

    setCachedProducts(products);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/api/products", async (req, res) => {
  try {
    let { name, description, imageFront, imageBack, images, variants } = req.body;
    if (!name || !imageFront) {
      return res.status(400).json({ error: "Name and cover image are required" });
    }

    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch (e) {}
    }

    // Compute global properties
    let computedPrice = 0;
    let computedStrikePrice = undefined;
    let computedMakingPrice = 0;
    let computedQuantity = 0;
    let computedCategory = ["Latest Arrivals"];
    let computedSizes = [];

    if (variants && Array.isArray(variants) && variants.length > 0) {
      computedQuantity = variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
      computedPrice = Math.min(...variants.map(v => Number(v.price) || 0));
      const strikePrices = variants.map(v => Number(v.strikePrice)).filter(p => p > 0);
      if (strikePrices.length > 0) computedStrikePrice = Math.max(...strikePrices);
      computedMakingPrice = Math.min(...variants.map(v => Number(v.makingPrice) || 0));
      computedCategory = [...new Set(variants.flatMap(v => Array.isArray(v.category) ? v.category : [v.category]).filter(Boolean))];
      computedSizes = variants.map(v => v.size).filter(Boolean);
    }

    if (!computedCategory.includes("Latest Arrivals")) {
      computedCategory.push("Latest Arrivals");
    }

    const newProduct = new Product({
      name,
      description,
      imageFront,
      imageBack,
      images,
      price: computedPrice,
      strikePrice: computedStrikePrice,
      makingPrice: computedMakingPrice,
      quantity: computedQuantity,
      category: computedCategory,
      sizes: computedSizes
    });
    await newProduct.save();

    const savedVariants = [];
    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        const variantDoc = await ProductVariant.create({
          productId: newProduct._id,
          size: v.size,
          quantity: Number(v.quantity) || 0,
          price: Number(v.price) || 0,
          strikePrice: v.strikePrice ? Number(v.strikePrice) : undefined,
          makingPrice: Number(v.makingPrice) || 0,
          category: [...new Set([...(Array.isArray(v.category) ? v.category : (v.category ? [v.category] : [])), "Latest Arrivals"])]
        });
        savedVariants.push(variantDoc);
      }
    }

    // Enforce limits and invalidate caches
    await enforceLatestArrivalsLimit();
    invalidateProductsCache();

    const productJson = newProduct.toJSON();
    productJson.variants = savedVariants;

    res.status(201).json(productJson);
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/api/products/:id", async (req, res) => {
  try {
    let { name, description, imageFront, imageBack, images, variants } = req.body;
    
    // Fetch the existing product to check for deleted images
    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const oldImages = oldProduct.images || [];
    const newImages = images || [];

    // Find images that are in oldImages but not in newImages
    const removedImages = oldImages.filter(img => !newImages.includes(img));
    
    // Check if imageFront or imageBack changed and was a Cloudinary URL not present in new images list
    if (oldProduct.imageFront && oldProduct.imageFront !== imageFront && !newImages.includes(oldProduct.imageFront)) {
      removedImages.push(oldProduct.imageFront);
    }
    if (oldProduct.imageBack && oldProduct.imageBack !== imageBack && !newImages.includes(oldProduct.imageBack)) {
      removedImages.push(oldProduct.imageBack);
    }

    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch (e) {}
    }

    // Compute global properties
    let computedPrice = 0;
    let computedStrikePrice = undefined;
    let computedMakingPrice = 0;
    let computedQuantity = 0;
    let computedCategory = ["Latest Arrivals"];
    let computedSizes = [];

    if (variants && Array.isArray(variants) && variants.length > 0) {
      computedQuantity = variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
      computedPrice = Math.min(...variants.map(v => Number(v.price) || 0));
      const strikePrices = variants.map(v => Number(v.strikePrice)).filter(p => p > 0);
      if (strikePrices.length > 0) computedStrikePrice = Math.max(...strikePrices);
      computedMakingPrice = Math.min(...variants.map(v => Number(v.makingPrice) || 0));
      computedCategory = [...new Set(variants.flatMap(v => Array.isArray(v.category) ? v.category : [v.category]).filter(Boolean))];
      computedSizes = variants.map(v => v.size).filter(Boolean);
    }

    if (oldProduct.category && oldProduct.category.includes("Latest Arrivals") && !computedCategory.includes("Latest Arrivals")) {
      computedCategory.push("Latest Arrivals");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        imageFront,
        imageBack,
        images,
        price: computedPrice,
        strikePrice: computedStrikePrice,
        makingPrice: computedMakingPrice,
        quantity: computedQuantity,
        category: computedCategory,
        sizes: computedSizes
      },
      { returnDocument: "after" }
    );

    // Delete old variants and write new ones
    await ProductVariant.deleteMany({ productId: req.params.id });
    const savedVariants = [];
    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        const variantDoc = await ProductVariant.create({
          productId: req.params.id,
          size: v.size,
          quantity: Number(v.quantity) || 0,
          price: Number(v.price) || 0,
          strikePrice: v.strikePrice ? Number(v.strikePrice) : undefined,
          makingPrice: Number(v.makingPrice) || 0,
          category: (oldProduct.category && oldProduct.category.includes("Latest Arrivals")) 
                      ? [...new Set([...(Array.isArray(v.category) ? v.category : (v.category ? [v.category] : [])), "Latest Arrivals"])] 
                      : (Array.isArray(v.category) ? v.category : (v.category ? [v.category] : []))
        });
        savedVariants.push(variantDoc);
      }
    }

    // Enforce limits and invalidate caches
    await enforceLatestArrivalsLimit();
    invalidateProductsCache(req.params.id);

    // Delete removed images from Cloudinary asynchronously
    for (const imgUrl of removedImages) {
      await deleteFromCloudinary(imgUrl);
    }

    const productJson = updatedProduct.toJSON();
    productJson.variants = savedVariants;

    res.json(productJson);
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Collect all Cloudinary URLs from this product
    const urlsToDelete = [];
    if (product.imageFront) urlsToDelete.push(product.imageFront);
    if (product.imageBack) urlsToDelete.push(product.imageBack);
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (!urlsToDelete.includes(img)) urlsToDelete.push(img);
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    // Delete associated variants
    await ProductVariant.deleteMany({ productId: req.params.id });

    // Find and delete associated reviews
    const reviews = await Review.find({ productId: req.params.id });
    for (const review of reviews) {
      if (review.images && review.images.length > 0) {
        review.images.forEach(img => {
          if (!urlsToDelete.includes(img)) urlsToDelete.push(img);
        });
      }
    }
    await Review.deleteMany({ productId: req.params.id });

    // Invalidate caches
    invalidateProductsCache(req.params.id);

    // Delete them from Cloudinary
    for (const url of urlsToDelete) {
      await deleteFromCloudinary(url);
    }

    res.json({ message: "Product deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

router.put("/api/categories/rename", async (req, res) => {
  try {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) {
      return res.status(400).json({ error: "Missing oldName or newName" });
    }

    // Update variants
    await ProductVariant.updateMany(
      { category: oldName },
      { $set: { "category.$": newName } }
    );

    // Update base products
    // Since category is an array of strings in Product, we replace the specific string
    await Product.updateMany(
      { category: oldName },
      { $set: { "category.$": newName } }
    );

    invalidateProductsCache();
    res.json({ success: true, message: "Category renamed successfully" });
  } catch (error) {
    console.error("Failed to rename category:", error);
    res.status(500).json({ error: "Failed to rename category" });
  }
});

router.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (cachedProductDetails.has(id)) {
      return res.json(cachedProductDetails.get(id));
    }
    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const variants = await ProductVariant.find({ productId: id }).lean();
    product.variants = variants;
    cachedProductDetails.set(id, product);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});

export default router;
