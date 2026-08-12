'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface FaqItem {
  question: string;
  answer: string;
}

interface DashboardStats {
  totalSales: number;
  totalIncome: number;
  activeOrders: number;
  totalProducts: number;
  latestArrivalsCount: number;
  bestSellersCount: number;
  totalCustomers: number;
  topProducts: Product[];
  historicalData?: {
    date: string;
    sales: number;
    orders: number;
    profit?: number;
  }[];
  totalProfitThisMonth?: number;
}

interface Product {
  _id?: string;
  name: string;
  price: number;
  makingPrice?: number;
  quantity?: number;
  description: string;
  category: string | string[];
  imageFront: string;
  imageBack?: string;
  images?: string[];
  sizes?: string[];
  sizeQuantities?: Record<string, number>;
  options?: { size: string; quantity: number; price: number; makingPrice?: number; category: string[] }[];
  variants?: { size: string; quantity: number; price: number; makingPrice?: number; category: string[] }[];
}

const fontCategories = [
  {
    category: "Apple & System OS Fonts",
    fonts: [
      { name: "SF Pro", label: "SF Pro (Apple System Sans)" },
      { name: "New York", label: "New York (Apple System Serif)" },
      { name: "SF Mono", label: "SF Mono (Apple System Monospace)" },
      { name: "Segoe UI", label: "Segoe UI (Windows System Sans)" },
      { name: "Helvetica Neue", label: "Helvetica Neue (Classic Apple Sans)" },
      { name: "Georgia", label: "Georgia (Classic Web Serif)" },
      { name: "Garamond", label: "Garamond (Elegant Web Serif)" }
    ]
  },
  {
    category: "Elegant Serifs (Classical & Editorial)",
    fonts: [
      { name: "Cinzel", label: "Cinzel (Classical Roman)" },
      { name: "Playfair Display", label: "Playfair Display (Elegant Editorial)" },
      { name: "Cormorant Garamond", label: "Cormorant Garamond (High-End Luxury)" },
      { name: "Fraunces", label: "Fraunces (Vintage Expressive)" },
      { name: "Bodoni Moda", label: "Bodoni Moda (High-Fashion Contrast)" },
      { name: "Lora", label: "Lora (Contemporary Serif)" },
      { name: "Merriweather", label: "Merriweather (Warm Serif)" },
      { name: "EB Garamond", label: "EB Garamond (Historical Serif)" },
      { name: "Libre Baskerville", label: "Libre Baskerville (Traditional Serif)" },
      { name: "Prata", label: "Prata (Elegant High-Contrast Serif)" },
      { name: "Newsreader", label: "Newsreader (Editorial Serif)" },
      { name: "Cardo", label: "Cardo (Classic Academic Serif)" },
      { name: "Noto Serif", label: "Noto Serif (Universal Serif)" },
      { name: "PT Serif", label: "PT Serif (Modern Work Serif)" },
      { name: "Domine", label: "Domine (Highly Legible Book Serif)" }
    ]
  },
  {
    category: "Sleek Sans-Serifs (Modern & Clean)",
    fonts: [
      { name: "Outfit", label: "Outfit (Default Modern)" },
      { name: "Inter", label: "Inter (Clean UI Sans)" },
      { name: "Roboto", label: "Roboto (Structured Neo-Grotesque)" },
      { name: "Montserrat", label: "Montserrat (Geometric Sans)" },
      { name: "DM Sans", label: "DM Sans (Minimalist Geometric)" },
      { name: "Plus Jakarta Sans", label: "Plus Jakarta Sans (Sleek Clean)" },
      { name: "Poppins", label: "Poppins (Friendly Geometric)" },
      { name: "Open Sans", label: "Open Sans (Neutral Sans)" },
      { name: "Lato", label: "Lato (Warm Sans)" },
      { name: "Raleway", label: "Raleway (Elegant Sans)" },
      { name: "Nunito", label: "Nunito (Soft Rounded Sans)" },
      { name: "Rubik", label: "Rubik (Low-Contrast Sans)" },
      { name: "Heebo", label: "Heebo (Compact Modern Sans)" },
      { name: "Work Sans", label: "Work Sans (Neo-Grotesque Display)" },
      { name: "Manrope", label: "Manrope (Clean Tech Sans)" },
      { name: "Sora", label: "Sora (Tech Display Sans)" },
      { name: "Urbanist", label: "Urbanist (Fashion Sans)" }
    ]
  },
  {
    category: "Modern Display & Bold (Expressive & Experimental)",
    fonts: [
      { name: "Syne", label: "Syne (Futuristic Art-Direction)" },
      { name: "Unbounded", label: "Unbounded (Ultra-Bold Geometric)" },
      { name: "Oswald", label: "Oswald (Condensed Impact)" },
      { name: "Bebas Neue", label: "Bebas Neue (Bold Headline Condensed)" },
      { name: "Archivo Black", label: "Archivo Black (Heavy Metal Sans)" },
      { name: "Syncopate", label: "Syncopate (Wide Futuristic Sans)" },
      { name: "Righteous", label: "Righteous (Art Deco Display)" },
      { name: "Ultra", label: "Ultra (Chunky Slab Serif)" },
      { name: "Anton", label: "Anton (Heavy Condensed Impact)" },
      { name: "Abril Fatface", label: "Abril Fatface (High-Contrast Bold Poster)" },
      { name: "Bungee", label: "Bungee (Urban Signage Display)" },
      { name: "Fredoka", label: "Fredoka (Cheerful Friendly Sans)" },
      { name: "Space Grotesk", label: "Space Grotesk (Tech Brutalist Sans)" },
      { name: "Cinzel Decorative", label: "Cinzel Decorative (Ornate Luxury Serif)" }
    ]
  },
  {
    category: "Monospace & Technical (Brutalist Coding)",
    fonts: [
      { name: "Space Mono", label: "Space Mono (Brutalist Technical)" },
      { name: "Fira Code", label: "Fira Code (Developer Coding Sans)" },
      { name: "Source Code Pro", label: "Source Code Pro (Classic Code Mono)" },
      { name: "JetBrains Mono", label: "JetBrains Mono (Sleek Technical Mono)" },
      { name: "Roboto Mono", label: "Roboto Mono (Clean Grotesque Mono)" },
      { name: "Share Tech Mono", label: "Share Tech Mono (Retro Cyber Tech)" }
    ]
  },
  {
    category: "Handwritten & Artistic (Elegant Scripts)",
    fonts: [
      { name: "Great Vibes", label: "Great Vibes (Classical Script)" },
      { name: "Alex Brush", label: "Alex Brush (Flowing Script)" },
      { name: "Sacramento", label: "Sacramento (Slim Editorial Script)" },
      { name: "Caveat", label: "Caveat (Organic Hand-Written)" },
      { name: "Dancing Script", label: "Dancing Script (Playful Script)" },
      { name: "Pacifico", label: "Pacifico (Retro Fun Script)" },
      { name: "Playball", label: "Playball (Sporty Calligraphy)" }
    ]
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

const generateChartPath = (
  data: { date: string; sales: number; orders: number; profit?: number }[],
  key: "sales" | "orders" | "profit",
  maxX: number,
  minX: number,
  maxY: number,
  minY: number
) => {
  if (!data || data.length === 0) return `M ${minX} ${minY} L ${maxX} ${minY}`;
  const maxValue = Math.max(...data.map(d => d[key] || 0), 1);
  const width = maxX - minX;
  const height = minY - maxY;
  const step = width / Math.max(data.length - 1, 1);

  let path = "";
  data.forEach((d, i) => {
    const x = minX + i * step;
    const y = minY - ((d[key] || 0) / maxValue) * height;
    if (i === 0) path += `M ${x} ${y} `;
    else path += `L ${x} ${y} `;
  });
  return path;
};

const generateSparklinePath = (
  data: { date: string; sales: number; orders: number }[],
  key: "sales" | "orders",
  maxX: number,
  minX: number,
  maxY: number,
  minY: number,
  fill: boolean
) => {
  if (!data || data.length === 0) return "";
  const sliceData = data.slice(-7);
  const maxValue = Math.max(...sliceData.map(d => d[key]), 1);
  const width = maxX - minX;
  const height = minY - maxY;
  const step = width / Math.max(sliceData.length - 1, 1);

  let path = "";
  sliceData.forEach((d, i) => {
    const x = minX + i * step;
    const y = minY - (d[key] / maxValue) * height;
    if (i === 0) path += `M ${x} ${y} `;
    else path += `L ${x} ${y} `;
  });

  if (fill) {
    path += `L ${maxX} ${minY} L ${minX} ${minY} Z`;
  }
  return path;
};

export default function AdminDashboard() {
  const fetchedTabs = useRef(new Set<string>());
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Authorization state
  const [authorized, setAuthorized] = useState<boolean>(false);

  // Layout State
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "products" | "customers" | "marketing" | "discounts" | "online-store">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState<boolean>(false);
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState<boolean>(false);
  const [onlineStoreDropdownOpen, setOnlineStoreDropdownOpen] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"all" | "categories" | "cancelled" | "completed">("all");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [deletedDefaultCategories, setDeletedDefaultCategories] = useState<string[]>([]);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<string | null>(null);
  const [deleteCategoryLoading, setDeleteCategoryLoading] = useState<boolean>(false);
  const [renameCategoryTarget, setRenameCategoryTarget] = useState<string | null>(null);
  const [renameCategoryNewName, setRenameCategoryNewName] = useState<string>("");
  const [isRenamingCategory, setIsRenamingCategory] = useState<boolean>(false);
  const [selectedCategoryView, setSelectedCategoryView] = useState<string | null>(null);
  const [showCategoryAddOptionsModal, setShowCategoryAddOptionsModal] = useState<boolean>(false);
  const [showAddExistingToCategoryModal, setShowAddExistingToCategoryModal] = useState<boolean>(false);
  const [existingProductIdsToAssign, setExistingProductIdsToAssign] = useState<string[]>([]);
  const [assignLoading, setAssignLoading] = useState<boolean>(false);
  const [activeCategoryPopoverProductId, setActiveCategoryPopoverProductId] = useState<string | null>(null);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const toggleExpand = (productId: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Load custom categories and deleted default categories from local storage
  useEffect(() => {
    const savedCustom = localStorage.getItem("admin_custom_categories");
    if (savedCustom) {
      try {
        setCustomCategories(JSON.parse(savedCustom));
      } catch (e) {
        console.error(e);
      }
    }
    const savedDeletedDefaults = localStorage.getItem("admin_deleted_default_categories");
    if (savedDeletedDefaults) {
      try {
        setDeletedDefaultCategories(JSON.parse(savedDeletedDefaults));
      } catch (e) {
        console.error(e);
      }
    }

    // Temporary one-time wipe of old categories logic
    if (!localStorage.getItem("admin_cleared_old_categories_v2")) {
      localStorage.removeItem("admin_custom_categories");
      localStorage.removeItem("admin_deleted_default_categories");
      localStorage.setItem("admin_cleared_old_categories_v2", "true");
      setCustomCategories([]);
      setDeletedDefaultCategories([]);
    }
  }, []);

  // Popover click outside handler
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveCategoryPopoverProductId(null);
      setCategoriesDropdownOpen(false);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // Discount Coupons State
  const [discountsList, setDiscountsList] = useState<any[]>([]);
  const [newDiscountCode, setNewDiscountCode] = useState<string>("");
  const [newDiscountType, setNewDiscountType] = useState<string>("percentage");
  const [newDiscountValue, setNewDiscountValue] = useState<string>("");
  const [newDiscountMinOrder, setNewDiscountMinOrder] = useState<string>("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [deleteDiscountConfirmId, setDeleteDiscountConfirmId] = useState<string | null>(null);

  // Orders Management State
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");
  const [refundStatusFilter, setRefundStatusFilter] = useState<string>("All");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState<boolean>(false);
  const [isRefundFilterOpen, setIsRefundFilterOpen] = useState<boolean>(false);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);
  const [deleteOrderTargetId, setDeleteOrderTargetId] = useState<string | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
  const [deleteCustomerTargetId, setDeleteCustomerTargetId] = useState<string | null>(null);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState<boolean>(false);

  // CRUD Form State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [makingPrice, setMakingPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [imageFront, setImageFront] = useState<string>("");
  const [imageBack, setImageBack] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(["50ml", "100ml", "150ml"]);
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({});
  const [options, setOptions] = useState<{ size: string; quantity: number | ""; price: number | ""; makingPrice: number | ""; category: string[] }[]>([{ size: "", quantity: "", price: "", makingPrice: "", category: [] }]);
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [newSizeInput, setNewSizeInput] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadingVideo, setUploadingVideo] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);

  // Storefront CMS Configuration State
  const [tickerText, setTickerText] = useState<string>("");
  const [tickerSpeed, setTickerSpeed] = useState<number>(60);
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [heroTitleFontType, setHeroTitleFontType] = useState<string>("Outfit");
  const [heroTitleFontColor, setHeroTitleFontColor] = useState<string>("#111827");
  const [heroTitleFontSize, setHeroTitleFontSize] = useState<string>("4.5rem");
  const [heroTitleFontAlignment, setHeroTitleFontAlignment] = useState<string>("center");
  const [heroTitleFontWeight, setHeroTitleFontWeight] = useState<string>("700");

  const [heroTemplate, setHeroTemplate] = useState<string>("center");
  const [showHeroTitle, setShowHeroTitle] = useState<boolean>(true);
  const [showHeroManifesto, setShowHeroManifesto] = useState<boolean>(true);
  const [showHeroButton, setShowHeroButton] = useState<boolean>(true);
  const [heroButtonText, setHeroButtonText] = useState<string>("Shop Now");
  const [heroButtonStyle, setHeroButtonStyle] = useState<string>("solid");
  const [heroButtonSize, setHeroButtonSize] = useState<string>("md");
  const [heroButtonColor, setHeroButtonColor] = useState<string>("");
  const [heroButtonTextColor, setHeroButtonTextColor] = useState<string>("#ffffff");
  const [heroManifesto, setHeroManifesto] = useState<string>("");
  const [heroManifestoFontType, setHeroManifestoFontType] = useState<string>("Outfit");
  const [heroManifestoFontColor, setHeroManifestoFontColor] = useState<string>("#ffffff");
  const [heroManifestoFontSize, setHeroManifestoFontSize] = useState<string>("0.72rem");
  const [heroManifestoFontAlignment, setHeroManifestoFontAlignment] = useState<string>("left");
  const [heroManifestoFontWeight, setHeroManifestoFontWeight] = useState<string>("500");

  const [selectedElement, setSelectedElement] = useState<"title" | "manifesto" | "button" | null>("title");
  const [heroBackup, setHeroBackup] = useState<any | null>(null);

  const [drafts, setDrafts] = useState<any>({
    title: { fontType: "Outfit", fontSize: "4.5rem", fontColor: "#111827", fontAlignment: "center", fontWeight: "700", fontVerticalAlignment: "bottom", positionX: 0, positionY: 0, maxWidth: 100, minHeight: 0 },
    manifesto: { fontType: "Outfit", fontSize: "0.72rem", fontColor: "#ffffff", fontAlignment: "left", fontWeight: "500", fontVerticalAlignment: "top", positionX: 0, positionY: 0, maxWidth: 100, minHeight: 0 },
    button: { fontType: "Outfit", fontSize: "0.85rem", fontColor: "#ffffff", fontAlignment: "center", fontWeight: "700", fontVerticalAlignment: "middle", positionX: 0, positionY: 0, maxWidth: 100, minHeight: 0 }
  });

  const updateDraft = (key: string, value: any) => {
    if (!selectedElement) return;
    setDrafts((prev: any) => ({ ...prev, [selectedElement]: { ...prev[selectedElement], [key]: value } }));

    // Sync sidebar state
    if (selectedElement === "title") {
          } else if (selectedElement === "manifesto") {
          }
  };

  const [isDraggingTitle, setIsDraggingTitle] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStartCoords, setResizeStartCoords] = useState({ x: 0, y: 0, startWidth: 100, startHeight: 0, startX: 0, startY: 0 });
  const [dragStartCoords, setDragStartCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showHeroTitleFontOptions, setShowHeroTitleFontOptions] = useState<boolean>(false);
  const [hoveredFontType, setHoveredFontType] = useState<string | null>(null);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState<boolean>(false);
  const [hoveredFontSize, setHoveredFontSize] = useState<string | null>(null);
  const [isFontSizeDropdownOpen, setIsFontSizeDropdownOpen] = useState<boolean>(false);
  const [hoveredFontWeight, setHoveredFontWeight] = useState<string | null>(null);
  const [isFontWeightDropdownOpen, setIsFontWeightDropdownOpen] = useState<boolean>(false);

  // Dynamically load Google Font for Realtime Preview
  useEffect(() => {
    const fontToLoad = hoveredFontType || (selectedElement && drafts[selectedElement] ? drafts[selectedElement].fontType : null);
    if (!fontToLoad) return;
    const systemFonts = ["SF Pro", "New York", "SF Mono", "Segoe UI", "Helvetica Neue", "Georgia", "Garamond"];
    if (systemFonts.includes(fontToLoad)) return;
    const fontId = "dynamic-font-admin-" + fontToLoad.replace(/\s+/g, "-").toLowerCase();
    if (document.getElementById(fontId)) return;

    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontToLoad.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }, [drafts, selectedElement, hoveredFontType]);

  // Drag and drop event handlers for Title Typography Preview positioning
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingTitle) {
        updateDraft('positionX', e.clientX - dragStartCoords.x);
        updateDraft('positionY', e.clientY - dragStartCoords.y);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartCoords.x;
        const deltaY = e.clientY - resizeStartCoords.y;

        let newWidth = resizeStartCoords.startWidth;
        let newPosX = resizeStartCoords.startX;
        let newPosY = resizeStartCoords.startY;
        let newHeight = resizeStartCoords.startHeight;

        const containerElem = document.getElementById("hero-preview-container");
        const containerWidth = containerElem ? containerElem.getBoundingClientRect().width : 1150;

        if (isResizing.includes("e")) {
          newWidth = resizeStartCoords.startWidth + (deltaX / containerWidth * 100);
          if (newWidth > 400) newWidth = 400; // Allow massive expansion
          if (newWidth < 5) newWidth = 5;

          const actualDeltaX = (newWidth - resizeStartCoords.startWidth) / 100 * containerWidth;
          newPosX = resizeStartCoords.startX + (actualDeltaX / 2);
        } else if (isResizing.includes("w")) {
          newWidth = resizeStartCoords.startWidth - (deltaX / containerWidth * 100);
          if (newWidth > 400) newWidth = 400; // Allow massive expansion
          if (newWidth < 5) newWidth = 5;

          const actualDeltaX = -(newWidth - resizeStartCoords.startWidth) / 100 * containerWidth;
          newPosX = resizeStartCoords.startX + (actualDeltaX / 2);
        }

        const verticalAlign = selectedElement ? drafts[selectedElement].fontVerticalAlignment : "top";

        if (isResizing.includes("s")) {
          newHeight = resizeStartCoords.startHeight + deltaY;
          if (newHeight < 0) newHeight = 0;
          const actualDeltaY = newHeight - resizeStartCoords.startHeight;
          if (verticalAlign === "middle") newPosY = resizeStartCoords.startY + (actualDeltaY / 2);
          else if (verticalAlign === "bottom") newPosY = resizeStartCoords.startY + actualDeltaY;
        } else if (isResizing.includes("n")) {
          newHeight = resizeStartCoords.startHeight - deltaY;
          if (newHeight < 0) newHeight = 0;
          const actualDeltaY = -(newHeight - resizeStartCoords.startHeight);
          if (verticalAlign === "middle") newPosY = resizeStartCoords.startY + (actualDeltaY / 2);
          else if (verticalAlign === "top") newPosY = resizeStartCoords.startY - actualDeltaY;
        }

        setDrafts((prev: any) => {
          if (!selectedElement) return prev;
          const updates: any = { maxWidth: newWidth, positionX: newPosX };
          if (isResizing.includes("n") || isResizing.includes("s")) {
            updates.minHeight = newHeight;
            updates.positionY = newPosY;
          }
          return {
            ...prev,
            [selectedElement]: {
              ...prev[selectedElement],
              ...updates
            }
          };
        });

        // Sync sidebar state for smooth visual feedback
        if (selectedElement === "title") {
          if (isResizing.includes("n") || isResizing.includes("s")) {
          }
        } else if (selectedElement === "manifesto") {
          if (isResizing.includes("n") || isResizing.includes("s")) {
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTitle(false);
      setIsResizing(null);
    };

    if (isDraggingTitle || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingTitle, dragStartCoords, isResizing, resizeStartCoords, selectedElement]);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoSubtitle, setVideoSubtitle] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [lifestyleText, setLifestyleText] = useState<string>("");
  const [lifestyleImage, setLifestyleImage] = useState<string>("");
  const [uploadingLifestyle, setUploadingLifestyle] = useState<boolean>(false);
  const [primaryColor, setPrimaryColor] = useState<string>("#57bc74");
  const [brandLogoType, setBrandLogoType] = useState<string>("text");
  const [brandLogoValue, setBrandLogoValue] = useState<string>("29sFORMULA");
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);
  const [heroBgType, setHeroBgType] = useState<string>("color");
  const [heroBgColor, setHeroBgColor] = useState<string>("#57bc74");
  const [heroBgImage, setHeroBgImage] = useState<string>("");
  const [heroBgVideo, setHeroBgVideo] = useState<string>("");
  const [showTicker, setShowTicker] = useState<boolean>(true);
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(true);
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [videoFallbackColor, setVideoFallbackColor] = useState<string>("#121212");
  const [showLifestyle, setShowLifestyle] = useState<boolean>(true);
  const [supportText, setSupportText] = useState<string>("For support inquiries, please contact us.");
  const [careersText, setCareersText] = useState<string>("Join our team! Check out our open positions.");
  const [tradeEnquiryText, setTradeEnquiryText] = useState<string>("For trade and wholesale inquiries, contact our B2B team.");
  const [aboutUsText, setAboutUsText] = useState<string>("We are 29sFORMULA, redefining luxury.");
  const [instagramLink, setInstagramLink] = useState<string>("#");
  const [facebookLink, setFacebookLink] = useState<string>("#");
  const [contactLink, setContactLink] = useState<string>("#");
  const [contactUsText, setContactUsText] = useState<string>("Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.");
  const [returnPolicyText, setReturnPolicyText] = useState<string>("We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund.");
  const [shippingPolicyText, setShippingPolicyText] = useState<string>("We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.");
  const [googleClientId, setGoogleClientId] = useState<string>("753896502014-yourmockclientid.apps.googleusercontent.com");

  // Dynamic Product Preview Page CMS Settings
  const [showProductReviews, setShowProductReviews] = useState<boolean>(true);
  const [showProductExploreMore, setShowProductExploreMore] = useState<boolean>(true);
  const [showProductFaq, setShowProductFaq] = useState<boolean>(true);
  const [usageGuideText, setUsageGuideText] = useState<string>("Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes.");
  const [exploreMoreTitle, setExploreMoreTitle] = useState<string>("Don't Stop. Explore More.");
  const [deliverySubtext, setDeliverySubtext] = useState<string>("TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.");

  // Admin Reviews Moderation State
  const [adminReviews, setAdminReviews] = useState<any[]>([]);
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>("");
  const [deleteReviewTarget, setDeleteReviewTarget] = useState<string | null>(null);
  const [isDeletingReview, setIsDeletingReview] = useState<boolean>(false);
  const [editReviewTarget, setEditReviewTarget] = useState<any>(null);
  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);

  // Customize Page Sub-Tab Switcher State ("landing" vs "product" vs "reviews")
  const [customizeSubTab, setCustomizeSubTab] = useState<"landing" | "product" | "reviews">("landing");

  const [loadingSettings, setLoadingSettings] = useState<boolean>(false);
  const [activeCustomizerSection, setActiveCustomizerSection] = useState<string | null>(null);

  // Navigation Guard & Unsaved Changes modal states
  const [originalSettings, setOriginalSettings] = useState<any>(null);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false);
  const [showCrudModal, setShowCrudModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [categoryModalError, setCategoryModalError] = useState<string | null>(null);
  const [categoryModalLoading, setCategoryModalLoading] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState<boolean>(false);
  const [customAlert, setCustomAlert] = useState<{ title: string; message: string } | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  const hasUnsavedChanges = originalSettings ? (
    tickerText !== (originalSettings.tickerText || "") ||
    tickerSpeed !== (originalSettings.tickerSpeed || 60) ||
    announcementText !== (originalSettings.announcementText || "") ||
    heroTitle !== (originalSettings.heroTitle || "") ||
    heroTitleFontType !== (originalSettings.heroTitleFontType || "Outfit") ||
    heroTitleFontColor !== (originalSettings.heroTitleFontColor || "#111827") ||
    heroTitleFontSize !== (originalSettings.heroTitleFontSize || "4.5rem") ||
    heroTitleFontAlignment !== (originalSettings.heroTitleFontAlignment || "center") ||
    
    heroTitleFontWeight !== (originalSettings.heroTitleFontWeight || "700") ||
    
    
    heroManifesto !== (originalSettings.heroManifesto || "") ||
    heroManifestoFontType !== (originalSettings.heroManifestoFontType || "Outfit") ||
    heroManifestoFontColor !== (originalSettings.heroManifestoFontColor || "#ffffff") ||
    heroManifestoFontSize !== (originalSettings.heroManifestoFontSize || "0.72rem") ||
    heroManifestoFontAlignment !== (originalSettings.heroManifestoFontAlignment || "left") ||
    heroManifestoFontWeight !== (originalSettings.heroManifestoFontWeight || "500") ||
    heroTemplate !== (originalSettings.heroTemplate || "center") ||
    showHeroTitle !== (originalSettings.showHeroTitle !== false) ||
    showHeroManifesto !== (originalSettings.showHeroManifesto !== false) ||
    showHeroButton !== (originalSettings.showHeroButton !== false) ||
    heroButtonText !== (originalSettings.heroButtonText || "Shop Now") ||
    heroButtonStyle !== (originalSettings.heroButtonStyle || "solid") ||
    heroButtonSize !== (originalSettings.heroButtonSize || "md") ||
    heroButtonColor !== (originalSettings.heroButtonColor || "") ||
    heroButtonTextColor !== (originalSettings.heroButtonTextColor || "#ffffff") ||
    videoTitle !== (originalSettings.videoTitle || "") ||
    videoSubtitle !== (originalSettings.videoSubtitle || "") ||
    videoUrl !== (originalSettings.videoUrl || "") ||
    videoFallbackColor !== (originalSettings.videoFallbackColor || "#57bc74") ||
    lifestyleText !== (originalSettings.lifestyleText || "") ||
    lifestyleImage !== (originalSettings.lifestyleImage || "") ||
    primaryColor !== (originalSettings.primaryColor || "#57bc74") ||
    brandLogoType !== (originalSettings.brandLogoType || "text") ||
    brandLogoValue !== (originalSettings.brandLogoValue || "29sFORMULA") ||
    heroBgType !== (originalSettings.heroBgType || "color") ||
    heroBgColor !== (originalSettings.heroBgColor || "#57bc74") ||
    heroBgImage !== (originalSettings.heroBgImage || "") ||
    heroBgVideo !== (originalSettings.heroBgVideo || "") ||
    showTicker !== (originalSettings.showTicker !== undefined ? originalSettings.showTicker : true) ||
    showAnnouncement !== (originalSettings.showAnnouncement !== undefined ? originalSettings.showAnnouncement : true) ||
    showVideo !== (originalSettings.showVideo !== undefined ? originalSettings.showVideo : true) ||
    showLifestyle !== (originalSettings.showLifestyle !== undefined ? originalSettings.showLifestyle : true) ||
    showProductReviews !== (originalSettings.showProductReviews !== undefined ? originalSettings.showProductReviews : true) ||
    showProductExploreMore !== (originalSettings.showProductExploreMore !== undefined ? originalSettings.showProductExploreMore : true) ||
    showProductFaq !== (originalSettings.showProductFaq !== undefined ? originalSettings.showProductFaq : true) ||
    usageGuideText !== (originalSettings.usageGuideText || "Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes.") ||
    exploreMoreTitle !== (originalSettings.exploreMoreTitle || "Don't Stop. Explore More.") ||
    deliverySubtext !== (originalSettings.deliverySubtext || "TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.") ||
    supportText !== (originalSettings.supportText || "For support inquiries, please contact us.") ||
    careersText !== (originalSettings.careersText || "Join our team! Check out our open positions.") ||
    tradeEnquiryText !== (originalSettings.tradeEnquiryText || "For trade and wholesale inquiries, contact our B2B team.") ||
    aboutUsText !== (originalSettings.aboutUsText || "We are 29sFORMULA, redefining luxury.") ||
    instagramLink !== (originalSettings.instagramLink || "#") ||
    facebookLink !== (originalSettings.facebookLink || "#") ||
    contactLink !== (originalSettings.contactLink || "#") ||
    contactUsText !== (originalSettings.contactUsText || "Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.") ||
    returnPolicyText !== (originalSettings.returnPolicyText || "We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund.") ||
    shippingPolicyText !== (originalSettings.shippingPolicyText || "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.") ||
    JSON.stringify(faqs) !== JSON.stringify(originalSettings.faqs || [])
  ) : false;

  const getChangedFieldsList = () => {
    const changes: string[] = [];
    if (!originalSettings) return changes;
    if (tickerText !== (originalSettings.tickerText || "")) changes.push("Marquee scrolling ticker text");
    if (tickerSpeed !== (originalSettings.tickerSpeed || 60)) changes.push("Marquee ticker scrolling speed");
    if (announcementText !== (originalSettings.announcementText || "")) changes.push("Top announcement banner copy");
    if (heroTitle !== (originalSettings.heroTitle || "")) changes.push("Hero brand header title");
    if (heroTitleFontType !== (originalSettings.heroTitleFontType || "Outfit")) changes.push("Hero title font type");
    if (heroTitleFontColor !== (originalSettings.heroTitleFontColor || "#111827")) changes.push("Hero title font color");
    if (heroTitleFontSize !== (originalSettings.heroTitleFontSize || "4.5rem")) changes.push("Hero title font size");
    if (heroTitleFontAlignment !== (originalSettings.heroTitleFontAlignment || "center")) changes.push("Hero title font alignment");
        if (heroTitleFontWeight !== (originalSettings.heroTitleFontWeight || "700")) changes.push("Hero title font weight");
    if (heroManifesto !== (originalSettings.heroManifesto || "")) changes.push("Hero brand manifesto subtext");
    if (heroManifestoFontType !== (originalSettings.heroManifestoFontType || "Outfit")) changes.push("Hero manifesto font type");
    if (heroManifestoFontColor !== (originalSettings.heroManifestoFontColor || "#ffffff")) changes.push("Hero manifesto font color");
    if (heroManifestoFontSize !== (originalSettings.heroManifestoFontSize || "0.72rem")) changes.push("Hero manifesto font size");
    if (heroManifestoFontAlignment !== (originalSettings.heroManifestoFontAlignment || "left")) changes.push("Hero manifesto font alignment");
    if (heroManifestoFontWeight !== (originalSettings.heroManifestoFontWeight || "500")) changes.push("Hero manifesto font weight");
    if (heroTemplate !== (originalSettings.heroTemplate || "center")) changes.push("Hero layout templates");
    if (showHeroTitle !== (originalSettings.showHeroTitle !== false)) changes.push("Hero Title toggle");
    if (showHeroManifesto !== (originalSettings.showHeroManifesto !== false)) changes.push("Hero Manifesto toggle");
    if (showHeroButton !== (originalSettings.showHeroButton !== false)) changes.push("Hero Button toggle");
    if (heroButtonText !== (originalSettings.heroButtonText || "Shop Now")) changes.push("Hero CTA Button text");
    if (heroButtonStyle !== (originalSettings.heroButtonStyle || "solid")) changes.push("Hero CTA Button style");
    if (heroButtonSize !== (originalSettings.heroButtonSize || "md")) changes.push("Hero CTA Button size");
    if (heroButtonColor !== (originalSettings.heroButtonColor || "")) changes.push("Hero CTA Button color");
    if (heroButtonTextColor !== (originalSettings.heroButtonTextColor || "#ffffff")) changes.push("Hero CTA Button text color");
    if (videoTitle !== (originalSettings.videoTitle || "")) changes.push("Video banner headline title");
    if (videoSubtitle !== (originalSettings.videoSubtitle || "")) changes.push("Video banner description");
    if (videoUrl !== (originalSettings.videoUrl || "")) changes.push("Background MP4 video URL");
    if (videoFallbackColor !== (originalSettings.videoFallbackColor || "#57bc74")) changes.push("Video Arrivals Fallback Background Color");
    if (JSON.stringify(faqs) !== JSON.stringify(originalSettings.faqs || [])) changes.push("Frequently Asked Questions (FAQ) list");
    if (lifestyleText !== (originalSettings.lifestyleText || "")) changes.push("Lifestyle overlay text copy");
    if (lifestyleImage !== (originalSettings.lifestyleImage || "")) changes.push("Lifestyle banner background image");
    if (primaryColor !== (originalSettings.primaryColor || "#57bc74")) changes.push("Primary brand theme color");
    if (brandLogoType !== (originalSettings.brandLogoType || "text") || brandLogoValue !== (originalSettings.brandLogoValue || "29sFORMULA")) changes.push("Brand Logo");
    if (heroBgType !== (originalSettings.heroBgType || "color")) changes.push("Hero section background layout type");
    if (heroBgColor !== (originalSettings.heroBgColor || "#57bc74")) changes.push("Hero section custom background color");
    if (heroBgImage !== (originalSettings.heroBgImage || "")) changes.push("Hero section background image URL");
    if (heroBgVideo !== (originalSettings.heroBgVideo || "")) changes.push("Hero section background video URL");
    if (showTicker !== (originalSettings.showTicker !== undefined ? originalSettings.showTicker : true)) changes.push("Marquee Ticker visibility toggle");
    if (showAnnouncement !== (originalSettings.showAnnouncement !== undefined ? originalSettings.showAnnouncement : true)) changes.push("Top Announcement Banner visibility toggle");
    if (showVideo !== (originalSettings.showVideo !== undefined ? originalSettings.showVideo : true)) changes.push("Video section visibility toggle");
    if (showLifestyle !== (originalSettings.showLifestyle !== undefined ? originalSettings.showLifestyle : true)) changes.push("Lifestyle banner visibility toggle");
    return changes;
  };

  const handleAutoLogout = (msg: string) => {
    localStorage.removeItem("adminSession");
    localStorage.removeItem("lastActivityTime");
    window.location.href = "/login?expired=true";
  };

  const handleManualLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("adminSession");
    localStorage.removeItem("lastActivityTime");
    window.location.href = "/login";
  };

  // Auth checking on mount
  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    const lastActivity = localStorage.getItem("lastActivityTime");
    const thirtyMinutes = 30 * 60 * 1000; // 1800000 ms

    if (!session || session !== "true") {
      window.location.href = "/login";
      return;
    }

    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10);
      if (elapsed > thirtyMinutes) {
        handleAutoLogout("Your session has expired due to 30 minutes of inactivity.");
        return;
      }
    }

    setAuthorized(true);
    localStorage.setItem("lastActivityTime", Date.now().toString());
  }, []);

  // Lazy Loading Data based on activeTab
  useEffect(() => {
    if (!authorized) return;

    if (activeTab === "home" && !fetchedTabs.current.has("home")) {
      fetchedTabs.current.add("home");
      fetchDashboardStats();
    }
    if (activeTab === "products" && !fetchedTabs.current.has("products")) {
      fetchedTabs.current.add("products");
      fetchProducts();
    }
    if (activeTab === "orders" && !fetchedTabs.current.has("orders")) {
      fetchedTabs.current.add("orders");
      fetchOrders();
    }
    if (activeTab === "online-store" && !fetchedTabs.current.has("online-store")) {
      fetchedTabs.current.add("online-store");
      fetchSettings();
      fetchAdminReviews();
    }
    if (activeTab === "discounts" && !fetchedTabs.current.has("discounts")) {
      fetchedTabs.current.add("discounts");
      fetchDiscounts();
    }
    if (activeTab === "customers" && !fetchedTabs.current.has("customers")) {
      fetchedTabs.current.add("customers");
      fetchCustomers();
    }
  }, [authorized, activeTab]);

  // Inactivity tracking listeners
  useEffect(() => {
    if (!authorized) return;

    const resetTimer = () => {
      localStorage.setItem("lastActivityTime", Date.now().toString());
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    const checkInterval = setInterval(() => {
      const lastActivity = localStorage.getItem("lastActivityTime");
      const thirtyMinutes = 30 * 60 * 1000;
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed > thirtyMinutes) {
          handleAutoLogout("You have been logged out automatically due to 30 minutes of inactivity.");
        }
      }
    }, 10000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(checkInterval);
    };
  }, [authorized]);

  // Browser refresh, close tab, and back button navigation guards
  useEffect(() => {
    if (!authorized) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeTab === "online-store" && hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved storefront customizations. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (activeTab === "online-store" && hasUnsavedChanges) {
        // Push state back to prevent history back navigation
        window.history.pushState(null, "", window.location.href);
        setPendingTabChange("storefront");
        setShowUnsavedModal(true);
      }
    };

    // Ensure state exists to hijack back actions
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [authorized, activeTab, hasUnsavedChanges]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/settings", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch settings catalog");
      const data = await res.json();
      if (data) {
        setTickerText(data.tickerText || "");
        setTickerSpeed(data.tickerSpeed || 60);
        setAnnouncementText(data.announcementText || "");
        setHeroTitle(data.heroTitle || "");
        setHeroTitleFontType(data.heroTitleFontType || "Outfit");
        setHeroTitleFontColor(data.heroTitleFontColor || "#111827");
        setHeroTitleFontSize(data.heroTitleFontSize || "4.5rem");
        setHeroTitleFontAlignment(data.heroTitleFontAlignment || "center");
        setHeroTitleFontWeight(data.heroTitleFontWeight || "700");
        if (data.heroManifestoFontType) setHeroManifestoFontType(data.heroManifestoFontType);
        if (data.heroManifestoFontColor) setHeroManifestoFontColor(data.heroManifestoFontColor);
        if (data.heroManifestoFontSize) setHeroManifestoFontSize(data.heroManifestoFontSize);
        if (data.heroManifestoFontAlignment) setHeroManifestoFontAlignment(data.heroManifestoFontAlignment);
        if (data.heroManifestoFontWeight) setHeroManifestoFontWeight(data.heroManifestoFontWeight);
        setHeroManifesto(data.heroManifesto || "");
        setHeroTemplate(data.heroTemplate || "center");
        setShowHeroTitle(data.showHeroTitle !== false);
        setShowHeroManifesto(data.showHeroManifesto !== false);
        setShowHeroButton(data.showHeroButton !== false);
        setHeroButtonText(data.heroButtonText || "Shop Now");
        setHeroButtonStyle(data.heroButtonStyle || "solid");
        setHeroButtonSize(data.heroButtonSize || "md");
        setHeroButtonColor(data.heroButtonColor || "");
        setHeroButtonTextColor(data.heroButtonTextColor || "#ffffff");
        setVideoTitle(data.videoTitle || "");
        setVideoSubtitle(data.videoSubtitle || "");
        setVideoUrl(data.videoUrl || "");
        setVideoFallbackColor(data.videoFallbackColor || "#57bc74");
        setLifestyleText(data.lifestyleText || "");
        setLifestyleImage(data.lifestyleImage || "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
        setPrimaryColor(data.primaryColor || "#57bc74");
        setBrandLogoType(data.brandLogoType || "text");
        setBrandLogoValue(data.brandLogoValue || "29sFORMULA");
        setHeroBgType(data.heroBgType || "color");
        setHeroBgColor(data.heroBgColor || "#57bc74");
        setHeroBgImage(data.heroBgImage || "");
        setHeroBgVideo(data.heroBgVideo || "");
        setShowTicker(data.showTicker !== undefined ? data.showTicker : true);
        setShowAnnouncement(data.showAnnouncement !== undefined ? data.showAnnouncement : true);
        setShowVideo(data.showVideo !== undefined ? data.showVideo : true);
        setShowLifestyle(data.showLifestyle !== undefined ? data.showLifestyle : true);
        setShowProductReviews(data.showProductReviews !== undefined ? data.showProductReviews : true);
        setShowProductExploreMore(data.showProductExploreMore !== undefined ? data.showProductExploreMore : true);
        setShowProductFaq(data.showProductFaq !== undefined ? data.showProductFaq : true);
        setUsageGuideText(data.usageGuideText || "Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes.");
        setExploreMoreTitle(data.exploreMoreTitle || "Don't Stop. Explore More.");
        setDeliverySubtext(data.deliverySubtext || "TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.");
        setGoogleClientId(data.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com");
        if (data.supportText !== undefined) setSupportText(data.supportText);
        if (data.careersText !== undefined) setCareersText(data.careersText);
        if (data.tradeEnquiryText !== undefined) setTradeEnquiryText(data.tradeEnquiryText);
        if (data.aboutUsText !== undefined) setAboutUsText(data.aboutUsText);
        if (data.instagramLink !== undefined) setInstagramLink(data.instagramLink);
        if (data.facebookLink !== undefined) setFacebookLink(data.facebookLink);
        if (data.contactLink !== undefined) setContactLink(data.contactLink);
        if (data.contactUsText !== undefined) setContactUsText(data.contactUsText);
        if (data.returnPolicyText !== undefined) setReturnPolicyText(data.returnPolicyText);
        if (data.shippingPolicyText !== undefined) setShippingPolicyText(data.shippingPolicyText);
        const loadedFaqs = data.faqs || [];
        setFaqs(loadedFaqs);

        // Save initial snapshot
        setOriginalSettings({
          tickerText: data.tickerText || "",
          tickerSpeed: data.tickerSpeed || 60,
          announcementText: data.announcementText || "",
          heroTitle: data.heroTitle || "",
          heroTitleFontType: data.heroTitleFontType || "Outfit",
          heroTitleFontColor: data.heroTitleFontColor || "#111827",
          heroTitleFontSize: data.heroTitleFontSize || "4.5rem",
          heroTitleFontAlignment: data.heroTitleFontAlignment || "center",
          heroTitleFontWeight: data.heroTitleFontWeight || "700",
          heroManifestoFontType: data.heroManifestoFontType || "Outfit",
          heroManifestoFontColor: data.heroManifestoFontColor || "#ffffff",
          heroManifestoFontSize: data.heroManifestoFontSize || "0.72rem",
          heroManifestoFontAlignment: data.heroManifestoFontAlignment || "left",
          heroManifestoFontWeight: data.heroManifestoFontWeight || "500",
          heroManifesto: data.heroManifesto || "",
          heroTemplate: data.heroTemplate || "center",
          showHeroTitle: data.showHeroTitle !== false,
          showHeroManifesto: data.showHeroManifesto !== false,
          showHeroButton: data.showHeroButton !== false,
          heroButtonText: data.heroButtonText || "Shop Now",
          heroButtonStyle: data.heroButtonStyle || "solid",
          heroButtonSize: data.heroButtonSize || "md",
          heroButtonColor: data.heroButtonColor || "",
          heroButtonTextColor: data.heroButtonTextColor || "#ffffff",
          videoTitle: data.videoTitle || "",
          videoSubtitle: data.videoSubtitle || "",
          videoUrl: data.videoUrl || "",
          videoFallbackColor: data.videoFallbackColor || "#57bc74",
          lifestyleText: data.lifestyleText || "",
          lifestyleImage: data.lifestyleImage || "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80",
          primaryColor: data.primaryColor || "#57bc74",
          brandLogoType: data.brandLogoType || "text",
          brandLogoValue: data.brandLogoValue || "29sFORMULA",
          heroBgType: data.heroBgType || "color",
          heroBgColor: data.heroBgColor || "#57bc74",
          heroBgImage: data.heroBgImage || "",
          heroBgVideo: data.heroBgVideo || "",
          showTicker: data.showTicker !== undefined ? data.showTicker : true,
          showAnnouncement: data.showAnnouncement !== undefined ? data.showAnnouncement : true,
          showVideo: data.showVideo !== undefined ? data.showVideo : true,
          showLifestyle: data.showLifestyle !== undefined ? data.showLifestyle : true,
          showProductReviews: data.showProductReviews !== undefined ? data.showProductReviews : true,
          showProductExploreMore: data.showProductExploreMore !== undefined ? data.showProductExploreMore : true,
          showProductFaq: data.showProductFaq !== undefined ? data.showProductFaq : true,
          usageGuideText: data.usageGuideText || "Fits your mood. Handcrafted with scientific precision. Refer to our USAGE GUIDE for layering notes.",
          exploreMoreTitle: data.exploreMoreTitle || "Don't Stop. Explore More.",
          deliverySubtext: data.deliverySubtext || "TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT.",
          googleClientId: data.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com",
          supportText: data.supportText || "",
          careersText: data.careersText || "",
          tradeEnquiryText: data.tradeEnquiryText || "",
          aboutUsText: data.aboutUsText || "",
          instagramLink: data.instagramLink || "#",
          facebookLink: data.facebookLink || "#",
          contactLink: data.contactLink || "#",
          contactUsText: data.contactUsText || "",
          returnPolicyText: data.returnPolicyText || "",
          shippingPolicyText: data.shippingPolicyText || "",
          faqs: loadedFaqs
        });
      }
    } catch (err: any) {
      console.warn("Storefront settings query failed (likely backend starting up):", err.message || err);
    }
  };



  const fetchAdminReviews = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/admin/reviews", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAdminReviews(data || []);
      }
    } catch (err) {
      console.warn("Failed to fetch admin reviews:", err);
    }
  };

  const handleDeleteAdminReviewConfirm = async () => {
    if (!deleteReviewTarget) return;
    setIsDeletingReview(true);
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/admin/reviews/${deleteReviewTarget}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSuccessMessage("Review deleted permanently!");
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchAdminReviews();
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setIsDeletingReview(false);
      setDeleteReviewTarget(null);
    }
  };

  const handleEditReviewSubmit = async () => {
    if (!editReviewTarget) return;
    setIsEditingReview(true);
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/admin/reviews/${editReviewTarget._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: editReviewTarget.rating,
          title: editReviewTarget.title,
          comment: editReviewTarget.comment,
          author: editReviewTarget.author,
          location: editReviewTarget.location
        })
      });
      if (res.ok) {
        setSuccessMessage("Review updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchAdminReviews();
      } else {
        alert("Failed to update review.");
      }
    } catch (err) {
      console.error("Failed to update review:", err);
    } finally {
      setIsEditingReview(false);
      setEditReviewTarget(null);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/discounts", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setDiscountsList(data || []);
      }
    } catch (e) {
      console.warn("Failed to fetch discounts:", e);
    }
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscountCode || !newDiscountValue) return;

    try {
      const res = await fetch("http://127.0.0.1:5001/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newDiscountCode,
          type: newDiscountType,
          value: parseFloat(newDiscountValue),
          minOrderAmount: parseFloat(newDiscountMinOrder) || 0
        }),
      });
      if (res.ok) {
        setNewDiscountCode("");
        setNewDiscountValue("");
        setNewDiscountMinOrder("");
        setDiscountError(null);
        fetchDiscounts();
        setSuccessMessage("Discount coupon successfully created!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const data = await res.json();
        setDiscountError(data.error || "Failed to create discount code.");
      }
    } catch (err) {
      setDiscountError("Network error. Could not connect to server.");
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/discounts/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchDiscounts();
        setSuccessMessage("Discount coupon removed!");
        setTimeout(() => setSuccessMessage(null), 3000);
        setDeleteDiscountConfirmId(null);
      }
    } catch (e) {
      console.error("Failed to delete discount:", e);
    }
  };

  const handleNavigationTrigger = (target: "home" | "orders" | "products" | "customers" | "marketing" | "discounts" | "online-store" | "logout" | "storefront") => {
    if (activeTab === "online-store" && hasUnsavedChanges && target !== "online-store") {
      setPendingTabChange(target);
      setShowUnsavedModal(true);
    } else {
      executeNavigation(target);
    }
  };

  const executeNavigation = (target: string) => {
    setIsMobileMenuOpen(false);
    if (target === "home") {
      setActiveTab("home");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
      fetchOrders();
    } else if (target === "products") {
      setActiveTab("products");
      setProductsDropdownOpen(true);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
      setActiveSubTab("all");
      setSelectedCategoryView(null);
    } else if (target === "orders") {
      setActiveTab("orders");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(true);
      setOnlineStoreDropdownOpen(false);
      setActiveSubTab("all");
      fetchOrders();
    } else if (target === "customers") {
      setActiveTab("customers");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
      fetchOrders();
    } else if (target === "marketing") {
      setActiveTab("marketing");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
    } else if (target === "discounts") {
      setActiveTab("discounts");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(false);
      fetchDiscounts();
    } else if (target === "online-store") {
      setActiveTab("online-store");
      setProductsDropdownOpen(false);
      setOrdersDropdownOpen(false);
      setOnlineStoreDropdownOpen(true);
      fetchAdminReviews();
    } else if (target === "logout") {
      localStorage.removeItem("adminSession");
      localStorage.removeItem("lastActivityTime");
      window.location.href = "/login";
    } else if (target === "storefront") {
      window.location.href = "/";
    }
  };

  const saveSettingsSilent = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickerText,
          tickerSpeed,
          announcementText,
          heroTitle,
          heroTitleFontType,
          heroTitleFontColor,
          heroTitleFontSize,
          heroTitleFontAlignment,
          heroTitleFontWeight,
          heroManifesto,
          heroTemplate,
          showHeroTitle,
          showHeroManifesto,
          showHeroButton,
          heroButtonText,
          heroButtonStyle,
          heroButtonSize,
          heroButtonColor,
          heroButtonTextColor,
          heroManifestoFontType,
          heroManifestoFontColor,
          heroManifestoFontSize,
          heroManifestoFontAlignment,
          heroManifestoFontWeight,
          videoTitle,
          videoSubtitle,
          videoUrl,
          videoFallbackColor,
          lifestyleText,
          lifestyleImage,
          primaryColor,
          heroBgType,
          heroBgColor,
          heroBgImage,
          heroBgVideo,
          showTicker,
          showAnnouncement,
          showVideo,
          showLifestyle,
          showProductReviews,
          showProductExploreMore,
          showProductFaq,
          usageGuideText,
          exploreMoreTitle,
          deliverySubtext,
          googleClientId,
          faqs
        })
      });
      if (!res.ok) throw new Error("Failed to save layout adjustments");

      setOriginalSettings({
        tickerText,
        tickerSpeed,
        announcementText,
        heroTitle,
        heroTitleFontType,
        heroTitleFontColor,
        heroTitleFontSize,
        heroTitleFontAlignment,
        heroTitleFontWeight,
        heroManifesto,
          heroTemplate,
          showHeroTitle,
          showHeroManifesto,
          showHeroButton,
          heroButtonText,
          heroButtonStyle,
          heroButtonSize,
          heroButtonColor,
          heroButtonTextColor,
          heroManifestoFontType,
          heroManifestoFontColor,
          heroManifestoFontSize,
          heroManifestoFontAlignment,
          heroManifestoFontWeight,
        videoTitle,
        videoSubtitle,
        videoUrl,
        videoFallbackColor,
        lifestyleText,
        lifestyleImage,
        primaryColor,
        heroBgType,
        heroBgColor,
        heroBgImage,
        heroBgVideo,
        showTicker,
        showAnnouncement,
        showVideo,
        showLifestyle,
        showProductReviews,
        showProductExploreMore,
        showProductFaq,
        usageGuideText,
        exploreMoreTitle,
        deliverySubtext,
        googleClientId,
        faqs
      });
    } catch (err: any) {
      alert("Could not auto-save storefront configuration: " + err.message);
    }
  };

  const resetSettingsToOriginal = () => {
    if (originalSettings) {
      setTickerText(originalSettings.tickerText || "");
      setTickerSpeed(originalSettings.tickerSpeed || 60);
      setAnnouncementText(originalSettings.announcementText || "");
      setHeroTitle(originalSettings.heroTitle || "");
      setHeroTitleFontType(originalSettings.heroTitleFontType || "Outfit");
      setHeroTitleFontColor(originalSettings.heroTitleFontColor || "#111827");
      setHeroTitleFontSize(originalSettings.heroTitleFontSize || "4.5rem");
      setHeroTitleFontAlignment(originalSettings.heroTitleFontAlignment || "center");
      setHeroTitleFontWeight(originalSettings.heroTitleFontWeight || "700");
      setHeroManifesto(originalSettings.heroManifesto || "");
      setHeroTemplate(originalSettings.heroTemplate || "center");
      setShowHeroTitle(originalSettings.showHeroTitle !== false);
      setShowHeroManifesto(originalSettings.showHeroManifesto !== false);
      setShowHeroButton(originalSettings.showHeroButton !== false);
      setHeroButtonText(originalSettings.heroButtonText || "Shop Now");
      setHeroButtonStyle(originalSettings.heroButtonStyle || "solid");
      setHeroButtonSize(originalSettings.heroButtonSize || "md");
      setHeroButtonColor(originalSettings.heroButtonColor || "");
      setHeroButtonTextColor(originalSettings.heroButtonTextColor || "#ffffff");
      setVideoTitle(originalSettings.videoTitle || "");
      setVideoSubtitle(originalSettings.videoSubtitle || "");
      setVideoUrl(originalSettings.videoUrl || "");
      setVideoFallbackColor(originalSettings.videoFallbackColor || "#57bc74");
      setLifestyleText(originalSettings.lifestyleText || "");
      setLifestyleImage(originalSettings.lifestyleImage || "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
      setHeroBgType(originalSettings.heroBgType || "color");
      setHeroBgColor(originalSettings.heroBgColor || "#57bc74");
      setHeroBgImage(originalSettings.heroBgImage || "");
      setHeroBgVideo(originalSettings.heroBgVideo || "");
      setPrimaryColor(originalSettings.primaryColor || "#57bc74");
      setBrandLogoType(originalSettings.brandLogoType || "text");
      setBrandLogoValue(originalSettings.brandLogoValue || "29sFORMULA");
      setShowTicker(originalSettings.showTicker !== undefined ? originalSettings.showTicker : true);
      setShowAnnouncement(originalSettings.showAnnouncement !== undefined ? originalSettings.showAnnouncement : true);
      setShowVideo(originalSettings.showVideo !== undefined ? originalSettings.showVideo : true);
      setShowLifestyle(originalSettings.showLifestyle !== undefined ? originalSettings.showLifestyle : true);
      setGoogleClientId(originalSettings.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com");
      setSupportText(originalSettings.supportText || "For support inquiries, please contact us.");
      setCareersText(originalSettings.careersText || "Join our team! Check out our open positions.");
      setTradeEnquiryText(originalSettings.tradeEnquiryText || "For trade and wholesale inquiries, contact our B2B team.");
      setAboutUsText(originalSettings.aboutUsText || "We are 29sFORMULA, redefining luxury.");
      setInstagramLink(originalSettings.instagramLink || "#");
      setFacebookLink(originalSettings.facebookLink || "#");
      setContactLink(originalSettings.contactLink || "#");
      setContactUsText(originalSettings.contactUsText || "Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.");
      setReturnPolicyText(originalSettings.returnPolicyText || "We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund.");
      setShippingPolicyText(originalSettings.shippingPolicyText || "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.");
      setFaqs(originalSettings.faqs || []);
    }
  };

  const handleSaveAndContinue = async () => {
    await saveSettingsSilent();
    setShowUnsavedModal(false);
    if (pendingTabChange) {
      executeNavigation(pendingTabChange);
      setPendingTabChange(null);
    }
  };

  const handleDiscardAndContinue = () => {
    resetSettingsToOriginal();
    setShowUnsavedModal(false);
    if (pendingTabChange) {
      executeNavigation(pendingTabChange);
      setPendingTabChange(null);
    }
  };

  const handleCancelNavigation = () => {
    setShowUnsavedModal(false);
    setPendingTabChange(null);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingSettings(true);
      setError(null);
      const res = await fetch("http://127.0.0.1:5001/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickerText,
          tickerSpeed,
          announcementText,
          heroTitle,
          heroTitleFontType,
          heroTitleFontColor,
          heroTitleFontSize,
          heroTitleFontAlignment,
          heroTitleFontWeight,
          heroManifesto,
          heroTemplate,
          showHeroTitle,
          showHeroManifesto,
          showHeroButton,
          heroButtonText,
          heroButtonStyle,
          heroButtonSize,
          heroButtonColor,
          heroButtonTextColor,
          heroManifestoFontType,
          heroManifestoFontColor,
          heroManifestoFontSize,
          heroManifestoFontAlignment,
          heroManifestoFontWeight,
          videoTitle,
          videoSubtitle,
          videoUrl,
          videoFallbackColor,
          lifestyleText,
          lifestyleImage,
          primaryColor,
          brandLogoType,
          brandLogoValue,
          heroBgType,
          heroBgColor,
          heroBgImage,
          heroBgVideo,
          showTicker,
          showAnnouncement,
          showVideo,
          showLifestyle,
          googleClientId,
          faqs,
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
        })
      });
      if (!res.ok) throw new Error("Failed to save layout adjustments");

      // Update original settings state
      setOriginalSettings({
        tickerText,
        tickerSpeed,
        announcementText,
        heroTitle,
        heroTitleFontType,
        heroTitleFontColor,
        heroTitleFontSize,
        heroTitleFontAlignment,
        heroTitleFontWeight,
        heroManifesto,
          heroTemplate,
          showHeroTitle,
          showHeroManifesto,
          showHeroButton,
          heroButtonText,
        videoTitle,
        videoSubtitle,
        videoUrl,
        videoFallbackColor,
        lifestyleText,
        lifestyleImage,
        primaryColor,
        brandLogoType,
        brandLogoValue,
        heroBgType,
        heroBgColor,
        heroBgImage,
        heroBgVideo,
        showTicker,
        showAnnouncement,
        showVideo,
        showLifestyle,
        googleClientId,
        faqs,
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
      });

      setSuccessMessage("Homepage layout customized successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update page settings.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoadingSettings(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/admin/dashboard-stats", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setDashboardStats(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5001/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to query store database.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = () => {
    fetch("http://127.0.0.1:5001/api/orders", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(err => console.error("Error fetching orders:", err));
  };

  const fetchCustomers = () => {
    fetch("http://127.0.0.1:5001/api/customers", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCustomers(data);
        }
      })
      .catch(err => console.error("Error fetching customers:", err));
  };

  const handleDeleteCustomer = async (id: string) => {
    setIsDeletingCustomer(true);
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/customers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchCustomers();
        setSelectedCustomer(null);
      } else {
        alert("Failed to delete customer");
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
    } finally {
      setIsDeletingCustomer(false);
      setDeleteCustomerTargetId(null);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    fetch(`http://127.0.0.1:5001/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then(updated => {
        setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, status: updated.status } : o));
        if (selectedOrder && selectedOrder._id === updated._id) {
          setSelectedOrder({ ...selectedOrder, status: updated.status });
        }
        setSuccessMessage("Order status updated to " + status);
        setTimeout(() => setSuccessMessage(null), 3000);
      })
      .catch(err => alert("Error updating status: " + err.message));
  };

  const handleDeleteOrder = (orderId: string) => {
    setDeleteOrderTargetId(orderId);
  };

  const executeDeleteOrder = async (orderId: string) => {
    setIsDeletingOrder(true);
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/orders/${orderId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete order");
      await res.json();
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "Cancelled", deletedByAdmin: true } : o));
      setSuccessMessage("Order marked as cancelled and moved to returns");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert("Error deleting order: " + err.message);
    } finally {
      setIsDeletingOrder(false);
      setDeleteOrderTargetId(null);
    }
  };

  const handleUpdateRefundStatus = (orderId: string, refundStatus: string) => {
    fetch(`http://127.0.0.1:5001/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refundStatus })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update refund status");
        return res.json();
      })
      .then(updated => {
        setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, refundStatus: updated.refundStatus } : o));
        if (selectedOrder && selectedOrder._id === updated._id) {
          setSelectedOrder({ ...selectedOrder, refundStatus: updated.refundStatus });
        }
        setSuccessMessage("Refund status updated to: " + refundStatus);
        setTimeout(() => setSuccessMessage(null), 3000);
      })
      .catch(err => alert("Error updating refund status: " + err.message));
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedCount = files.length;
    const currentCount = images.length;
    if (currentCount + selectedCount > 6) {
      setCustomAlert({
        title: "Image Limit Exceeded",
        message: "You can upload a maximum of 6 images in total."
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < selectedCount; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://127.0.0.1:5001/api/upload", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      const newImagesList = [...images, ...uploadedUrls];
      setImages(newImagesList);

      // Auto-select the first image as the cover image if none is currently selected
      if (!imageFront && newImagesList.length > 0) {
        setImageFront(newImagesList[0]);
      }
    } catch (err: any) {
      setCustomAlert({
        title: "Upload Failed",
        message: "Failed to upload image(s): " + err.message
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const urlToRemove = images[indexToRemove];
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);

    // If we removed the cover image, reset it to the first remaining image or null
    if (imageFront === urlToRemove) {
      setImageFront(updated.length > 0 ? updated[0] : "");
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setVideoProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5001/api/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setVideoProgress(percentage);
      }
    };

    xhr.onload = () => {
      setUploadingVideo(false);
      setVideoProgress(null);
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          setVideoUrl(data.url);
        } catch (err) {
          setCustomAlert({
            title: "Parse Error",
            message: "Failed to parse upload server response."
          });
        }
      } else {
        let errMsg = "Upload failed";
        try {
          const data = JSON.parse(xhr.responseText);
          errMsg = data.error || errMsg;
        } catch (e) { }
        setCustomAlert({
          title: "Video Upload Failed",
          message: errMsg
        });
      }
    };

    xhr.onerror = () => {
      setUploadingVideo(false);
      setVideoProgress(null);
      setCustomAlert({
        title: "Network Error",
        message: "Network request failed. Please check connection to server."
      });
    };

    xhr.send(formData);
  };

  const handleLifestyleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLifestyle(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5001/api/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      setLifestyleImage(data.url);
    } catch (err: any) {
      setCustomAlert({
        title: "Upload Failed",
        message: "Failed to upload lifestyle image: " + err.message
      });
    } finally {
      setUploadingLifestyle(false);
    }
  };

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5001/api/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      setBrandLogoValue(data.url);
    } catch (err: any) {
      setCustomAlert({
        title: "Upload Failed",
        message: "Failed to upload brand logo: " + err.message
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleResetToDefaults = () => {
    setTickerText("7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | 7-DAY EASY RETURNS & EXCHANGES | FREE SHIPPING ACROSS INDIA | ");
    setTickerSpeed(60);
    setAnnouncementText("EVERY BOTTLE IS PREPARED WITH CARE. DUE TO SEASONAL DEMAND, PROCESSING MAY TAKE UP TO 5-7 DAYS BEFORE DISPATCH.");
    setHeroTitle("29sFORMULA");
    setHeroManifesto("SCENT IS THE DIFFERENCE YOU FEEL AND NEVER FAKE. EVERY 29S FORMULA BOTTLE IS CRAFTED BY HANDS THAT CARE, NOT MACHINES THAT RUSH.");
    setVideoTitle("NEW ARRIVALS");
    setVideoSubtitle("Drop's live. Smells divine. Feels better.");
    setVideoUrl("");
    setVideoFallbackColor("#121212");
    setLifestyleText("Intense notes, Raw elements. This is 29sFORMULA.");
    setLifestyleImage("https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
    setPrimaryColor("#57bc74");
    setBrandLogoType("text");
    setBrandLogoValue("29sFORMULA");
    setShowTicker(true);
    setShowAnnouncement(true);
    setShowVideo(true);
    setShowLifestyle(true);
    setShowResetConfirmModal(false);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setMakingPrice("");
    setQuantity("");
    setDescription("");
    setCategory([]);
    setImageFront("");
    setImageBack("");
    setImages([]);
    setSizes(["50ml", "100ml", "150ml"]);
    setSizeQuantities({});
    setOptions([{ size: "", quantity: "", price: "", makingPrice: "", category: [] }]);
    setIsEditing(false);
    setEditId(null);
    setCategoriesDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError("Please complete all required parameters (Name).");
      return;
    }
    if (options.length === 0) {
      setError("Please add at least one product variant.");
      return;
    }
    if (options.some(opt => !opt.size.trim())) {
      setError("Please specify sizes for all variants.");
      return;
    }
    if (options.some(opt => opt.quantity === "" || opt.price === "" || opt.makingPrice === "" || !opt.category || opt.category.length === 0)) {
      setError("Please specify valid quantity, price, making price, and category for all variants.");
      return;
    }

    if (images.length < 3 || images.length > 6) {
      setError("Please upload between 3 and 6 images.");
      return;
    }

    if (!imageFront) {
      setError("Please select one of the uploaded images as the cover image.");
      return;
    }

    // Set imageBack (hover image) as the first non-cover image to keep hover functionality working
    const nonCoverImages = images.filter(img => img !== imageFront);
    const alternateImage = nonCoverImages.length > 0 ? nonCoverImages[0] : "";

    const payload = {
      name,
      description,
      imageFront,
      imageBack: alternateImage || undefined,
      images,
      variants: options
    };

    try {
      const url = isEditing
        ? `http://127.0.0.1:5001/api/products/${editId}`
        : "http://127.0.0.1:5001/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Failed to update database inventory`);

      setSuccessMessage(`Product successfully ${isEditing ? "modified" : "cataloged"}!`);
      setTimeout(() => setSuccessMessage(null), 3000);

      resetForm();
      fetchProducts();
      setShowCrudModal(false);
    } catch (err: any) {
      setError(err.message || "Submit failed.");
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setEditId(product._id || null);
    setName(product.name);
    setPrice(product.price ? product.price.toString() : "0");
    setMakingPrice(product.makingPrice ? product.makingPrice.toString() : "0");
    setQuantity(product.quantity !== undefined ? product.quantity.toString() : "0");
    setDescription(product.description || "");
    setCategory(Array.isArray(product.category) ? product.category : [product.category].filter(Boolean));
    setImageFront(product.imageFront);
    setImageBack(product.imageBack || "");
    setImages(product.images || []);
    setSizes(product.sizes || []);
    setSizeQuantities(product.sizeQuantities || {});

    // Load variants/options with legacy fallback
    if (product.variants && product.variants.length > 0) {
      const mappedVariants = product.variants.map(opt => ({ ...opt, category: Array.isArray(opt.category) ? opt.category : (opt.category ? [opt.category as unknown as string] : []) }));
      setOptions(mappedVariants as any);
    } else if (product.options && product.options.length > 0) {
      const mappedOptions = product.options.map(opt => ({ ...opt, category: Array.isArray(opt.category) ? opt.category : (opt.category ? [opt.category] : []) }));
      setOptions(mappedOptions as any);
    } else {
      const legacyOptions = (product.sizes || []).map(sz => ({
        size: sz,
        quantity: product.sizeQuantities ? (product.sizeQuantities[sz] || 0) : 0,
        price: product.price || 0,
        makingPrice: product.makingPrice || 0,
        category: Array.isArray(product.category) ? product.category.filter(c => c !== "Latest Arrivals") : (product.category && product.category !== "Latest Arrivals" ? [product.category] : [])
      }));
      setOptions(legacyOptions.length > 0 ? legacyOptions : [{ size: "", quantity: "", price: "", makingPrice: "", category: [] }]);
    }

    setShowCrudModal(true);
    setActiveTab("products");
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setCategoryModalError("Please enter a category name.");
      return;
    }
    const name = newCategoryName.trim();
    if (allCategories.includes(name)) {
      setCategoryModalError("This category already exists!");
      return;
    }

    setCategoryModalLoading(true);
    setCategoryModalError(null);

    try {
      // 1. Update all selected products to append the new category
      for (const prodId of selectedProductIds) {
        const prod = products.find(p => p._id === prodId);
        if (!prod) continue;
        const existingCats = Array.isArray(prod.category) ? prod.category : [prod.category].filter(Boolean);
        const updatedCats = Array.from(new Set([...existingCats, name]));
        const res = await fetch(`http://127.0.0.1:5001/api/products/${prodId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...prod,
            category: updatedCats
          })
        });
        if (!res.ok) {
          throw new Error(`Failed to update product ${prod.name}`);
        }
      }

      // 2. Add category to custom categories list
      const updated = [...customCategories, name];
      setCustomCategories(updated);
      localStorage.setItem("admin_custom_categories", JSON.stringify(updated));

      // 3. Reset state & close modal
      setNewCategoryName("");
      setSelectedProductIds([]);
      setShowAddCategoryModal(false);

      // 4. Refresh product list
      fetchProducts();
      setSuccessMessage("Category created successfully and products updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setCategoryModalError(err.message || "Something went wrong.");
    } finally {
      setCategoryModalLoading(false);
    }
  };

  const handleRenameCategorySubmit = async () => {
    if (!renameCategoryTarget || !renameCategoryNewName.trim()) return;
    setIsRenamingCategory(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/categories/rename", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName: renameCategoryTarget, newName: renameCategoryNewName.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rename category");

      const defaultCategoriesList = ["Best Seller"];
      if (defaultCategoriesList.includes(renameCategoryTarget)) {
        const updated = [...deletedDefaultCategories, renameCategoryTarget];
        setDeletedDefaultCategories(updated);
        localStorage.setItem("admin_deleted_default_categories", JSON.stringify(updated));
      }

      // Update customCategories to reflect the new name and remove the old name
      const trimmedNewName = renameCategoryNewName.trim();
      const updatedCustomCats = customCategories.filter(c => c !== renameCategoryTarget);
      if (!updatedCustomCats.includes(trimmedNewName)) {
        updatedCustomCats.push(trimmedNewName);
      }
      setCustomCategories(updatedCustomCats);
      localStorage.setItem("admin_custom_categories", JSON.stringify(updatedCustomCats));

      fetchProducts();
      setSuccessMessage("Category renamed successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setRenameCategoryTarget(null);
      setRenameCategoryNewName("");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setIsRenamingCategory(false);
    }
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!deleteCategoryTarget) return;
    setDeleteCategoryLoading(true);
    try {
      // 1. Find all products in this category and remove it from their category list
      const productsToUpdate = products.filter(p => {
        const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean);
        return cats.includes(deleteCategoryTarget);
      });
      for (const prod of productsToUpdate) {
        const existingCats = Array.isArray(prod.category) ? prod.category : [prod.category].filter(Boolean);
        const updatedCats = existingCats.filter(c => c !== deleteCategoryTarget);
        const res = await fetch(`http://127.0.0.1:5001/api/products/${prod._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...prod,
            category: updatedCats
          })
        });
        if (!res.ok) {
          throw new Error(`Failed to update product ${prod.name}`);
        }
      }

      // 2. Remove from customCategories if it's there
      if (customCategories.includes(deleteCategoryTarget)) {
        const updated = customCategories.filter(c => c !== deleteCategoryTarget);
        setCustomCategories(updated);
        localStorage.setItem("admin_custom_categories", JSON.stringify(updated));
      } else {
        // It's a default category, add to deletedDefaultCategories
        const updated = [...deletedDefaultCategories, deleteCategoryTarget];
        setDeletedDefaultCategories(updated);
        localStorage.setItem("admin_deleted_default_categories", JSON.stringify(updated));
      }

      // 3. Reset states & refresh
      setDeleteCategoryTarget(null);
      fetchProducts();
      setSuccessMessage("Category deleted successfully and products unlinked!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    } finally {
      setDeleteCategoryLoading(false);
    }
  };

  const handleAssignExistingToCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryView || existingProductIdsToAssign.length === 0) return;
    setAssignLoading(true);

    try {
      for (const prodId of existingProductIdsToAssign) {
        const prod = products.find(p => p._id === prodId);
        if (!prod) continue;
        const existingCats = Array.isArray(prod.category) ? prod.category : [prod.category].filter(Boolean);
        const updatedCats = Array.from(new Set([...existingCats, selectedCategoryView]));

        const res = await fetch(`http://127.0.0.1:5001/api/products/${prodId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...prod,
            category: updatedCats
          })
        });
        if (!res.ok) {
          throw new Error(`Failed to assign product ${prod.name}`);
        }
      }

      setSuccessMessage("Products added to category successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      setExistingProductIdsToAssign([]);
      setShowAddExistingToCategoryModal(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "Failed to assign products.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/products/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete product");

      setSuccessMessage("Product removed from inventory!");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Delete failed.");
      setTimeout(() => setError(null), 4000);
    }
  };

  // Stats
  const totalProducts = products.length;
  const avgPrice = totalProducts > 0
    ? Math.round(products.reduce((acc, curr) => acc + curr.price, 0) / totalProducts)
    : 0;
  const latestArrivalsCount = products.filter(p => Array.isArray(p.category) ? p.category.includes("Latest Arrivals") : p.category === "Latest Arrivals").length;
  const bestSellersCount = products.filter(p => Array.isArray(p.category) ? p.category.includes("Best Seller") : p.category === "Best Seller").length;

  // Dynamic categories list (sorted A-Z)
  const defaultCategoriesList = ["Best Seller", "Latest Arrivals"];
  const categoriesFromProducts = Array.from(new Set(
    products.flatMap(p => Array.isArray(p.category) ? p.category : [p.category]).filter(c => Boolean(c) && c !== "Latest Arrivals" && c !== "Best Seller")
  ));
  const allCategories = Array.from(new Set([
    ...defaultCategoriesList,
    ...categoriesFromProducts,
    ...customCategories
  ])).sort((a, b) => {
    const isBotA = a === "Best Seller" || a === "Latest Arrivals";
    const isBotB = b === "Best Seller" || b === "Latest Arrivals";
    if (isBotA && !isBotB) return -1;
    if (!isBotA && isBotB) return 1;
    return a.localeCompare(b);
  });

  // Filtered products for search, sorted alphabetically A-Z
  const filteredProducts = products
    .filter(p => {
      const categoryString = Array.isArray(p.category) ? p.category.join(", ") : (p.category || "");
      return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryString.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!authorized) {
    return (
      <div className={styles.authCheckingWrapper}>
        <div className={styles.spinner} />
        <span className={styles.authText}>Verifying Credentials...</span>
      </div>
    );
  }

  const renderResizeHandles = (element: "title" | "manifesto") => {
    if (selectedElement !== element) return null;
    const handleStyle = {
      position: "absolute",
      width: "12px",
      height: "12px",
      backgroundColor: "#ffffff",
      border: "2px solid #3b82f6",
      zIndex: 10,
      boxSizing: "border-box"
    } as React.CSSProperties;

    const handleProps = (dir: string) => ({
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(dir);

        // Calculate the actual DOM height to prevent "dead zones" when minHeight is 0 (auto)
        const parentElem = (e.target as HTMLElement).parentElement;
        const currentHeight = parentElem ? parentElem.getBoundingClientRect().height : (drafts[element].minHeight || 0);

        setResizeStartCoords({
          x: e.clientX,
          y: e.clientY,
          startWidth: drafts[element].maxWidth,
          startHeight: currentHeight,
          startX: drafts[element].positionX,
          startY: drafts[element].positionY
        });
      }
    });

    return (
      <>
        <div style={{ ...handleStyle, top: "-6px", left: "-6px", cursor: "nwse-resize" }} {...handleProps("nw")} />
        <div style={{ ...handleStyle, top: "-6px", left: "calc(50% - 6px)", cursor: "ns-resize" }} {...handleProps("n")} />
        <div style={{ ...handleStyle, top: "-6px", right: "-6px", cursor: "nesw-resize" }} {...handleProps("ne")} />
        <div style={{ ...handleStyle, top: "calc(50% - 6px)", left: "-6px", cursor: "ew-resize" }} {...handleProps("w")} />
        <div style={{ ...handleStyle, top: "calc(50% - 6px)", right: "-6px", cursor: "ew-resize" }} {...handleProps("e")} />
        <div style={{ ...handleStyle, bottom: "-6px", left: "-6px", cursor: "nesw-resize" }} {...handleProps("sw")} />
        <div style={{ ...handleStyle, bottom: "-6px", left: "calc(50% - 6px)", cursor: "ns-resize" }} {...handleProps("s")} />
        <div style={{ ...handleStyle, bottom: "-6px", right: "-6px", cursor: "nwse-resize" }} {...handleProps("se")} />
      </>
    );
  };

  return (
    <div className={styles.adminPageWrapper}>
      
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <span className={styles.brandName}>29sFORMULA</span>
        <button className={styles.hamburgerBtn} onClick={() => setIsMobileMenuOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* 1. Left Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.brandRow}>
            <span className={styles.brandName}>29sFORMULA</span>
          </div>

          <nav className={styles.navMenu}>
            <div
              onClick={() => handleNavigationTrigger("home")}
              className={`${styles.menuItem} ${activeTab === "home" ? styles.menuItemActive : ""}`}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>Dashboard</span>
              </div>
            </div>

            <div>
              <div
                onClick={() => {
                  handleNavigationTrigger("orders");
                  setOrdersDropdownOpen(!ordersDropdownOpen);
                }}
                className={`${styles.menuItem} ${activeTab === "orders" ? styles.menuItemActive : ""}`}
              >
                <div className={styles.menuItemLeft}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801-1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746m-3.41 1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746M12 2.25h.008v.008H12V2.25Zm-5.69 2.192C5.18 4.534 4.5 5.519 4.5 6.708v11.835A2.25 2.25 0 0 0 6.75 20.82h10.5a2.25 2.25 0 0 0 2.25-2.25V6.708c0-1.189-.68-2.174-1.81-2.266m-10.74 0A48.581 48.581 0 0 0 3 4.5" />
                  </svg>
                  <span>Orders</span>
                </div>
              </div>

              {(ordersDropdownOpen || activeTab === "orders") && (
                <div className={styles.subMenuContainer}>
                  {/* Item 1: Active Orders */}
                  <div
                    onClick={() => {
                      setActiveTab("orders");
                      setActiveSubTab("all");
                    }}
                    className={styles.subMenuItem}
                  >
                    {activeTab === "orders" && activeSubTab === "all" ? (
                      <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : activeTab === "orders" && (activeSubTab === "cancelled" || activeSubTab === "completed") ? (
                      <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                    )}
                    <div className={`${styles.subMenuItemCapsule} ${activeTab === "orders" && activeSubTab === "all" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192" />
                        </svg>
                        Active Orders
                      </div>
                    </div>
                  </div>

                  {/* Item 2: Returns */}
                  <div
                    onClick={() => {
                      setActiveTab("orders");
                      setActiveSubTab("cancelled");
                    }}
                    className={styles.subMenuItem}
                  >
                    {activeTab === "orders" && activeSubTab === "cancelled" ? (
                      <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : activeTab === "orders" && activeSubTab === "completed" ? (
                      <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                    )}
                    <div className={`${styles.subMenuItemCapsule} ${activeTab === "orders" && activeSubTab === "cancelled" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Returns
                      </div>
                    </div>
                  </div>

                  {/* Item 3: Completed Orders */}
                  <div
                    onClick={() => {
                      setActiveTab("orders");
                      setActiveSubTab("completed");
                    }}
                    className={styles.subMenuItem}
                  >
                    {activeTab === "orders" && activeSubTab === "completed" ? (
                      <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                    )}
                    <div className={`${styles.subMenuItemCapsule} ${activeTab === "orders" && activeSubTab === "completed" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completed
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div
                onClick={() => {
                  handleNavigationTrigger("products");
                  setProductsDropdownOpen(!productsDropdownOpen);
                }}
                className={`${styles.menuItem} ${activeTab === "products" ? styles.menuItemActive : ""}`}
              >
                <div className={styles.menuItemLeft}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  <span>Products</span>
                </div>
              </div>

              {/* Sub-menu dropdown */}
              {(productsDropdownOpen || activeTab === "products") && (
                <div className={styles.subMenuContainer}>
                  {/* Item 1: All Products */}
                  <div
                    onClick={() => {
                      setActiveTab("products");
                      setActiveSubTab("all");
                    }}
                    className={styles.subMenuItem}
                  >
                    {activeTab === "products" && activeSubTab === "all" ? (
                      <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : activeTab === "products" && activeSubTab === "categories" ? (
                      <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                    )}
                    <div className={`${styles.subMenuItemCapsule} ${activeTab === "products" && activeSubTab === "all" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                      All Products
                    </div>
                  </div>

                  {/* Item 2: Categories */}
                  <div
                    onClick={() => {
                      setActiveTab("products");
                      setActiveSubTab("categories");
                      setSelectedCategoryView(null);
                    }}
                    className={styles.subMenuItem}
                  >
                    {activeTab === "products" && activeSubTab === "categories" ? (
                      <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                    )}
                    <div className={`${styles.subMenuItemCapsule} ${activeTab === "products" && activeSubTab === "categories" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l7.12-7.12a1.125 1.125 0 0 0 0-1.591L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                        </svg>
                        Categories
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              onClick={() => handleNavigationTrigger("customers")}
              className={`${styles.menuItem} ${activeTab === "customers" ? styles.menuItemActive : ""}`}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.947 11.947 0 0 1 12 20c-1.18 0-2.31-.172-3.37-.492v-.271m0-.003c0-1.113.285-2.16.786-3.07M6 16.25a4.125 4.125 0 0 1 7.533 0M6 16.25c0-.18.01-.36.03-.538m10.22 0A10.287 10.287 0 0 0 12 14c-1.8 0-3.486.462-4.966 1.272m0-.112a4.125 4.125 0 0 1 6.536-3.567m-6.536 3.567A8.995 8.995 0 0 1 12 9.75c1.8 0 3.486.462 4.966 1.272M7.5 6a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM5.25 9.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <span>Customers</span>
              </div>
            </div>

            <div
              onClick={() => handleNavigationTrigger("marketing")}
              className={`${styles.menuItem} ${activeTab === "marketing" ? styles.menuItemActive : ""}`}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
                <span>Marketing</span>
              </div>
            </div>

            <div
              onClick={() => handleNavigationTrigger("discounts")}
              className={`${styles.menuItem} ${activeTab === "discounts" ? styles.menuItemActive : ""}`}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3zM6 7.5h.008v.008H6V7.5zM14.25 14.25l3.5-3.5" />
                </svg>
                <span>Discounts</span>
              </div>
            </div>

            <div
              onClick={() => {
                handleNavigationTrigger("online-store");
                setOnlineStoreDropdownOpen(!onlineStoreDropdownOpen);
              }}
              className={`${styles.menuItem} ${activeTab === "online-store" ? styles.menuItemActive : ""}`}
            >
              <div className={styles.menuItemLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
                <span>Online Store</span>
              </div>
            </div>

            {(onlineStoreDropdownOpen || activeTab === "online-store") && (
              <div className={styles.subMenuContainer}>
                {/* Item 1: Landing Page */}
                <div
                  onClick={() => {
                    setActiveTab("online-store");
                    setCustomizeSubTab("landing");
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "online-store" && customizeSubTab === "landing" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (activeTab === "online-store" && (customizeSubTab === "product" || customizeSubTab === "reviews")) ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "online-store" && customizeSubTab === "landing" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                      Landing Page
                    </div>
                  </div>
                </div>

                {/* Item 2: Product Pages */}
                <div
                  onClick={() => {
                    setActiveTab("online-store");
                    setCustomizeSubTab("product");
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "online-store" && customizeSubTab === "product" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (activeTab === "online-store" && customizeSubTab === "reviews") ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 36" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "online-store" && customizeSubTab === "product" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      Product Pages
                    </div>
                  </div>
                </div>

                {/* Item 3: Customer Reviews */}
                <div
                  onClick={() => {
                    setActiveTab("online-store");
                    setCustomizeSubTab("reviews");
                  }}
                  className={styles.subMenuItem}
                >
                  {activeTab === "online-store" && customizeSubTab === "reviews" ? (
                    <svg style={{ display: "block", minWidth: "28px", width: "28px", height: "36px", marginRight: "8px", color: "#d1d5db" }} viewBox="0 0 28 36" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M 12 0 L 12 14 A 4 4 0 0 0 16 18 L 24 18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20 14 L 24 18 L 20 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div style={{ minWidth: "28px", width: "28px", height: "36px", marginRight: "8px" }} />
                  )}
                  <div className={`${styles.subMenuItemCapsule} ${activeTab === "online-store" && customizeSubTab === "reviews" ? styles.subMenuItemCapsuleActive : ""}`} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "13px", height: "13px", marginRight: "6px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      Customer Reviews
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>

        <a href="#" onClick={(e) => { e.preventDefault(); handleNavigationTrigger("logout"); }} className={styles.logoutLink}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.menuIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span>Logout</span>
        </a>
      </aside>

      {/* 2. Main Page Content Wrapper */}
      <div className={styles.mainWrapper}>

        {/* Top bar with search input */}
        <header className={styles.topNavbar}>
          <div className={styles.searchBar}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.searchIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602Z" />
            </svg>
            <input
              type="text"
              placeholder="Search something"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.navRightInfo}>
            <div className={styles.avatar}>A</div>
          </div>
        </header>

        {/* Dynamic tabs render content */}
        <div className={styles.scrollableContent}>

          {activeTab === "home" && (
            <div className={styles.viewContainer}>
              <h1 className={styles.pageHeading}>Dashboard</h1>

              {/* Stats widgets layout row */}
              <section className={styles.statsRow}>
                {/* Stat 1 */}
                <div className={styles.statBox}>
                  <div className={styles.statTop}>
                    <div className={styles.statLabelBlock}>
                      <span className={styles.statLabelText}>Total Orders</span>
                      <span className={`${styles.trendTag} ${styles.trendUp}`}>
                        -
                      </span>
                    </div>
                    <button className={styles.trendArrowCircle}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.trendArrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </button>
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statValueText}>
                      {dashboardStats ? dashboardStats.totalSales.toLocaleString() : "0"}
                    </span>
                    <div className={styles.sparkline}>
                      <svg viewBox="0 0 120 40" className={styles.sparkSvg}>
                        <defs>
                          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={generateSparklinePath(dashboardStats?.historicalData || [], "orders", 120, 0, 5, 40, true)} fill="url(#blueGrad)" />
                        <path d={generateSparklinePath(dashboardStats?.historicalData || [], "orders", 120, 0, 5, 40, false)} fill="none" stroke="#4f46e5" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Stat 1.5: Profit */}
                <div className={styles.statBox}>
                  <div className={styles.statTop}>
                    <div className={styles.statLabelBlock}>
                      <span className={styles.statLabelText}>Total Profit</span>
                      <span className={`${styles.trendTag} ${styles.trendUp}`}>
                        -
                      </span>
                    </div>
                    <button className={styles.trendArrowCircle}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.trendArrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </button>
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statValueText}>
                      ₹{dashboardStats ? (dashboardStats.totalProfitThisMonth || 0).toLocaleString("en-IN") : "0"}
                    </span>
                    <div className={styles.sparkline}>
                      <svg viewBox="0 0 120 40" className={styles.sparkSvg}>
                        <defs>
                          <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={generateSparklinePath(dashboardStats?.historicalData || [], "sales", 120, 0, 5, 40, true)} fill="url(#greenGrad)" />
                        <path d={generateSparklinePath(dashboardStats?.historicalData || [], "sales", 120, 0, 5, 40, false)} fill="none" stroke="#10b981" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className={styles.statBox}>
                  <div className={styles.statTop}>
                    <div className={styles.statLabelBlock}>
                      <span className={styles.statLabelText}>Total Revenue</span>
                      <span className={`${styles.trendTag} ${styles.trendDown}`}>
                        -
                      </span>
                    </div>
                    <button className={styles.trendArrowCircle}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.trendArrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </button>
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statValueText}>
                      ₹{dashboardStats ? dashboardStats.totalIncome.toLocaleString("en-IN") : "0"}
                    </span>
                    <div className={styles.sparkline}>
                      <svg viewBox="0 0 120 40" className={styles.sparkSvg}>
                        <defs>
                          <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#eab308" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={generateSparklinePath(dashboardStats?.historicalData || [], "sales", 120, 0, 5, 40, true)} fill="url(#orangeGrad)" />
                        <path d={generateSparklinePath(dashboardStats?.historicalData || [], "sales", 120, 0, 5, 40, false)} fill="none" stroke="#eab308" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div 
                  className={styles.statBox} 
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setActiveTab("orders");
                    setActiveSubTab("all");
                  }}
                >
                  <div className={styles.statTop}>
                    <div className={styles.statLabelBlock}>
                      <span className={styles.statLabelText}>Active Orders</span>
                      <span className={`${styles.trendTag} ${styles.trendUp}`}>
                        -
                      </span>
                    </div>
                    <button className={styles.trendArrowCircle}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.trendArrowIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </button>
                  </div>
                  <div className={styles.statBottom}>
                    <span className={styles.statValueText}>
                      {dashboardStats ? dashboardStats.activeOrders.toLocaleString() : "0"}
                    </span>
                    <div className={styles.sparkline}>
                      <svg viewBox="0 0 120 40" className={styles.sparkSvg}>
                        <defs>
                          <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={generateSparklinePath(dashboardStats?.historicalData || [], "orders", 120, 0, 5, 40, true)} fill="url(#redGrad)" />
                        <path d={generateSparklinePath(dashboardStats?.historicalData || [], "orders", 120, 0, 5, 40, false)} fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </section>

              {/* Middle Row Charts Section */}
              <section className={styles.chartPanelGrid}>
                {/* Main Curve Chart */}
                <div className={styles.chartContainerCard}>
                  <div className={styles.chartHeader}>
                    <div className={styles.chartHeaderLeft}>
                      <span className={styles.chartHeaderLabel}>Sales Chart</span>
                      <div className={styles.chartValueRow}>
                        <span className={styles.chartMainValue}>₹{dashboardStats ? dashboardStats.totalIncome.toLocaleString("en-IN") : "0"}</span>
                        <span className={styles.chartTrendTag}>-</span>
                      </div>
                    </div>
                    <div className={styles.chartHeaderRight}>
                      <div className={styles.legendRow}>
                        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendBlack}`} />Sales</span>
                        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendPurple}`} />Orders</span>
                        <span className={styles.legendItem}><span className={styles.legendDot} style={{ backgroundColor: "#10b981" }} />Profit</span>
                      </div>
                      <select className={styles.chartSelect}>
                        <option>Last 30 Days</option>
                      </select>
                    </div>
                  </div>

                  {/* Bezier SVG Line Chart */}
                  <div className={styles.chartCanvasArea}>
                    <svg viewBox="0 0 800 240" className={styles.mainSvgChart}>
                      {/* Grid Lines */}
                      <line x1="40" y1="30" x2="760" y2="30" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="40" y1="65" x2="760" y2="65" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="40" y1="100" x2="760" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="40" y1="135" x2="760" y2="135" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="40" y1="170" x2="760" y2="170" stroke="#f3f4f6" strokeWidth="1" />
                      <line x1="40" y1="205" x2="760" y2="205" stroke="#f3f4f6" strokeWidth="1" />



                      {/* Bottom Date Labels */}
                      {dashboardStats?.historicalData?.map((d, i) => {
                        const totalPoints = dashboardStats.historicalData?.length || 1;
                        const step = 700 / Math.max(totalPoints - 1, 1);
                        // For 30 days, skip labels to prevent overlap (e.g. show every 4th label and the very last one)
                        if (totalPoints > 15 && i % 4 !== 0 && i !== totalPoints - 1) return null;
                        return (
                          <text key={i} x={50 + i * step} y="235" className={styles.axisText} textAnchor="middle">{d.date}</text>
                        );
                      })}

                      {/* Line 1: Sales (Black Line) */}
                      <path
                        d={generateChartPath(dashboardStats?.historicalData || [], "sales", 750, 50, 30, 205)}
                        fill="none"
                        stroke="#000000"
                        strokeWidth="3"
                      />

                      {/* Line 2: Orders (Purple Line) */}
                      <path
                        d={generateChartPath(dashboardStats?.historicalData || [], "orders", 750, 50, 30, 205)}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3"
                        opacity="0.6"
                      />

                      {/* Line 3: Profit (Green Line) */}
                      <path
                        d={generateChartPath(dashboardStats?.historicalData || [], "profit", 750, 50, 30, 205)}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        opacity="0.8"
                      />
                    </svg>
                  </div>
                </div>

                {/* Right Top Products Widget */}
                <div className={styles.topProductsCard}>
                  <h3 className={styles.topProductsTitle}>Top Products</h3>
                  <div className={styles.topProductsList}>
                    {!dashboardStats ? (
                      <p>Loading products...</p>
                    ) : dashboardStats.topProducts.length === 0 ? (
                      <p className={styles.emptyText}>No cataloged entries found.</p>
                    ) : (
                      dashboardStats.topProducts.map((item) => (
                        <div key={item._id} className={styles.topProductItem}>
                          <img
                            src={item.imageFront}
                            alt={item.name}
                            className={styles.productThumbSmall}
                          />
                          <div className={styles.productMetaSmall}>
                            <span className={styles.productTitleSmall}>{item.name}</span>
                            <span className={styles.productSalesSmall}>100 Items sold</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "orders" && (
            <div className={styles.viewContainer} style={{ gap: "16px", marginTop: "-12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {activeSubTab === "cancelled" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : activeSubTab === "completed" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801-1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746m-3.41 1.25c.028-.392.35-.746.78-.746h2c.43 0 .752.354.78.746M12 2.25h.008v.008H12V2.25Zm-5.69 2.192C5.18 4.534 4.5 5.519 4.5 6.708v11.835A2.25 2.25 0 0 0 6.75 20.82h10.5a2.25 2.25 0 0 0 2.25-2.25V6.708c0-1.189-.68-2.174-1.81-2.266m-10.74 0A48.581 48.581 0 0 0 3 4.5" />
                    </svg>
                  )}
                  <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>
                    {activeSubTab === "cancelled" ? "Returns" : activeSubTab === "completed" ? "Completed" : "Active Orders"}
                  </h1>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {activeSubTab === "cancelled" ? (
                    <div style={{ position: "relative" }}>
                      <div
                        onClick={() => setIsRefundFilterOpen(!isRefundFilterOpen)}
                        className={styles.selectInput}
                        style={{ padding: "6px 12px", minHeight: "36px", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: "160px" }}
                      >
                        {refundStatusFilter === "All" ? "All Refund Statuses" : refundStatusFilter}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#6b7280" style={{ width: "14px", height: "14px", transform: isRefundFilterOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                      {isRefundFilterOpen && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setIsRefundFilterOpen(false)} />
                          <div style={{ position: "absolute", top: "42px", left: 0, width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", zIndex: 110, overflow: "hidden" }}>
                            {["All", "Refunded", "Not Refunded"].map((opt) => (
                              <div
                                key={opt}
                                onClick={() => { setRefundStatusFilter(opt); setIsRefundFilterOpen(false); }}
                                style={{
                                  padding: "8px 12px",
                                  fontSize: "0.85rem",
                                  cursor: "pointer",
                                  backgroundColor: refundStatusFilter === opt ? "#eff6ff" : "transparent",
                                  color: refundStatusFilter === opt ? "#2563eb" : "#374151",
                                  fontWeight: refundStatusFilter === opt ? 600 : 400
                                }}
                                onMouseEnter={(e) => { if (refundStatusFilter !== opt) e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                                onMouseLeave={(e) => { if (refundStatusFilter !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                              >
                                {opt === "All" ? "All Refund Statuses" : opt}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div style={{ position: "relative" }}>
                      <div
                        onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                        className={styles.selectInput}
                        style={{ padding: "6px 12px", minHeight: "36px", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: "140px" }}
                      >
                        {orderStatusFilter === "All" ? "All Statuses" : orderStatusFilter}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#6b7280" style={{ width: "14px", height: "14px", transform: isStatusFilterOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                      {isStatusFilterOpen && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setIsStatusFilterOpen(false)} />
                          <div style={{ position: "absolute", top: "42px", left: 0, width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", zIndex: 110, overflow: "hidden" }}>
                            {["All", "Processing", "Shipped"].map((opt) => (
                              <div
                                key={opt}
                                onClick={() => { setOrderStatusFilter(opt); setIsStatusFilterOpen(false); }}
                                style={{
                                  padding: "8px 12px",
                                  fontSize: "0.85rem",
                                  cursor: "pointer",
                                  backgroundColor: orderStatusFilter === opt ? "#eff6ff" : "transparent",
                                  color: orderStatusFilter === opt ? "#2563eb" : "#374151",
                                  fontWeight: orderStatusFilter === opt ? 600 : 400
                                }}
                                onMouseEnter={(e) => { if (orderStatusFilter !== opt) e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                                onMouseLeave={(e) => { if (orderStatusFilter !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                              >
                                {opt === "All" ? "All Statuses" : opt}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <button
                    onClick={fetchOrders}
                    className={styles.addPerfumeBtn}
                    title="Reload Orders"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>

              <div className={styles.tablePanelFull}>
                <div className={styles.dashboardCard}>
                  <h2 className={styles.cardHeaderTitle}>
                    {activeSubTab === "cancelled" ? "Returns" : activeSubTab === "completed" ? "Completed" : "Customer Orders"}
                  </h2>

                  {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No orders placed in the system yet. Placed orders will show up here in real-time.</p>
                    </div>
                  ) : (
                    <div className={styles.tableResponsive} style={{ overflow: openStatusDropdownId ? "visible" : "auto" }}>
                      <table className={styles.inventoryTable}>
                        <thead>
                          <tr>
                            <th>OrderId</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Order Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders
                            .filter(o => !o.deletedByAdmin)
                            .filter(o => {
                              if (activeSubTab === "cancelled") {
                                const matchesRefund = refundStatusFilter === "All" || (o.refundStatus || "Not Refunded") === refundStatusFilter;
                                return o.status === "Cancelled" && matchesRefund;
                              } else if (activeSubTab === "completed") {
                                return o.status === "Delivered";
                              } else {
                                const matchesStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
                                return o.status !== "Cancelled" && o.status !== "Delivered" && matchesStatus;
                              }
                            })
                            .filter(o =>
                              o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((order, idx, arr) => {
                              const openUpwards = arr.length > 0 && idx >= arr.length - 2;
                              return (
                                <tr key={order._id}>
                                  <td>
                                    <span className={styles.tableName}>{order.orderId}</span>
                                  </td>
                                  <td>
                                    <span className={styles.tableName}>{order.customerName}</span>
                                    <span className={styles.tableDesc}>{order.customerEmail}</span>
                                  </td>
                                  <td style={{ fontWeight: 700 }}>
                                    ₹{order.totalAmount.toLocaleString("en-IN")}.00
                                  </td>
                                  <td>
                                    <span className={styles.tableDesc} style={{ whiteSpace: "normal" }}>
                                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                      })}
                                    </span>
                                  </td>
                                  <td>
                                    <span style={{
                                      display: "inline-block",
                                      padding: "4px 8px",
                                      borderRadius: "12px",
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                      backgroundColor: order.status === "Delivered" ? "#eaf7ee" : order.status === "Shipped" ? "#eff6ff" : "#fef3c7",
                                      color: order.status === "Delivered" ? "#15803d" : order.status === "Shipped" ? "#1d4ed8" : "#b45309"
                                    }}>
                                      {order.status}
                                    </span>
                                  </td>
                                  <td>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                      <div style={{ position: "relative" }}>
                                        <div
                                          onClick={() => setOpenStatusDropdownId(openStatusDropdownId === order._id ? null : order._id)}
                                          className={styles.selectInput}
                                          style={{ padding: "4px 8px", fontSize: "0.8rem", cursor: "pointer", minWidth: "110px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                        >
                                          {order.status}
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#6b7280" style={{ width: "12px", height: "12px", transform: openStatusDropdownId === order._id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                          </svg>
                                        </div>

                                        {openStatusDropdownId === order._id && (
                                          <>
                                            <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setOpenStatusDropdownId(null)} />
                                            <div style={{
                                              position: "absolute",
                                              left: 0,
                                              minWidth: "120px",
                                              background: "#fff",
                                              border: "1px solid #e5e7eb",
                                              borderRadius: "8px",
                                              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                              zIndex: 9999,
                                              overflow: "hidden",
                                              top: "100%",
                                              marginTop: "4px"
                                            }}>
                                              {["Processing", "Shipped", "Delivered"].map((opt) => (
                                                <div
                                                  key={opt}
                                                  onClick={() => { handleUpdateOrderStatus(order._id, opt); setOpenStatusDropdownId(null); }}
                                                  style={{
                                                    padding: "6px 12px",
                                                    fontSize: "0.8rem",
                                                    cursor: "pointer",
                                                    backgroundColor: order.status === opt ? "#eff6ff" : "transparent",
                                                    color: order.status === opt ? "#2563eb" : "#374151",
                                                    fontWeight: order.status === opt ? 600 : 400
                                                  }}
                                                  onMouseEnter={(e) => { if (order.status !== opt) e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                                                  onMouseLeave={(e) => { if (order.status !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                                                >
                                                  {opt}
                                                </div>
                                              ))}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => setSelectedOrder(order)}
                                        title="View Order Details"
                                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "#4b5563", padding: "4px" }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteOrder(order._id)}
                                        title="Delete Order"
                                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && activeSubTab === "all" && (
            <div className={styles.viewContainer} style={{ gap: "16px", marginTop: "-12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>Products</h1>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                    setShowCrudModal(true);
                  }}
                  className={styles.addPerfumeBtn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add new product
                </button>
              </div>

              {error && !showCrudModal && <div className={styles.errorBanner} style={{ marginBottom: "20px" }}>{error}</div>}

              {/* Centered Table Panel */}
              <div className={styles.tablePanelFull}>
                <div className={styles.dashboardCard}>
                  <h2 className={styles.cardHeaderTitle}>All Products</h2>

                  {loading ? (
                    <div className={styles.loadingState}>
                      <div className={styles.spinner} />
                      <p>Loading database inventory...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No perfumes cataloged. Create your first product by clicking &quot;Add new product&quot; above!</p>
                    </div>
                  ) : (
                    <div className={styles.tableResponsive}>
                      <table className={styles.inventoryTable}>
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Cover</th>
                            <th>ProductDetails</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => {
                            const hasVariants = (product.options && product.options.length > 0) || (product.variants && product.variants.length > 0);
                            const variantsList = product.options && product.options.length > 0 ? product.options : (product.variants || []);
                            const isExpanded = expandedProducts.has(product._id!);

                            return (
                              <React.Fragment key={product._id}>
                                <tr>
                                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    {hasVariants && (
                                      <button
                                        onClick={() => toggleExpand(product._id!)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title={isExpanded ? "Hide Variants" : "Show Variants"}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={2.5}
                                          stroke="currentColor"
                                          style={{ width: "16px", height: "16px", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                      </button>
                                    )}
                                  </td>
                                  <td>
                                    <img
                                      src={product.imageFront}
                                      alt={product.name}
                                      className={styles.tableThumb}
                                    />
                                  </td>
                                  <td>
                                    <span className={styles.tableName}>{product.name}</span>
                                    <span className={styles.tableDesc}>{product.description || "No description set"}</span>
                                  </td>
                                  <td>
                                    <div style={{ fontSize: "0.82rem", color: "#374151" }}>
                                      {(() => {
                                        const cats = Array.isArray(product.category) ? product.category : [product.category].filter(Boolean);
                                        if (cats.length === 0) return <span style={{ color: "#9ca3af" }}>Uncategorized</span>;
                                        const firstCat = cats[0];
                                        const remainingCount = cats.length - 1;
                                        return (
                                          <>
                                            <span>{firstCat}</span>
                                            {remainingCount > 0 && (
                                              <div style={{ position: "relative", display: "inline-block" }}>
                                                <span
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveCategoryPopoverProductId(
                                                      activeCategoryPopoverProductId === product._id ? null : (product._id || null)
                                                    );
                                                  }}
                                                  style={{
                                                    color: "#4f46e5",
                                                    fontWeight: 700,
                                                    marginLeft: "4px",
                                                    cursor: "pointer",
                                                    textDecoration: "underline"
                                                  }}
                                                  title="Click to view remaining categories"
                                                >
                                                  +{remainingCount}
                                                </span>
                                                {activeCategoryPopoverProductId === product._id && (
                                                  <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                      position: "absolute",
                                                      top: "20px",
                                                      left: "0",
                                                      backgroundColor: "#ffffff",
                                                      border: "1px solid #e5e7eb",
                                                      borderRadius: "8px",
                                                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                                      padding: "10px",
                                                      zIndex: 100,
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      gap: "6px",
                                                      minWidth: "150px"
                                                    }}
                                                  >
                                                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", paddingBottom: "4px", borderBottom: "1px solid #f3f4f6", marginBottom: "2px" }}>Other Categories</span>
                                                    {cats.slice(1).map(cat => (
                                                      <span key={cat} style={{ fontSize: "0.8rem", color: "#111827" }}>
                                                        {cat}
                                                      </span>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </td>
                                  <td>
                                    <span className={styles.tablePrice}>
                                      {(() => {
                                        if (hasVariants && variantsList.length > 0) {
                                          const prices = variantsList.map((v: any) => Number(v.price)).filter((p: number) => !isNaN(p));
                                          if (prices.length > 0) {
                                            const min = Math.min(...prices);
                                            const max = Math.max(...prices);
                                            return min === max
                                              ? `₹${min.toLocaleString("en-IN")}`
                                              : `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
                                          }
                                        }
                                        return `₹${Number(product.price).toLocaleString("en-IN")}`;
                                      })()}
                                    </span>
                                  </td>
                                  <td>
                                    <span style={{
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      color: (product.quantity !== undefined ? Number(product.quantity) : 0) <= 3 ? "#dc2626" : (product.quantity !== undefined ? Number(product.quantity) : 0) <= 10 ? "#d97706" : "#374151"
                                    }}>
                                      {product.quantity !== undefined ? product.quantity : 0}
                                    </span>
                                  </td>
                                  <td>
                                    <div className={styles.actionGroup}>
                                      <button
                                        onClick={() => handleEdit(product)}
                                        className={styles.editActionBtn}
                                        style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                        title="Edit Product"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => setDeleteTargetId(product._id!)}
                                        className={styles.deleteActionBtn}
                                        style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                        title="Delete Product"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && hasVariants && variantsList.map((v, i) => (
                                  <tr key={`variant-${product._id}-${i}`} style={{ backgroundColor: "#f9fafb", borderBottom: i === variantsList.length - 1 ? "1px solid #e5e7eb" : "1px solid #f3f4f6" }}>
                                    <td></td>
                                    <td></td>
                                    <td colSpan={2}>
                                      <span style={{ fontSize: "0.85rem", color: "#4b5563", fontWeight: 500 }}>Variant: {v.size}</span>
                                    </td>
                                    <td>
                                      <span className={styles.tablePrice} style={{ fontSize: "0.85rem" }}>₹{Number(v.price).toLocaleString("en-IN")}</span>
                                    </td>
                                    <td>
                                      <span style={{
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        color: Number(v.quantity) <= 3 ? "#dc2626" : Number(v.quantity) <= 10 ? "#d97706" : "#374151"
                                      }}>
                                        {v.quantity}
                                      </span>
                                    </td>
                                    <td>
                                      <div className={styles.actionGroup}>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                          className={styles.editActionBtn}
                                          style={{ padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                          title="Edit Variant"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setDeleteTargetId(product._id!); }}
                                          className={styles.deleteActionBtn}
                                          style={{ padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                          title="Delete Variant"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && activeSubTab === "categories" && (
            selectedCategoryView ? (
              <div key={`cat-detail-${selectedCategoryView}`} className={styles.viewContainerSlideRight} style={{ gap: "16px", marginTop: "-12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <button
                      onClick={() => setSelectedCategoryView(null)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                      title="Back to Categories"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderLeft: "1px solid #e5e7eb", paddingLeft: "15px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l7.12-7.12a1.125 1.125 0 0 0 0-1.591L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                      </svg>
                      <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>{selectedCategoryView} Collection</h1>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCategoryAddOptionsModal(true);
                    }}
                    className={styles.addPerfumeBtn}
                    style={{ padding: "8px 16px", fontSize: "0.7rem" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new product
                  </button>
                </div>

                {/* Category catalog inventory */}
                <div className={styles.tablePanelFull}>
                  <div className={styles.dashboardCard}>
                    <h2 className={styles.cardHeaderTitle}>Category Catalog Inventory</h2>
                    {products.filter(p => Array.isArray(p.category) ? p.category.includes(selectedCategoryView) : p.category === selectedCategoryView).length === 0 ? (
                      <div className={styles.emptyState} style={{ padding: "40px 20px" }}>
                        <p>No products cataloged in this category yet. Click &quot;Add new product&quot; above to create one!</p>
                      </div>
                    ) : (
                      <div className={styles.tableResponsive}>
                        <table className={styles.inventoryTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '40px' }}></th>
                              <th>Cover</th>
                              <th>ProductDetails</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Making Price</th>
                              <th>Stock</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products
                              .filter(p => Array.isArray(p.category) ? p.category.includes(selectedCategoryView) : p.category === selectedCategoryView)
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((product) => {
                                const hasVariants = (product.options && product.options.length > 0) || (product.variants && product.variants.length > 0);
                                const variantsList = product.options && product.options.length > 0 ? product.options : (product.variants || []);
                                const isExpanded = expandedProducts.has(product._id!);

                                return (
                                  <React.Fragment key={product._id}>
                                    <tr>
                                      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                        {hasVariants && (
                                          <button
                                            onClick={() => toggleExpand(product._id!)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            title={isExpanded ? "Hide Variants" : "Show Variants"}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth={2.5}
                                              stroke="currentColor"
                                              style={{ width: "16px", height: "16px", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                                            >
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                            </svg>
                                          </button>
                                        )}
                                      </td>
                                      <td>
                                        <img
                                          src={product.imageFront}
                                          alt={product.name}
                                          className={styles.tableThumb}
                                        />
                                      </td>
                                      <td>
                                        <span className={styles.tableName}>{product.name}</span>
                                        <span className={styles.tableDesc}>{product.description || "No description set"}</span>
                                      </td>
                                      <td>
                                        <div style={{ fontSize: "0.82rem", color: "#374151" }}>
                                          {(() => {
                                            const cats = Array.isArray(product.category) ? product.category : [product.category].filter(Boolean);
                                            if (cats.length === 0) return <span style={{ color: "#9ca3af" }}>Uncategorized</span>;
                                            const firstCat = cats[0];
                                            const remainingCount = cats.length - 1;
                                            return (
                                              <>
                                                <span>{firstCat}</span>
                                                {remainingCount > 0 && (
                                                  <div style={{ position: "relative", display: "inline-block" }}>
                                                    <span
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveCategoryPopoverProductId(
                                                          activeCategoryPopoverProductId === product._id ? null : (product._id || null)
                                                        );
                                                      }}
                                                      style={{
                                                        color: "#4f46e5",
                                                        fontWeight: 700,
                                                        marginLeft: "4px",
                                                        cursor: "pointer",
                                                        textDecoration: "underline"
                                                      }}
                                                      title="Click to view remaining categories"
                                                    >
                                                      +{remainingCount}
                                                    </span>
                                                    {activeCategoryPopoverProductId === product._id && (
                                                      <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                          position: "absolute",
                                                          top: "20px",
                                                          left: "0",
                                                          backgroundColor: "#ffffff",
                                                          border: "1px solid #e5e7eb",
                                                          borderRadius: "8px",
                                                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                                          padding: "10px",
                                                          zIndex: 100,
                                                          display: "flex",
                                                          flexDirection: "column",
                                                          gap: "6px",
                                                          minWidth: "150px"
                                                        }}
                                                      >
                                                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", paddingBottom: "4px", borderBottom: "1px solid #f3f4f6", marginBottom: "2px" }}>Other Categories</span>
                                                        {cats.slice(1).map(cat => (
                                                          <span key={cat} style={{ fontSize: "0.8rem", color: "#111827" }}>
                                                            {cat}
                                                          </span>
                                                        ))}
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </>
                                            );
                                          })()}
                                        </div>
                                      </td>
                                      <td>
                                        <span className={styles.tablePrice}>
                                          {(() => {
                                            if (hasVariants && variantsList.length > 0) {
                                              const prices = variantsList.map((v: any) => Number(v.price)).filter((p: number) => !isNaN(p));
                                              if (prices.length > 0) {
                                                const min = Math.min(...prices);
                                                const max = Math.max(...prices);
                                                return min === max
                                                  ? `₹${min.toLocaleString("en-IN")}`
                                                  : `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
                                              }
                                            }
                                            return `₹${Number(product.price).toLocaleString("en-IN")}`;
                                          })()}
                                        </span>
                                      </td>
                                      <td>
                                        <span className={styles.tablePrice}>
                                          {(() => {
                                            if (hasVariants && variantsList.length > 0) {
                                              const makingPrices = variantsList.map((v: any) => Number(v.makingPrice)).filter((p: number) => !isNaN(p));
                                              if (makingPrices.length > 0) {
                                                const min = Math.min(...makingPrices);
                                                const max = Math.max(...makingPrices);
                                                return min === max
                                                  ? `₹${min.toLocaleString("en-IN")}`
                                                  : `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
                                              }
                                            }
                                            return `₹${Number(product.makingPrice || 0).toLocaleString("en-IN")}`;
                                          })()}
                                        </span>
                                      </td>
                                      <td>
                                        <span style={{
                                          fontSize: "0.85rem",
                                          fontWeight: 600,
                                          color: (product.quantity !== undefined ? Number(product.quantity) : 0) <= 3 ? "#dc2626" : (product.quantity !== undefined ? Number(product.quantity) : 0) <= 10 ? "#d97706" : "#374151"
                                        }}>
                                          {product.quantity !== undefined ? product.quantity : 0}
                                        </span>
                                      </td>
                                      <td>
                                        <div className={styles.actionGroup}>
                                          <button
                                            onClick={() => handleEdit(product)}
                                            className={styles.editActionBtn}
                                            style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                            title="Edit Product"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => setDeleteTargetId(product._id!)}
                                            className={styles.deleteActionBtn}
                                            style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                            title="Delete Product"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                    {isExpanded && hasVariants && variantsList.map((v, i) => (
                                      <tr key={`variant-${product._id}-${i}`} style={{ backgroundColor: "#f9fafb", borderBottom: i === variantsList.length - 1 ? "1px solid #e5e7eb" : "1px solid #f3f4f6" }}>
                                        <td></td>
                                        <td></td>
                                        <td colSpan={2}>
                                          <span style={{ fontSize: "0.85rem", color: "#4b5563", fontWeight: 500 }}>Variant: {v.size}</span>
                                        </td>
                                        <td>
                                          <span className={styles.tablePrice} style={{ fontSize: "0.85rem" }}>₹{Number(v.price).toLocaleString("en-IN")}</span>
                                        </td>
                                        <td>
                                          <span className={styles.tablePrice} style={{ fontSize: "0.85rem", color: "#6b7280" }}>₹{Number(v.makingPrice || 0).toLocaleString("en-IN")}</span>
                                        </td>
                                        <td>
                                          <span style={{
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            color: Number(v.quantity) <= 3 ? "#dc2626" : Number(v.quantity) <= 10 ? "#d97706" : "#374151"
                                          }}>
                                            {v.quantity}
                                          </span>
                                        </td>
                                        <td>
                                          <div className={styles.actionGroup}>
                                            <button
                                              onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                              className={styles.editActionBtn}
                                              style={{ padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                              title="Edit Variant"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={(e) => { e.stopPropagation(); setDeleteTargetId(product._id!); }}
                                              className={styles.deleteActionBtn}
                                              style={{ padding: "5px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                              title="Delete Variant"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                              </svg>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </React.Fragment>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div key="cat-list" className={styles.viewContainerSlideLeft} style={{ gap: "16px", marginTop: "-12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l7.12-7.12a1.125 1.125 0 0 0 0-1.591L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                    </svg>
                    <h1 className={styles.pageHeading} style={{ margin: 0, fontSize: "1.25rem" }}>Categories</h1>
                  </div>
                  <button
                    onClick={() => {
                      setNewCategoryName("");
                      setSelectedProductIds([]);
                      setCategoryModalError(null);
                      setShowAddCategoryModal(true);
                    }}
                    className={styles.addPerfumeBtn}
                    style={{ padding: "8px 16px", fontSize: "0.7rem" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add New Category
                  </button>
                </div>

                {/* Categories list panel */}
                <div className={styles.tablePanelFull}>
                  <div className={styles.dashboardCard}>
                    <h2 className={styles.cardHeaderTitle}>All Categories</h2>
                    <div className={styles.tableResponsive}>
                      <table className={styles.inventoryTable}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left" }}>CategoryName</th>
                            <th style={{ textAlign: "center" }}>ProductsCount</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allCategories.map(catName => (
                            <tr key={catName}>
                              <td style={{ textAlign: "left" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px", color: "#6b7280" }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.591 0l7.12-7.12a1.125 1.125 0 0 0 0-1.591L11.159 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                                  </svg>
                                  <strong>{catName}</strong>
                                </div>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <span className={styles.badgeCount} style={{ display: "inline-block", padding: "4px 10px", fontSize: "0.85rem", background: "#f3f4f6", color: "#000", borderRadius: "20px" }}>
                                  {products.filter(p => Array.isArray(p.category) ? p.category.includes(catName) : p.category === catName).length} products
                                </span>
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end" }}>
                                  <button
                                    onClick={() => {
                                      setSelectedCategoryView(catName);
                                    }}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      cursor: "pointer",
                                      color: "#4b5563",
                                      padding: "6px",
                                      borderRadius: "4px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "background-color 0.2s, color 0.2s"
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                    title="View Products"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRenameCategoryTarget(catName);
                                      setRenameCategoryNewName(catName);
                                    }}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      cursor: "pointer",
                                      color: "#4b5563",
                                      padding: "6px",
                                      borderRadius: "4px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "background-color 0.2s, color 0.2s"
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                    title="Edit Category"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                  </button>
                                  {catName !== "Latest Arrivals" && catName !== "Best Seller" && (
                                    <button
                                      onClick={() => setDeleteCategoryTarget(catName)}
                                      style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#ef4444",
                                        padding: "6px",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "background-color 0.2s, color 0.2s"
                                      }}
                                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                      title="Delete Category"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {activeTab === "online-store" && (
            <div className={styles.viewContainer}>
              <div>
                <h1 className={styles.pageHeading} style={{ margin: 0 }}>
                  {customizeSubTab === "landing" ? "Landing Page" : customizeSubTab === "product" ? "Product Pages" : "Customer Reviews"}
                </h1>
              </div>





              <div className={customizeSubTab === "reviews" ? "" : styles.customizerContainer}>
                {error && <div className={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleSaveSettings} className={styles.customizerForm}>
                  {/* SUB TAB 1: LANDING PAGE CUSTOMIZER */}
                  {customizeSubTab === "landing" && (
                    <>


                      {/* Card 2: Hero branding */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "hero" ? null : "hero")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Hero Section Copy</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "hero" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "hero" && (
                          <div className={styles.accordionContent}>
                            <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <label className={styles.inputLabel}>Brand Header Title</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHeroBackup({
                                      heroTitle,
                                      heroManifesto,
                                      heroTemplate,
                                      showHeroTitle,
                                      showHeroManifesto,
                                      showHeroButton,
                                      heroButtonText,
                                      heroButtonStyle,
                                      heroButtonSize,
                                      heroButtonColor,
                                      heroButtonTextColor,
                                      heroTitleFontType,
                                      heroTitleFontColor,
                                      heroTitleFontSize,
                                      heroTitleFontAlignment,
                                      heroTitleFontWeight,
                                      heroManifestoFontType,
                                      heroManifestoFontColor,
                                      heroManifestoFontSize,
                                      heroManifestoFontAlignment,
                                      heroManifestoFontWeight,
                                    });
                                    setDrafts({
                                      title: { fontType: heroTitleFontType, fontSize: selectedElement === "title" && hoveredFontSize ? hoveredFontSize : heroTitleFontSize, fontColor: heroTitleFontColor, fontAlignment: heroTitleFontAlignment, fontWeight: heroTitleFontWeight, fontVerticalAlignment: 'bottom', positionX: 0, positionY: 0, maxWidth: 100, minHeight: 0 },
                                      manifesto: { fontType: heroManifestoFontType, fontSize: selectedElement === "manifesto" && hoveredFontSize ? hoveredFontSize : heroManifestoFontSize, fontColor: heroManifestoFontColor, fontAlignment: heroManifestoFontAlignment, fontWeight: heroManifestoFontWeight, fontVerticalAlignment: 'top', positionX: 0, positionY: 0, maxWidth: 100, minHeight: 0 },
                                      button: { fontType: "Outfit", fontSize: "0.85rem", fontColor: "#ffffff", fontAlignment: "center", fontWeight: "700", fontVerticalAlignment: "middle", positionX: 0, positionY: 0, maxWidth: 100, minHeight: 0 }
                                    });
                                    setSelectedElement("title");
                                    setShowHeroTitleFontOptions(true);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#3b82f6",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "0.82rem",
                                    fontWeight: 600,
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    transition: "background 0.2s"
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#eff6ff"}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                  {/* Edit Pencil Icon */}
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "14px", height: "14px" }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                  </svg>
                                  <span>Customize Layout & Styling</span>
                                </button>
                              </div>
                              <div style={{ display: "flex", gap: "8px", position: "relative" }}>
                                <input
                                  type="text"
                                  value={heroTitle}
                                  onChange={(e) => setHeroTitle(e.target.value)}
                                  placeholder="29sFORMULA"
                                  className={styles.textInput}
                                  style={{ flex: 1 }}
                                />
                              </div>
                            </div>
                            <div className={styles.inputGroup}>
                              <label className={styles.inputLabel}>Brand Manifesto (Hero Subtext)</label>
                              <textarea
                                value={heroManifesto}
                                onChange={(e) => setHeroManifesto(e.target.value)}
                                placeholder="SCENT IS THE DIFFERENCE YOU FEEL AND NEVER FAKE..."
                                className={styles.textareaInput}
                                rows={3}
                              />
                            </div>

                            {/* Hero Background Customization */}
                            <div style={{
                              marginTop: "20px",
                              paddingTop: "20px",
                              borderTop: "1px solid #e5e7eb",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px"
                            }}>


                              <label className={styles.inputLabel} style={{ fontWeight: 700 }}>Hero Background Customization</label>

                              {/* Background Type Selection */}
                              <div style={{ display: "flex", gap: "8px" }}>
                                {["color", "image", "video"].map((type) => {
                                  const label = type === "color" ? "Solid Color" : type === "image" ? "Image Background" : "Video Background";
                                  const isActive = heroBgType === type;
                                  return (
                                    <button
                                      key={type}
                                      type="button"
                                      onClick={() => setHeroBgType(type)}
                                      style={{
                                        flex: 1,
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        backgroundColor: isActive ? "#111827" : "#ffffff",
                                        color: isActive ? "#ffffff" : "#374151",
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "background 0.2s, color 0.2s"
                                      }}
                                    >
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Conditional Inputs */}
                              {heroBgType === "color" && (
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Background Color</label>
                                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <input
                                      type="color"
                                      value={heroBgColor}
                                      onChange={(e) => setHeroBgColor(e.target.value)}
                                      style={{
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        width: "40px",
                                        height: "40px",
                                        padding: 0,
                                        cursor: "pointer",
                                        backgroundColor: "transparent"
                                      }}
                                    />
                                    <input
                                      type="text"
                                      value={heroBgColor}
                                      onChange={(e) => setHeroBgColor(e.target.value)}
                                      placeholder="#57bc74"
                                      className={styles.textInput}
                                      style={{ flex: 1, fontFamily: "monospace" }}
                                    />
                                  </div>
                                </div>
                              )}

                              {heroBgType === "image" && (
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Background Image URL</label>
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    <input
                                      type="text"
                                      value={heroBgImage}
                                      onChange={(e) => setHeroBgImage(e.target.value)}
                                      placeholder="https://example.com/background.jpg"
                                      className={styles.textInput}
                                      style={{ flex: 1 }}
                                    />
                                    <label style={{
                                      padding: "10px 14px",
                                      backgroundColor: "#ffffff",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "8px",
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px"
                                    }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                      </svg>
                                      <span>Upload</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={async (e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                              const res = await fetch("http://127.0.0.1:5001/api/upload", {
                                                method: "POST",
                                                body: formData
                                              });
                                              if (res.ok) {
                                                const uploadResult = await res.json();
                                                setHeroBgImage(uploadResult.url);
                                              } else {
                                                alert("Image upload failed");
                                              }
                                            } catch (err) {
                                              console.error("Upload error:", err);
                                            }
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              )}

                              {heroBgType === "video" && (
                                <div className={styles.inputGroup}>
                                  <label className={styles.inputLabel}>Background Video URL (MP4 / WebM)</label>
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    <input
                                      type="text"
                                      value={heroBgVideo}
                                      onChange={(e) => setHeroBgVideo(e.target.value)}
                                      placeholder="https://example.com/background.mp4"
                                      className={styles.textInput}
                                      style={{ flex: 1 }}
                                    />
                                    <label style={{
                                      padding: "10px 14px",
                                      backgroundColor: "#ffffff",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "8px",
                                      fontSize: "0.85rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px"
                                    }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                      </svg>
                                      <span>Upload</span>
                                      <input
                                        type="file"
                                        accept="video/*"
                                        style={{ display: "none" }}
                                        onChange={async (e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                              const res = await fetch("http://127.0.0.1:5001/api/upload", {
                                                method: "POST",
                                                body: formData
                                              });
                                              if (res.ok) {
                                                const uploadResult = await res.json();
                                                setHeroBgVideo(uploadResult.url);
                                              } else {
                                                alert("Video upload failed");
                                              }
                                            } catch (err) {
                                              console.error("Upload error:", err);
                                            }
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setHeroTitle("29sFORMULA");
                                setHeroTitleFontType("Outfit");
                                setHeroTitleFontColor("#111827");
                                setHeroTitleFontSize("4.5rem");
                                setHeroTitleFontAlignment("center");
                                setHeroTitleFontWeight("700");
                                setHeroManifesto("SCENT IS THE DIFFERENCE YOU FEEL AND NEVER FAKE. EVERY 29S FORMULA BOTTLE IS CRAFTED BY HANDS THAT CARE, NOT MACHINES THAT RUSH.");
                              }}
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                padding: "8px 14px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                                marginTop: "15px",
                                display: "inline-block"
                              }}
                            >
                              Reset Hero Copy to Defaults
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card 3: Video Section */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "video" ? null : "video")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Video Section Banner</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "video" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "video" && (
                          <div className={styles.accordionContent}>
                            <div className={styles.toggleRow} style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span className={styles.toggleLabel} style={{ fontWeight: 600, fontSize: "0.85rem", color: "#374151" }}>Display Video Section on Storefront</span>
                              <label className={styles.switch}>
                                <input
                                  type="checkbox"
                                  checked={showVideo}
                                  onChange={(e) => setShowVideo(e.target.checked)}
                                />
                                <span className={styles.slider} />
                              </label>
                            </div>
                            <div className={styles.inputRow} style={{ marginBottom: "15px" }}>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Headline Title</label>
                                <input
                                  type="text"
                                  value={videoTitle}
                                  onChange={(e) => setVideoTitle(e.target.value)}
                                  placeholder="NEW ARRIVALS"
                                  className={styles.textInput}
                                  disabled={!showVideo}
                                />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Subtitle Description</label>
                                <input
                                  type="text"
                                  value={videoSubtitle}
                                  onChange={(e) => setVideoSubtitle(e.target.value)}
                                  placeholder="Drop's live. Smells divine..."
                                  className={styles.textInput}
                                  disabled={!showVideo}
                                />
                              </div>
                            </div>
                            <div className={styles.inputGroup}>
                              <label className={styles.inputLabel}>MP4 Background Video</label>
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "5px" }}>
                                {videoUrl && (
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f3f4f6", padding: "10px 12px", borderRadius: "6px" }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#374151" style={{ width: "18px", height: "18px" }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h14.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
                                    <span style={{ fontSize: "0.85rem", color: "#374151", fontWeight: 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                      Background Video Configured
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setVideoUrl("")}
                                      style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}
                                      disabled={!showVideo || uploadingVideo}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                )}

                                {!videoUrl && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      background: `${videoFallbackColor}15`,
                                      border: `1px solid ${videoFallbackColor}40`,
                                      padding: "12px 14px",
                                      borderRadius: "8px",
                                      marginBottom: "5px"
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke={videoFallbackColor} style={{ width: "20px", height: "20px", flexShrink: 0 }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 1 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.852l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                    <span style={{ fontSize: "0.82rem", color: "#374151", fontWeight: 500 }}>
                                      No background video configured. Storefront will display a solid background matching your chosen fallback color (<strong>{videoFallbackColor}</strong>).
                                    </span>
                                  </div>
                                )}

                                <div style={{ display: "flex", gap: "10px", alignItems: "center", width: "100%" }}>
                                  <label
                                    className={styles.fileUploadBtn}
                                    style={{
                                      flex: 1,
                                      margin: 0,
                                      cursor: (!showVideo || uploadingVideo) ? "not-allowed" : "pointer",
                                      opacity: (!showVideo || uploadingVideo) ? 0.7 : 1
                                    }}
                                  >
                                    <input
                                      type="file"
                                      accept="video/*"
                                      style={{ display: "none" }}
                                      onChange={handleVideoUpload}
                                      disabled={!showVideo || uploadingVideo}
                                    />
                                    {uploadingVideo ? `Uploading... ${videoProgress !== null ? `${videoProgress}%` : ""}` : "Choose Video File"}
                                  </label>
                                </div>

                                {videoProgress !== null && (
                                  <div style={{ width: "100%", background: "#e5e7eb", borderRadius: "4px", height: "8px", overflow: "hidden", marginTop: "4px" }}>
                                    <div style={{ width: `${videoProgress}%`, background: "#000000", height: "100%", transition: "width 0.1s ease" }} />
                                  </div>
                                )}

                                {/* Fallback color picker for when no video is loaded */}
                                <div className={styles.inputGroup} style={{ marginTop: "15px" }}>
                                  <label className={styles.inputLabel}>Fallback Background Color</label>
                                  <div style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "8px" }}>
                                    <input
                                      type="color"
                                      value={videoFallbackColor}
                                      onChange={(e) => setVideoFallbackColor(e.target.value)}
                                      style={{ width: "60px", height: "40px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", padding: "0", background: "transparent" }}
                                      disabled={!showVideo}
                                    />
                                    <input
                                      type="text"
                                      value={videoFallbackColor}
                                      onChange={(e) => setVideoFallbackColor(e.target.value)}
                                      placeholder="#57bc74"
                                      className={styles.textInput}
                                      style={{ flex: 1 }}
                                      disabled={!showVideo}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowVideo(true);
                                setVideoTitle("NEW ARRIVALS");
                                setVideoSubtitle("Drop's live. Smells divine. Feels better.");
                                setVideoUrl("");
                                setVideoFallbackColor("#57bc74");
                              }}
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                padding: "8px 14px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                                marginTop: "15px",
                                display: "inline-block"
                              }}
                            >
                              Reset Video Section to Defaults
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card 4: Lifestyle Section */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "lifestyle" ? null : "lifestyle")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Lifestyle Banner</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "lifestyle" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "lifestyle" && (
                          <div className={styles.accordionContent}>
                            <div className={styles.toggleRow} style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span className={styles.toggleLabel} style={{ fontWeight: 600, fontSize: "0.85rem", color: "#374151" }}>Display Lifestyle Banner on Storefront</span>
                              <label className={styles.switch}>
                                <input
                                  type="checkbox"
                                  checked={showLifestyle}
                                  onChange={(e) => setShowLifestyle(e.target.checked)}
                                />
                                <span className={styles.slider} />
                              </label>
                            </div>
                            <div className={styles.inputGroup}>
                              <label className={styles.inputLabel}>Lifestyle Overlay Text Copy</label>
                              <input
                                type="text"
                                value={lifestyleText}
                                onChange={(e) => setLifestyleText(e.target.value)}
                                placeholder="Intense notes, Raw elements. This is 29sFORMULA."
                                className={styles.textInput}
                                disabled={!showLifestyle}
                              />
                            </div>
                            <div className={styles.inputGroup} style={{ marginTop: "15px" }}>
                              <label className={styles.inputLabel}>Lifestyle Banner Background Image</label>
                              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <input
                                  type="text"
                                  value={lifestyleImage}
                                  onChange={(e) => setLifestyleImage(e.target.value)}
                                  placeholder="Image URL (e.g. https://images.unsplash.com/...)"
                                  className={styles.textInput}
                                  style={{ flex: 1 }}
                                  disabled={!showLifestyle || uploadingLifestyle}
                                />
                                <label
                                  className={styles.fileUploadBtn}
                                  style={{
                                    margin: 0,
                                    padding: "10px 16px",
                                    cursor: (!showLifestyle || uploadingLifestyle) ? "not-allowed" : "pointer",
                                    opacity: (!showLifestyle || uploadingLifestyle) ? 0.7 : 1
                                  }}
                                >
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLifestyleImageUpload}
                                    style={{ display: "none" }}
                                    disabled={!showLifestyle || uploadingLifestyle}
                                  />
                                  {uploadingLifestyle ? "Uploading..." : "Upload Image"}
                                </label>
                              </div>
                              {lifestyleImage && (
                                <div style={{ marginTop: "10px", position: "relative", width: "100%", height: "120px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={lifestyleImage}
                                    alt="Lifestyle Preview"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowLifestyle(true);
                                setLifestyleText("Intense notes, Raw elements. This is 29sFORMULA.");
                                setLifestyleImage("https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=1800&q=80");
                              }}
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                padding: "8px 14px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                                marginTop: "15px",
                                display: "inline-block"
                              }}
                            >
                              Reset Lifestyle Banner to Defaults
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card 5: Storefront Theme Settings */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "25px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "theme" ? null : "theme")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Storefront Theme Styling</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "theme" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "theme" && (
                          <div className={styles.accordionContent}>
                            <div className={styles.inputGroup}>
                              <label className={styles.inputLabel}>Primary Brand Theme Color</label>
                              <div style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "8px" }}>
                                <input
                                  type="color"
                                  value={primaryColor}
                                  onChange={(e) => setPrimaryColor(e.target.value)}
                                  style={{ width: "60px", height: "40px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", padding: "0", background: "transparent" }}
                                />
                                <input
                                  type="text"
                                  value={primaryColor}
                                  onChange={(e) => setPrimaryColor(e.target.value)}
                                  placeholder="#57bc74"
                                  className={styles.textInput}
                                  style={{ flex: 1 }}
                                />
                              </div>
                            </div>

                            <div className={styles.inputGroup} style={{ marginTop: "25px", borderTop: "1px solid #e5e7eb", paddingTop: "25px" }}>
                              <label className={styles.inputLabel}>Brand Logo Format</label>
                              <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.95rem" }}>
                                  <input 
                                    type="radio" 
                                    name="brandLogoType"
                                    value="text" 
                                    checked={brandLogoType === "text"}
                                    onChange={(e) => setBrandLogoType(e.target.value)}
                                    style={{ width: "16px", height: "16px", accentColor: "#4f46e5" }}
                                  />
                                  Text Logo
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.95rem" }}>
                                  <input 
                                    type="radio" 
                                    name="brandLogoType"
                                    value="image" 
                                    checked={brandLogoType === "image"}
                                    onChange={(e) => setBrandLogoType(e.target.value)}
                                    style={{ width: "16px", height: "16px", accentColor: "#4f46e5" }}
                                  />
                                  Image Logo
                                </label>
                              </div>
                            </div>

                            <div className={styles.inputGroup} style={{ marginTop: "20px" }}>
                              <label className={styles.inputLabel}>
                                {brandLogoType === "text" ? "Brand Logo Text" : "Brand Logo Image"}
                              </label>
                              
                              {brandLogoType === "text" ? (
                                <input
                                  type="text"
                                  value={brandLogoValue}
                                  onChange={(e) => setBrandLogoValue(e.target.value)}
                                  placeholder="29sFORMULA"
                                  className={styles.textInput}
                                  style={{ marginTop: "8px" }}
                                />
                              ) : (
                                <div style={{ marginTop: "8px" }}>
                                  {brandLogoValue && brandLogoValue.startsWith("http") && (
                                    <div style={{ marginBottom: "15px", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px", backgroundColor: "#f9fafb", display: "inline-block" }}>
                                      <img 
                                        src={brandLogoValue} 
                                        alt="Brand Logo Preview" 
                                        style={{ maxHeight: "60px", objectFit: "contain", display: "block" }} 
                                      />
                                    </div>
                                  )}
                                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", color: "#374151", fontWeight: 500, transition: "all 0.2s ease" }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                      </svg>
                                      {uploadingLogo ? "Uploading..." : "Upload Logo Image"}
                                      <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/webp, image/svg+xml" 
                                        style={{ display: "none" }}
                                        onChange={handleBrandLogoUpload}
                                        disabled={uploadingLogo}
                                      />
                                    </label>
                                    <input
                                      type="text"
                                      value={brandLogoValue}
                                      onChange={(e) => setBrandLogoValue(e.target.value)}
                                      placeholder="Or paste an image URL..."
                                      className={styles.textInput}
                                      style={{ flex: 1 }}
                                    />
                                  </div>
                                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "8px" }}>
                                    Recommended: Transparent PNG or SVG, max height 60px.
                                  </p>
                                </div>
                              )}
                            </div>                            <button
                              type="button"
                              onClick={() => {
                                setPrimaryColor("#57bc74");
                                setGoogleClientId("753896502014-yourmockclientid.apps.googleusercontent.com");
                              }}
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                padding: "8px 14px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                                marginTop: "15px",
                                display: "inline-block"
                              }}
                            >
                              Reset Section to Defaults
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  
                      {/* Storefront Policies & Popups */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "policies" ? null : "policies")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Storefront Policies & Popups</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "policies" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                        {activeCustomizerSection === "policies" && (
                          <div className={styles.accordionContent}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Support Text</label>
                                <textarea className={styles.textareaInput} value={supportText} onChange={(e) => setSupportText(e.target.value)} rows={3} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Careers Text</label>
                                <textarea className={styles.textareaInput} value={careersText} onChange={(e) => setCareersText(e.target.value)} rows={3} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Trade Enquiry Text</label>
                                <textarea className={styles.textareaInput} value={tradeEnquiryText} onChange={(e) => setTradeEnquiryText(e.target.value)} rows={3} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>About Us Text</label>
                                <textarea className={styles.textareaInput} value={aboutUsText} onChange={(e) => setAboutUsText(e.target.value)} rows={3} />
                              </div>
                                                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Instagram Link</label>
                                <textarea className={styles.textareaInput} value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} rows={1} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Facebook Link</label>
                                <textarea className={styles.textareaInput} value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} rows={1} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Contact Page Link</label>
                                <textarea className={styles.textareaInput} value={contactLink} onChange={(e) => setContactLink(e.target.value)} rows={1} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Contact Us Text</label>
                                <textarea
                                  className={styles.textareaInput}
                                  value={contactUsText}
                                  onChange={(e) => setContactUsText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Return Policy Text</label>
                                <textarea
                                  className={styles.textareaInput}
                                  value={returnPolicyText}
                                  onChange={(e) => setReturnPolicyText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Shipping Policy Text</label>
                                <textarea
                                  className={styles.textareaInput}
                                  value={shippingPolicyText}
                                  onChange={(e) => setShippingPolicyText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                  {/* SUB TAB 2: PRODUCT PREVIEW PAGE CUSTOMIZER */}
                  {customizeSubTab === "product" && (
                    <>
                      {/* Card 6: Product Preview Page Settings */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "faq" ? null : "faq")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Frequently Asked Questions (FAQ)</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "faq" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "faq" && (
                          <div className={styles.accordionContent}>
                            {/* List of current FAQs */}
                            {faqs.length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
                                {faqs.map((faq, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      border: "1px solid #e5e7eb",
                                      borderRadius: "8px",
                                      padding: "15px",
                                      backgroundColor: "#f9fafb",
                                      position: "relative"
                                    }}
                                  >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4b5563" }}>FAQ #{index + 1}</span>
                                      <button
                                        type="button"
                                        onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                                        style={{
                                          backgroundColor: "#fee2e2",
                                          color: "#dc2626",
                                          border: "none",
                                          borderRadius: "4px",
                                          padding: "4px 10px",
                                          fontSize: "0.75rem",
                                          fontWeight: 600,
                                          cursor: "pointer",
                                          transition: "background 0.2s ease"
                                        }}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                    <div className={styles.inputGroup} style={{ marginBottom: "10px" }}>
                                      <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Question</label>
                                      <input
                                        type="text"
                                        value={faq.question}
                                        onChange={(e) => {
                                          const updated = [...faqs];
                                          updated[index] = { ...updated[index], question: e.target.value };
                                          setFaqs(updated);
                                        }}
                                        className={styles.textInput}
                                        style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                                        placeholder="Enter question..."
                                        required
                                      />
                                    </div>
                                    <div className={styles.inputGroup}>
                                      <label className={styles.inputLabel} style={{ fontSize: "0.78rem" }}>Answer</label>
                                      <textarea
                                        value={faq.answer}
                                        onChange={(e) => {
                                          const updated = [...faqs];
                                          updated[index] = { ...updated[index], answer: e.target.value };
                                          setFaqs(updated);
                                        }}
                                        className={styles.textareaInput}
                                        rows={2}
                                        style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                                        placeholder="Enter answer..."
                                        required
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ fontSize: "0.85rem", color: "#6b7280", fontStyle: "italic", marginBottom: "20px" }}>No FAQs configured yet. Click Add below to create one.</p>
                            )}

                            {/* Add New FAQ Trigger and Reset Button */}
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                              <button
                                type="button"
                                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                                style={{
                                  backgroundColor: "#000",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "6px",
                                  padding: "10px 18px",
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  transition: "opacity 0.2s ease"
                                }}
                              >
                                + Add FAQ
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setFaqs([
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
                                      answer: "We accept all major credit cards, debit cards, UPI, net banking, and Cash on Delivery (COD) services."
                                    },
                                    {
                                      question: "IS CASH ON DELIVERY AVAILABLE?",
                                      answer: "Yes, Cash on Delivery is available for all pin codes across India at no additional charge."
                                    }
                                  ]);
                                }}
                                style={{
                                  backgroundColor: "#f3f4f6",
                                  color: "#374151",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "6px",
                                  padding: "10px 18px",
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  transition: "background 0.2s ease"
                                }}
                              >
                                Reset FAQs to Defaults
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card 7: Product Preview Page Settings */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "25px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "productPage" ? null : "productPage")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Product Preview Page Controls</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`${styles.chevronIcon} ${activeCustomizerSection === "productPage" ? styles.chevronRotated : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>

                        {activeCustomizerSection === "productPage" && (
                          <div className={styles.accordionContent}>
                            <div className={styles.toggleRow} style={{ marginBottom: "15px" }}>
                              <span className={styles.toggleLabel}>Show Customer Reviews Section</span>
                              <label className={styles.switch}>
                                <input
                                  type="checkbox"
                                  checked={showProductReviews}
                                  onChange={(e) => setShowProductReviews(e.target.checked)}
                                />
                                <span className={styles.slider} />
                              </label>
                            </div>

                            <div className={styles.toggleRow} style={{ marginBottom: "15px" }}>
                              <span className={styles.toggleLabel}>Show Recommended &ldquo;Explore More&rdquo; Section</span>
                              <label className={styles.switch}>
                                <input
                                  type="checkbox"
                                  checked={showProductExploreMore}
                                  onChange={(e) => setShowProductExploreMore(e.target.checked)}
                                />
                                <span className={styles.slider} />
                              </label>
                            </div>

                            <div className={styles.toggleRow} style={{ marginBottom: "20px" }}>
                              <span className={styles.toggleLabel}>Show Frequently Asked Questions (FAQ) Section</span>
                              <label className={styles.switch}>
                                <input
                                  type="checkbox"
                                  checked={showProductFaq}
                                  onChange={(e) => setShowProductFaq(e.target.checked)}
                                />
                                <span className={styles.slider} />
                              </label>
                            </div>

                            <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                              <label className={styles.inputLabel}>Usage & Layering Guide Subtext</label>
                              <input
                                type="text"
                                value={usageGuideText}
                                onChange={(e) => setUsageGuideText(e.target.value)}
                                placeholder="Fits your mood. Handcrafted with scientific precision..."
                                className={styles.textInput}
                              />
                            </div>

                            <div className={styles.inputGroup} style={{ marginBottom: "15px" }}>
                              <label className={styles.inputLabel}>Recommended Section Headline Title</label>
                              <input
                                type="text"
                                value={exploreMoreTitle}
                                onChange={(e) => setExploreMoreTitle(e.target.value)}
                                placeholder="Don't Stop. Explore More."
                                className={styles.textInput}
                              />
                            </div>

                            <div className={styles.inputGroup}>
                              <label className={styles.inputLabel}>Price Taxes & Shipping Subtext</label>
                              <input
                                type="text"
                                value={deliverySubtext}
                                onChange={(e) => setDeliverySubtext(e.target.value)}
                                placeholder="TAXES INCLUDED. SHIPPING CALCULATED AT CHECKOUT."
                                className={styles.textInput}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* SUB TAB 3: CUSTOMER REVIEWS MODERATION */}
                  {customizeSubTab === "reviews" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Moderate Reviews</h3>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            type="button"
                            onClick={fetchAdminReviews}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "8px",
                              background: "transparent",
                              color: "#4b5563",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f3f4f6"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                            title="Refresh Reviews"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className={styles.dashboardCard} style={{ padding: "10px" }}>
                        {adminReviews.length > 0 ? (
                          <div style={{ overflowX: "auto" }}>
                            <table className={styles.inventoryTable}>
                              <thead>
                                <tr>
                                  <th>AuthorName</th>
                                  <th>ReviewRating</th>
                                  <th style={{ width: "30%" }}>ReviewComment</th>
                                  <th>ReviewPhotos</th>
                                  <th>ReviewDate</th>
                                  <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {adminReviews
                                  .filter(r =>
                                    r.author?.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
                                    r.comment?.toLowerCase().includes(reviewSearchQuery.toLowerCase()) ||
                                    r.title?.toLowerCase().includes(reviewSearchQuery.toLowerCase())
                                  )
                                  .map((review) => (
                                    <tr key={review._id}>
                                      <td>
                                        <span className={styles.tableName}>{review.author}</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "#6b7280", fontWeight: 400, marginTop: "2px" }}>
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "12px", height: "12px" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                          </svg>
                                          {review.location || "IN"}
                                        </div>
                                      </td>
                                      <td>
                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                      </td>
                                      <td>
                                        {review.title && <div style={{ fontWeight: 700 }}>{review.title}</div>}
                                        <div style={{ color: "#4b5563" }}>{review.comment}</div>
                                      </td>
                                      <td>
                                        {review.images && review.images.length > 0 ? (
                                          <div style={{ display: "flex", gap: "4px" }}>
                                            {review.images.map((img: string, i: number) => (
                                              <img key={i} src={img} alt="Attached" className={styles.tableThumb} style={{ width: "30px", height: "30px" }} />
                                            ))}
                                          </div>
                                        ) : (
                                          <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>No photos</span>
                                        )}
                                      </td>
                                      <td>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                      </td>
                                      <td style={{ textAlign: "right" }}>
                                        <div className={styles.actionGroup}>
                                          <button
                                            onClick={() => setEditReviewTarget({ ...review })}
                                            className={styles.editActionBtn}
                                            title="Edit Review"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => setDeleteReviewTarget(review._id)}
                                            className={styles.deleteActionBtn}
                                            title="Delete Review"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div style={{ textAlign: "center", padding: "30px 10px", color: "#6b7280", fontSize: "0.85rem" }}>
                            No customer reviews found in database.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Save and Reset Row */}
                  {(customizeSubTab === "landing" || customizeSubTab === "product") && (
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "15px", width: "100%" }}>
                      <button
                        type="submit"
                        disabled={loadingSettings || !hasUnsavedChanges}
                        className={styles.saveSettingsBtn}
                        style={{
                          flex: 1,
                          opacity: (loadingSettings || !hasUnsavedChanges) ? 0.6 : 1,
                          cursor: (loadingSettings || !hasUnsavedChanges) ? "not-allowed" : "pointer"
                        }}
                      >
                        {loadingSettings ? "Saving Adjustments..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirmModal(true)}
                        className={styles.resetSettingsBtn}
                        style={{ flex: 1 }}
                      >
                        Reset to Defaults
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Redesigned Customers Directory Tab */}
          {activeTab === "customers" && (
            <div className={styles.viewContainer}>
              <div style={{ marginBottom: "20px" }}>
                <h1 className={styles.pageHeading} style={{ margin: 0 }}>Customers Directory</h1>
              </div>

              <div className={styles.dashboardCard} style={{ marginTop: "20px" }}>
                {customers.length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #e5e7eb", fontSize: "0.82rem", color: "#6b7280", textTransform: "uppercase" }}>
                          <th style={{ padding: "12px 16px" }}>CustomerName</th>
                          <th style={{ padding: "12px 16px" }}>EmailAddress</th>
                          <th style={{ padding: "12px 16px" }}>Phone</th>
                          <th style={{ padding: "12px 16px", textAlign: "center" }}>TotalOrders</th>
                          <th style={{ padding: "12px 16px", textAlign: "right" }}>TotalSpend</th>
                          <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((cust, idx) => (
                          <tr
                            key={idx}
                            style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer", transition: "background-color 0.2s" }}
                            onClick={() => setSelectedCustomer(cust)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: "0.88rem", color: "#111827" }}>
                              {cust.name}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#4b5563" }}>
                              {cust.email}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: "0.85rem", color: "#4b5563" }}>
                              {cust.phone}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: "0.88rem", fontWeight: 600, textAlign: "center", color: "#111827" }}>
                              {cust.totalOrders}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: "0.88rem", fontWeight: 700, textAlign: "right", color: "#000" }}>
                              ₹{cust.totalSpend.toLocaleString("en-IN")}.00
                            </td>
                            <td style={{ padding: "14px 16px", textAlign: "center" }}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setDeleteCustomerTargetId(cust._id); }}
                                className={styles.deleteActionBtn}
                                style={{ padding: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                title="Delete Customer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "16px", height: "16px" }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                    <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>No customer directory records found.</p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "0.82rem" }}>Customers will appear here automatically once their checkouts create orders.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Redesigned Marketing Campaigns & Promos Tab */}
          {activeTab === "marketing" && (
            <div className={styles.viewContainer}>
              <div style={{ marginBottom: "20px" }}>
                <h1 className={styles.pageHeading} style={{ margin: 0 }}>Marketing Campaigns & Promos</h1>
              </div>

              <div className={styles.dashboardCard} style={{ marginTop: "20px", padding: "24px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "20px", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" }}>Active Marquee Announcements</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#374151" }}>Top Marquee Ticker Loop Status</span>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={showTicker}
                        onChange={(e) => {
                          setShowTicker(e.target.checked);
                          saveSettingsSilent();
                        }}
                      />
                      <span className={styles.slider} />
                    </label>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Ticker Content Text</label>
                    <input
                      type="text"
                      value={tickerText}
                      onChange={(e) => setTickerText(e.target.value)}
                      onBlur={saveSettingsSilent}
                      className={styles.textInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Redesigned Discount Coupons & Promo Codes Tab */}
          {activeTab === "discounts" && (
            <div className={styles.viewContainer}>
              <div style={{ marginBottom: "5px" }}>
                <h1 className={styles.pageHeading} style={{ margin: 0 }}>Discount Coupons & Promotion Codes</h1>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "25px", marginTop: "10px" }}>
                {/* Form to create discount */}
                <div className={styles.dashboardCard} style={{ padding: "25px", height: "fit-content", background: "linear-gradient(145deg, #ffffff, #f8fafc)", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
                    <div style={{ backgroundColor: "#e0e7ff", padding: "8px", borderRadius: "8px", color: "#4f46e5" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Generate Coupon</h3>
                  </div>
                  
                  <form onSubmit={handleCreateDiscount}>
                    {discountError && <div className={styles.errorBanner} style={{ padding: "10px 14px", fontSize: "0.85rem", marginBottom: "20px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}>{discountError}</div>}
                    
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Coupon Code <span style={{ color: "#ef4444" }}>*</span></label>
                      <input
                        type="text"
                        value={newDiscountCode}
                        onChange={(e) => setNewDiscountCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                        placeholder="e.g. SUMMER2024"
                        style={{ padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: "8px", width: "100%", fontSize: "0.9rem", fontWeight: 600, color: "#1e293b", transition: "border-color 0.2s", outline: "none" }}
                        onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                        required
                      />
                    </div>
                    
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Discount Type <span style={{ color: "#ef4444" }}>*</span></label>
                      <select
                        value={newDiscountType}
                        onChange={(e) => setNewDiscountType(e.target.value)}
                        style={{ padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: "8px", width: "100%", fontSize: "0.9rem", fontWeight: 600, color: "#1e293b", cursor: "pointer", outline: "none", appearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23475569\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                        onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Flat Amount (₹)</option>
                      </select>
                    </div>
                    
                    <div style={{ marginBottom: "25px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Discount Value <span style={{ color: "#ef4444" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 700, fontSize: "0.9rem" }}>
                          {newDiscountType === "percentage" ? "%" : "₹"}
                        </span>
                        <input
                          type="number"
                          value={newDiscountValue}
                          onChange={(e) => setNewDiscountValue(e.target.value)}
                          placeholder={newDiscountType === "percentage" ? "10" : "150"}
                          style={{ padding: "10px 12px 10px 32px", border: "2px solid #e2e8f0", borderRadius: "8px", width: "100%", fontSize: "0.9rem", fontWeight: 600, color: "#1e293b", outline: "none" }}
                          onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
                          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                          required
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: "25px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>Minimum Order Amount (₹) <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Optional)</span></label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 700, fontSize: "0.9rem" }}>
                          ₹
                        </span>
                        <input
                          type="number"
                          value={newDiscountMinOrder}
                          onChange={(e) => setNewDiscountMinOrder(e.target.value)}
                          placeholder="e.g. 500"
                          style={{ padding: "10px 12px 10px 32px", border: "2px solid #e2e8f0", borderRadius: "8px", width: "100%", fontSize: "0.9rem", fontWeight: 600, color: "#1e293b", outline: "none" }}
                          onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
                          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#4f46e5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        width: "100%",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.3)",
                        transition: "background-color 0.2s"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4338ca"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4f46e5"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "18px", height: "18px" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Create Coupon
                    </button>
                  </form>
                </div>

                {/* List of active discount coupons */}
                <div className={styles.dashboardCard} style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "15px" }}>Active Storefront Coupons</h3>
                  {discountsList.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
                      {discountsList.map((disc) => (
                        <div key={disc._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", border: "2px dashed #d1d5db", borderRadius: "10px", backgroundColor: "#f8fafc", position: "relative" }}>
                          <div>
                            <div style={{ fontWeight: 800, fontFamily: "monospace", fontSize: "1.2rem", color: "#111827", letterSpacing: "1px" }}>{disc.code}</div>
                            <div style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: 700, marginTop: "4px" }}>
                              {disc.type === "percentage" ? `${disc.value}% OFF` : `₹${disc.value.toLocaleString("en-IN")} FLAT OFF`}
                              {disc.minOrderAmount > 0 && <span style={{ color: "#64748b", fontWeight: 500, marginLeft: "8px" }}>| Min ₹{disc.minOrderAmount.toLocaleString("en-IN")}</span>}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDeleteDiscountConfirmId(disc._id)}
                            style={{ backgroundColor: "#fee2e2", border: "none", color: "#dc2626", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem", padding: "8px 12px", borderRadius: "6px", transition: "all 0.2s ease" }}
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "40px 10px", textAlign: "center", color: "#6b7280", fontSize: "0.88rem" }}>
                      No active discount coupons found. Create one using the form on the left!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {deleteDiscountConfirmId && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#dc2626" className={styles.warningIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3>Confirm Coupon Deletion</h3>
            </div>
            <p className={styles.modalBody}>
              Are you sure you want to permanently revoke this discount coupon? Customers will no longer be able to apply it during checkout.
            </p>
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.modalCancelBtn}
                onClick={() => setDeleteDiscountConfirmId(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className={styles.modalConfirmBtn}
                onClick={() => handleDeleteDiscount(deleteDiscountConfirmId)}
              >
                Yes, Revoke Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOrderTargetId && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#dc2626" className={styles.warningIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3>Confirm Delete Order</h3>
            </div>

            <p className={styles.modalDescription}>
              Are you sure you want to delete this order? It will be removed from the admin panel list, marked as Cancelled, and its stock will be restored.
            </p>

            <div className={styles.modalActionRow}>
              <button
                onClick={() => {
                  if (deleteOrderTargetId) {
                    executeDeleteOrder(deleteOrderTargetId);
                  }
                }}
                disabled={isDeletingOrder}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#dc2626", color: "#fff", opacity: isDeletingOrder ? 0.7 : 1 }}
              >
                {isDeletingOrder ? "Deleting..." : "Delete Order"}
              </button>
              <button
                onClick={() => setDeleteOrderTargetId(null)}
                className={styles.cancelActionBtn}
                disabled={isDeletingOrder}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved changes confirmation modal overlay */}
      {showUnsavedModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#dc2626" className={styles.warningIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3>Unsaved Changes Detected</h3>
            </div>

            <p className={styles.modalDescription}>
              You have modified storefront settings without saving. The following adjustments will be lost if you leave:
            </p>

            <ul className={styles.changesList}>
              {getChangedFieldsList().map((field, idx) => (
                <li key={idx} className={styles.changeItem}>
                  <span className={styles.bullet}>•</span>
                  {field}
                </li>
              ))}
            </ul>

            <div className={styles.modalActionRow}>
              <button onClick={handleSaveAndContinue} className={styles.primaryActionBtn}>
                Save & Continue
              </button>
              <button onClick={handleDiscardAndContinue} className={styles.secondaryActionBtn}>
                Discard Changes
              </button>
              <button onClick={handleCancelNavigation} className={styles.cancelActionBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRUD Product Modal Overlay */}
      {showCrudModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "800px", maxHeight: "90vh", display: "flex", flexDirection: "column", padding: "24px 24px 20px 24px", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "14px", marginBottom: "14px", flexShrink: 0, backgroundColor: "#f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#111827" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#111827" }}>
                  {isEditing ? "Edit Product Details" : "Add new product to Catalog"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowCrudModal(false); resetForm(); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px", display: "inline-flex", alignItems: "center", borderRadius: "50%", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#000"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px", marginBottom: "14px" }}>
                {error && showCrudModal && (
                  <div className={styles.errorBanner} style={{ marginBottom: "14px", padding: "12px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "0.85rem", borderLeft: "4px solid #ef4444" }}>
                    {error}
                  </div>
                )}

                {/* Card 1: Product details */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product details</h4>

                  <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                    <label className={styles.inputLabel}>PerfumeName *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.textInput}
                      style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={styles.textareaInput}
                      style={{ padding: "10px 12px", fontSize: "0.85rem" }}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Card 2: Product Variants & Sizing Table */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product Variants & Sizing</h4>

                  <div style={{ overflow: "visible" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Size*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Quantity*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Price*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Making Price*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", minWidth: "180px" }}>Category*</th>
                          <th style={{ padding: "8px 6px", width: "40px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {options.map((opt, index) => (
                          <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="text"
                                value={opt.size}
                                placeholder="e.g. 50ml"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].size = e.target.value;
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.quantity}
                                min="0"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].quantity = e.target.value === "" ? "" : (parseInt(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.price}
                                min="1"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].price = e.target.value === "" ? "" : (parseFloat(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.makingPrice}
                                min="0"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].makingPrice = e.target.value === "" ? "" : (parseFloat(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px", position: "relative" }}>
                              <div
                                className={styles.selectInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", height: "34px", boxSizing: "border-box", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                onClick={() => setOpenCategoryIndex(openCategoryIndex === index ? null : index)}
                              >
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {opt.category && opt.category.length > 0 ? opt.category.join(", ") : "Select..."}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "12px", height: "12px", flexShrink: 0 }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                              </div>
                              {openCategoryIndex === index && (
                                <>
                                  <div
                                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenCategoryIndex(null);
                                    }}
                                  />
                                  <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: "4px",
                                    right: "4px",
                                    zIndex: 50,
                                    backgroundColor: "#fff",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                    maxHeight: "250px",
                                    overflowY: "auto",
                                    marginTop: "4px"
                                  }}>
                                    {allCategories.map(cat => {
                                      const isSelected = opt.category && opt.category.includes(cat);
                                      return (
                                        <div
                                          key={cat}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const updated = [...options];
                                            if (!updated[index].category) updated[index].category = [];
                                            if (isSelected) {
                                              updated[index].category = updated[index].category.filter(c => c !== cat);
                                            } else {
                                              updated[index].category.push(cat);
                                            }
                                            setOptions(updated);
                                          }}
                                          style={{
                                            padding: "8px 12px",
                                            cursor: "pointer",
                                            backgroundColor: isSelected ? "#4b5563" : "#fff",
                                            color: isSelected ? "#fff" : "#374151",
                                            fontSize: "0.8rem",
                                            transition: "background-color 0.2s, color 0.2s"
                                          }}
                                          onMouseEnter={(e) => {
                                            if (!isSelected) e.currentTarget.style.backgroundColor = "#f3f4f6";
                                          }}
                                          onMouseLeave={(e) => {
                                            if (!isSelected) e.currentTarget.style.backgroundColor = "#fff";
                                          }}
                                        >
                                          {cat}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </td>
                            <td style={{ padding: "8px 4px", textAlign: "center" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (options.length > 1) {
                                    setOptions(options.filter((_, idx) => idx !== index));
                                  }
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: options.length <= 1 ? "#fca5a5" : "#ef4444",
                                  cursor: options.length <= 1 ? "not-allowed" : "pointer",
                                  fontSize: "1rem",
                                  padding: "4px"
                                }}
                                title="Remove Variant"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOptions([...options, { size: "", quantity: "", price: "", makingPrice: "", category: [] }]);
                    }}
                    style={{
                      marginTop: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#000000",
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                  >
                    + Add Variant
                  </button>
                </div>

                {/* Card 3: Perfume Images */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product Images</h4>

                  <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                    <label className={styles.inputLabel} style={{ marginBottom: "6px" }}>Perfume Images (Upload 3 to 6 images) *</label>
                    <label style={{ display: "block" }}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleMultipleFilesUpload}
                        disabled={uploading}
                      />
                      <div style={{
                        border: "2px dashed #d1d5db",
                        borderRadius: "8px",
                        padding: "16px 12px",
                        textAlign: "center",
                        backgroundColor: "#fafafa",
                        cursor: uploading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                      }}
                        onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = "#000000"; e.currentTarget.style.backgroundColor = "#f3f4f6"; } }}
                        onMouseLeave={(e) => { if (!uploading) { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#fafafa"; } }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "24px", height: "24px", color: "#9ca3af", margin: "0 auto 4px auto" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                        <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>
                          {uploading ? "Uploading Images..." : "Choose Image Files to Upload"}
                        </span>
                        <span style={{ display: "block", fontSize: "0.7rem", color: "#6b7280", marginTop: "2px" }}>
                          JPG or PNG files • 3 to 6 images • Minimum 3 required
                        </span>
                      </div>
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                      <span style={{ fontSize: "0.72rem", color: images.length >= 3 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                        {images.length >= 3 ? `✓ Met requirement (${images.length} uploaded)` : `✗ Need ${3 - images.length} more image(s)`}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                        Max limit: 6 images
                      </span>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div style={{ backgroundColor: "#f9fafb", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                      <label className={styles.inputLabel} style={{ marginBottom: "6px", display: "block", fontSize: "0.68rem", color: "#4b5563" }}>
                        Tap an image to set as FRONT COVER (★ indicates Cover)
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))", gap: "8px" }}>
                        {images.map((url, index) => {
                          const isCover = imageFront === url;
                          return (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                borderRadius: "8px",
                                border: isCover ? "2px solid #000000" : "1px solid #e5e7eb",
                                padding: "3px",
                                backgroundColor: "#ffffff",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: isCover ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"
                              }}
                              onClick={() => setImageFront(url)}
                              onMouseEnter={(e) => { if (!isCover) e.currentTarget.style.borderColor = "#9ca3af"; }}
                              onMouseLeave={(e) => { if (!isCover) e.currentTarget.style.borderColor = "#e5e7eb"; }}
                            >
                              <img
                                src={url}
                                alt={`Uploaded perfume ${index + 1}`}
                                style={{ width: "100%", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                              />

                              <span style={{
                                fontSize: "0.58rem",
                                fontWeight: 700,
                                color: isCover ? "#000000" : "#9ca3af",
                                textTransform: "uppercase",
                                letterSpacing: "0.02em",
                                marginTop: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "2px"
                              }}>
                                {isCover ? "★ Cover" : "Set Cover"}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                                style={{
                                  position: "absolute",
                                  top: "-5px",
                                  right: "-5px",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)"
                                }}
                                title="Remove Image"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalActionRow} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "14px", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0, backgroundColor: "#f3f4f6" }}>
                <button
                  type="button"
                  onClick={() => { setShowCrudModal(false); resetForm(); }}
                  className={styles.secondaryActionBtn}
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryActionBtn}
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  disabled={!name.trim() || images.length < 3 || images.length > 6 || !imageFront || options.length === 0 || options.some(opt => !opt.size.trim() || opt.quantity === "" || opt.price === "" || !opt.category || opt.category.length === 0)}
                >
                  {isEditing ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Add Category Modal Overlay */}
      {showAddCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "580px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px", flexShrink: 0 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                Add New Category
              </h3>
              <button
                type="button"
                onClick={() => { setShowAddCategoryModal(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingRight: "10px", marginBottom: "15px" }}>
                {categoryModalError && (
                  <div className={styles.errorBanner} style={{ marginBottom: "15px", padding: "10px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "0.85rem", flexShrink: 0 }}>
                    {categoryModalError}
                  </div>
                )}

                <div className={styles.inputGroup} style={{ marginBottom: "15px", flexShrink: 0 }}>
                  <label className={styles.inputLabel}>Category Name *</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Exclusive Series"
                    className={styles.textInput}
                    required
                  />
                </div>

                <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                  <label className={styles.inputLabel} style={{ marginBottom: "8px", flexShrink: 0 }}>Select Products to Add to this Category</label>
                  <div style={{ overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "10px", height: "175px", flexShrink: 0 }}>
                    {products.length === 0 ? (
                      <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>No products available.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {products.map(product => {
                          const isChecked = selectedProductIds.includes(product._id!);
                          return (
                            <label
                              key={product._id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "8px",
                                border: "1px solid #f3f4f6",
                                borderRadius: "6px",
                                cursor: "pointer",
                                backgroundColor: isChecked ? "#fafafa" : "#fff",
                                transition: "background-color 0.2s"
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProductIds([...selectedProductIds, product._id!]);
                                  } else {
                                    setSelectedProductIds(selectedProductIds.filter(id => id !== product._id));
                                  }
                                }}
                                style={{ cursor: "pointer", width: "16px", height: "16px" }}
                              />
                              {product.imageFront && (
                                <img
                                  src={product.imageFront}
                                  alt={product.name}
                                  style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }}
                                />
                              )}
                              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#000" }}>{product.name}</span>
                                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Current Categories: {Array.isArray(product.category) ? product.category.join(", ") : (product.category || "None")}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.modalActionRow} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "15px", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => { setShowAddCategoryModal(false); }}
                  className={styles.secondaryActionBtn}
                  disabled={categoryModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryActionBtn}
                  disabled={categoryModalLoading || !newCategoryName.trim()}
                >
                  {categoryModalLoading ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Category Product Add Option Selector Modal Overlay */}
      {showCategoryAddOptionsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "480px", display: "flex", flexDirection: "column", padding: "24px" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px", flexShrink: 0 }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                Add Product to Category
              </h3>
              <button
                type="button"
                onClick={() => { setShowCategoryAddOptionsModal(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "12px" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.5 }}>
                Choose how you want to add a product to the <strong>{selectedCategoryView}</strong> collection:
              </p>

              {/* Option 1: Create New Product */}
              <div
                onClick={() => {
                  setShowCategoryAddOptionsModal(false);
                  setIsEditing(false);
                  resetForm();
                  setCategory(selectedCategoryView ? [selectedCategoryView] : []);
                  setShowCrudModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: "#fff"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.backgroundColor = "#fafafa"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#fff"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#f3f4f6", borderRadius: "50%", color: "#000" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#000" }}>Create New Product</span>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Create a brand new perfume catalog listing from scratch.</span>
                </div>
              </div>

              {/* Option 2: Add Existing Product */}
              <div
                onClick={() => {
                  setShowCategoryAddOptionsModal(false);
                  setExistingProductIdsToAssign([]);
                  setShowAddExistingToCategoryModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: "#fff"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.backgroundColor = "#fafafa"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#fff"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#f3f4f6", borderRadius: "50%", color: "#000" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-3.75 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#000" }}>Add Existing Products</span>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Select and link existing products from your catalog here.</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => { setShowCategoryAddOptionsModal(false); }}
                className={styles.secondaryActionBtn}
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Existing Product to Category Modal Overlay */}
      {showAddExistingToCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "580px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px", flexShrink: 0 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                Add Products to {selectedCategoryView}
              </h3>
              <button
                type="button"
                onClick={() => { setShowAddExistingToCategoryModal(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAssignExistingToCategory} style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingRight: "10px", marginBottom: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflow: "hidden" }}>
                  <label className={styles.inputLabel} style={{ marginBottom: "2px" }}>
                    Select Products to Associate (Displaying max 3 at a time, scrollable)
                  </label>

                  <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {(() => {
                      const availableProducts = products.filter(p => {
                        const cats = Array.isArray(p.category) ? p.category : [p.category].filter((c): c is string => typeof c === 'string');
                        return selectedCategoryView ? !cats.includes(selectedCategoryView) : false;
                      });

                      if (availableProducts.length === 0) {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", border: "1px dashed #d1d5db", borderRadius: "6px", backgroundColor: "#fafafa" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", color: "#9ca3af", marginBottom: "10px" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span style={{ fontSize: "0.85rem", color: "#6b7280", textAlign: "center" }}>All existing products are already assigned to this category.</span>
                          </div>
                        );
                      }

                      return (
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          overflowY: "auto",
                          padding: "4px",
                          height: "175px"
                        }}>
                          {availableProducts.map((product) => {
                            const isChecked = existingProductIdsToAssign.includes(product._id!);
                            return (
                              <label
                                key={product._id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  padding: "8px",
                                  border: "1px solid #f3f4f6",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  backgroundColor: isChecked ? "#fafafa" : "#fff",
                                  transition: "background-color 0.2s"
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setExistingProductIdsToAssign([...existingProductIdsToAssign, product._id!]);
                                    } else {
                                      setExistingProductIdsToAssign(existingProductIdsToAssign.filter(id => id !== product._id));
                                    }
                                  }}
                                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                />
                                {product.imageFront && (
                                  <img
                                    src={product.imageFront}
                                    alt={product.name}
                                    style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }}
                                  />
                                )}
                                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#000" }}>{product.name}</span>
                                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Current Categories: {Array.isArray(product.category) ? product.category.join(", ") : (product.category || "None")}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className={styles.modalActionRow} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "15px", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => { setShowAddExistingToCategoryModal(false); }}
                  className={styles.secondaryActionBtn}
                  disabled={assignLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryActionBtn}
                  disabled={assignLoading || existingProductIdsToAssign.length === 0}
                >
                  {assignLoading ? "Saving..." : "Add to Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Category Confirmation Modal */}
      {deleteCategoryTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Delete Category?</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteCategoryTarget(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className={styles.modalDescription} style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: "1.5", margin: "15px 0" }}>
              Are you sure you want to delete the category <strong>&quot;{deleteCategoryTarget}&quot;</strong>? All products currently in this category will have their category cleared, but they will not be deleted and can still be found in <strong>&quot;All Products&quot;</strong>.
            </p>

            <div className={styles.modalActionRow} style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={() => setDeleteCategoryTarget(null)}
                className={styles.secondaryActionBtn}
                disabled={deleteCategoryLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategoryConfirm}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                disabled={deleteCategoryLoading}
              >
                {deleteCategoryLoading ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              <h3>Delete Perfume?</h3>
            </div>

            <p className={styles.modalDescription}>
              Are you sure you want to delete this perfume from your inventory catalog? This action is permanent and cannot be undone.
            </p>

            <div className={styles.modalActionRow}>
              <button
                onClick={async () => {
                  if (deleteTargetId) {
                    setIsDeletingProduct(true);
                    await handleDelete(deleteTargetId);
                    setDeleteTargetId(null);
                    setIsDeletingProduct(false);
                  }
                }}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingProduct ? 0.7 : 1 }}
                disabled={isDeletingProduct}
              >
                {isDeletingProduct ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setDeleteTargetId(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingProduct}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Overlay Modal */}
      {customAlert && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#000000" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <h3>{customAlert.title}</h3>
            </div>

            <p className={styles.modalDescription}>
              {customAlert.message}
            </p>

            <div className={styles.modalActionRow}>
              <button
                onClick={() => setCustomAlert(null)}
                className={styles.primaryActionBtn}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <h3>Reset Customize Settings?</h3>
            </div>

            <p className={styles.modalDescription}>
              Are you sure you want to reset all storefront layout options, text copies, theme color, and banner configurations back to factory system defaults?
            </p>

            <div className={styles.modalActionRow}>
              <button
                onClick={handleResetToDefaults}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className={styles.secondaryActionBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification for Success Messages */}
      {successMessage && (
        <div className={styles.toastNotification}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#10b981" style={{ width: "20px", height: "20px", marginRight: "10px", flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Selected Customer Detail Modal */}
      {selectedCustomer && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCustomer(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000, padding: "20px" }} data-lenis-prevent="true">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "600px", background: "#fff", borderRadius: "8px", padding: "30px", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eaeaea", paddingBottom: "12px", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#111827" }}>Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Name</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827", fontWeight: 600 }}>{selectedCustomer.name}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Email Address</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827" }}>{selectedCustomer.email}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Phone Number</p>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827" }}>{selectedCustomer.phone}</p>
                </div>
              </div>
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Shipping Address (Latest)</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827", lineHeight: "1.4" }}>{selectedCustomer.address}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "10px", padding: "15px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Total Orders</p>
                  <p style={{ margin: 0, fontSize: "1.2rem", color: "#111827", fontWeight: 700 }}>{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Total Spend</p>
                  <p style={{ margin: 0, fontSize: "1.2rem", color: "#10b981", fontWeight: 700 }}>₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}.00</p>
                </div>
              </div>

              {/* Order History Table */}
              <div style={{ marginTop: "10px" }}>
                <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: "#111827", textTransform: "uppercase", fontWeight: 700, borderBottom: "1px solid #eaeaea", paddingBottom: "5px" }}>Order History</p>
                <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #eaeaea", borderRadius: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                    <thead style={{ position: "sticky", top: 0, backgroundColor: "#f9fafb", zIndex: 1 }}>
                      <tr>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Order ID</th>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Date</th>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Amount</th>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(o => o.customerEmail === selectedCustomer.email).length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#9ca3af", fontStyle: "italic" }}>No orders found for this customer.</td>
                        </tr>
                      ) : (
                        orders
                          .filter(o => o.customerEmail === selectedCustomer.email)
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((order) => (
                            <tr key={order._id} style={{ borderBottom: "1px solid #eaeaea" }}>
                              <td style={{ padding: "8px 12px", color: "#111827", fontWeight: 500 }}>{order.orderId}</td>
                              <td style={{ padding: "8px 12px", color: "#6b7280" }}>
                                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td style={{ padding: "8px 12px", color: "#111827", fontWeight: 600 }}>₹{order.totalAmount.toLocaleString("en-IN")}.00</td>
                              <td style={{ padding: "8px 12px" }}>
                                <span style={{
                                  display: "inline-block",
                                  padding: "2px 6px",
                                  borderRadius: "12px",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  backgroundColor: order.status === "Delivered" ? "#eaf7ee" : order.status === "Shipped" ? "#eff6ff" : "#fef3c7",
                                  color: order.status === "Delivered" ? "#15803d" : order.status === "Shipped" ? "#1d4ed8" : "#b45309"
                                }}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setDeleteCustomerTargetId(selectedCustomer._id)} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}>Delete Customer</button>
              <button onClick={() => setSelectedCustomer(null)} className={styles.secondaryActionBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteCustomerTargetId && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              <h3>Confirm Delete Customer</h3>
            </div>
            <p className={styles.modalDescription}>
              Are you sure you want to remove this customer from the directory? Historical orders will not be deleted.
            </p>
            <div className={styles.modalActionRow}>
              <button
                onClick={() => handleDeleteCustomer(deleteCustomerTargetId)}
                disabled={isDeletingCustomer}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingCustomer ? 0.7 : 1 }}
              >
                {isDeletingCustomer ? "Deleting..." : "Delete Customer"}
              </button>
              <button
                onClick={() => setDeleteCustomerTargetId(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingCustomer}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000, padding: "20px" }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "600px", background: "#fff", borderRadius: "8px", padding: "30px", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eaeaea", paddingBottom: "12px", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#111827" }}>Order Details: <span style={{ fontFamily: "monospace", color: "#4f46e5" }}>{selectedOrder.orderId}</span></h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", color: "#888" }}>Customer Information</h3>
                <p style={{ margin: "4px 0", fontSize: "0.88rem", color: "#111827" }}><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p style={{ margin: "4px 0", fontSize: "0.88rem", color: "#111827" }}><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p style={{ margin: "4px 0", fontSize: "0.88rem", color: "#111827" }}><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                <p style={{ margin: "4px 0", fontSize: "0.88rem", color: "#111827" }}><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
              </div>

              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", color: "#888" }}>Fulfillment status</h3>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    backgroundColor: selectedOrder.status === "Delivered" ? "#eaf7ee" : selectedOrder.status === "Shipped" ? "#eff6ff" : selectedOrder.status === "Cancelled" ? "#fee2e2" : "#fef3c7",
                    color: selectedOrder.status === "Delivered" ? "#15803d" : selectedOrder.status === "Shipped" ? "#1d4ed8" : selectedOrder.status === "Cancelled" ? "#ef4444" : "#b45309"
                  }}>
                    {selectedOrder.status}
                  </span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                    style={{ padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.8rem", background: "#fff", cursor: "pointer", color: "#000" }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Return Requested">Return Requested</option>
                    <option value="Returned">Returned</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {selectedOrder.paymentMethod !== "COD" && (
                <div>
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", color: "#888" }}>Refund Status</h3>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      backgroundColor: selectedOrder.refundStatus === "Refunded" ? "#eaf7ee" : "#fef3c7",
                      color: selectedOrder.refundStatus === "Refunded" ? "#15803d" : "#b45309"
                    }}>
                      {selectedOrder.refundStatus || "Not Refunded"}
                    </span>
                    <select
                      value={selectedOrder.refundStatus || "Not Refunded"}
                      onChange={(e) => handleUpdateRefundStatus(selectedOrder._id, e.target.value)}
                      style={{ padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.8rem", background: "#fff", cursor: "pointer", color: "#000" }}
                    >
                      <option value="Not Refunded">Not Refunded</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px 0", color: "#888" }}>Items Purchased</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedOrder.cartItems.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "15px", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" }}>
                      {item.image && (
                        <img src={item.image} alt={item.name} style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#111" }}>{item.name}</h4>
                        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Volume: {item.size} | Qty: {item.quantity}</span>
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}.00</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #eaeaea", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111" }}>Total Amount Due (COD)</span>
                <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#4f46e5" }}>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}.00</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Brand Header Title Font Customizer Pop-up Modal */}
      {showHeroTitleFontOptions && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15000,
            padding: "20px"
          }}
          onClick={() => {
            // Restore from backup on clicking backdrop
            if (heroBackup) {
              setHeroTitle(heroBackup.heroTitle);
              setHeroManifesto(heroBackup.heroManifesto);
              setHeroTemplate(heroBackup.heroTemplate);
              setShowHeroTitle(heroBackup.showHeroTitle);
              setShowHeroManifesto(heroBackup.showHeroManifesto);
              setShowHeroButton(heroBackup.showHeroButton);
              setHeroButtonText(heroBackup.heroButtonText);
              setHeroButtonStyle(heroBackup.heroButtonStyle);
              setHeroButtonSize(heroBackup.heroButtonSize);
              setHeroButtonColor(heroBackup.heroButtonColor);
              setHeroButtonTextColor(heroBackup.heroButtonTextColor);
              setHeroTitleFontType(heroBackup.heroTitleFontType);
              setHeroTitleFontColor(heroBackup.heroTitleFontColor);
              setHeroTitleFontSize(heroBackup.heroTitleFontSize);
              setHeroTitleFontAlignment(heroBackup.heroTitleFontAlignment);
              setHeroTitleFontWeight(heroBackup.heroTitleFontWeight);
              setHeroManifestoFontType(heroBackup.heroManifestoFontType);
              setHeroManifestoFontColor(heroBackup.heroManifestoFontColor);
              setHeroManifestoFontSize(heroBackup.heroManifestoFontSize);
              setHeroManifestoFontAlignment(heroBackup.heroManifestoFontAlignment);
              setHeroManifestoFontWeight(heroBackup.heroManifestoFontWeight);
            }
            setShowHeroTitleFontOptions(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              width: "95vw",
              maxWidth: "1280px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "95vh",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 30px",
              borderBottom: "1px solid #f3f4f6",
              backgroundColor: "#fafafa"
            }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#111827", fontFamily: "Outfit, sans-serif" }}>
                  Customize Landing Page Hero Section
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
                  Select a layout template structure, and click on any text box or button in the live preview to edit its content or toggle its visibility.
                </p>
              </div>
              <button
                onClick={() => {
                  // Restore from backup on click close
                  if (heroBackup) {
                    setHeroTitle(heroBackup.heroTitle);
                    setHeroManifesto(heroBackup.heroManifesto);
                    setHeroTemplate(heroBackup.heroTemplate);
                    setShowHeroTitle(heroBackup.showHeroTitle);
                    setShowHeroManifesto(heroBackup.showHeroManifesto);
                    setShowHeroButton(heroBackup.showHeroButton);
                    setHeroButtonText(heroBackup.heroButtonText);
                    setHeroButtonStyle(heroBackup.heroButtonStyle);
                    setHeroButtonSize(heroBackup.heroButtonSize);
                    setHeroButtonColor(heroBackup.heroButtonColor);
                    setHeroButtonTextColor(heroBackup.heroButtonTextColor);
                    setHeroTitleFontType(heroBackup.heroTitleFontType);
                    setHeroTitleFontColor(heroBackup.heroTitleFontColor);
                    setHeroTitleFontSize(heroBackup.heroTitleFontSize);
                    setHeroTitleFontAlignment(heroBackup.heroTitleFontAlignment);
                    setHeroTitleFontWeight(heroBackup.heroTitleFontWeight);
                    setHeroManifestoFontType(heroBackup.heroManifestoFontType);
                    setHeroManifestoFontColor(heroBackup.heroManifestoFontColor);
                    setHeroManifestoFontSize(heroBackup.heroManifestoFontSize);
                    setHeroManifestoFontAlignment(heroBackup.heroManifestoFontAlignment);
                    setHeroManifestoFontWeight(heroBackup.heroManifestoFontWeight);
                  }
                  setShowHeroTitleFontOptions(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#9ca3af",
                  lineHeight: 1,
                  padding: "8px"
                }}
              >
                ✕
              </button>
            </div>

            {/* Split layout for settings and preview */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: "65vh" }}>
              
              {/* Left sidebar: Templates and Active component settings */}
              <div style={{
                width: "420px",
                borderRight: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                backgroundColor: "#ffffff",
                padding: "24px",
                boxSizing: "border-box"
              }}>
                {/* 1. Visual Layout Templates Selector */}
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: "0 0 12px 0" }}>
                  1. Page Structure Layout Template
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "30px" }}>
                  {[
                    {
                      id: "center",
                      label: "Classic Center",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="25" y1="15" x2="75" y2="15" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="35" y1="23" x2="65" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="40" y="32" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "top-center",
                      label: "Top Center",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="25" y1="10" x2="75" y2="10" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="35" y1="17" x2="65" y2="17" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="40" y="24" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "bottom-center",
                      label: "Bottom Center",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="25" y1="22" x2="75" y2="22" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="35" y1="29" x2="65" y2="29" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="40" y="36" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "left",
                      label: "Left Centered",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="12" y1="15" x2="55" y2="15" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="12" y1="23" x2="60" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="12" y="32" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "bottom-left",
                      label: "Bottom Left",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="12" y1="23" x2="50" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="12" y1="31" x2="60" y2="31" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="12" y="38" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "top-left",
                      label: "Top Left",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="12" y1="12" x2="50" y2="12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="12" y1="20" x2="60" y2="20" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="12" y="28" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "right",
                      label: "Right Centered",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="45" y1="15" x2="88" y2="15" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="40" y1="23" x2="88" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="68" y="32" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "right-top",
                      label: "Right Top",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="45" y1="12" x2="88" y2="12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="40" y1="20" x2="88" y2="20" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="68" y="28" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "right-bottom",
                      label: "Right Bottom",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="45" y1="23" x2="88" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="40" y1="31" x2="88" y2="31" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="68" y="38" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    }
                  ].map((t) => {
                    const isSelected = heroTemplate === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setHeroTemplate(t.id)}
                        style={{
                          flex: 1,
                          background: "none",
                          border: isSelected ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "8px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          alignItems: "center",
                          outline: "none",
                          transition: "all 0.2s"
                        }}
                      >
                        {t.icon}
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isSelected ? "#3b82f6" : "#475569" }}>
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 2. Component Customizer */}
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: "0 0 12px 0" }}>
                  2. Component Editor
                </h4>

                {selectedElement ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                    <div style={{ backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #eff6ff" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#2563eb" }}>
                        Selected Element
                      </span>
                      <h5 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "2px 0 0 0", color: "#0f172a", textTransform: "capitalize" }}>
                        {selectedElement === "title" ? "Hero Title" : selectedElement === "manifesto" ? "Hero Manifesto" : "CTA Button"}
                      </h5>
                    </div>

                    {/* Visibility Switch */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#334155" }}>
                        Enable Element Visibility
                      </span>
                      <input
                        type="checkbox"
                        checked={
                          selectedElement === "title" ? showHeroTitle :
                          selectedElement === "manifesto" ? showHeroManifesto :
                          showHeroButton
                        }
                        onChange={(e) => {
                          const val = e.target.checked;
                          if (selectedElement === "title") setShowHeroTitle(val);
                          else if (selectedElement === "manifesto") setShowHeroManifesto(val);
                          else setShowHeroButton(val);
                        }}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      />
                    </div>

                    {/* Text Field Inputs */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                        Content / Label Text
                      </label>
                      {selectedElement === "manifesto" ? (
                        <textarea
                          value={heroManifesto}
                          onChange={(e) => setHeroManifesto(e.target.value)}
                          disabled={!showHeroManifesto}
                          rows={4}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.88rem",
                            width: "100%",
                            resize: "vertical",
                            boxSizing: "border-box",
                            color: "#000",
                            opacity: showHeroManifesto ? 1 : 0.5
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={selectedElement === "title" ? heroTitle : heroButtonText}
                          onChange={(e) => {
                            if (selectedElement === "title") setHeroTitle(e.target.value);
                            else setHeroButtonText(e.target.value);
                          }}
                          disabled={selectedElement === "title" ? !showHeroTitle : !showHeroButton}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.88rem",
                            width: "100%",
                            boxSizing: "border-box",
                            color: "#000",
                            opacity: (selectedElement === "title" ? showHeroTitle : showHeroButton) ? 1 : 0.5
                          }}
                        />
                      )}
                    </div>

                    {/* Font & Style options - Only for text elements */}
                    {selectedElement !== "button" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                        
                        {/* Font Type Selection (Custom Dropdown with hover preview) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Family</label>
                          
                          {/* Trigger element */}
                          <div
                            onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.88rem",
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: 600,
                              fontFamily: selectedElement === "title" ? `"${heroTitleFontType}", sans-serif` : `"${heroManifestoFontType}", sans-serif`
                            }}
                          >
                            <span>
                              {selectedElement === "title" ? heroTitleFontType : heroManifestoFontType}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#64748b" style={{ width: "12px", height: "12px", transform: isFontDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>

                          {/* Popover overlay */}
                          {isFontDropdownOpen && (
                            <>
                              <div style={{ position: "fixed", inset: 0, zIndex: 16000 }} onClick={() => { setIsFontDropdownOpen(false); setHoveredFontType(null); }} />
                              <div style={{
                                position: "absolute",
                                top: "68px",
                                left: 0,
                                width: "100%",
                                minWidth: "280px",
                                maxHeight: "320px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                zIndex: 16100,
                                boxSizing: "border-box"
                              }}>
                                {[
                                  { category: "Elegant Serif (Luxury & Heritage)", fonts: [
                                    { name: "Cinzel", label: "Cinzel (Luxury Capital)" },
                                    { name: "Cinzel Decorative", label: "Cinzel Decorative (Ornate)" },
                                    { name: "Cormorant Garamond", label: "Cormorant Garamond (Editorial)" },
                                    { name: "Playfair Display", label: "Playfair Display (Classic)" },
                                    { name: "Prata", label: "Prata (High-Contrast)" },
                                    { name: "Italiana", label: "Italiana (Minimalist)" },
                                    { name: "Bodoni Moda", label: "Bodoni Moda (Modern)" },
                                    { name: "DM Serif Display", label: "DM Serif (Bold Editorial)" },
                                    { name: "EB Garamond", label: "EB Garamond (Luxury Antique)" },
                                    { name: "Spectral", label: "Spectral (Editorial Serif)" },
                                    { name: "Fraunces", label: "Fraunces (Warm & Organic)" }
                                  ]},
                                  { category: "Modern Sans-Serif (Clean & Premium)", fonts: [
                                    { name: "Outfit", label: "Outfit (Modern & Trendy)" },
                                    { name: "Montserrat", label: "Montserrat (Geometric)" },
                                    { name: "Inter", label: "Inter (Technical)" },
                                    { name: "Tenor Sans", label: "Tenor Sans (Clean Chic)" },
                                    { name: "Space Grotesk", label: "Space Grotesk (Tech)" },
                                    { name: "Lora", label: "Lora (Contemporary)" },
                                    { name: "Cabinet Grotesk", label: "Cabinet Grotesk (Luxury Geometric)" }
                                  ]}
                                ].map((cat, catIdx) => (
                                  <div key={catIdx}>
                                    <div style={{
                                      padding: "6px 12px",
                                      fontSize: "0.68rem",
                                      fontWeight: 800,
                                      color: "#94a3b8",
                                      backgroundColor: "#f8fafc",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.05em",
                                      borderBottom: "1px solid #f1f5f9"
                                    }}>
                                      {cat.category}
                                    </div>
                                    {cat.fonts.map((f) => {
                                      const isSelected = (selectedElement === "title" ? heroTitleFontType : heroManifestoFontType) === f.name;
                                      return (
                                        <div
                                          key={f.name}
                                          onClick={() => {
                                            if (selectedElement === "title") setHeroTitleFontType(f.name);
                                            else setHeroManifestoFontType(f.name);
                                            setIsFontDropdownOpen(false);
                                            setHoveredFontType(null);
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                                            setHoveredFontType(f.name);
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = isSelected ? '#eff6ff' : 'transparent';
                                            setHoveredFontType(null);
                                          }}
                                          style={{
                                            padding: "8px 12px",
                                            fontSize: "0.85rem",
                                            cursor: "pointer",
                                            fontFamily: `"${f.name}", sans-serif`,
                                            backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                            color: isSelected ? "#2563eb" : "#334155",
                                            fontWeight: isSelected ? 700 : 500,
                                            borderBottom: "1px solid #f8fafc",
                                            transition: "background-color 0.15s"
                                          }}
                                        >
                                          {f.label}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Font Size Selection (Custom Popover with hover preview) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Size</label>
                          
                          {/* Trigger */}
                          <div
                            onClick={() => setIsFontSizeDropdownOpen(!isFontSizeDropdownOpen)}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.88rem",
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: 600
                            }}
                          >
                            <span>
                              {selectedElement === "title" ? heroTitleFontSize : heroManifestoFontSize}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#64748b" style={{ width: "12px", height: "12px", transform: isFontSizeDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>

                          {/* Popover list */}
                          {isFontSizeDropdownOpen && (
                            <>
                              <div style={{ position: "fixed", inset: 0, zIndex: 16000 }} onClick={() => { setIsFontSizeDropdownOpen(false); setHoveredFontSize(null); }} />
                              <div style={{
                                position: "absolute",
                                top: "68px",
                                left: 0,
                                width: "100%",
                                minWidth: "200px",
                                maxHeight: "280px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                zIndex: 16100,
                                boxSizing: "border-box"
                              }}>
                                {(selectedElement === "title"
                                  ? ["1.5rem", "2.0rem", "2.5rem", "3.0rem", "3.5rem", "4.0rem", "4.5rem", "5.0rem", "5.5rem", "6.0rem", "6.5rem", "7.0rem", "7.5rem", "8.0rem", "9.0rem", "10.0rem"]
                                  : ["0.6rem", "0.7rem", "0.8rem", "0.9rem", "1.0rem", "1.1rem", "1.2rem", "1.3rem", "1.4rem", "1.5rem", "1.6rem", "1.8rem", "2.0rem"]
                                ).map((size) => {
                                  const isSelected = (selectedElement === "title" ? heroTitleFontSize : heroManifestoFontSize) === size;
                                  return (
                                    <div
                                      key={size}
                                      onClick={() => {
                                        if (selectedElement === "title") setHeroTitleFontSize(size);
                                        else setHeroManifestoFontSize(size);
                                        setIsFontSizeDropdownOpen(false);
                                        setHoveredFontSize(null);
                                      }}
                                      onMouseEnter={() => setHoveredFontSize(size)}
                                      onMouseLeave={() => setHoveredFontSize(null)}
                                      style={{
                                        padding: "8px 12px",
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                        color: isSelected ? "#2563eb" : "#334155",
                                        fontWeight: isSelected ? 700 : 500,
                                        borderBottom: "1px solid #f8fafc",
                                        transition: "background-color 0.15s"
                                      }}
                                    >
                                      {size}
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Font Color Picker */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={selectedElement === "title" ? heroTitleFontColor : heroManifestoFontColor}
                              onChange={(e) => {
                                if (selectedElement === "title") setHeroTitleFontColor(e.target.value);
                                else setHeroManifestoFontColor(e.target.value);
                              }}
                              style={{
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                width: "40px",
                                height: "40px",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: "transparent"
                              }}
                            />
                            <input
                              type="text"
                              value={selectedElement === "title" ? heroTitleFontColor : heroManifestoFontColor}
                              onChange={(e) => {
                                if (selectedElement === "title") setHeroTitleFontColor(e.target.value);
                                else setHeroManifestoFontColor(e.target.value);
                              }}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "0.88rem",
                                width: "100%",
                                color: "#000",
                                fontFamily: "monospace"
                              }}
                            />
                          </div>
                        </div>

                        {/* Font Weight (Custom Popover with hover preview) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Weight</label>
                          
                          {/* Trigger */}
                          <div
                            onClick={() => setIsFontWeightDropdownOpen(!isFontWeightDropdownOpen)}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.88rem",
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: 600
                            }}
                          >
                            <span>
                              {selectedElement === "title" 
                                ? { "300": "Light (300)", "400": "Regular (400)", "500": "Medium (500)", "600": "Semi Bold (600)", "700": "Bold (700)", "800": "Extra Bold (800)", "900": "Black (900)" }[heroTitleFontWeight] || heroTitleFontWeight
                                : { "300": "Light (300)", "400": "Regular (400)", "500": "Medium (500)", "600": "Semi Bold (600)", "700": "Bold (700)", "800": "Extra Bold (800)", "900": "Black (900)" }[heroManifestoFontWeight] || heroManifestoFontWeight
                              }
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#64748b" style={{ width: "12px", height: "12px", transform: isFontWeightDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>

                          {/* Popover list */}
                          {isFontWeightDropdownOpen && (
                            <>
                              <div style={{ position: "fixed", inset: 0, zIndex: 16000 }} onClick={() => { setIsFontWeightDropdownOpen(false); setHoveredFontWeight(null); }} />
                              <div style={{
                                position: "absolute",
                                top: "68px",
                                left: 0,
                                width: "100%",
                                minWidth: "200px",
                                maxHeight: "280px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                zIndex: 16100,
                                boxSizing: "border-box"
                              }}>
                                {[
                                  { value: "300", label: "Light (300)" },
                                  { value: "400", label: "Regular (400)" },
                                  { value: "500", label: "Medium (500)" },
                                  { value: "600", label: "Semi Bold (600)" },
                                  { value: "700", label: "Bold (700)" },
                                  { value: "800", label: "Extra Bold (800)" },
                                  { value: "900", label: "Black (900)" }
                                ].map((w) => {
                                  const isSelected = (selectedElement === "title" ? heroTitleFontWeight : heroManifestoFontWeight) === w.value;
                                  return (
                                    <div
                                      key={w.value}
                                      onClick={() => {
                                        if (selectedElement === "title") setHeroTitleFontWeight(w.value);
                                        else setHeroManifestoFontWeight(w.value);
                                        setIsFontWeightDropdownOpen(false);
                                        setHoveredFontWeight(null);
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                                        setHoveredFontWeight(w.value);
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = isSelected ? '#eff6ff' : 'transparent';
                                        setHoveredFontWeight(null);
                                      }}
                                      style={{
                                        padding: "8px 12px",
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                        color: isSelected ? "#2563eb" : "#334155",
                                        fontWeight: isSelected ? 700 : 500,
                                        borderBottom: "1px solid #f8fafc",
                                        transition: "background-color 0.15s"
                                      }}
                                    >
                                      {w.label}
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>

                      </div>
                    )}

                    {/* Button Styling Options - Only for button element */}
                    {selectedElement === "button" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                        
                        {/* Button Style selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Style</label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {["solid", "outline", "minimal"].map((style) => (
                              <button
                                key={style}
                                type="button"
                                onClick={() => setHeroButtonStyle(style)}
                                style={{
                                  flex: 1,
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid #cbd5e1",
                                  backgroundColor: heroButtonStyle === style ? "#111827" : "#ffffff",
                                  color: heroButtonStyle === style ? "#ffffff" : "#374151",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  textTransform: "capitalize"
                                }}
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Button Size selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Size</label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {["sm", "md", "lg"].map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setHeroButtonSize(size)}
                                style={{
                                  flex: 1,
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid #cbd5e1",
                                  backgroundColor: heroButtonSize === size ? "#111827" : "#ffffff",
                                  color: heroButtonSize === size ? "#ffffff" : "#374151",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  textTransform: "uppercase"
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Button Color selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Theme Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={heroButtonColor || "#000000"}
                              onChange={(e) => setHeroButtonColor(e.target.value)}
                              style={{
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                width: "40px",
                                height: "40px",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: "transparent"
                              }}
                            />
                            <input
                              type="text"
                              placeholder="e.g. #ff0000 (falls back to brand primary color if empty)"
                              value={heroButtonColor}
                              onChange={(e) => setHeroButtonColor(e.target.value)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "0.88rem",
                                width: "100%",
                                boxSizing: "border-box",
                                color: "#000",
                                fontFamily: "monospace"
                              }}
                            />
                          </div>
                        </div>

                        {/* Button Text Color selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Text Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={heroButtonTextColor || "#ffffff"}
                              onChange={(e) => setHeroButtonTextColor(e.target.value)}
                              style={{
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                width: "40px",
                                height: "40px",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: "transparent"
                              }}
                            />
                            <input
                              type="text"
                              value={heroButtonTextColor}
                              onChange={(e) => setHeroButtonTextColor(e.target.value)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "0.88rem",
                                width: "100%",
                                boxSizing: "border-box",
                                color: "#000",
                                fontFamily: "monospace"
                              }}
                            />
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: "30px 10px", textAlign: "center", color: "#64748b", border: "1px dashed #e2e8f0", borderRadius: "8px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#94a3b8" style={{ width: "32px", height: "32px", margin: "0 auto 8px auto" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-1.676-1.345c-.528-.407-1.094-.82-1.676-1.228m1.676 1.228a17.382 17.382 0 0 0-3.352-2.528m3.352 2.528c.582.448 1.148.89 1.676 1.345M12 3v18M3 12h18" />
                    </svg>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      Select a component on the live preview to begin customizing it.
                    </span>
                  </div>
                )}

              </div>


              {/* Right panel: Live Interactive Preview */}
              <div style={{
                flex: 1,
                backgroundColor: "#f1f5f9",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", zIndex: 10 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.1em" }}>
                    Live Preview Screen (Visual Layout & Toggles)
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ fontSize: "0.7rem", color: "#2563eb", backgroundColor: "#dbeafe", padding: "4px 8px", borderRadius: "4px", fontWeight: 700 }}>
                      Interactive Elements Enable Click to Select
                    </span>
                  </div>
                </div>

                {/* Scaled Desktop Mock Canvas Wrapper */}
                <div style={{ 
                  width: "100%", 
                  height: "100%", 
                  position: "relative", 
                  overflow: "hidden", 
                  backgroundColor: "#e2e8f0", 
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1"
                }}>
                  {/* Styled Desktop Viewport Scaled Down */}
                  <div
                    onClick={() => setSelectedElement(null)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "1280px",
                      height: "800px",
                      transform: "translate(-50%, -50%) scale(0.55)",
                      transformOrigin: "center center",
                      backgroundColor: heroBgType === "color" ? (heroBgColor || "var(--primary-brand-color, #57bc74)") : "#121212",
                      backgroundImage: heroBgType === "image" && heroBgImage ? `url("${heroBgImage}")` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: 
                        heroTemplate === "top-left" || heroTemplate === "right-top" || heroTemplate === "top-center" ? "flex-start" : 
                        heroTemplate === "bottom-left" || heroTemplate === "right-bottom" || heroTemplate === "bottom-center" ? "flex-end" : "center",
                      alignItems: 
                        heroTemplate === "center" || heroTemplate.endsWith("center") ? "center" : 
                        heroTemplate.startsWith("right") ? "flex-end" : "flex-start",
                      padding: 
                        heroTemplate === "bottom-left" || heroTemplate === "right-bottom" || heroTemplate === "bottom-center" ? "80px 5%" : 
                        heroTemplate === "top-left" || heroTemplate === "right-top" || heroTemplate === "top-center" ? "80px 5%" : "0 5%",
                      textAlign: 
                        heroTemplate === "center" || heroTemplate.endsWith("center") ? "center" : 
                        heroTemplate.startsWith("right") ? "right" : "left",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box"
                    }}
                  >
                    {heroBgType === "video" && heroBgVideo && (
                      <video src={heroBgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
                    )}
                    {heroBgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

                    <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", width: "100%" }}>
                      
                      {/* 1. Hero Title Element */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement("title");
                        }}
                        style={{
                          cursor: "pointer",
                          border: selectedElement === "title" ? "2px dashed #2563eb" : "1px dashed transparent",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          opacity: showHeroTitle ? 1 : 0.45,
                          backgroundColor: selectedElement === "title" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative"
                        }}
                      >
                        {selectedElement === "title" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Title
                          </div>
                        )}
                        {showHeroTitle ? (
                          <h1 style={{
                            fontFamily: selectedElement === "title" && hoveredFontType ? `"${hoveredFontType}", sans-serif` : `"${heroTitleFontType}", sans-serif`,
                            color: heroTitleFontColor,
                            fontSize: selectedElement === "title" && hoveredFontSize ? hoveredFontSize : heroTitleFontSize,
                            fontWeight: Number(selectedElement === "title" && hoveredFontWeight ? hoveredFontWeight : heroTitleFontWeight),
                            margin: 0,
                            lineHeight: "1.1"
                          }}>
                            {heroTitle || ""}
                          </h1>
                        ) : (
                          <span style={{ fontSize: "0.95rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [Title Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>

                      {/* 2. Hero Manifesto Element */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement("manifesto");
                        }}
                        style={{
                          cursor: "pointer",
                          border: selectedElement === "manifesto" ? "2px dashed #2563eb" : "1px dashed transparent",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          opacity: showHeroManifesto ? 1 : 0.45,
                          backgroundColor: selectedElement === "manifesto" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative"
                        }}
                      >
                        {selectedElement === "manifesto" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Manifesto
                          </div>
                        )}
                        {showHeroManifesto ? (
                          <p style={{
                            fontFamily: selectedElement === "manifesto" && hoveredFontType ? `"${hoveredFontType}", sans-serif` : `"${heroManifestoFontType}", sans-serif`,
                            color: heroManifestoFontColor,
                            fontSize: selectedElement === "manifesto" && hoveredFontSize ? hoveredFontSize : heroManifestoFontSize,
                            fontWeight: Number(selectedElement === "manifesto" && hoveredFontWeight ? hoveredFontWeight : heroManifestoFontWeight),
                            margin: 0,
                            lineHeight: "1.6",
                            textTransform: "uppercase",
                            letterSpacing: "0.03em"
                          }}>
                            {heroManifesto || ""}
                          </p>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [Manifesto Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>

                      {/* 3. Hero Button Element */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement("button");
                        }}
                        style={{
                          cursor: "pointer",
                          border: selectedElement === "button" ? "2px dashed #2563eb" : "1px dashed transparent",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          opacity: showHeroButton ? 1 : 0.45,
                          backgroundColor: selectedElement === "button" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative",
                          display: "inline-block",
                          alignSelf: 
                            heroTemplate === "center" || heroTemplate.endsWith("center") ? "center" : 
                            heroTemplate.startsWith("right") ? "flex-end" : "flex-start"
                        }}
                      >
                        {selectedElement === "button" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Button
                          </div>
                        )}
                        {showHeroButton ? (() => {
                          const btnColor = heroButtonColor ? heroButtonColor : (primaryColor || "#000");
                          const isSolid = heroButtonStyle === "solid";
                          const isOutline = heroButtonStyle === "outline";
                          
                          const paddings: Record<string, string> = { sm: "10px 24px", md: "14px 36px", lg: "18px 48px" };
                          const fontSizes: Record<string, string> = { sm: "0.75rem", md: "0.85rem", lg: "0.95rem" };
                          
                          return (
                            <div style={{
                              display: "inline-block",
                              padding: paddings[heroButtonSize] || paddings.md,
                              fontSize: fontSizes[heroButtonSize] || fontSizes.md,
                              backgroundColor: isSolid ? btnColor : "transparent",
                              color: isSolid ? (heroButtonTextColor || "#ffffff") : (heroButtonTextColor || btnColor),
                              border: isSolid || isOutline ? `2px solid ${btnColor}` : "none",
                              textDecoration: heroButtonStyle === "minimal" ? "underline" : "none",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              textAlign: "center"
                            }}>
                              {heroButtonText || "Shop Now"}
                            </div>
                          );
                        })()
                        : (
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [CTA Button Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              padding: "16px 30px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#fafafa"
            }}>
              <button
                type="button"
                onClick={() => {
                  // Restore from backup on click cancel
                  if (heroBackup) {
                    setHeroTitle(heroBackup.heroTitle);
                    setHeroManifesto(heroBackup.heroManifesto);
                    setHeroTemplate(heroBackup.heroTemplate);
                    setShowHeroTitle(heroBackup.showHeroTitle);
                    setShowHeroManifesto(heroBackup.showHeroManifesto);
                    setShowHeroButton(heroBackup.showHeroButton);
                    setHeroButtonText(heroBackup.heroButtonText);
                    setHeroButtonStyle(heroBackup.heroButtonStyle);
                    setHeroButtonSize(heroBackup.heroButtonSize);
                    setHeroButtonColor(heroBackup.heroButtonColor);
                    setHeroButtonTextColor(heroBackup.heroButtonTextColor);
                    setHeroTitleFontType(heroBackup.heroTitleFontType);
                    setHeroTitleFontColor(heroBackup.heroTitleFontColor);
                    setHeroTitleFontSize(heroBackup.heroTitleFontSize);
                    setHeroTitleFontAlignment(heroBackup.heroTitleFontAlignment);
                    setHeroTitleFontWeight(heroBackup.heroTitleFontWeight);
                    setHeroManifestoFontType(heroBackup.heroManifestoFontType);
                    setHeroManifestoFontColor(heroBackup.heroManifestoFontColor);
                    setHeroManifestoFontSize(heroBackup.heroManifestoFontSize);
                    setHeroManifestoFontAlignment(heroBackup.heroManifestoFontAlignment);
                    setHeroManifestoFontWeight(heroBackup.heroManifestoFontWeight);
                  }
                  setShowHeroTitleFontOptions(false);
                }}
                className={styles.secondaryActionBtn}
                style={{ padding: "10px 24px", fontSize: "0.88rem", fontWeight: 600 }}
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={async () => {
                  await saveSettingsSilent();
                  setShowHeroTitleFontOptions(false);
                }}
                className={styles.primaryActionBtn}
                style={{ padding: "10px 24px", fontSize: "0.88rem", fontWeight: 600 }}
              >
                Apply Customization
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Rename Category Modal */}
      {renameCategoryTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#000" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              <h3>Rename Category</h3>
            </div>
            <div style={{ marginTop: "15px", marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>New Category Name</label>
              <input
                type="text"
                value={renameCategoryNewName}
                onChange={(e) => setRenameCategoryNewName(e.target.value)}
                placeholder="Enter new category name..."
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
              />
            </div>
            <div className={styles.modalActionRow}>
              <button
                onClick={handleRenameCategorySubmit}
                disabled={isRenamingCategory || !renameCategoryNewName.trim() || renameCategoryNewName.trim() === renameCategoryTarget}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5", opacity: (isRenamingCategory || !renameCategoryNewName.trim() || renameCategoryNewName.trim() === renameCategoryTarget) ? 0.7 : 1 }}
              >
                {isRenamingCategory ? "Saving..." : "Rename Category"}
              </button>
              <button
                onClick={() => { setRenameCategoryTarget(null); setRenameCategoryNewName(""); }}
                className={styles.secondaryActionBtn}
                disabled={isRenamingCategory}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {deleteReviewTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3>Confirm Deletion</h3>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#4b5563", marginTop: "10px", marginBottom: "20px" }}>
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>
            <div className={styles.modalActionRow}>
              <button
                onClick={handleDeleteAdminReviewConfirm}
                disabled={isDeletingReview}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingReview ? 0.7 : 1 }}
              >
                {isDeletingReview ? "Deleting..." : "Delete Review"}
              </button>
              <button
                onClick={() => setDeleteReviewTarget(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingReview}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editReviewTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#000" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              <h3>Edit Review</h3>
            </div>

            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Author</label>
                <input
                  type="text"
                  value={editReviewTarget.author || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, author: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Location</label>
                <input
                  type="text"
                  value={editReviewTarget.location || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, location: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editReviewTarget.rating || 5}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, rating: Number(e.target.value) })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Title</label>
                <input
                  type="text"
                  value={editReviewTarget.title || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, title: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Comment</label>
                <textarea
                  value={editReviewTarget.comment || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, comment: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem", minHeight: "100px", resize: "vertical" }}
                />
              </div>
            </div>

            <div className={styles.modalActionRow} style={{ marginTop: "20px" }}>
              <button
                onClick={handleEditReviewSubmit}
                disabled={isEditingReview || !editReviewTarget.comment?.trim() || !editReviewTarget.author?.trim()}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6", opacity: (isEditingReview || !editReviewTarget.comment?.trim() || !editReviewTarget.author?.trim()) ? 0.7 : 1 }}
              >
                {isEditingReview ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditReviewTarget(null)}
                className={styles.secondaryActionBtn}
                disabled={isEditingReview}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
