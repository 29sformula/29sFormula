import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

dotenv.config();

// Bypass SSL certificate check for local development network environments
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Disable mongoose query buffering globally to avoid server hangs on slow DB connections
mongoose.set("bufferCommands", false);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || ""
});

// Configure Multer Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// In-Memory Cache Store for 50k+ Concurrent Customer Scaling
let cachedSettings = null;
let cachedProducts = null;
const cachedProductDetails = new Map(); // id -> product details JSON

// Invalidation helpers
const invalidateSettingsCache = () => {
  cachedSettings = null;
};
const invalidateProductsCache = (id = null) => {
  cachedProducts = null;
  if (id) {
    cachedProductDetails.delete(id);
  } else {
    cachedProductDetails.clear();
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Upload endpoint for Cloudinary using Streams
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(400).json({ error: "Cloudinary credentials not configured in backend .env file" });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Set up Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "29sformula"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary stream upload failed:", error);
          return res.status(500).json({ error: error.message || "Failed to upload file to Cloudinary" });
        }
        res.json({ url: result.secure_url });
      }
    );

    // Stream the buffer to Cloudinary
    Readable.from(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ error: error.message || "Failed to upload file to Cloudinary" });
  }
});

// Helper to extract Cloudinary public_id from URL
const getCloudinaryPublicId = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    
    let publicIdWithExt = parts[1];
    if (publicIdWithExt.startsWith("v")) {
      const slashIndex = publicIdWithExt.indexOf("/");
      if (slashIndex !== -1) {
        publicIdWithExt = publicIdWithExt.substring(slashIndex + 1);
      }
    }
    
    
    const dotIndex = publicIdWithExt.lastIndexOf(".");
    if (dotIndex !== -1) {
      return publicIdWithExt.substring(0, dotIndex);
    }
    return publicIdWithExt;
  } catch (e) {
    console.error("Failed to parse Cloudinary URL public_id:", e);
    return null;
  }
};

// Helper to determine Cloudinary resource type
const getCloudinaryResourceType = (url) => {
  if (!url) return "image";
  return url.includes("/video/") ? "video" : "image";
};

// Helper to delete an asset from Cloudinary
const deleteFromCloudinary = async (url) => {
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) return;

  const resourceType = getCloudinaryResourceType(url);
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`Cloudinary deletion success for ${publicId} (${resourceType}):`, result);
  } catch (error) {
    console.error(`Cloudinary deletion failed for ${publicId}:`, error);
  }
};

// API Delete endpoint for Cloudinary
app.post("/api/upload/delete", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    await deleteFromCloudinary(url);
    res.json({ message: "Asset deleted successfully from Cloudinary" });
  } catch (error) {
    console.error("Delete asset failed:", error);
    res.status(500).json({ error: error.message || "Failed to delete asset from Cloudinary" });
  }
});

// MongoDB connection
const mongoURL = process.env.mongoURL;

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageFront: { type: String, required: true },
  imageBack: { type: String },
  images: { type: [String], default: [] },
  
  // Denormalized computed values for fast storefront query rendering
  price: { type: Number },
  makingPrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  category: { type: [String], default: [] },
  sizes: { type: [String], default: [] }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const productVariantSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  makingPrice: { type: Number, default: 0 },
  category: { type: [String], default: [] }
}, { timestamps: true });

productVariantSchema.index({ productId: 1, size: 1 }, { unique: true });

const ProductVariant = mongoose.models.ProductVariant || mongoose.model("ProductVariant", productVariantSchema);

