import mongoose from "mongoose";

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
  brandLogoType: { type: String, default: "text" },
  brandLogoValue: { type: String, default: "29sFORMULA" },
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

export default Settings;
