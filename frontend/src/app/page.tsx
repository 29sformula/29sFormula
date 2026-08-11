'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Footer from "@/components/Footer";

import Navbar from "@/components/Navbar/Navbar";
import Preloader from "@/components/Preloader";
import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderSuccessModal from "@/components/OrderSuccessModal";

const defaultProducts: any[] = [];


interface FaqItem {
  question: string;
  answer: string;
}

// removed reviewsData

const defaultFaqs: FaqItem[] = [
  {
    question: "ARE THESE FRAGRANCES LONG-LASTING?",
    answer: "Yes, our Extrait de Parfum formulas contain a high concentration of fragrance oils (30-40%), ensuring they last 12+ hours on skin and days on clothing."
  },
  {
    question: "DO YOU USE NATURAL OR SYNTHETIC INGREDIENTS?",
    answer: "We use a precise blend of both. Natural absolutes provide depth and complexity, while safe synthetics provide stability, projection, and ethical alternatives to animal-derived notes like musk."
  },
  {
    question: "IS YOUR PACKAGING ECO-FRIENDLY?",
    answer: "Yes, our glass bottles are 100% recyclable, and our packaging uses sustainably sourced, biodegradable materials with minimal plastic."
  },
  {
    question: "WHAT IS YOUR RETURN POLICY?",
    answer: "We offer a 14-day return policy for unopened and unused products. For hygiene reasons, we cannot accept returns on opened fragrances."
  },
  {
    question: "DO YOU SHIP INTERNATIONALLY?",
    answer: "Currently, we ship nationwide within our home market. We are actively working on expanding our shipping network to international destinations."
  }
];