const seedDefaultProducts = async () => {
  try {
    const img1 = "https://res.cloudinary.com/busgtynq/image/upload/v1783591253/29sformula/kuelqnlvaaf3h0cnnvo3.jpg";
    const img2 = "https://res.cloudinary.com/busgtynq/image/upload/v1783591255/29sformula/kfvrntcgccdabqoamlvr.jpg";
    const img3 = "https://res.cloudinary.com/busgtynq/image/upload/v1783591257/29sformula/oqi0nzhwiyiobikiwjvc.jpg";

    const defaultItems = [
      {
        _id: new mongoose.Types.ObjectId("6a60a1461ade3da9ecf51d56"),
        name: "29s CLASSIC - OUD WOOD",
        description: "An elegant, warm, and sophisticated blend of precious oud wood, sweet cardamom, and sandalwood.",
        imageFront: img1,
        imageBack: img2,
        images: [img1, img2, img3],
        variants: [
          { size: "50ml", quantity: 50, price: 1999, category: "Latest Arrivals" },
          { size: "100ml", quantity: 50, price: 2499, category: "Best Seller" },
          { size: "150ml", quantity: 50, price: 2999, category: "Latest Arrivals" }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId("6a60a1461ade3da9ecf51d57"),
        name: "29s INTENSE - CITRUS BLOSSOM",
        description: "A vibrant, refreshing, and crisp scent featuring neroli, orange blossom, and a base of light musk.",
        imageFront: img2,
        imageBack: img1,
        images: [img2, img1, img3],
        variants: [
          { size: "50ml", quantity: 40, price: 1799, category: "Best Seller" },
          { size: "100ml", quantity: 40, price: 2199, category: "Best Seller" }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId("6a60a1461ade3da9ecf51d58"),
        name: "29s AMBASSADOR - JET BLACK",
        description: "A bold, mysterious, and captivating fragrance combining patchouli, black pepper, leather, and vanilla.",
        imageFront: img3,
        imageBack: img2,
        images: [img3, img2, img1],
        variants: [
          { size: "50ml", quantity: 40, price: 2499, category: "Latest Arrivals" },
          { size: "100ml", quantity: 40, price: 2999, category: "Latest Arrivals" },
          { size: "150ml", quantity: 40, price: 3499, category: "Latest Arrivals" }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId("6a60a1461ade3da9ecf51d59"),
        name: "29s SPORT - COBALT BLUE",
        description: "An energetic, fresh, and aquatic scent driven by sea salt, mint, grapefruit, and cedarwood.",
        imageFront: img1,
        imageBack: img3,
        images: [img1, img3, img2],
        variants: [
          { size: "100ml", quantity: 95, price: 1599, category: "Best Seller" }
        ]
      }
    ];

    for (const item of defaultItems) {
      let product = await Product.findOne({ name: item.name });
      if (!product) {
        product = await Product.create({
          _id: item._id,
          name: item.name,
          description: item.description,
          imageFront: item.imageFront,
          imageBack: item.imageBack,
          images: item.images,
          price: Math.min(...item.variants.map(v => v.price)),
          quantity: item.variants.reduce((acc, v) => acc + v.quantity, 0),
          category: [...new Set(item.variants.flatMap(v => Array.isArray(v.category) ? v.category : [v.category]).filter(Boolean))],
          sizes: item.variants.map(v => v.size)
        });
        console.log(`Seeded base product: ${product.name}`);

        for (const v of item.variants) {
          await ProductVariant.create({
            productId: product._id,
            size: v.size,
            quantity: v.quantity,
            price: v.price,
            category: Array.isArray(v.category) ? v.category : (v.category ? [v.category] : ["Latest Arrivals"])
          });
        }
        console.log(`Seeded variants for: ${product.name}`);
      }
    }
  } catch (error) {
    console.error("Failed to seed default products:", error.message);
  }
};

// Define Settings Schema
const settingsSchema = new mongoose.Schema({
  tickerText: { 
    type: String, 
    default: "7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | " 
  },
  tickerSpeed: {
    type: Number,
    default: 60
  },
  announcementText: { 
    type: String, 
    default: "EVERY BOTTLE IS PREPARED WITH CARE. DUE TO SEASONAL DEMAND, PROCESSING MAY TAKE UP TO 5-7 DAYS BEFORE DISPATCH." 
  },
  heroTitle: { type: String, default: "29sFORMULA" },
  heroTitleFontType: { type: String, default: "Outfit" },
  heroTitleFontColor: { type: String, default: "#111827" },
  heroTitleFontSize: { type: String, default: "4.5rem" },
  heroTitleFontAlignment: { type: String, default: "center" },
  heroTitleFontWeight: { type: String, default: "700" },
  heroManifesto: { 
    type: String, 
    default: "SCENT IS THE DIFFERENCE YOU FEEL AND NEVER FAKE. EVERY 29S FORMULA BOTTLE IS CRAFTED BY HANDS THAT CARE, NOT MACHINES THAT RUSH." 
  },
  heroBgType: { type: String, default: "color" },
  heroBgColor: { type: String, default: "#121212" },
  heroBgImage: { type: String, default: "" },
  heroBgVideo: { type: String, default: "" },
  heroManifestoFontSize: { type: String, default: "1.1rem" },
  heroManifestoFontAlignment: { type: String, default: "center" },
  heroManifestoFontWeight: { type: String, default: "600" },
  heroManifestoFontVerticalAlignment: { type: String, default: "center" },
  heroManifestoPositionX: { type: String, default: "50" },
  heroManifestoPositionY: { type: String, default: "50" },
  heroManifestoMaxWidth: { type: String, default: "800" },
  heroManifestoMinHeight: { type: String, default: "60" },
  videoTitle: { type: String, default: "NEW ARRIVALS" },
  videoSubtitle: { type: String, default: "Drop's live. Smells divine. Feels better." },
  videoUrl: { type: String, default: "" },
  videoFallbackColor: { type: String, default: "#121212" },
  lifestyleText: { type: String, default: "Intense notes, Raw elements. This is 29sFORMULA." },
  lifestyleImage: { type: String, default: "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80" },
  primaryColor: { type: String, default: "#57bc74" },
  showTicker: { type: Boolean, default: true },
  showAnnouncement: { type: Boolean, default: true },
  showVideo: { type: Boolean, default: true },
  showLifestyle: { type: Boolean, default: true },
  faqs: {
    type: [{ question: String, answer: String }],
    default: [
      {
        question: "HOW DO I FIND MY PERFECT SCENT?",
        answer: "We recommend starting with our Sample Set. It contains sample vials of our top fragrances so you can wear them on your skin and discover which elements match your personal chemistry."
      },
      {
        question: "WHEN WILL MY NEW 29S BOTTLE ARRIVE?",
        answer: "Orders are hand-crafted and dispatched within 2-3 business days. Delivery typically takes 4-7 business days depending on your location."
      },
      {
        question: "WHAT IF I WANT TO RETURN OR EXCHANGE?",
        answer: "We offer hassle-free returns on unopened bottles within 14 days of delivery. Sample vials are non-returnable, but we will gladly exchange any damaged bottles immediately."
      },
      {
        question: "HOW CAN I PAY?",
        answer: "We accept all major credit cards, UPI (Google Pay, PhonePe, Paytm), and net banking. Secure checkout processed by Razorpay."
      }
    ]
  },
  googleClientId: { type: String, default: "753896502014-yourmockclientid.apps.googleusercontent.com" },
  // Product Preview Page Settings
  showProductReviews: { type: Boolean, default: true },
  showProductExploreMore: { type: Boolean, default: true },
  showProductFaq: { type: Boolean, default: true },
  usageGuideText: { 
    type: String, 
    default: "Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes." 
  },
  exploreMoreTitle: { 
    type: String, 
    default: "Don't Stop. Explore More." 
  },
  deliverySubtext: {
    type: String,
    default: "TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT."
  },
  contactUsText: { 
    type: String, 
    default: "Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours."
  },
  returnPolicyText: {
    type: String,
    default: "We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund."
  },
  
  supportText: { type: String, default: "For support inquiries, please contact us." },
  careersText: { type: String, default: "Join our team! Check out our open positions." },
  tradeEnquiryText: { type: String, default: "For trade and wholesale inquiries, contact our B2B team." },
  aboutUsText: { type: String, default: "We are 29sFORMULA, redefining luxury." },
  
  instagramLink: { type: String, default: "#" },
  facebookLink: { type: String, default: "#" },
  contactLink: { type: String, default: "#" },
  shippingPolicyText: {
    type: String,
    default: "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days."
  }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

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

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  isGoogleUser: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Define Review Schema
const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  author: { type: String, required: true },
  avatar: { type: String },
  avatarBg: { type: String, default: "#f1f5f9" },
  avatarColor: { type: String, default: "#334155" },
  location: { type: String, default: "IN" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  title: { type: String },
  images: { type: [String], default: [] },
  verified: { type: Boolean, default: true },
  helpful: { type: Number, default: 0 }
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

// Define Discount Schema
const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, default: "percentage" }, // "percentage" or "fixed"
  value: { type: Number, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Discount = mongoose.models.Discount || mongoose.model("Discount", discountSchema);

// Define Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  totalOrders: { type: Number, default: 0 },
  totalSpend: { type: Number, default: 0 }
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

const seedCustomers = async () => {
  try {
    const count = await Customer.countDocuments();
    if (count > 0) return;
    console.log("Migrating existing orders to Customer collection...");
    const orders = await Order.find({});
    const customerMap = new Map();
    
    for (const order of orders) {
      const email = order.customerEmail?.toLowerCase().trim();
      if (!email) continue;
      if (customerMap.has(email)) {
        const existing = customerMap.get(email);
        existing.totalOrders += 1;
        existing.totalSpend += order.totalAmount || 0;
        if (order.shippingAddress) existing.address = order.shippingAddress;
        existing.name = order.customerName;
        existing.phone = order.customerPhone;
      } else {
        customerMap.set(email, {
          name: order.customerName,
          email: email,
          phone: order.customerPhone,
          address: order.shippingAddress,
          totalOrders: 1,
          totalSpend: order.totalAmount || 0
        });
      }
    }
    
    for (const custData of customerMap.values()) {
      await Customer.create(custData);
    }
    console.log("Customer migration completed successfully.");
  } catch (error) {
    console.error("Failed to seed customers:", error.message);
  }
};



const seedSettings = async () => {
  try {
    const count = await Settings.countDocuments();
    if (count === 0) {
      const defaultSettings = new Settings();
      await defaultSettings.save();
      console.log("Default page settings seeded successfully!");
    } else {
      const settings = await Settings.findOne({});
      if (settings) {
        let changed = false;
        if (settings.videoUrl === "https://videos.pexels.com/video-files/4440939/4440939-hd_1920_1080_25fps.mp4") {
          settings.videoUrl = "";
          changed = true;
          console.log("Cleared default seed videoUrl from database settings.");
        }
        if (settings.videoFallbackColor === "#57bc74") {
          settings.videoFallbackColor = "#121212";
          changed = true;
          console.log("Updated default videoFallbackColor to premium dark #121212 in database settings.");
        }
        if (changed) {
          await settings.save();
        }
      }
    }
  } catch (error) {
    console.error("Failed to seed page settings:", error.message);
  }
};

if (!mongoURL) {
  console.warn("Warning: mongoURL is not defined in the .env file.");
} else {
  mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("Connected to MongoDB successfully!");
      // Seeding calls disabled to keep database clean as requested:
      // seedDefaultProducts();
      // seedSettings();
      // seedCustomers();
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
      if (mongoURL.includes("<") && mongoURL.includes(">")) {
        console.warn("Tip: It looks like your mongoURL contains '<' and '>' brackets around the password. Make sure to remove them in the .env file (e.g., replace <1234567890bhanu> with 1234567890bhanu).");
      }
    });
}

// Basic API greeting
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the 29s Formula Perfume E-commerce API",
    status: "healthy",
    version: "1.0.0"
  });
});

