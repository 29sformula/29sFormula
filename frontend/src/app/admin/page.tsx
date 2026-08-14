'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import AdminSidebar from "./components/AdminSidebar";
import HomeTab from "./components/tabs/HomeTab";
import OrdersTab from "./components/tabs/OrdersTab";
import ProductsTab from "./components/tabs/ProductsTab";
import OnlineStoreTab from "./components/tabs/OnlineStoreTab";
import CustomersTab from "./components/tabs/CustomersTab";
import MarketingTab from "./components/tabs/MarketingTab";
import DiscountsTab from "./components/tabs/DiscountsTab";
import { FaqItem, DashboardStats, Product } from "./types";
import { fontCategories, getFontFamilyStack } from "./constants/fonts";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { useDashboardData } from "./hooks/useDashboardData";
import AdminModals from "./components/modals/AdminModals";





export default function AdminDashboard() {
  const fetchedTabs = useRef(new Set<string>());
  const { dashboardStats, fetchDashboardStats } = useDashboardData();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Authorization state
  const { authorized } = useAdminAuth();

  // Layout State
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "products" | "customers" | "marketing" | "discounts" | "online-store">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState<boolean>(false);
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState<boolean>(false);
  const [onlineStoreDropdownOpen, setOnlineStoreDropdownOpen] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"all" | "categories" | "cancelled" | "completed" | "returns">("all");
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

  // Tab-specific lazy fetching
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
    if (activeTab === "customers" && !fetchedTabs.current.has("customers")) {
      fetchedTabs.current.add("customers");
      fetchCustomers();
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
  }, [activeTab, authorized]);
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
  const [returnStatusModalOpen, setReturnStatusModalOpen] = useState(false);
  const [returnStatusAction, setReturnStatusAction] = useState<{ orderId: string, newStatus: string }>({ orderId: "", newStatus: "" });
  const [returnStatusNotes, setReturnStatusNotes] = useState("");
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
          heroManifestoFontType,
          heroManifestoFontColor,
          heroManifestoFontSize,
          heroManifestoFontAlignment,
          heroManifestoFontWeight,
          heroTemplate,
          showHeroTitle,
          showHeroManifesto,
          showHeroButton,
          heroButtonText,
          heroButtonStyle,
          heroButtonSize,
          heroButtonColor,
          heroButtonTextColor,
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
          showProductReviews,
          showProductExploreMore,
          showProductFaq,
          usageGuideText,
          exploreMoreTitle,
          deliverySubtext,
          supportText,
          careersText,
          tradeEnquiryText,
          aboutUsText,
          instagramLink,
          facebookLink,
          contactLink,
          contactUsText,
          returnPolicyText,
          shippingPolicyText,
          faqs,
          googleClientId
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
          heroManifestoFontType,
          heroManifestoFontColor,
          heroManifestoFontSize,
          heroManifestoFontAlignment,
          heroManifestoFontWeight,
          heroTemplate,
          showHeroTitle,
          showHeroManifesto,
          showHeroButton,
          heroButtonText,
          heroButtonStyle,
          heroButtonSize,
          heroButtonColor,
          heroButtonTextColor,
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
          showProductReviews,
          showProductExploreMore,
          showProductFaq,
          usageGuideText,
          exploreMoreTitle,
          deliverySubtext,
          supportText,
          careersText,
          tradeEnquiryText,
          aboutUsText,
          instagramLink,
          facebookLink,
          contactLink,
          contactUsText,
          returnPolicyText,
          shippingPolicyText,
          faqs,
          googleClientId
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
          heroManifestoFontType,
          heroManifestoFontColor,
          heroManifestoFontSize,
          heroManifestoFontAlignment,
          heroManifestoFontWeight,
          heroTemplate,
          showHeroTitle,
          showHeroManifesto,
          showHeroButton,
          heroButtonText,
          heroButtonStyle,
          heroButtonSize,
          heroButtonColor,
          heroButtonTextColor,
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
          showProductReviews,
          showProductExploreMore,
          showProductFaq,
          usageGuideText,
          exploreMoreTitle,
          deliverySubtext,
          supportText,
          careersText,
          tradeEnquiryText,
          aboutUsText,
          instagramLink,
          facebookLink,
          contactLink,
          contactUsText,
          returnPolicyText,
          shippingPolicyText,
          faqs,
          googleClientId
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
          heroManifestoFontType,
          heroManifestoFontColor,
          heroManifestoFontSize,
          heroManifestoFontAlignment,
          heroManifestoFontWeight,
          heroTemplate,
          showHeroTitle,
          showHeroManifesto,
          showHeroButton,
          heroButtonText,
          heroButtonStyle,
          heroButtonSize,
          heroButtonColor,
          heroButtonTextColor,
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
          showProductReviews,
          showProductExploreMore,
          showProductFaq,
          usageGuideText,
          exploreMoreTitle,
          deliverySubtext,
          supportText,
          careersText,
          tradeEnquiryText,
          aboutUsText,
          instagramLink,
          facebookLink,
          contactLink,
          contactUsText,
          returnPolicyText,
          shippingPolicyText,
          faqs,
          googleClientId
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

  const handleUpdateReturnStatus = (orderId: string, newStatus: string) => {
    if (newStatus === "Pending") {
      executeReturnStatusUpdate(orderId, newStatus, "");
    } else {
      setReturnStatusAction({ orderId, newStatus });
      setReturnStatusNotes("");
      setReturnStatusModalOpen(true);
    }
  };

  const executeReturnStatusUpdate = async (orderId: string, newStatus: string, notes: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/orders/${orderId}/return-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNotes: notes })
      });
      if (!res.ok) throw new Error("Failed to update return status");
      const updatedReq = await res.json();
      
      setOrders(prev => prev.map(o => {
        if (o._id === orderId) {
          return { 
            ...o, 
            returnRequest: updatedReq, 
            status: newStatus === "Approved" ? "Return Approved" : newStatus === "Rejected" ? "Return Rejected" : o.status 
          };
        }
        return o;
      }));
      setReturnStatusModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update return request status.");
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

      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        customizeSubTab={customizeSubTab}
        setCustomizeSubTab={setCustomizeSubTab}
        ordersDropdownOpen={ordersDropdownOpen}
        productsDropdownOpen={productsDropdownOpen}
        onlineStoreDropdownOpen={onlineStoreDropdownOpen}
        setOrdersDropdownOpen={setOrdersDropdownOpen}
        setProductsDropdownOpen={setProductsDropdownOpen}
        setOnlineStoreDropdownOpen={setOnlineStoreDropdownOpen}
        setActiveTab={setActiveTab}
        setActiveSubTab={setActiveSubTab}
        setSelectedCategoryView={setSelectedCategoryView}
        handleNavigationTrigger={handleNavigationTrigger}
      />

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
            <HomeTab
              dashboardStats={dashboardStats}
              setActiveTab={setActiveTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}


          {activeTab === "orders" && (
            <OrdersTab
              activeSubTab={activeSubTab}
              orders={orders}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isRefundFilterOpen={isRefundFilterOpen}
              setIsRefundFilterOpen={setIsRefundFilterOpen}
              refundStatusFilter={refundStatusFilter}
              setRefundStatusFilter={setRefundStatusFilter}
              isStatusFilterOpen={isStatusFilterOpen}
              setIsStatusFilterOpen={setIsStatusFilterOpen}
              orderStatusFilter={orderStatusFilter}
              setOrderStatusFilter={setOrderStatusFilter}
              fetchOrders={fetchOrders}
              openStatusDropdownId={openStatusDropdownId}
              setOpenStatusDropdownId={setOpenStatusDropdownId}
              handleUpdateReturnStatus={handleUpdateReturnStatus}
              handleUpdateOrderStatus={handleUpdateOrderStatus}
              setSelectedOrder={setSelectedOrder}
              handleDeleteOrder={handleDeleteOrder}
            />
          )}

          <ProductsTab
              activeTab={activeTab}
              activeSubTab={activeSubTab}
              setIsEditing={setIsEditing}
              resetForm={resetForm}
              setShowCrudModal={setShowCrudModal}
              error={error}
              showCrudModal={showCrudModal}
              loading={loading}
              filteredProducts={filteredProducts}
              expandedProducts={expandedProducts}
              toggleExpand={toggleExpand}
              setActiveCategoryPopoverProductId={setActiveCategoryPopoverProductId}
              activeCategoryPopoverProductId={activeCategoryPopoverProductId}
              handleEdit={handleEdit}
              setDeleteTargetId={setDeleteTargetId}
              selectedCategoryView={selectedCategoryView}
              setSelectedCategoryView={setSelectedCategoryView}
              setShowCategoryAddOptionsModal={setShowCategoryAddOptionsModal}
              products={products}
              setNewCategoryName={setNewCategoryName}
              setSelectedProductIds={setSelectedProductIds}
              setCategoryModalError={setCategoryModalError}
              setShowAddCategoryModal={setShowAddCategoryModal}
              allCategories={allCategories}
              setRenameCategoryTarget={setRenameCategoryTarget}
              setRenameCategoryNewName={setRenameCategoryNewName}
              setDeleteCategoryTarget={setDeleteCategoryTarget}
            />
          <OnlineStoreTab
              heroButtonColor={heroButtonColor}
              heroButtonSize={heroButtonSize}
              heroButtonStyle={heroButtonStyle}
              heroButtonText={heroButtonText}
              heroButtonTextColor={heroButtonTextColor}
              heroTemplate={heroTemplate}
              showHeroTitle={showHeroTitle}
              showHeroManifesto={showHeroManifesto}
              showHeroButton={showHeroButton}
              activeTab={activeTab}
              customizeSubTab={customizeSubTab}
              error={error}
              handleSaveSettings={handleSaveSettings}
              setActiveCustomizerSection={setActiveCustomizerSection}
              activeCustomizerSection={activeCustomizerSection}
              setHeroBackup={setHeroBackup}
              setDrafts={setDrafts}
              heroTitleFontType={heroTitleFontType}
              selectedElement={selectedElement}
              hoveredFontSize={hoveredFontSize}
              heroTitleFontSize={heroTitleFontSize}
              heroTitleFontColor={heroTitleFontColor}
              heroTitleFontAlignment={heroTitleFontAlignment}
              heroTitleFontWeight={heroTitleFontWeight}
              heroManifestoFontType={heroManifestoFontType}
              heroManifestoFontSize={heroManifestoFontSize}
              heroManifestoFontColor={heroManifestoFontColor}
              heroManifestoFontAlignment={heroManifestoFontAlignment}
              heroManifestoFontWeight={heroManifestoFontWeight}
              setSelectedElement={setSelectedElement}
              setShowHeroTitleFontOptions={setShowHeroTitleFontOptions}
              heroTitle={heroTitle}
              setHeroTitle={setHeroTitle}
              heroManifesto={heroManifesto}
              setHeroManifesto={setHeroManifesto}
              heroBgType={heroBgType}
              setHeroBgType={setHeroBgType}
              heroBgColor={heroBgColor}
              setHeroBgColor={setHeroBgColor}
              heroBgImage={heroBgImage}
              setHeroBgImage={setHeroBgImage}
              heroBgVideo={heroBgVideo}
              setHeroBgVideo={setHeroBgVideo}
              setHeroTitleFontType={setHeroTitleFontType}
              setHeroTitleFontColor={setHeroTitleFontColor}
              setHeroTitleFontSize={setHeroTitleFontSize}
              setHeroTitleFontAlignment={setHeroTitleFontAlignment}
              setHeroTitleFontWeight={setHeroTitleFontWeight}
              showVideo={showVideo}
              setShowVideo={setShowVideo}
              videoTitle={videoTitle}
              setVideoTitle={setVideoTitle}
              videoSubtitle={videoSubtitle}
              setVideoSubtitle={setVideoSubtitle}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              uploadingVideo={uploadingVideo}
              videoFallbackColor={videoFallbackColor}
              handleVideoUpload={handleVideoUpload}
              videoProgress={videoProgress}
              setVideoFallbackColor={setVideoFallbackColor}
              showLifestyle={showLifestyle}
              setShowLifestyle={setShowLifestyle}
              lifestyleText={lifestyleText}
              setLifestyleText={setLifestyleText}
              lifestyleImage={lifestyleImage}
              setLifestyleImage={setLifestyleImage}
              uploadingLifestyle={uploadingLifestyle}
              handleLifestyleImageUpload={handleLifestyleImageUpload}
              primaryColor={primaryColor}
              setPrimaryColor={setPrimaryColor}
              brandLogoType={brandLogoType}
              setBrandLogoType={setBrandLogoType}
              brandLogoValue={brandLogoValue}
              setBrandLogoValue={setBrandLogoValue}
              uploadingLogo={uploadingLogo}
              handleBrandLogoUpload={handleBrandLogoUpload}
              setGoogleClientId={setGoogleClientId}
              supportText={supportText}
              setSupportText={setSupportText}
              careersText={careersText}
              setCareersText={setCareersText}
              tradeEnquiryText={tradeEnquiryText}
              setTradeEnquiryText={setTradeEnquiryText}
              aboutUsText={aboutUsText}
              setAboutUsText={setAboutUsText}
              instagramLink={instagramLink}
              setInstagramLink={setInstagramLink}
              facebookLink={facebookLink}
              setFacebookLink={setFacebookLink}
              contactLink={contactLink}
              setContactLink={setContactLink}
              contactUsText={contactUsText}
              setContactUsText={setContactUsText}
              returnPolicyText={returnPolicyText}
              setReturnPolicyText={setReturnPolicyText}
              shippingPolicyText={shippingPolicyText}
              setShippingPolicyText={setShippingPolicyText}
              faqs={faqs}
              setFaqs={setFaqs}
              showProductReviews={showProductReviews}
              setShowProductReviews={setShowProductReviews}
              showProductExploreMore={showProductExploreMore}
              setShowProductExploreMore={setShowProductExploreMore}
              showProductFaq={showProductFaq}
              setShowProductFaq={setShowProductFaq}
              usageGuideText={usageGuideText}
              setUsageGuideText={setUsageGuideText}
              exploreMoreTitle={exploreMoreTitle}
              setExploreMoreTitle={setExploreMoreTitle}
              deliverySubtext={deliverySubtext}
              setDeliverySubtext={setDeliverySubtext}
              fetchAdminReviews={fetchAdminReviews}
              adminReviews={adminReviews}
              reviewSearchQuery={reviewSearchQuery}
              setEditReviewTarget={setEditReviewTarget}
              setDeleteReviewTarget={setDeleteReviewTarget}
              loadingSettings={loadingSettings}
              hasUnsavedChanges={hasUnsavedChanges}
              setShowResetConfirmModal={setShowResetConfirmModal}
            />
          <CustomersTab
              activeTab={activeTab}
              customers={customers}
              setSelectedCustomer={setSelectedCustomer}
              setDeleteCustomerTargetId={setDeleteCustomerTargetId}
            />
          <MarketingTab
              activeTab={activeTab}
              showTicker={showTicker}
              setShowTicker={setShowTicker}
              saveSettingsSilent={saveSettingsSilent}
              tickerText={tickerText}
              setTickerText={setTickerText}
            />
          <DiscountsTab
              activeTab={activeTab}
              handleCreateDiscount={handleCreateDiscount}
              discountError={discountError}
              newDiscountCode={newDiscountCode}
              setNewDiscountCode={setNewDiscountCode}
              newDiscountType={newDiscountType}
              setNewDiscountType={setNewDiscountType}
              newDiscountValue={newDiscountValue}
              setNewDiscountValue={setNewDiscountValue}
              newDiscountMinOrder={newDiscountMinOrder}
              setNewDiscountMinOrder={setNewDiscountMinOrder}
              discountsList={discountsList}
              setDeleteDiscountConfirmId={setDeleteDiscountConfirmId}

            />
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

        <AdminModals
          allCategories={allCategories}
          assignLoading={assignLoading}
          category={category}
          categoryModalError={categoryModalError}
          categoryModalLoading={categoryModalLoading}
          customAlert={customAlert}
          deleteCategoryLoading={deleteCategoryLoading}
          deleteCategoryTarget={deleteCategoryTarget}
          deleteCustomerTargetId={deleteCustomerTargetId}
          deleteReviewTarget={deleteReviewTarget}
          deleteTargetId={deleteTargetId}
          description={description}
          editReviewTarget={editReviewTarget}
          error={error}
          executeReturnStatusUpdate={executeReturnStatusUpdate}
          existingProductIdsToAssign={existingProductIdsToAssign}
          handleAddCategorySubmit={handleAddCategorySubmit}
          handleAssignExistingToCategory={handleAssignExistingToCategory}
          handleDelete={handleDelete}
          handleDeleteAdminReviewConfirm={handleDeleteAdminReviewConfirm}
          handleDeleteCategoryConfirm={handleDeleteCategoryConfirm}
          handleDeleteCustomer={handleDeleteCustomer}
          handleEditReviewSubmit={handleEditReviewSubmit}
          handleMultipleFilesUpload={handleMultipleFilesUpload}
          handleRemoveImage={handleRemoveImage}
          handleRenameCategorySubmit={handleRenameCategorySubmit}
          handleResetToDefaults={handleResetToDefaults}
          handleSubmit={handleSubmit}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
          handleUpdateRefundStatus={handleUpdateRefundStatus}
          heroBackup={heroBackup}
          heroBgColor={heroBgColor}
          heroBgImage={heroBgImage}
          heroBgType={heroBgType}
          heroBgVideo={heroBgVideo}
          heroButtonColor={heroButtonColor}
          heroButtonSize={heroButtonSize}
          heroButtonStyle={heroButtonStyle}
          heroButtonText={heroButtonText}
          heroButtonTextColor={heroButtonTextColor}
          heroManifesto={heroManifesto}
          heroManifestoFontAlignment={heroManifestoFontAlignment}
          heroManifestoFontColor={heroManifestoFontColor}
          heroManifestoFontSize={heroManifestoFontSize}
          heroManifestoFontType={heroManifestoFontType}
          heroManifestoFontWeight={heroManifestoFontWeight}
          heroTemplate={heroTemplate}
          heroTitle={heroTitle}
          heroTitleFontAlignment={heroTitleFontAlignment}
          heroTitleFontColor={heroTitleFontColor}
          heroTitleFontSize={heroTitleFontSize}
          heroTitleFontType={heroTitleFontType}
          heroTitleFontWeight={heroTitleFontWeight}
          hoveredFontSize={hoveredFontSize}
          hoveredFontType={hoveredFontType}
          hoveredFontWeight={hoveredFontWeight}
          images={images}
          isDeletingCustomer={isDeletingCustomer}
          isDeletingProduct={isDeletingProduct}
          isDeletingReview={isDeletingReview}
          isEditing={isEditing}
          isEditingReview={isEditingReview}
          isFontDropdownOpen={isFontDropdownOpen}
          isFontSizeDropdownOpen={isFontSizeDropdownOpen}
          isFontWeightDropdownOpen={isFontWeightDropdownOpen}
          isRenamingCategory={isRenamingCategory}
          name={name}
          newCategoryName={newCategoryName}
          openCategoryIndex={openCategoryIndex}
          options={options}
          orders={orders}
          price={price}
          primaryColor={primaryColor}
          products={products}
          renameCategoryNewName={renameCategoryNewName}
          renameCategoryTarget={renameCategoryTarget}
          resetForm={resetForm}
          returnStatusAction={returnStatusAction}
          returnStatusModalOpen={returnStatusModalOpen}
          returnStatusNotes={returnStatusNotes}
          saveSettingsSilent={saveSettingsSilent}
          selectedCategoryView={selectedCategoryView}
          selectedCustomer={selectedCustomer}
          selectedElement={selectedElement}
          selectedOrder={selectedOrder}
          selectedProductIds={selectedProductIds}
          setCategory={setCategory}
          setCustomAlert={setCustomAlert}
          setDeleteCategoryTarget={setDeleteCategoryTarget}
          setDeleteCustomerTargetId={setDeleteCustomerTargetId}
          setDeleteReviewTarget={setDeleteReviewTarget}
          setDeleteTargetId={setDeleteTargetId}
          setDescription={setDescription}
          setEditReviewTarget={setEditReviewTarget}
          setExistingProductIdsToAssign={setExistingProductIdsToAssign}
          setHeroButtonColor={setHeroButtonColor}
          setHeroButtonSize={setHeroButtonSize}
          setHeroButtonStyle={setHeroButtonStyle}
          setHeroButtonText={setHeroButtonText}
          setHeroButtonTextColor={setHeroButtonTextColor}
          setHeroManifesto={setHeroManifesto}
          setHeroManifestoFontAlignment={setHeroManifestoFontAlignment}
          setHeroManifestoFontColor={setHeroManifestoFontColor}
          setHeroManifestoFontSize={setHeroManifestoFontSize}
          setHeroManifestoFontType={setHeroManifestoFontType}
          setHeroManifestoFontWeight={setHeroManifestoFontWeight}
          setHeroTemplate={setHeroTemplate}
          setHeroTitle={setHeroTitle}
          setHeroTitleFontAlignment={setHeroTitleFontAlignment}
          setHeroTitleFontColor={setHeroTitleFontColor}
          setHeroTitleFontSize={setHeroTitleFontSize}
          setHeroTitleFontType={setHeroTitleFontType}
          setHeroTitleFontWeight={setHeroTitleFontWeight}
          setHoveredFontSize={setHoveredFontSize}
          setHoveredFontType={setHoveredFontType}
          setHoveredFontWeight={setHoveredFontWeight}
          setImageFront={setImageFront}
          setIsDeletingProduct={setIsDeletingProduct}
          setIsEditing={setIsEditing}
          setIsFontDropdownOpen={setIsFontDropdownOpen}
          setIsFontSizeDropdownOpen={setIsFontSizeDropdownOpen}
          setIsFontWeightDropdownOpen={setIsFontWeightDropdownOpen}
          setName={setName}
          setNewCategoryName={setNewCategoryName}
          setOpenCategoryIndex={setOpenCategoryIndex}
          setOptions={setOptions}
          setRenameCategoryNewName={setRenameCategoryNewName}
          setRenameCategoryTarget={setRenameCategoryTarget}
          setReturnStatusModalOpen={setReturnStatusModalOpen}
          setReturnStatusNotes={setReturnStatusNotes}
          setSelectedCustomer={setSelectedCustomer}
          setSelectedElement={setSelectedElement}
          setSelectedOrder={setSelectedOrder}
          setSelectedProductIds={setSelectedProductIds}
          setShowAddCategoryModal={setShowAddCategoryModal}
          setShowAddExistingToCategoryModal={setShowAddExistingToCategoryModal}
          setShowCategoryAddOptionsModal={setShowCategoryAddOptionsModal}
          setShowCrudModal={setShowCrudModal}
          setShowHeroButton={setShowHeroButton}
          setShowHeroManifesto={setShowHeroManifesto}
          setShowHeroTitle={setShowHeroTitle}
          setShowHeroTitleFontOptions={setShowHeroTitleFontOptions}
          setShowResetConfirmModal={setShowResetConfirmModal}
          showAddCategoryModal={showAddCategoryModal}
          showAddExistingToCategoryModal={showAddExistingToCategoryModal}
          showCategoryAddOptionsModal={showCategoryAddOptionsModal}
          showCrudModal={showCrudModal}
          showHeroButton={showHeroButton}
          showHeroManifesto={showHeroManifesto}
          showHeroTitle={showHeroTitle}
          showHeroTitleFontOptions={showHeroTitleFontOptions}
          showResetConfirmModal={showResetConfirmModal}
          successMessage={successMessage}
          uploading={uploading}
        />
    </div>
  );
}