const getFontFamilyStack = (fontName: string) => {
  if (fontName === "SF Pro") {
    return `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  }
  if (fontName === "New York") {
    return `"New York", Georgia, "Times New Roman", serif`;
  }
  if (fontName === "SF Mono") {
    return `"SF Mono", Consolas, "Courier New", monospace`;
  }
  if (fontName === "Segoe UI") {
    return `"Segoe UI", -apple-system, Roboto, Helvetica, Arial, sans-serif`;
  }
  if (fontName === "Helvetica Neue") {
    return `"Helvetica Neue", Helvetica, Arial, sans-serif`;
  }
  return `"${fontName}", sans-serif`;
};

export default function Home() {
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqs);
  const [globalSettings, setGlobalSettings] = useState<any>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewFade, setReviewFade] = useState(true);
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">("forward");

  // Hero Section State
  const [heroBgType, setHeroBgType] = useState<"color" | "image" | "video">("color");
  const [heroBgColor, setHeroBgColor] = useState<string>("#121212");
  const [heroBgImage, setHeroBgImage] = useState<string | null>(null);
  const [heroBgVideo, setHeroBgVideo] = useState<string | null>(null);
  
  const [heroTitle, setHeroTitle] = useState<string>("THE 29S FORMULA");
  const [heroTitleFontType, setHeroTitleFontType] = useState<string>("Outfit");
  
  const [allReviews, setAllReviews] = useState<any[]>([]);

  // Auto-slide reviews every 4 seconds
  useEffect(() => {
    if (allReviews.length <= 1) return;
    const interval = setInterval(() => {
      const nextIndex = (currentReviewIndex + 1) % allReviews.length;
      setSlideDirection(nextIndex > currentReviewIndex ? "forward" : "backward");
      setReviewFade(false);
      setTimeout(() => {
        setCurrentReviewIndex(nextIndex);
        setReviewFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [allReviews.length, currentReviewIndex]);

  // Computed Review Stats
  const totalReviews = allReviews.length;
  const avgRating = totalReviews > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
    : "5.0";
    
  const getRatingPercent = (star: number) => {
    if (totalReviews === 0) return 0;
    const count = allReviews.filter(r => r.rating === star).length;
    return (count / totalReviews) * 100;
  };
  const [heroTitleFontColor, setHeroTitleFontColor] = useState<string>("#111827");
  const [heroTitleFontSize, setHeroTitleFontSize] = useState<string>("4.5rem");
  const [heroTitleFontAlignment, setHeroTitleFontAlignment] = useState<string>("center");
  const [heroTitleFontWeight, setHeroTitleFontWeight] = useState<string>("700");
  const [heroTitleFontVerticalAlignment, setHeroTitleFontVerticalAlignment] = useState<string>("bottom");
  const [heroTitlePositionX, setHeroTitlePositionX] = useState<number>(0);
  const [heroTitlePositionY, setHeroTitlePositionY] = useState<number>(0);
  const [heroTitleMaxWidth, setHeroTitleMaxWidth] = useState<number>(100);
  const [heroTitleMinHeight, setHeroTitleMinHeight] = useState<number>(0);

  const [heroManifesto, setHeroManifesto] = useState<string>("");
  const [heroManifestoFontType, setHeroManifestoFontType] = useState<string>("Outfit");
  const [heroManifestoFontColor, setHeroManifestoFontColor] = useState<string>("#ffffff");
  const [heroManifestoFontSize, setHeroManifestoFontSize] = useState<string>("0.72rem");
  const [heroManifestoFontAlignment, setHeroManifestoFontAlignment] = useState<string>("left");
  const [heroManifestoFontWeight, setHeroManifestoFontWeight] = useState<string>("500");
  const [heroManifestoFontVerticalAlignment, setHeroManifestoFontVerticalAlignment] = useState<string>("top");
  const [heroManifestoPositionX, setHeroManifestoPositionX] = useState<number>(0);
  const [heroManifestoPositionY, setHeroManifestoPositionY] = useState<number>(0);
  const [heroManifestoMaxWidth, setHeroManifestoMaxWidth] = useState<number>(100);
  const [heroManifestoMinHeight, setHeroManifestoMinHeight] = useState<number>(0);

  useEffect(() => {
    [heroTitleFontType, heroManifestoFontType].forEach(font => {
      if (!font) return;
      const systemFonts = ["SF Pro", "New York", "SF Mono", "Segoe UI", "Helvetica Neue", "Georgia", "Garamond"];
      if (systemFonts.includes(font)) return;
      const fontId = "dynamic-font-store-" + font.replace(/\s+/g, "-").toLowerCase();
      if (document.getElementById(fontId)) return;
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    });
  }, [heroTitleFontType, heroManifestoFontType]);
  const [videoTitle, setVideoTitle] = useState<string>("NEW ARRIVALS");
  const [videoSubtitle, setVideoSubtitle] = useState<string>("Drop's live. Smells divine. Feels better.");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoFallbackColor, setVideoFallbackColor] = useState<string>("#121212");
  const [lifestyleText, setLifestyleText] = useState<string>("Intense notes, Raw elements. This is 29sFORMULA.");
  const [lifestyleImage, setLifestyleImage] = useState<string>("https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
  const [primaryColor, setPrimaryColor] = useState<string>(
    typeof window !== 'undefined' ? (localStorage.getItem("settings_primaryColor") || "#57bc74") : "#57bc74"
  );
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [showLifestyle, setShowLifestyle] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Cart Drawer State
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isDiscountExpanded, setIsDiscountExpanded] = useState<boolean>(false);
  const [isCartClosing, setIsCartClosing] = useState<boolean>(false);

  const handleCloseCart = () => {
    setIsCartClosing(true);
    setTimeout(() => {
      setShowCartDrawer(false);
      setIsCartClosing(false);
    }, 300);
  };

  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);

  const initiateCheckout = () => {
    setShowCartDrawer(false);
    setShowCheckoutDrawer(true);
  };

  const handleOrderSuccess = (orderId: string, orderDetails: any) => {
    setShowCheckoutDrawer(false);
    setCompletedOrderId(orderId);
    setCompletedOrderDetails(orderDetails);
    setShowSuccessModal(true);
    
    // Clear cart
    localStorage.removeItem("cart");
    // Dispatch cart update event
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const loadCart = () => {
    if (typeof window !== "undefined") {
      const items = localStorage.getItem("cart");
      if (items) {
        try {
          setCartItems(JSON.parse(items));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    loadCart();
    const handleStorageChange = () => loadCart();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  const addToCart = (product: any, size: string = "50ml") => {
    if (typeof window !== "undefined") {
      const current = localStorage.getItem("cart");
      let itemsList = [];
      if (current) {
        try {
          itemsList = JSON.parse(current);
        } catch (e) {}
      }
      
      const existingIdx = itemsList.findIndex((item: any) => item._id === product._id && item.size === size);
      if (existingIdx > -1) {
        itemsList[existingIdx].quantity += 1;
      } else {
        const variantPrice = (product.options && product.options.find((o: any) => o.size === size)?.price) 
                          || (product.variants && product.variants.find((v: any) => v.size === size)?.price)
                          || product.price;

        itemsList.push({
          _id: product._id,
          name: product.name,
          price: variantPrice,
          imageFront: product.imageFront,
          size: size,
          quantity: 1
        });
      }
      localStorage.setItem("cart", JSON.stringify(itemsList));
      window.dispatchEvent(new Event("cartUpdated"));
      setShowCartDrawer(true);
    }
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      const updated = cartItems.filter((_, idx) => idx !== index);
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    } else {
      const updated = [...cartItems];
      updated[index].quantity = newQty;
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.warn("Autoplay was prevented by browser:", e));
    }
  }, [videoUrl]);

  useEffect(() => {
    // Load cached settings immediately to prevent visual jumps during load
    try {
      const cachedHeroTitle = localStorage.getItem("settings_heroTitle");
      if (cachedHeroTitle) setHeroTitle(cachedHeroTitle);
      const cachedHeroTitleFontType = localStorage.getItem("settings_heroTitleFontType");
      if (cachedHeroTitleFontType) setHeroTitleFontType(cachedHeroTitleFontType);
      const cachedHeroTitleFontColor = localStorage.getItem("settings_heroTitleFontColor");
      if (cachedHeroTitleFontColor) setHeroTitleFontColor(cachedHeroTitleFontColor);
      const cachedHeroTitleFontSize = localStorage.getItem("settings_heroTitleFontSize");
      if (cachedHeroTitleFontSize) setHeroTitleFontSize(cachedHeroTitleFontSize);
      const cachedHeroTitleFontAlignment = localStorage.getItem("settings_heroTitleFontAlignment");
      if (cachedHeroTitleFontAlignment) setHeroTitleFontAlignment(cachedHeroTitleFontAlignment);
      const cachedHeroTitleFontVerticalAlignment = localStorage.getItem("settings_heroTitleFontVerticalAlignment");
      if (cachedHeroTitleFontVerticalAlignment) setHeroTitleFontVerticalAlignment(cachedHeroTitleFontVerticalAlignment);
      const cachedHeroTitleFontWeight = localStorage.getItem("settings_heroTitleFontWeight");
      if (cachedHeroTitleFontWeight) setHeroTitleFontWeight(cachedHeroTitleFontWeight);
      const cachedHeroManifesto = localStorage.getItem("settings_heroManifesto");
      if (cachedHeroManifesto) setHeroManifesto(cachedHeroManifesto);
      const cachedVideoTitle = localStorage.getItem("settings_videoTitle");
      if (cachedVideoTitle) setVideoTitle(cachedVideoTitle);
      const cachedVideoSubtitle = localStorage.getItem("settings_videoSubtitle");
      if (cachedVideoSubtitle) setVideoSubtitle(cachedVideoSubtitle);
      const cachedVideoUrl = localStorage.getItem("settings_videoUrl");
      if (cachedVideoUrl) setVideoUrl(cachedVideoUrl);
      const cachedVideoFallbackColor = localStorage.getItem("settings_videoFallbackColor");
      if (cachedVideoFallbackColor) setVideoFallbackColor(cachedVideoFallbackColor);
      const cachedLifestyleText = localStorage.getItem("settings_lifestyleText");
      if (cachedLifestyleText) setLifestyleText(cachedLifestyleText);
      const cachedLifestyleImage = localStorage.getItem("settings_lifestyleImage");
      if (cachedLifestyleImage) setLifestyleImage(cachedLifestyleImage);
      const cachedPrimaryColor = localStorage.getItem("settings_primaryColor");
      if (cachedPrimaryColor) setPrimaryColor(cachedPrimaryColor);
      const cachedHeroTitlePositionX = localStorage.getItem("settings_heroTitlePositionX");
      if (cachedHeroTitlePositionX) setHeroTitlePositionX(Number(cachedHeroTitlePositionX));
      const cachedHeroTitlePositionY = localStorage.getItem("settings_heroTitlePositionY");
      if (cachedHeroTitlePositionY) setHeroTitlePositionY(Number(cachedHeroTitlePositionY));
      const cachedHeroTitleMaxWidth = localStorage.getItem("settings_heroTitleMaxWidth");
      if (cachedHeroTitleMaxWidth) setHeroTitleMaxWidth(Number(cachedHeroTitleMaxWidth));
      const cachedHeroTitleMinHeight = localStorage.getItem("settings_heroTitleMinHeight");
      if (cachedHeroTitleMinHeight) setHeroTitleMinHeight(Number(cachedHeroTitleMinHeight));
      const cachedHeroManifestoPositionX = localStorage.getItem("settings_heroManifestoPositionX");
      if (cachedHeroManifestoPositionX) setHeroManifestoPositionX(Number(cachedHeroManifestoPositionX));
      const cachedHeroManifestoPositionY = localStorage.getItem("settings_heroManifestoPositionY");
      if (cachedHeroManifestoPositionY) setHeroManifestoPositionY(Number(cachedHeroManifestoPositionY));
      const cachedHeroManifestoMaxWidth = localStorage.getItem("settings_heroManifestoMaxWidth");
      if (cachedHeroManifestoMaxWidth) setHeroManifestoMaxWidth(Number(cachedHeroManifestoMaxWidth));
      const cachedHeroManifestoMinHeight = localStorage.getItem("settings_heroManifestoMinHeight");
      if (cachedHeroManifestoMinHeight) setHeroManifestoMinHeight(Number(cachedHeroManifestoMinHeight));
      const cachedHeroBgType = localStorage.getItem("settings_heroBgType");
      if (cachedHeroBgType === "color" || cachedHeroBgType === "image" || cachedHeroBgType === "video") setHeroBgType(cachedHeroBgType);
      const cachedHeroBgColor = localStorage.getItem("settings_heroBgColor");
      if (cachedHeroBgColor) setHeroBgColor(cachedHeroBgColor);
      const cachedHeroBgImage = localStorage.getItem("settings_heroBgImage");
      if (cachedHeroBgImage) setHeroBgImage(cachedHeroBgImage);
      const cachedHeroBgVideo = localStorage.getItem("settings_heroBgVideo");
      if (cachedHeroBgVideo) setHeroBgVideo(cachedHeroBgVideo);
      const cachedShowVideo = localStorage.getItem("settings_showVideo");
      if (cachedShowVideo) setShowVideo(cachedShowVideo === "true");
      const cachedShowLifestyle = localStorage.getItem("settings_showLifestyle");
      if (cachedShowLifestyle) setShowLifestyle(cachedShowLifestyle === "true");
      
      // Load cached arrays list to avoid slow loading layout shifts
      const cachedArrivals = localStorage.getItem("storefront_arrivals");
      if (cachedArrivals) setArrivals(JSON.parse(cachedArrivals));
      const cachedBestSellers = localStorage.getItem("storefront_bestSellers");
      if (cachedBestSellers) setBestSellers(JSON.parse(cachedBestSellers));
    } catch (e) {
      console.warn("Failed to load cached settings:", e);
    }

    const loadData = () => {
      fetch("http://127.0.0.1:5001/api/storefront/home", { cache: "no-store" })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(payload => {
          if (payload.arrivals && Array.isArray(payload.arrivals)) {
            setArrivals(payload.arrivals);
            localStorage.setItem("storefront_arrivals", JSON.stringify(payload.arrivals));
          }
          if (payload.bestSellers && Array.isArray(payload.bestSellers)) {
            setBestSellers(payload.bestSellers);
            localStorage.setItem("storefront_bestSellers", JSON.stringify(payload.bestSellers));
          }
          
          if (payload.reviews && Array.isArray(payload.reviews)) {
            const formatted = payload.reviews.map((r: any) => ({
              name: r.author || r.authorName || "Anonymous",
              date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              rating: Number(r.rating) || 5,
              text: r.comment || r.text || ""
            }));
            setAllReviews(formatted);
          }

          if (payload.settings) {
            const data = payload.settings;
            setGlobalSettings(data);
            if (data.heroTitle !== undefined) {
              setHeroTitle(data.heroTitle);
              localStorage.setItem("settings_heroTitle", data.heroTitle);
            }
            if (data.heroTitleFontType !== undefined) {
              setHeroTitleFontType(data.heroTitleFontType);
              localStorage.setItem("settings_heroTitleFontType", data.heroTitleFontType);
            }
            if (data.heroTitleFontColor !== undefined) {
              setHeroTitleFontColor(data.heroTitleFontColor);
              localStorage.setItem("settings_heroTitleFontColor", data.heroTitleFontColor);
            }
            if (data.heroTitleFontSize !== undefined) {
              setHeroTitleFontSize(data.heroTitleFontSize);
              localStorage.setItem("settings_heroTitleFontSize", data.heroTitleFontSize);
            }
            if (data.heroTitleFontAlignment !== undefined) {
              setHeroTitleFontAlignment(data.heroTitleFontAlignment);
              localStorage.setItem("settings_heroTitleFontAlignment", data.heroTitleFontAlignment);
            }
            if (data.heroTitleFontVerticalAlignment !== undefined) {
              setHeroTitleFontVerticalAlignment(data.heroTitleFontVerticalAlignment);
              localStorage.setItem("settings_heroTitleFontVerticalAlignment", data.heroTitleFontVerticalAlignment);
            }
            if (data.heroTitleFontWeight !== undefined) {
              setHeroTitleFontWeight(data.heroTitleFontWeight);
              localStorage.setItem("settings_heroTitleFontWeight", data.heroTitleFontWeight);
            }
            if (data.heroTitlePositionX !== undefined) {
              setHeroTitlePositionX(data.heroTitlePositionX);
              localStorage.setItem("settings_heroTitlePositionX", String(data.heroTitlePositionX));
            }
            if (data.heroTitlePositionY !== undefined) {
              setHeroTitlePositionY(data.heroTitlePositionY);
              localStorage.setItem("settings_heroTitlePositionY", String(data.heroTitlePositionY));
            }
            if (data.heroTitleMaxWidth !== undefined) {
              setHeroTitleMaxWidth(data.heroTitleMaxWidth);
              localStorage.setItem("settings_heroTitleMaxWidth", String(data.heroTitleMaxWidth));
            }
            if (data.heroTitleMinHeight !== undefined) {
              setHeroTitleMinHeight(data.heroTitleMinHeight);
              localStorage.setItem("settings_heroTitleMinHeight", String(data.heroTitleMinHeight));
            }
            if (data.heroManifesto !== undefined) {
              setHeroManifesto(data.heroManifesto);
              localStorage.setItem("settings_heroManifesto", data.heroManifesto);
            }
            if (data.heroManifestoFontType !== undefined) { setHeroManifestoFontType(data.heroManifestoFontType); localStorage.setItem("settings_heroManifestoFontType", data.heroManifestoFontType); }
            if (data.heroManifestoFontColor !== undefined) { setHeroManifestoFontColor(data.heroManifestoFontColor); localStorage.setItem("settings_heroManifestoFontColor", data.heroManifestoFontColor); }
            if (data.heroManifestoFontSize !== undefined) { setHeroManifestoFontSize(data.heroManifestoFontSize); localStorage.setItem("settings_heroManifestoFontSize", data.heroManifestoFontSize); }
            if (data.heroManifestoFontAlignment !== undefined) { setHeroManifestoFontAlignment(data.heroManifestoFontAlignment); localStorage.setItem("settings_heroManifestoFontAlignment", data.heroManifestoFontAlignment); }
            if (data.heroManifestoFontVerticalAlignment !== undefined) { setHeroManifestoFontVerticalAlignment(data.heroManifestoFontVerticalAlignment); localStorage.setItem("settings_heroManifestoFontVerticalAlignment", data.heroManifestoFontVerticalAlignment); }
            if (data.heroManifestoFontWeight !== undefined) { setHeroManifestoFontWeight(data.heroManifestoFontWeight); localStorage.setItem("settings_heroManifestoFontWeight", data.heroManifestoFontWeight); }
            if (data.heroManifestoPositionX !== undefined) { setHeroManifestoPositionX(data.heroManifestoPositionX); localStorage.setItem("settings_heroManifestoPositionX", String(data.heroManifestoPositionX)); }
            if (data.heroManifestoPositionY !== undefined) { setHeroManifestoPositionY(data.heroManifestoPositionY); localStorage.setItem("settings_heroManifestoPositionY", String(data.heroManifestoPositionY)); }
            if (data.heroManifestoMaxWidth !== undefined) { setHeroManifestoMaxWidth(data.heroManifestoMaxWidth); localStorage.setItem("settings_heroManifestoMaxWidth", String(data.heroManifestoMaxWidth)); }
            if (data.heroManifestoMinHeight !== undefined) { setHeroManifestoMinHeight(data.heroManifestoMinHeight); localStorage.setItem("settings_heroManifestoMinHeight", String(data.heroManifestoMinHeight)); }
            if (data.videoTitle !== undefined) {
              setVideoTitle(data.videoTitle);
              localStorage.setItem("settings_videoTitle", data.videoTitle);
            }
            if (data.videoSubtitle !== undefined) {
              setVideoSubtitle(data.videoSubtitle);
              localStorage.setItem("settings_videoSubtitle", data.videoSubtitle);
            }
            if (data.videoUrl !== undefined) {
              setVideoUrl(data.videoUrl);
              localStorage.setItem("settings_videoUrl", data.videoUrl);
            }
            if (data.videoFallbackColor !== undefined) {
              setVideoFallbackColor(data.videoFallbackColor);
              localStorage.setItem("settings_videoFallbackColor", data.videoFallbackColor);
            }
            if (data.lifestyleText !== undefined) {
              setLifestyleText(data.lifestyleText);
              localStorage.setItem("settings_lifestyleText", data.lifestyleText);
            }
            if (data.lifestyleImage !== undefined) {
              setLifestyleImage(data.lifestyleImage);
              localStorage.setItem("settings_lifestyleImage", data.lifestyleImage);
            }
            if (data.primaryColor !== undefined) {
              setPrimaryColor(data.primaryColor);
              if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);
              localStorage.setItem("settings_primaryColor", data.primaryColor);
            }
            if (data.heroBgType !== undefined) {
              setHeroBgType(data.heroBgType);
              localStorage.setItem("settings_heroBgType", data.heroBgType);
            }
            if (data.heroBgColor !== undefined) {
              setHeroBgColor(data.heroBgColor);
              localStorage.setItem("settings_heroBgColor", data.heroBgColor);
            }
            if (data.heroBgImage !== undefined) {
              setHeroBgImage(data.heroBgImage);
              localStorage.setItem("settings_heroBgImage", data.heroBgImage);
            }
            if (data.heroBgVideo !== undefined) {
              setHeroBgVideo(data.heroBgVideo);
              localStorage.setItem("settings_heroBgVideo", data.heroBgVideo);
            }
            if (data.showVideo !== undefined) {
              setShowVideo(data.showVideo);
              localStorage.setItem("settings_showVideo", String(data.showVideo));
            }
            if (data.showLifestyle !== undefined) {
              setShowLifestyle(data.showLifestyle);
              localStorage.setItem("settings_showLifestyle", String(data.showLifestyle));
            }
            if (data.faqs !== undefined && Array.isArray(data.faqs)) setFaqs(data.faqs);
          }
        })
        .catch(err => console.warn("Quietly catching storefront fetch error:", err.message || err));
    };

    loadData();
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  

  return (
    <div suppressHydrationWarning className={styles.page}>
      <Preloader />
      <style>{`
        @keyframes slideInFromRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutToLeft {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-30px); }
        }
        @keyframes slideInFromLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutToRight {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(30px); }
        }
      `}</style>
      
      {/* 3. Navigation Header */}
      <Navbar onCartClick={() => setShowCartDrawer(true)} />

      {/* 4. Hero Section */}
      <section 
        className={styles.hero}
        style={{
          backgroundColor: heroBgType === "color" ? (heroBgColor || "var(--primary-brand-color, #57bc74)") : "#121212",
          backgroundImage: heroBgType === "image" && heroBgImage ? `url("${heroBgImage}")` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: "80vh"
        }}
      >
        {/* Background Video for Storefront */}
        {heroBgType === "video" && heroBgVideo && (
          <video
            src={heroBgVideo}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1
            }}
          />
        )}
        {/* Dark overlay for text readability when using image or video */}
        {heroBgType !== "color" && (
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            zIndex: 1
          }} />
        )}
        
        {/* Content wrapper with z-index positioning */}
        <div className={styles.heroContent} style={{ position: "relative", zIndex: 2, height: "100%", width: "100%" }}>
          <div 
            style={{
              position: "absolute",
              top: heroManifestoFontVerticalAlignment === "top" ? "0" : (heroManifestoFontVerticalAlignment === "middle" ? "50%" : "auto"),
              bottom: heroManifestoFontVerticalAlignment === "bottom" ? "0" : "auto",
              left: `calc(50% - (${heroManifestoMaxWidth}% / 2) + ${heroManifestoPositionX}px)`,
              width: `${heroManifestoMaxWidth}%`,
              minHeight: heroManifestoMinHeight ? `${heroManifestoMinHeight}px` : "auto",
              fontFamily: getFontFamilyStack(heroManifestoFontType),
              color: heroManifestoFontColor,
              fontSize: heroManifestoFontSize,
              textAlign: heroManifestoFontAlignment as any,
              fontWeight: Number(heroManifestoFontWeight),
              lineHeight: "1.6",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              transform: `translateY(${heroManifestoFontVerticalAlignment === "middle" ? "-50%" : "0"})`,
              zIndex: 2,
              pointerEvents: "none"
            }}
          >
            <strong style={{ fontWeight: 800 }}>RAW & HONEST</strong>{" "}
            {heroManifesto}
          </div>
          <h1 
            className={styles.brandTitle}
            style={{
              position: "absolute",
              top: heroTitleFontVerticalAlignment === "top" ? "0" : (heroTitleFontVerticalAlignment === "middle" ? "50%" : "auto"),
              bottom: heroTitleFontVerticalAlignment === "bottom" ? "0" : "auto",
              left: `calc(50% - (${heroTitleMaxWidth}% / 2) + ${heroTitlePositionX}px)`,
              width: `${heroTitleMaxWidth}%`,
              minHeight: heroTitleMinHeight ? `${heroTitleMinHeight}px` : "auto",
              fontFamily: getFontFamilyStack(heroTitleFontType),
              color: heroTitleFontColor,
              fontSize: heroTitleFontSize,
              textAlign: heroTitleFontAlignment as any,
              fontWeight: Number(heroTitleFontWeight),
              transform: `translateY(${heroTitleFontVerticalAlignment === "middle" ? "-50%" : "0"}) scaleY(1.05)`
            }}
          >
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* 5. New Arrivals Video Section */}
      {showVideo && (
        <section className={styles.videoSection} style={{ backgroundColor: videoFallbackColor }}>
          {videoUrl && (
            <video 
              ref={videoRef}
              key={videoUrl}
              className={styles.bgVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          )}
          <div className={styles.videoOverlay} />
          <div className={styles.videoContent}>
            <h2 className={styles.videoTitle}>{videoTitle}</h2>
            <p className={styles.videoSubtitle}>{videoSubtitle}</p>
            <Link href="/shop">
              <button className={styles.videoBtn}>Shop Now</button>
            </Link>
          </div>
        </section>
      )}

      {/* 6. Latest Arrivals Products Section */}
      <section className={styles.arrivalsSection}>
        <div className={styles.arrivalsHeader}>
          <h2 className={styles.arrivalsTitle}>LATEST ARRIVALS</h2>
          <Link href="/shop?category=arrivals" className={styles.viewAllLink}>VIEW ALL</Link>
        </div>
        <div className={arrivals.length > 0 ? styles.arrivalsGrid : styles.emptyStateGrid}>
          {arrivals.length > 0 ? (
            arrivals.map((product) => (
              <Link 
                key={product._id} 
                href={`/product/${product._id}`}
                onClick={(e) => {
                  if (product.quantity === 0) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                style={{ 
                  textDecoration: "none", 
                  color: "inherit", 
                  display: "block",
                  cursor: product.quantity === 0 ? "not-allowed" : "pointer"
                }}
              >
                <div className={styles.productCard} style={product.quantity === 0 ? { pointerEvents: "none" } : {}}>
                  <div className={styles.productImageContainer} style={product.quantity === 0 ? { filter: "grayscale(1)", opacity: 0.7 } : {}}>
                    <img 
                      className={`${styles.productImage} ${styles.productImageFront}`} 
                      src={product.imageFront} 
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.imageBack && (
                      <img 
                        className={`${styles.productImage} ${styles.productImageBack}`} 
                        src={product.imageBack} 
                        alt={`${product.name} Alternate`}
                        loading="lazy"
                      />
                    )}
                    
                    {/* Arrow controls */}
                    <button 
                      aria-label="Previous image" 
                      className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <button 
                      aria-label="Next image" 
                      className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
    
                    <button 
                      aria-label="Add to cart" 
                      className={styles.addToCartCircle}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.cartIcon}>
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                        <line x1="12" y1="13" x2="12" y2="17"></line>
                        <line x1="10" y1="15" x2="14" y2="15"></line>
                      </svg>
                    </button>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productPrice}>Rs. {product.price.toLocaleString("en-IN")}.00</p>
                    {product.quantity !== undefined && product.quantity <= 5 && (
                      <p style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 700, marginTop: "4px", letterSpacing: "0.02em" }}>
                        {product.quantity === 0 ? "OUT OF STOCK" : `ONLY ${product.quantity} LEFT`}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyStateContainer}>
              <p>Our latest perfume arrivals are currently being prepared. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. Lifestyle Banner Section */}
      {showLifestyle && (
        <section 
          className={styles.lifestyleBanner}
          style={{ backgroundImage: `url(${lifestyleImage})` }}
        >
          <div className={styles.lifestyleOverlay} />
          <p className={styles.lifestyleText}>{lifestyleText}</p>
        </section>
      )}

      {/* 8. Best Sellers Products Section */}
      <section className={styles.arrivalsSection}>
        <div className={styles.arrivalsHeader}>
          <h2 className={styles.arrivalsTitle}>BEST SELLERS</h2>
          <Link href="/shop?category=bestsellers" className={styles.viewAllLink}>SHOP ALL</Link>
        </div>
        <div className={bestSellers.length > 0 ? styles.arrivalsGrid : styles.emptyStateGrid}>
          {bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <Link 
                key={product._id} 
                href={`/product/${product._id}`}
                onClick={(e) => {
                  if (product.quantity === 0) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                style={{ 
                  textDecoration: "none", 
                  color: "inherit", 
                  display: "block",
                  cursor: product.quantity === 0 ? "not-allowed" : "pointer"
                }}
              >
                <div className={styles.productCard} style={product.quantity === 0 ? { pointerEvents: "none" } : {}}>
                  <div className={styles.productImageContainer} style={product.quantity === 0 ? { filter: "grayscale(1)", opacity: 0.7 } : {}}>
                    <img 
                      className={`${styles.productImage} ${styles.productImageFront}`} 
                      src={product.imageFront} 
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.imageBack && (
                      <img 
                        className={`${styles.productImage} ${styles.productImageBack}`} 
                        src={product.imageBack} 
                        alt={`${product.name} Alternate`}
                        loading="lazy"
                      />
                    )}
                    
                    {/* Arrow controls */}
                    <button 
                      aria-label="Previous image" 
                      className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <button 
                      aria-label="Next image" 
                      className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.arrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
    
                    <button 
                      aria-label="Add to cart" 
                      className={styles.addToCartCircle}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.cartIcon}>
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                        <line x1="12" y1="13" x2="12" y2="17"></line>
                        <line x1="10" y1="15" x2="14" y2="15"></line>
                      </svg>
                    </button>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productPrice}>Rs. {product.price.toLocaleString("en-IN")}.00</p>
                    {product.quantity !== undefined && product.quantity <= 5 && (
                      <p style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 700, marginTop: "4px", letterSpacing: "0.02em" }}>
                        {product.quantity === 0 ? "OUT OF STOCK" : `ONLY ${product.quantity} LEFT`}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyStateContainer}>
              <p>No featured best sellers cataloged yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* 9. Customer Reviews Section */}
      <section style={{
        backgroundColor: "#f9fafb",
        padding: "80px 40px",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1100px",
          display: "flex",
          flexDirection: "column",
          gap: "35px"
        }}>
          {/* Header Title */}
          <h2 style={{
            fontSize: "2.2rem",
            fontWeight: 600,
            fontFamily: "Outfit, Inter, sans-serif",
            color: "#111827",
            margin: "0 0 10px 0",
            textAlign: "left"
          }}>
            Rating & Reviews
          </h2>

          {/* Grid Layout containing rating summary on left and review card on right */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(300px, 1fr) 1.2fr",
            gap: "60px",
            alignItems: "center",
            width: "100%"
          }}>
            {/* Left Column: Summary Rating */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
              justifyContent: "space-between"
            }}>
              {/* Overall Score */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <span style={{
                    fontSize: "7.5rem",
                    fontWeight: 700,
                    color: "#111827",
                    fontFamily: "Outfit, sans-serif",
                    lineHeight: "0.9"
                  }}>
                    {avgRating}
                  </span>
                  <span style={{
                    fontSize: "2.2rem",
                    color: "#9ca3af",
                    fontWeight: 500,
                    marginLeft: "4px"
                  }}>
                    /5
                  </span>
                </div>
                <span style={{
                  fontSize: "1rem",
                  color: "#9ca3af",
                  fontWeight: 500,
                  marginTop: "16px",
                  fontFamily: "Inter, sans-serif"
                }}>
                  ({totalReviews} Reviews)
                </span>
              </div>

              {/* Progress Bars */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flexGrow: 1,
                maxWidth: "240px"
              }}>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#d97706", fontSize: "1.1rem" }}>★</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", width: "12px" }}>{star}</span>
                    <div style={{ flexGrow: 1, height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", position: "relative" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${getRatingPercent(star)}%`, backgroundColor: "#111827", borderRadius: "4px", transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Review Card */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.03)",
              minHeight: "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative"
            }}>
              <div style={{
                animation: reviewFade 
                  ? (slideDirection === "forward" ? "slideInFromRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" : "slideInFromLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards") 
                  : (slideDirection === "forward" ? "slideOutToLeft 0.3s ease forwards" : "slideOutToRight 0.3s ease forwards"),
              }}>
                {totalReviews === 0 ? (
                  <div style={{ padding: "40px 0", textAlign: "center" }}>
                    <p style={{ fontSize: "1.2rem", color: "#6b7280", fontFamily: "Inter, sans-serif", margin: 0 }}>
                      No reviews yet. Check out our products and be the first to leave a review!
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <span style={{ fontWeight: 600, fontSize: "1.1rem", color: "#111827", fontFamily: "Outfit, sans-serif" }}>
                        {allReviews[currentReviewIndex]?.name}
                      </span>
                    </div>
                    {/* Stars and Date Row */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px"
                    }}>
                      {/* Gold Stars */}
                      <div style={{ display: "flex", gap: "2px", color: "#d97706", fontSize: "1.1rem" }}>
                        {"★".repeat(allReviews[currentReviewIndex]?.rating || 5)}
                      </div>
                      {/* Date */}
                      <span style={{
                        fontSize: "0.9rem",
                        color: "#9ca3af",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500
                      }}>
                        {allReviews[currentReviewIndex]?.date}
                      </span>
                    </div>
                    {/* Review text */}
                    <p style={{
                      fontSize: "1.1rem",
                      color: "#374151",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: "1.6",
                      margin: 0
                    }}>
                      &ldquo;{allReviews[currentReviewIndex]?.text}&rdquo;
                    </p>
                  </>
                )}
              </div>

              {/* Dynamic Dots Carousel */}
              <div style={{ display: "flex", gap: "6px", overflow: "hidden", borderRadius: "100px", height: "6px", backgroundColor: "#e5e7eb" }}>
                {allReviews.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (i === currentReviewIndex) return;
                      setSlideDirection(i > currentReviewIndex ? "forward" : "backward");
                      setReviewFade(false);
                      setTimeout(() => {
                        setCurrentReviewIndex(i);
                        setReviewFade(true);
                      }, 200);
                    }}
                    style={{
                      flex: 1,
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {/* Active Bar indicator */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "#111827",
                      opacity: currentReviewIndex === i ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      borderRadius: "100px"
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions Section */}
      <section className={styles.faqSection}>
        <h2 className={styles.faqTitle}>FREQUENTLY ASKED QUESTIONS</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem} onClick={() => toggleFaq(index)}>
              <div className={styles.faqItemHeader}>
                <span className={styles.faqQuestion}>{faq.question.toUpperCase()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`${styles.faqChevron} ${activeFaq === index ? styles.faqChevronActive : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <div className={`${styles.faqItemContent} ${activeFaq === index ? styles.faqItemContentActive : ""}`}>
                <p className={styles.faqAnswerText}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <Footer />

      {/* Cart Slider Drawer Overlay */}
      {showCartDrawer && (
        <div className={`${styles.cartOverlay} ${isCartClosing ? styles.cartOverlayClosing : ""}`} onClick={handleCloseCart}>
          <div className={`${styles.cartDrawer} ${isCartClosing ? styles.cartDrawerClosing : ""}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cartDrawerHeader}>
              <div className={styles.cartHeaderLeft}>
                <span>CART</span>
                {cartItems.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                  <span className={styles.cartCountBadge}>
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button 
                aria-label="Close cart" 
                className={styles.closeCartBtn} 
                onClick={handleCloseCart}
              >
                ✕
              </button>
            </div>

            {cartItems.length > 0 ? (
              <div className={styles.cartDrawerBody}>
                <div className={styles.cartItemsList}>
                  {cartItems.map((item, index) => (
                    <div key={`${item._id}-${item.size}`} className={styles.cartItemRow}>
                      <img src={item.imageFront} alt={item.name} className={styles.cartItemImg} loading="lazy" />
                      <div className={styles.cartItemInfo}>
                        <div className={styles.cartItemHeaderRow}>
                          <h4 className={styles.cartItemName}>{item.name.toUpperCase()}</h4>
                          <span className={styles.cartItemTotalPrice}>Rs. {(item.price * item.quantity).toLocaleString("en-IN")}.00</span>
                        </div>
                        <p className={styles.cartItemSize}>{item.size}</p>
                        <p className={styles.cartItemUnitPrice}>Rs. {item.price.toLocaleString("en-IN")}.00</p>
                        
                        <div className={styles.cartItemControlsRow}>
                          <div className={styles.qtyControlRow}>
                            <button onClick={() => updateQuantity(index, item.quantity - 1)} className={styles.qtyBtn}>−</button>
                            <span className={styles.qtyVal}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(index, item.quantity + 1)} className={styles.qtyBtn}>+</button>
                          </div>
                          
                          <button onClick={() => updateQuantity(index, 0)} className={styles.removeCartItemBtn} title="Remove item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: 16, height: 16 }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.cartDrawerFooter}>
                  <div className={styles.cartDrawerDivider}></div>
                  
                  <div 
                    className={`${styles.discountRow} ${isDiscountExpanded ? styles.discountRowExpanded : ""}`}
                    onClick={() => setIsDiscountExpanded(!isDiscountExpanded)}
                  >
                    <span>Discount</span>
                    <span>{isDiscountExpanded ? "−" : "+"}</span>
                  </div>
                  
                  <div className={`${styles.discountFormWrapper} ${isDiscountExpanded ? styles.discountFormWrapperExpanded : ""}`}>
                    <div className={styles.discountForm}>
                      <input 
                        type="text" 
                        placeholder="Discount code" 
                        className={styles.discountInput} 
                        onClick={(e) => e.stopPropagation()} 
                      />
                      <button 
                        className={styles.discountApplyBtn}
                        onClick={(e) => { e.stopPropagation(); alert("Discount code applied!"); }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.totalContainer}>
                    <span className={styles.totalTitle}>Estimated total</span>
                    <span className={styles.totalVal}>Rs. {cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString("en-IN")}.00</span>
                  </div>
                  
                  <p className={styles.taxSubtext}>
                    Duties and taxes included. Shipping is calculated at checkout.
                  </p>
                  
                  <button className={styles.checkoutBtn} onClick={initiateCheckout}>
                    Checkout
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.cartDrawerEmpty}>
                <h2 className={styles.cartEmptyHeading}>YOUR CART IS EMPTY</h2>
                <p className={styles.cartEmptySubtext}>
                  Have an account? <Link href="/login" className={styles.cartLoginLink} onClick={handleCloseCart}>Log in</Link> to check out faster.
                </p>
                <button className={styles.continueBtn} onClick={handleCloseCart}>
                  Continue shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Realtime Checkout Drawer and Success Overlay */}
      <CheckoutDrawer
        isOpen={showCheckoutDrawer}
        onClose={() => setShowCheckoutDrawer(false)}
        cartItems={cartItems}
        primaryColor={primaryColor}
        onOrderSuccess={handleOrderSuccess}
      />
      <OrderSuccessModal
        isOpen={showSuccessModal}
        orderId={completedOrderId}
        orderDetails={completedOrderDetails}
        onClose={() => setShowSuccessModal(false)}
        primaryColor={primaryColor}
      />
    </div>
  );
}