// GET home page customization settings
app.get("/api/settings", async (req, res) => {
  try {
    if (cachedSettings) {
      return res.json(cachedSettings);
    }
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    cachedSettings = settings;
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// POST home page customization settings
app.post("/api/settings", async (req, res) => {
  try {
    const { 
      tickerText, 
      tickerSpeed,
      announcementText, 
      heroTitle, 
      heroManifesto, 
      videoTitle, 
      videoSubtitle, 
      videoUrl, 
      videoFallbackColor,
      lifestyleText,
      lifestyleImage,
      primaryColor,
      showTicker,
      showAnnouncement,
      showVideo,
      showLifestyle,
      faqs,
      googleClientId,
      contactUsText,
      returnPolicyText,
      shippingPolicyText,
      supportText,
      careersText,
      tradeEnquiryText,
      aboutUsText,
      instagramLink,
      facebookLink,
      contactLink
    } = req.body;
    
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
    }

    const oldVideoUrl = settings.videoUrl;

    if (tickerText !== undefined) settings.tickerText = tickerText;
    if (tickerSpeed !== undefined) settings.tickerSpeed = tickerSpeed;
    if (announcementText !== undefined) settings.announcementText = announcementText;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (req.body.heroTitleFontType !== undefined) settings.heroTitleFontType = req.body.heroTitleFontType;
    if (req.body.heroTitleFontColor !== undefined) settings.heroTitleFontColor = req.body.heroTitleFontColor;
    if (req.body.heroTitleFontSize !== undefined) settings.heroTitleFontSize = req.body.heroTitleFontSize;
    if (req.body.heroTitleFontAlignment !== undefined) settings.heroTitleFontAlignment = req.body.heroTitleFontAlignment;
    if (req.body.heroTitleFontWeight !== undefined) settings.heroTitleFontWeight = req.body.heroTitleFontWeight;
    if (heroManifesto !== undefined) settings.heroManifesto = heroManifesto;
    if (req.body.heroBgType !== undefined) settings.heroBgType = req.body.heroBgType;
    if (req.body.heroBgColor !== undefined) settings.heroBgColor = req.body.heroBgColor;
    if (req.body.heroBgImage !== undefined) settings.heroBgImage = req.body.heroBgImage;
    if (req.body.heroBgVideo !== undefined) settings.heroBgVideo = req.body.heroBgVideo;
    if (req.body.heroManifestoFontSize !== undefined) settings.heroManifestoFontSize = req.body.heroManifestoFontSize;
    if (req.body.heroManifestoFontAlignment !== undefined) settings.heroManifestoFontAlignment = req.body.heroManifestoFontAlignment;
    if (req.body.heroManifestoFontWeight !== undefined) settings.heroManifestoFontWeight = req.body.heroManifestoFontWeight;
    if (req.body.heroManifestoFontVerticalAlignment !== undefined) settings.heroManifestoFontVerticalAlignment = req.body.heroManifestoFontVerticalAlignment;
    if (req.body.heroManifestoPositionX !== undefined) settings.heroManifestoPositionX = req.body.heroManifestoPositionX;
    if (req.body.heroManifestoPositionY !== undefined) settings.heroManifestoPositionY = req.body.heroManifestoPositionY;
    if (req.body.heroManifestoMaxWidth !== undefined) settings.heroManifestoMaxWidth = req.body.heroManifestoMaxWidth;
    if (req.body.heroManifestoMinHeight !== undefined) settings.heroManifestoMinHeight = req.body.heroManifestoMinHeight;
    
    // Product Preview Page settings
    if (req.body.showProductReviews !== undefined) settings.showProductReviews = req.body.showProductReviews;
    if (req.body.showProductExploreMore !== undefined) settings.showProductExploreMore = req.body.showProductExploreMore;
    if (req.body.showProductFaq !== undefined) settings.showProductFaq = req.body.showProductFaq;
    if (req.body.usageGuideText !== undefined) settings.usageGuideText = req.body.usageGuideText;
    if (req.body.exploreMoreTitle !== undefined) settings.exploreMoreTitle = req.body.exploreMoreTitle;
    if (req.body.deliverySubtext !== undefined) settings.deliverySubtext = req.body.deliverySubtext;
    if (videoTitle !== undefined) settings.videoTitle = videoTitle;
    if (videoSubtitle !== undefined) settings.videoSubtitle = videoSubtitle;
    if (videoUrl !== undefined) settings.videoUrl = videoUrl;
    if (videoFallbackColor !== undefined) settings.videoFallbackColor = videoFallbackColor;
    if (lifestyleText !== undefined) settings.lifestyleText = lifestyleText;
    if (lifestyleImage !== undefined) settings.lifestyleImage = lifestyleImage;
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;
    if (showTicker !== undefined) settings.showTicker = showTicker;
    if (showAnnouncement !== undefined) settings.showAnnouncement = showAnnouncement;
    if (showVideo !== undefined) settings.showVideo = showVideo;
    if (showLifestyle !== undefined) settings.showLifestyle = showLifestyle;
    if (faqs !== undefined) settings.faqs = faqs;
    if (googleClientId !== undefined) settings.googleClientId = googleClientId;
    if (contactUsText !== undefined) settings.contactUsText = contactUsText;
    if (returnPolicyText !== undefined) settings.returnPolicyText = returnPolicyText;
    if (shippingPolicyText !== undefined) settings.shippingPolicyText = shippingPolicyText;
    if (supportText !== undefined) settings.supportText = supportText;
    if (careersText !== undefined) settings.careersText = careersText;
    if (tradeEnquiryText !== undefined) settings.tradeEnquiryText = tradeEnquiryText;
    if (aboutUsText !== undefined) settings.aboutUsText = aboutUsText;
    if (instagramLink !== undefined) settings.instagramLink = instagramLink;
    if (facebookLink !== undefined) settings.facebookLink = facebookLink;
    if (contactLink !== undefined) settings.contactLink = contactLink;

    await settings.save();

    // Update in-memory cache
    cachedSettings = settings;

    // Delete old background video from Cloudinary if changed/removed
    if (videoUrl !== undefined && oldVideoUrl && oldVideoUrl !== videoUrl) {
      await deleteFromCloudinary(oldVideoUrl);
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to save page settings" });
  }
});

// Place a new order
app.post("/api/orders", async (req, res) => {
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

// Retrieve all orders (for admin)
app.get("/api/orders", async (req, res) => {
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

// Search customer by email or phone
app.get("/api/customers/search", async (req, res) => {
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

// Retrieve all customers (for admin)
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ totalSpend: -1 });
    res.json(customers);
  } catch (error) {
    console.error("Failed to retrieve customers:", error);
    res.status(500).json({ error: "Failed to retrieve customers" });
  }
});

// Delete a customer (for admin)
app.delete("/api/customers/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

// Update order status or refund status (for admin update)
app.put("/api/orders/:id", async (req, res) => {
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

// Soft-delete order from admin view (for admin deletion)
app.delete("/api/orders/:id", async (req, res) => {
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

// Track an order as a customer
app.get("/api/orders/track", async (req, res) => {
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

// Cancel a pending order
app.post("/api/orders/:id/cancel", async (req, res) => {
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

// Register a new customer
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const newUser = new User({
      name: name.trim(),
      email: trimmedEmail,
      password: password,
      isGoogleUser: false
    });

    await newUser.save();
    
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isGoogleUser: false
    });
  } catch (error) {
    console.error("Manual registration failed:", error);
    res.status(500).json({ error: "Failed to register account" });
  }
});

// Login customer manually
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (user.isGoogleUser) {
      return res.status(400).json({ error: "This email is registered using Google Sign-In. Please sign in with Google." });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isGoogleUser: false
    });
  } catch (error) {
    console.error("Manual login failed:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Authenticate customer using Google JWT ID Token credential
app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Google token credential is required" });
    }

    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
    const verifyRes = await fetch(googleVerifyUrl);
    
    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      console.error("Google token verification failed:", errText);
      return res.status(400).json({ error: "Failed to verify Google token credential." });
    }

    const payload = await verifyRes.json();
    const { sub: googleId, email, name } = payload;

    if (!email) {
      return res.status(400).json({ error: "Google account does not provide an email address." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      user = new User({
        name: name || "Google User",
        email: trimmedEmail,
        googleId,
        isGoogleUser: true
      });
      await user.save();
    } else if (!user.isGoogleUser) {
      user.isGoogleUser = true;
      user.googleId = googleId;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isGoogleUser: true
    });
  } catch (error) {
    console.error("Google login failed:", error);
    res.status(500).json({ error: "Failed to verify Google credentials" });
  }
});
// GET storefront shop data
app.get("/api/storefront/shop", async (req, res) => {
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

// GET storefront init data
app.get("/api/storefront/home", async (req, res) => {
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

// GET admin dashboard stats
app.get("/api/admin/dashboard-stats", async (req, res) => {
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

    const activeOrders = orders.filter(o => !o.deletedByAdmin && o.status !== "Cancelled" && o.status !== "Delivered");
    const activeOrdersCount = activeOrders.length;
    
    const nonDeletedOrders = orders.filter(o => !o.deletedByAdmin);
    const totalIncome = nonDeletedOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalSalesCount = nonDeletedOrders.length;

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

// GET all products
app.get("/api/products", async (req, res) => {
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

    cachedProducts = products;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

async function enforceLatestArrivalsLimit() {
  try {
    const latestArrivals = await Product.find({ category: "Latest Arrivals" }).sort({ createdAt: -1 });
    if (latestArrivals.length > 6) {
      const productsToUpdate = latestArrivals.slice(6);
      for (const product of productsToUpdate) {
        await Product.findByIdAndUpdate(product._id, {
          $pull: { category: "Latest Arrivals" }
        });
        await ProductVariant.updateMany(
          { productId: product._id },
          { $pull: { category: "Latest Arrivals" } }
        );
      }
      console.log(`Enforced Latest Arrivals limit: removed from ${productsToUpdate.length} older products.`);
    }
  } catch (err) {
    console.error("Failed to enforce Latest Arrivals limit:", err);
  }
}

// POST a new product
app.post("/api/products", async (req, res) => {
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
    let computedMakingPrice = 0;
    let computedQuantity = 0;
    let computedCategory = ["Latest Arrivals"];
    let computedSizes = [];

    if (variants && Array.isArray(variants) && variants.length > 0) {
      computedQuantity = variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
      computedPrice = Math.min(...variants.map(v => Number(v.price) || 0));
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

// PUT (Update) a product
app.put("/api/products/:id", async (req, res) => {
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
    let computedMakingPrice = 0;
    let computedQuantity = 0;
    let computedCategory = ["Latest Arrivals"];
    let computedSizes = [];

    if (variants && Array.isArray(variants) && variants.length > 0) {
      computedQuantity = variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
      computedPrice = Math.min(...variants.map(v => Number(v.price) || 0));
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

// DELETE a product
app.delete("/api/products/:id", async (req, res) => {
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

// Rename a category across all products and variants
app.put("/api/categories/rename", async (req, res) => {
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

// GET a single product by ID
app.get("/api/products/:id", async (req, res) => {
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

// GoKwik Checkout Initialization Endpoint
app.post("/api/gokwik/create-checkout", async (req, res) => {
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

// GET reviews for a product
app.get("/api/reviews/:productId", async (req, res) => {
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

// POST a new review for a product (persisted in MongoDB)
app.post("/api/reviews", async (req, res) => {
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

// POST toggle helpful count for a review
app.post("/api/reviews/:reviewId/helpful", async (req, res) => {
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

// GET all reviews across all products (Admin Review Moderation)
app.get("/api/admin/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Failed to fetch admin reviews:", error);
    res.status(500).json({ error: "Failed to fetch admin reviews" });
  }
});

// DELETE a review (Admin Review Moderation)
app.delete("/api/admin/reviews/:id", async (req, res) => {
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

// Admin: Edit a review
app.put("/api/admin/reviews/:id", async (req, res) => {
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

// GET all discounts
app.get("/api/discounts", async (req, res) => {
  try {
    const discounts = await Discount.find({}).sort({ createdAt: -1 });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch discounts" });
  }
});

// POST a new discount
app.post("/api/discounts", async (req, res) => {
  try {
    const { code, type, value } = req.body;
    if (!code || !value) {
      return res.status(400).json({ error: "Code and value are required." });
    }
    const newDiscount = new Discount({
      code: String(code).toUpperCase().trim(),
      type: type || "percentage",
      value: Number(value),
      active: true
    });
    await newDiscount.save();
    res.status(201).json(newDiscount);
  } catch (error) {
    res.status(500).json({ error: "Failed to create discount (code may already exist)." });
  }
});

// DELETE a discount
app.delete("/api/discounts/:id", async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete discount" });
  }
});

// Validate discount code for storefront checkout
app.get("/api/discounts/validate", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "Discount code is required" });
    const discount = await Discount.findOne({ code: String(code).toUpperCase().trim(), active: true });
    if (!discount) return res.status(404).json({ error: "Invalid discount code" });
    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: "Failed to validate code" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// trigger restart
