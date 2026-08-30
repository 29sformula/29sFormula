'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import Footer from "@/components/Footer";
import NewtonsCradleLoader from "@/components/NewtonsCradleLoader";

import CheckoutDrawer from "@/components/CheckoutDrawer";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import Navbar from "@/components/Navbar/Navbar";

interface Product {
  _id: string;
  name: string;
  price: number;
  strikePrice?: number;
  quantity?: number;
  description?: string;
  category: string | string[];
  imageFront: string;
  imageBack?: string;
  images?: string[];
  sizes?: string[];
}

const defaultProducts: Product[] = [];

export default function ProductDetailPage() {
  const { id } = useParams();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState<string>(
    "#57bc74"
  );
  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts);
  
  // Media Gallery states
  const [activeImg, setActiveImg] = useState<string>("");
  const [allImages, setAllImages] = useState<string[]>([]);
  
  // Customizer option choices
  const [selectedVolume, setSelectedVolume] = useState<string>("100ml");
  const [quantity, setQuantity] = useState<number>(1);
  

  // Cart Drawer State
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartError, setCartError] = useState<string | null>(null);

  const showCartError = (msg: string) => {
    setCartError(msg);
    setTimeout(() => setCartError(null), 3000);
  };
  const [isDiscountExpanded, setIsDiscountExpanded] = useState<boolean>(false);
  const [isCartClosing, setIsCartClosing] = useState<boolean>(false);

  // Session is now handled by Navbar

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
  // Coupon/Discount States
  const [couponCodeInput, setCouponCodeInput] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<any | null>(null);
  const [couponMessage, setCouponMessage] = useState<string>("");

  const handleApplyCoupon = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!couponCodeInput.trim()) return;

    try {
      const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/discounts/validate?code=${couponCodeInput.trim()}&subtotal=${cartSubtotal}`, { cache: "no-store" });
      if (res.ok) {
        const discount = await res.json();
        setAppliedDiscount(discount);
        setCouponMessage(`Coupon ${discount.code} applied successfully!`);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 10000
        });
      } else {
        const errData = await res.json().catch(() => null);
        setAppliedDiscount(null);
        setCouponMessage(errData?.error || "Invalid discount coupon code.");
      }
    } catch (err) {
      setCouponMessage("Could not validate coupon.");
    }
  };

  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  // Reviews Section State (Connected to MongoDB database)
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState<string>("");
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string>("");
  const [reviewsData, setReviewsData] = useState<any>({
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
  
  // Real-world Reviews List State
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewFade, setReviewFade] = useState(true);

  const displayReviews = reviewsList;

  useEffect(() => {
    setCurrentReviewIndex(0);
  }, [reviewsList.length]);

  useEffect(() => {
    if (displayReviews.length <= 1) return;
    const interval = setInterval(() => {
      setReviewFade(false);
      setTimeout(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % displayReviews.length);
        setReviewFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [displayReviews.length]);

  // Review Photo Uploads & Lightbox State
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // FAQ Section State
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [faqsList, setFaqsList] = useState<any[]>([
    {
      question: "HOW DO I FIND MY PERFECT SCENT?",
      answer: "We recommend reviewing the scent notes on each product page or starting with our discovery set. Every 29sFORMULA fragrance is crafted with botanical essences that evolve dynamically on skin."
    },
    {
      question: "WHEN WILL MY NEW 29S BOTTLE ARRIVE?",
      answer: "Every order is hand-packaged with care. Express dispatch typically takes 1-2 business days, followed by 3-5 days delivery time across India with live tracking."
    },
    {
      question: "WHAT IS THE LONGEVITY & PROJECTION OF 29S PERFUMES?",
      answer: "Our formulations carry high essential oil concentrations (Extrait / Eau de Parfum grade), ensuring 8-12+ hours of long-lasting sillage on skin and fabric."
    },
    {
      question: "WHAT IF I WANT TO RETURN OR EXCHANGE?",
      answer: "We accept 7-day easy returns and exchanges for unopened bottles in original packaging. Damaged or defective items are replaced immediately with express delivery."
    },
    {
      question: "HOW SHOULD I STORE MY FRAGRANCE FOR LONGEST SHELF LIFE?",
      answer: "Store your bottle in a cool, dry place away from direct sunlight and temperature fluctuations to preserve the pure formulation notes for up to 3+ years."
    }
  ]);

  // Dynamic Admin Product Page CMS Settings
  const [showProductReviews, setShowProductReviews] = useState<boolean>(true);
  const [showProductExploreMore, setShowProductExploreMore] = useState<boolean>(true);
  const [showProductFaq, setShowProductFaq] = useState<boolean>(true);
  const [usageGuideText, setUsageGuideText] = useState<string>("Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes.");
  const [exploreMoreTitle, setExploreMoreTitle] = useState<string>("Don't Stop. Explore More.");
  const [deliverySubtext, setDeliverySubtext] = useState<string>("TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.");

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/upload`, {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            uploadedUrls.push(data.url);
          }
        }
      } catch (err) {
        console.error("Failed to upload review photo:", err);
      }
    }

    setReviewImages(prev => [...prev, ...uploadedUrls]);
    setUploadingImage(false);
  };

  const handleRemoveReviewImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const fetchReviews = async (productId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/reviews/${productId}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setReviewsData({
          average: data.average || 0,
          total: data.total || 0,
          breakdown: data.breakdown || [
            { stars: 5, percentage: 0, count: 0 },
            { stars: 4, percentage: 0, count: 0 },
            { stars: 3, percentage: 0, count: 0 },
            { stars: 2, percentage: 0, count: 0 },
            { stars: 1, percentage: 0, count: 0 },
          ]
        });
        setReviewsList(data.reviews || []);
      }
    } catch (err) {
      console.warn("Failed to fetch database reviews:", err);
    }
  };

  useEffect(() => {
    if (product && product._id) {
      fetchReviews(product._id);
    }
  }, [product]);


  // Lock background page scroll when review modal, cart drawer, or lightbox is open
  useEffect(() => {
    if (showReviewModal || showCartDrawer || lightboxImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReviewModal, showCartDrawer, lightboxImg]);


  const handleToggleHelpful = async (reviewId: string) => {
    setReviewsList(prev => prev.map(rev => {
      const idStr = rev._id || rev.id;
      if (idStr === reviewId) {
        const isLiked = rev.userLiked;
        return {
          ...rev,
          userLiked: !isLiked,
          helpful: isLiked ? Math.max(0, rev.helpful - 1) : rev.helpful + 1
        };
      }
      return rev;
    }));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: true })
      });
    } catch (e) {
      console.warn("Failed to update helpful count:", e);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !product._id) return;

    try {
      const payload = {
        productId: product._id,
        author: reviewerName.trim() || "Anonymous",
        rating: userRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        location: "IN",
        images: reviewImages
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setReviewsData({
          average: data.average,
          total: data.total,
          breakdown: data.breakdown
        });
        setReviewsList(data.reviews);
        setReviewSuccessMsg("Thank you! Your review has been saved to the database.");
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccessMsg("");
          setReviewerName("");
          setReviewTitle("");
          setReviewComment("");
          setReviewImages([]);
        }, 1200);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to post review");
      }
    } catch (err) {
      console.error("Failed to save review:", err);
      alert("Network error: Could not connect to backend server to save review.");
    }
  };

  const renderStars = (rating: number, size = 20) => {
    const stars = [];
    const activeStarColor = "#000000";
    for (let i = 1; i <= 5; i++) {
      const fillPercent = Math.min(Math.max((rating - (i - 1)) * 100, 0), 100);
      const gradId = `starGrad-${i}-${Math.round(fillPercent)}-${Math.random().toString(36).substring(2, 6)}`;

      if (fillPercent >= 100) {
        stars.push(
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={activeStarColor}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      } else if (fillPercent <= 0) {
        stars.push(
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#d1d5db">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} width={size} height={size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={gradId}>
                <stop offset={`${fillPercent}%`} stopColor={activeStarColor} />
                <stop offset={`${fillPercent}%`} stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path fill={`url(#${gradId})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      }
    }
    return stars;
  };

  const initiateCheckout = () => {
    setShowCartDrawer(false);
    setCheckoutItems(cartItems);
    setShowCheckoutDrawer(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const variantPrice = ((product as any).options && (product as any).options.find((o: any) => o.size === selectedVolume)?.price) 
                      || ((product as any).variants && (product as any).variants.find((v: any) => v.size === selectedVolume)?.price)
                      || product.price;
        // @ts-ignore
        const variantStrikePrice = ((product as any).options && (product as any).options.find((o: any) => o.size === selectedVolume)?.strikePrice) 
                          || ((product as any).variants && (product as any).variants.find((v: any) => v.size === selectedVolume)?.strikePrice)
                          || (product as any).strikePrice;

    const buyNowItem = {
      _id: product._id,
      name: product.name,
      price: variantPrice,
      strikePrice: variantStrikePrice,
      size: selectedVolume,
      quantity: quantity,
      imageFront: product.imageFront
    };
    setCheckoutItems([buyNowItem]);
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

  const addToCart = (product: any, size: string = "50ml", qtyToAdd: number = 1) => {
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
        const maxS = itemsList[existingIdx].maxStock ?? ((product.variants && product.variants.find((v: any) => v.size === size)?.quantity) ?? product.quantity);
        if (itemsList[existingIdx].quantity + qtyToAdd > maxS) {
          showCartError(`Only ${maxS} units of ${product.name} (${size}) are available in stock.`);
          itemsList[existingIdx].quantity = maxS;
          setShowCartDrawer(true);
        } else {
          itemsList[existingIdx].quantity += qtyToAdd;
        }
      } else {
        const variantPrice = (product.options && product.options.find((o: any) => o.size === size)?.price) 
                          || (product.variants && product.variants.find((v: any) => v.size === size)?.price)
                          || product.price;

        const variantStrikePrice = ((product as any).options && (product as any).options.find((o: any) => o.size === size)?.strikePrice) || ((product as any).variants && (product as any).variants.find((v: any) => v.size === size)?.strikePrice) || (product as any).strikePrice;
        const maxS = (product.variants && product.variants.find((v: any) => v.size === size)?.quantity) ?? product.quantity;
        let qtyToPush = qtyToAdd;
        if (qtyToAdd > maxS) {
          showCartError(`Only ${maxS} units of ${product.name} (${size}) are available in stock.`);
          qtyToPush = maxS;
          setShowCartDrawer(true);
        }

        itemsList.push({
          _id: product._id,
          name: product.name,
          price: variantPrice,
          strikePrice: variantStrikePrice,
          imageFront: product.imageFront,
          size: size,
          quantity: qtyToPush,
          maxStock: maxS
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
      const item = cartItems[index];
      if (item.maxStock !== undefined && newQty > item.maxStock) {
        showCartError(`Only ${item.maxStock} units of ${item.name} (${item.size}) are available in stock.`);
        const updated = [...cartItems];
        updated[index].quantity = item.maxStock;
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
        setShowCartDrawer(true);
        return;
      }
      const updated = [...cartItems];
      updated[index].quantity = newQty;
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {

    // Get primary color and Product Page CMS settings from backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/settings`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.primaryColor) setPrimaryColor(data.primaryColor);
              if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);
          if (data.showProductReviews !== undefined) setShowProductReviews(data.showProductReviews);
          if (data.showProductExploreMore !== undefined) setShowProductExploreMore(data.showProductExploreMore);
          if (data.showProductFaq !== undefined) setShowProductFaq(data.showProductFaq);
          if (data.usageGuideText) setUsageGuideText(data.usageGuideText);
          if (data.exploreMoreTitle) setExploreMoreTitle(data.exploreMoreTitle);
          if (data.deliverySubtext) setDeliverySubtext(data.deliverySubtext);
          if (data.faqs && data.faqs.length > 0) setFaqsList(data.faqs);
        }
      })
      .catch(err => console.warn("Error setting dynamic colors:", err));

    // Load cached products list to avoid slow loading recommended shifts
    try {
      const cachedProducts = localStorage.getItem("storefront_products");
      if (cachedProducts) {
        setAllProducts(JSON.parse(cachedProducts));
      }
    } catch (e) {}

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllProducts(data);
          localStorage.setItem("storefront_products", JSON.stringify(data));
        }
      })
      .catch(err => {
        console.warn("API load failed for recommended products list:", err);
      });

    if (!id) return;

    // Load product details
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/products/${id}`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Product fetch failed");
        return res.json();
      })
      .then((data: Product) => {
        if (data) {
          setProduct(data);
          initializeMedia(data);
          const productSizes = data.sizes && data.sizes.length > 0 ? data.sizes : ["50ml", "100ml", "150ml"];
          setSelectedVolume(productSizes[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("API load failed, trying default list match:", err);
        // Fallback to local default product match
        const found = defaultProducts.find(p => p._id === id);
        if (found) {
          setProduct(found);
          initializeMedia(found);
          const fallbackSizes = found.sizes && found.sizes.length > 0 ? found.sizes : ["50ml", "100ml", "150ml"];
          setSelectedVolume(fallbackSizes[0]);
        }
        setLoading(false);
      });
  }, [id]);

  const initializeMedia = (prod: Product) => {
    const list: string[] = [];
    if (prod.imageFront) list.push(prod.imageFront);
    if (prod.imageBack) list.push(prod.imageBack);
    if (prod.images && prod.images.length > 0) {
      prod.images.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    setAllImages(list);
    if (list.length > 0) {
      setActiveImg(list[0]);
    }
  };

  const handleNextImage = () => {
    if (allImages.length <= 1) return;
    const currentIdx = allImages.indexOf(activeImg);
    const nextIdx = (currentIdx + 1) % allImages.length;
    setActiveImg(allImages[nextIdx]);
  };

  const handlePrevImage = () => {
    if (allImages.length <= 1) return;
    const currentIdx = allImages.indexOf(activeImg);
    const prevIdx = (currentIdx - 1 + allImages.length) % allImages.length;
    setActiveImg(allImages[prevIdx]);
  };

  const handleQuantityIncrease = () => {
    if (!product) return;
    const maxStock = ((product as any).variants && (product as any).variants.find((v: any) => v.size === selectedVolume)?.quantity) ?? (product as any).quantity;
    setQuantity(prev => {
      if (prev + 1 > maxStock) {
        showCartError(`Only ${maxStock} units of ${product.name} (${selectedVolume}) are available in stock.`);
        setShowCartDrawer(true);
        return maxStock;
      }
      return prev + 1;
    });
  };

  const handleQuantityDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return <NewtonsCradleLoader fullScreen={true} />;
  }

  if (!product) {
    return (
      <div className={styles.errorWrapper}>
        <h2>Fragrance Not Found</h2>
        <p>We could not locate this perfume in our inventory catalog.</p>
        <Link href="/" className={styles.backHomeBtn}>
          Back to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className={styles.page}>
      {/* Dynamic Header */}
      <Navbar onCartClick={() => setShowCartDrawer(true)} />


      {/* Main product detail section */}
      <main className={styles.productContainer}>
        <div className={styles.detailGrid}>
          {/* Left Column: Interactive Media Gallery */}
          <div className={styles.mediaGallery}>
            <div className={styles.mainImageWrapper}>
              <img 
                src={activeImg} 
                alt={product.name} 
                className={styles.mainImage}
              />
              
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage} 
                    className={`${styles.navArrow} ${styles.navArrowLeft}`}
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button 
                    onClick={handleNextImage} 
                    className={`${styles.navArrow} ${styles.navArrowRight}`}
                    aria-label="Next image"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Row */}
            {allImages.length > 1 && (
              <div className={styles.thumbnailRow}>
                {allImages.map((url, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImg(url)}
                    className={`${styles.thumbWrapper} ${activeImg === url ? styles.thumbActive : ""}`}
                  >
                    <img 
                      src={url} 
                      alt={`${product.name} angle ${idx + 1}`} 
                      className={styles.thumbImage}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Checkout Options & Metadata details */}
          <div className={styles.productDetails}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            
            {/* Rating Stars Row */}
            <div className={styles.ratingRow}>
              <div className={styles.stars} style={{ display: "flex", gap: "2px" }}>
                {renderStars(reviewsData.average || 5, 18)}
              </div>
              <span className={styles.reviewsCount}>
                {reviewsData.total} {reviewsData.total === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {/* Price display tag */}
            <div className={styles.priceRow}>
              {(() => {
                const currentVariant = (product as any).variants?.find((v: any) => v.size === selectedVolume) || (product as any).options?.find((v: any) => v.size === selectedVolume);
                const currentPrice = currentVariant?.price || product.price;
                const currentStrikePrice = currentVariant?.strikePrice || (product as any).strikePrice;
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {currentStrikePrice && currentStrikePrice > currentPrice && (
                      <span style={{ color: "#ef4444", textDecoration: "line-through", fontSize: "1.1rem", fontWeight: 500 }}>
                        Rs. {currentStrikePrice.toLocaleString("en-IN")}.00
                      </span>
                    )}
                    <span className={styles.priceVal}>
                      Rs. {currentPrice.toLocaleString("en-IN")}.00
                    </span>
                    {currentStrikePrice && currentStrikePrice > currentPrice && (
                      <span style={{ color: "#16a34a", fontSize: "1.1rem", fontWeight: 700 }}>
                        -{Math.round(((currentStrikePrice - currentPrice) / currentStrikePrice) * 100)}%
                      </span>
                    )}
                  </div>
                );
              })()}
              <span className={styles.taxSubtext}>{deliverySubtext.toUpperCase()}</span>
            </div>
            {product.quantity !== undefined && product.quantity <= 5 && (
              <div style={{
                color: "#dc2626",
                fontSize: "0.82rem",
                fontWeight: 700,
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                letterSpacing: "0.03em"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span>{product.quantity === 0 ? "OUT OF STOCK" : `ONLY ${product.quantity} BOTTLES LEFT IN STOCK`}</span>
              </div>
            )}

            {/* Bottle Volume Picker */}
            <div className={styles.pickerSection}>
              <span className={styles.pickerLabel}>Bottle Volume</span>
              <div className={styles.volumeOptionsGrid}>
                {(product.sizes && product.sizes.length > 0 ? product.sizes : ["50ml", "100ml", "150ml"]).map((size) => {
                  const displaySize = size.toLowerCase().endsWith("ml") ? size : `${size}ml`;
                  const variantPrice = 
                    (product as any).variants?.find((v: any) => v.size === size)?.price || 
                    (product as any).options?.find((v: any) => v.size === size)?.price || 
                    product.price;
                    
                  return (
                    <button 
                      key={size}
                      onClick={() => setSelectedVolume(size)}
                      className={`${styles.volumeOptionBtn} ${selectedVolume === size ? styles.volumeActive : ""}`}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px", gap: "4px" }}
                    >
                      <span style={{ fontWeight: 600 }}>{displaySize}</span>
                      <span style={{ fontSize: "0.75rem", opacity: selectedVolume === size ? 0.9 : 0.65 }}>
                        ₹{variantPrice.toLocaleString("en-IN")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Warning / Fit details note */}
            <p className={styles.sizeHelperNote}>
              {usageGuideText}
            </p>

            {/* Buy and Add count selectors */}
            <div className={styles.checkoutActionsRow}>
              <div className={styles.quantityCounter}>
                <button onClick={handleQuantityDecrease} className={styles.qtyBtn} disabled={product.quantity === 0}>−</button>
                <span className={styles.qtyVal}>{product.quantity === 0 ? 0 : quantity}</span>
                <button onClick={handleQuantityIncrease} className={styles.qtyBtn} disabled={product.quantity === 0}>+</button>
              </div>

              <button 
                onClick={() => addToCart(product, selectedVolume, quantity)} 
                className={styles.addToCartBtn}
                disabled={product.quantity === 0}
                style={{
                  opacity: product.quantity === 0 ? 0.5 : 1,
                  cursor: product.quantity === 0 ? "not-allowed" : "pointer"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "16px", height: "16px", marginRight: "8px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {product.quantity === 0 ? "Out of stock" : "Add to cart"}
              </button>
            </div>

            <button 
              onClick={handleBuyNow} 
              className={styles.buyNowBtn}
              disabled={product.quantity === 0}
              style={{
                opacity: product.quantity === 0 ? 0.5 : 1,
                cursor: product.quantity === 0 ? "not-allowed" : "pointer"
              }}
            >
              {product.quantity === 0 ? "OUT OF STOCK" : "Buy It Now"}
            </button>

            <span className={styles.freeShippingBanner}>
              FREE SHIPPING ACROSS INDIA
            </span>


            {/* Long description text */}
            <div className={styles.descriptionSection}>
              <p>{product.description || "No detailed description cataloged for this perfume yet. Handcrafted by PhD students using premium raw materials for exceptional longevity."}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Dynamic Reviews Section */}
      {showProductReviews && reviewsData && (
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
            {/* Header Title & Write Review Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", margin: "0 0 10px 0" }}>
              <h2 style={{
                fontSize: "2.2rem",
                fontWeight: 600,
                fontFamily: "Outfit, Inter, sans-serif",
                color: "#111827",
                margin: 0
              }}>
                Rating & Reviews
              </h2>
              <button 
                style={{
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#374151"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111827"}
                onClick={() => setShowReviewModal(true)}
              >
                Write a review
              </button>
            </div>

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
                      {reviewsData.average}
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
                    ({reviewsData.total} Reviews)
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
                  {reviewsData.breakdown.map((item: any) => (
                    <div key={item.stars} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#d97706", fontSize: "1.1rem" }}>★</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827", width: "12px" }}>{item.stars}</span>
                      <div style={{ flexGrow: 1, height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", position: "relative" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${item.percentage}%`, backgroundColor: "#111827", borderRadius: "4px" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Review Card */}
              {displayReviews.length > 0 ? (
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
                  opacity: reviewFade ? 1 : 0,
                  transform: reviewFade ? "translateY(0)" : "translateY(5px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  position: "relative"
                }}>
                  <div>
                    {/* Reviewer Name */}
                    <h3 style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#111827",
                      margin: "0 0 8px 0",
                      fontFamily: "Outfit, Inter, sans-serif"
                    }}>
                      {displayReviews[currentReviewIndex]?.author || displayReviews[currentReviewIndex]?.name}
                    </h3>

                    {/* Stars and Date Row */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px"
                    }}>
                      {/* Gold Stars */}
                      <div style={{
                        color: "#111827",
                        fontSize: "0.95rem",
                        letterSpacing: "0.15em"
                      }}>
                        {"★".repeat(displayReviews[currentReviewIndex]?.rating || 5)}
                      </div>
                      {/* Date */}
                      <span style={{
                        fontSize: "0.82rem",
                        color: "#9ca3af",
                        fontWeight: 500,
                        fontFamily: "Inter, sans-serif"
                      }}>
                        {displayReviews[currentReviewIndex]?.createdAt 
                          ? new Date(displayReviews[currentReviewIndex].createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) 
                          : (displayReviews[currentReviewIndex]?.date || "13 Oct 2024")}
                      </span>
                    </div>

                    {/* Review text */}
                    <p style={{
                      fontSize: "0.95rem",
                      color: "#4b5563",
                      lineHeight: "1.6",
                      margin: 0,
                      fontFamily: "Inter, sans-serif",
                      fontStyle: "normal"
                    }}>
                      &ldquo;{displayReviews[currentReviewIndex]?.comment || displayReviews[currentReviewIndex]?.text}&rdquo;
                    </p>

                    {/* Review Images */}
                    {displayReviews[currentReviewIndex]?.images && displayReviews[currentReviewIndex].images.length > 0 && (
                      <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                        {displayReviews[currentReviewIndex].images.map((imgUrl: string, idx: number) => (
                          <img 
                            key={idx} 
                            src={imgUrl} 
                            alt={`Review photo ${idx + 1}`} 
                            style={{ 
                              width: "70px", 
                              height: "70px", 
                              objectFit: "cover", 
                              borderRadius: "6px", 
                              cursor: "pointer", 
                              border: "1px solid #e5e7eb" 
                            }}
                            onClick={() => setLightboxImg(imgUrl)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Capsule Tracker at the bottom of the card */}
                  <div style={{
                    width: "120px",
                    height: "4px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "2px",
                    margin: "24px auto 0 auto",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${100 / displayReviews.length}%`,
                      backgroundColor: "#111827",
                      borderRadius: "2px",
                      transform: `translateX(${currentReviewIndex * 100}%)`,
                      transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    }} />
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "32px",
                  boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.03)",
                  minHeight: "220px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "40px", height: "40px", color: "#9ca3af", marginBottom: "16px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-1.074-.83l1.246-3.535C4.163 15.3 3.75 13.7 3.75 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                  <p style={{ fontSize: "0.95rem", color: "#4b5563", margin: "0 0 4px 0", fontWeight: 600, fontFamily: "Outfit, sans-serif" }}>
                    No reviews yet
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#9ca3af", margin: 0, fontFamily: "Inter, sans-serif" }}>
                    Be the first to share your experience with this fragrance!
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Explore More Section */}
      {showProductExploreMore && (
        <section className={styles.exploreMoreSection}>
          <h2 className={styles.exploreMoreTitle}>{exploreMoreTitle}</h2>
        
        <div className={styles.exploreMoreGrid}>
          {allProducts.filter(p => p._id !== id).slice(0, 5).map((item) => {
            const hasSale = item.name.toLowerCase().includes("chausar");
            const displayComparePrice = 10004;

            return (
              <div key={item._id} className={styles.exploreCard}>
                <Link href={`/product/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className={styles.exploreImageWrapper}>
                    <img 
                      src={item.imageFront} 
                      alt={item.name} 
                      className={styles.exploreImage}
                    />
                    {hasSale && (
                      <span className={styles.saleBadge}>Sale</span>
                    )}
                  </div>
                  
                  <div className={styles.exploreProductInfo}>
                    <h3 className={styles.exploreProductTitle}>{item.name.toUpperCase()}</h3>
                    <p className={styles.exploreProductPrice}>
                      Rs. {item.price.toLocaleString("en-IN")}.00
                      {hasSale && (
                        <span className={styles.exploreComparePrice}>
                          Rs. {displayComparePrice.toLocaleString("en-IN")}.00
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
                
                <button 
                  onClick={() => addToCart(item, item.sizes?.[0] || "50ml", 1)}
                  className={styles.exploreAddToCartBtn}
                >
                  Add to cart
                </button>
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* FREQUENTLY ASKED QUESTIONS Section */}
      {showProductFaq && (
        <section className={styles.faqSection}>
        <div className={styles.faqContainer}>
          <h2 className={styles.faqSectionTitle}>FREQUENTLY ASKED QUESTIONS</h2>
          <p className={styles.faqSectionSubtitle}>Everything you need to know about our handcrafted luxury perfume formulations.</p>
          
          <div className={styles.faqAccordionList}>
            {faqsList.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div key={index} className={`${styles.faqAccordionItem} ${isOpen ? styles.faqAccordionItemOpen : ""}`}>
                  <button 
                    className={styles.faqQuestionBtn} 
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.faqQuestionText}>{faq.question}</span>
                    <span 
                      className={styles.faqToggleIcon}
                      style={{ color: isOpen ? (primaryColor || "#57bc74") : "#111827" }}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className={styles.faqAnswerBody}>
                      <p className={styles.faqAnswerText}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

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
            {cartError && (
              <div style={{ backgroundColor: '#fef2f2', borderLeft: '3px solid #ef4444', color: '#dc2626', padding: '12px', fontSize: '0.85rem', borderRadius: '4px', margin: '15px 20px 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{cartError}</span>
              </div>
            )}

            {cartItems.length > 0 ? (
              <div className={styles.cartDrawerBody}>
                <div className={styles.cartItemsList}>
                  {cartItems.map((item, index) => (
                    <div key={`${item._id}-${item.size}`} className={styles.cartItemRow}>
                      <img src={item.imageFront} alt={item.name} className={styles.cartItemImg} />
                      <div className={styles.cartItemInfo}>
                        <div className={styles.cartItemHeaderRow}>
                          <h4 className={styles.cartItemName}>{item.name.toUpperCase()}</h4>
                          <div className={styles.cartItemTotalPrice} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {item.strikePrice && item.strikePrice > item.price && (
                              <del style={{ color: "#ef4444", fontSize: "0.85em" }}>
                                Rs. {(item.strikePrice * item.quantity).toLocaleString("en-IN")}.00
                              </del>
                            )}
                            <span>Rs. {(item.price * item.quantity).toLocaleString("en-IN")}.00</span>
                          </div>
                        </div>
                        <p className={styles.cartItemSize}>{item.size}</p>
                        <div className={styles.cartItemUnitPrice} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                          {item.strikePrice && item.strikePrice > item.price && (
                            <del style={{ color: "#ef4444", fontSize: "0.85em" }}>
                              Rs. {item.strikePrice.toLocaleString("en-IN")}.00
                            </del>
                          )}
                          <span>Rs. {item.price.toLocaleString("en-IN")}.00</span>
                          {item.strikePrice && item.strikePrice > item.price && (
                            <span style={{ color: "#16a34a", fontSize: "0.85em", fontWeight: 700 }}>
                              -{Math.round(((item.strikePrice - item.price) / item.strikePrice) * 100)}%
                            </span>
                          )}
                        </div>
                        
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
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className={styles.discountInput} 
                        onClick={(e) => e.stopPropagation()} 
                      />
                      <button 
                        className={styles.discountApplyBtn}
                        onClick={handleApplyCoupon}
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && (
                      <p style={{ fontSize: "0.78rem", color: appliedDiscount ? "#16a34a" : "#dc2626", marginTop: "5px", paddingLeft: "5px", fontWeight: 600 }}>
                        {couponMessage}
                      </p>
                    )}
                  </div>
                  
                  <div className={styles.totalContainer}>
                    <span className={styles.totalTitle}>Estimated total</span>
                    <span className={styles.totalVal}>
                      {appliedDiscount && (
                        <span style={{ textDecoration: "line-through", color: "#6b7280", marginRight: "8px", fontSize: "0.85rem", fontWeight: 400 }}>
                          Rs. {cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString("en-IN")}.00
                        </span>
                      )}
                      Rs. {Math.max(0, cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) - (appliedDiscount ? (appliedDiscount.type === "percentage" ? (cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) * appliedDiscount.value) / 100 : appliedDiscount.value) : 0)).toLocaleString("en-IN")}.00
                    </span>
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
        cartItems={checkoutItems}
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

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Write a Review for {product?.name}</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowReviewModal(false)}>✕</button>
            </div>

            {reviewSuccessMsg ? (
              <div className={styles.successAlert}>{reviewSuccessMsg}</div>
            ) : (
              <form onSubmit={handleSubmitReview} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rating</label>
                  <div className={styles.starSelector}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        onClick={() => setUserRating(star)}
                        style={{ cursor: "pointer", fontSize: "1.85rem", color: star <= userRating ? "#000000" : "#d1d5db" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    value={reviewerName} 
                    onChange={(e) => setReviewerName(e.target.value)} 
                    className={styles.formInput} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Review Headline</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Give your review a title (e.g. Exceptional longevity!)" 
                    value={reviewTitle} 
                    onChange={(e) => setReviewTitle(e.target.value)} 
                    className={styles.formInput} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Review Comments</label>
                  <textarea 
                    rows={4} 
                    required 
                    placeholder="Describe what you liked about this fragrance formulation..." 
                    value={reviewComment} 
                    onChange={(e) => setReviewComment(e.target.value)} 
                    className={styles.formTextarea} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Attach Photos (Optional)</label>
                  <div className={styles.imageUploadWrapper}>
                    <label className={styles.uploadBoxLabel}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleReviewImageUpload}
                        style={{ display: "none" }}
                        disabled={uploadingImage}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: "22px", height: "22px", color: primaryColor || "#57bc74" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                      <span style={{ fontSize: "0.82rem", color: "#4b5563", fontWeight: 500 }}>
                        {uploadingImage ? "Uploading photos..." : "Click to upload product photos"}
                      </span>
                    </label>
                  </div>

                  {reviewImages.length > 0 && (
                    <div className={styles.imagePreviewGrid}>
                      {reviewImages.map((imgUrl, idx) => (
                        <div key={idx} className={styles.imagePreviewThumb}>
                          <img src={imgUrl} alt={`Attached review photo ${idx + 1}`} />
                          <button 
                            type="button" 
                            className={styles.removeImgBtn} 
                            onClick={() => handleRemoveReviewImage(idx)}
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className={styles.submitReviewBtn}
                  style={{ backgroundColor: primaryColor || "#57bc74" }}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "Uploading..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox Overlay */}
      {lightboxImg && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
          <button className={styles.lightboxCloseBtn} onClick={() => setLightboxImg(null)}>✕</button>
          <img src={lightboxImg} alt="Enlarged review photo" className={styles.lightboxImg} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
