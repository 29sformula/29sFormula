    
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
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.Mixed, default: ["Latest Arrivals"] }, // Supports array of strings or single string
  imageFront: { type: String, required: true },
  imageBack: { type: String },
  images: { type: [String], default: [] },
  sizes: { type: [String], default: ["50ml", "100ml", "150ml"] },
  quantity: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const seedDefaultProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) return;

    const img1 = "https://res.cloudinary.com/busgtynq/image/upload/v1783591253/29sformula/kuelqnlvaaf3h0cnnvo3.jpg";
    const img2 = "https://res.cloudinary.com/busgtynq/image/upload/v1783591255/29sformula/kfvrntcgccdabqoamlvr.jpg";
    const img3 = "https://res.cloudinary.com/busgtynq/image/upload/v1783591257/29sformula/oqi0nzhwiyiobikiwjvc.jpg";

    const defaultItems = [
      {
        name: "29s CLASSIC - OUD WOOD",
        price: 1999,
        description: "An elegant, warm, and sophisticated blend of precious oud wood, sweet cardamom, and sandalwood.",
        category: ["Latest Arrivals", "Best Seller"],
        imageFront: img1,
        imageBack: img2,
        images: [img1, img2, img3],
        sizes: ["50ml", "100ml", "150ml"],
        quantity: 150
      },
      {
        name: "29s INTENSE - CITRUS BLOSSOM",
        price: 1799,
        description: "A vibrant, refreshing, and crisp scent featuring neroli, orange blossom, and a base of light musk.",
        category: ["Best Seller"],
        imageFront: img2,
        imageBack: img1,
        images: [img2, img1, img3],
        sizes: ["50ml", "100ml"],
        quantity: 80
      },
      {
        name: "29s AMBASSADOR - JET BLACK",
        price: 2499,
        description: "A bold, mysterious, and captivating fragrance combining patchouli, black pepper, leather, and vanilla.",
        category: ["Latest Arrivals"],
        imageFront: img3,
        imageBack: img2,
        images: [img3, img2, img1],
        sizes: ["50ml", "100ml", "150ml"],
        quantity: 120
      },
      {
        name: "29s SPORT - COBALT BLUE",
        price: 1599,
        description: "An energetic, fresh, and aquatic scent driven by sea salt, mint, grapefruit, and cedarwood.",
        category: ["Best Seller"],
        imageFront: img1,
        imageBack: img3,
        images: [img1, img3, img2],
        sizes: ["100ml"],
        quantity: 95
      }
    ];

    await Product.insertMany(defaultItems);
    console.log("Successfully seeded default brand products in database.");
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
  }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

// Define Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  cartItems: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  status: { type: String, default: "Processing" }
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
  productId: { type: String, required: true, index: true },
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
      seedDefaultProducts();
      seedSettings();
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
      googleClientId
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

    const orderId = `ORD-29S-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = new Order({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      cartItems,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      status: "Processing"
    });

    await newOrder.save();

    // Reduce stock for each product in the order based on quantity
    for (const item of cartItems) {
      if (item.productId) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.quantity } }
        );
      }
    }
    // Invalidate products cache so storefront displays correct updated stock
    invalidateProductsCache();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Failed to place order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Retrieve all orders (for admin)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Failed to retrieve orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

// Update order status (for admin status update)
app.put("/api/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Fulfillment status is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Track an order as a customer
app.get("/api/orders/track", async (req, res) => {
  try {
    const { orderId, emailOrPhone } = req.query;
    if (!orderId || !emailOrPhone) {
      return res.status(400).json({ error: "Order ID and Email/Phone contact details are required" });
    }

    // Search order by orderId and matching email or phone
    const order = await Order.findOne({
      orderId: orderId.trim(),
      $or: [
        { customerEmail: emailOrPhone.trim().toLowerCase() },
        { customerPhone: emailOrPhone.trim() }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: "No matching order found. Please check details." });
    }

    res.json(order);
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
          await Product.findByIdAndUpdate(
            item.productId,
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

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    if (cachedProducts) {
      return res.json(cachedProducts);
    }
    const products = await Product.find({}).sort({ createdAt: -1 });
    cachedProducts = products;
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST a new product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, description, category, imageFront, imageBack, images, sizes, quantity } = req.body;
    if (!name || !price || !imageFront) {
      return res.status(400).json({ error: "Name, price, and cover image are required" });
    }
    const newProduct = new Product({ name, price, description, category, imageFront, imageBack, images, sizes, quantity: Number(quantity) || 0 });
    await newProduct.save();

    // Invalidate caches
    invalidateProductsCache();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT (Update) a product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { name, price, description, category, imageFront, imageBack, images, sizes, quantity } = req.body;
    
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

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category, imageFront, imageBack, images, sizes, quantity: Number(quantity) || 0 },
      { returnDocument: "after" }
    );

    // Invalidate caches
    invalidateProductsCache(req.params.id);

    // Delete removed images from Cloudinary asynchronously
    for (const imgUrl of removedImages) {
      await deleteFromCloudinary(imgUrl);
    }

    res.json(updatedProduct);
  } catch (error) {
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

// GET a single product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (cachedProductDetails.has(id)) {