'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Footer from "@/components/Footer";

import Navbar from "@/components/Navbar/Navbar";

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  cartItems: {
    productId: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
    image?: string;
  }[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  refundStatus?: string;
  createdAt: string;
}

export default function TrackOrderPage() {
  const [queryInput, setQueryInput] = useState("");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [primaryColor, setPrimaryColor] = useState<string>(
    typeof window !== 'undefined' ? (localStorage.getItem("settings_primaryColor") || "#57bc74") : "#57bc74"
  );

  // Session is now handled by Navbar
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/settings", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data && data.primaryColor) {
          setPrimaryColor(data.primaryColor);
              if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);
        }
      })
      .catch(err => console.warn("Failed to load storefront theme color:", err));

    // Auto-fetch orders if user is logged in
    const session = localStorage.getItem("userSession");
    if (session) {
      try {
        const user = JSON.parse(session);
        if (user && user.email) {
          // fetchOrderData is defined below, but since useEffect runs after render, it will be available in the closure
          fetchOrderData(user.email);
        }
      } catch (e) {
        console.error("Error parsing userSession for tracking:", e);
      }
    }
  }, []);

  const fetchOrderData = async (queryStr: string) => {
    setLoading(true);
    setError(null);
    setCurrentOrder(null);
    setHistory([]);
    setCancelSuccess(false);

    try {
      const res = await fetch(`http://127.0.0.1:5001/api/orders/track?query=${encodeURIComponent(queryStr.trim())}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No order matched these details.");
      }
      setCurrentOrder(data.currentOrder);
      setHistory(data.history || []);
      
      setTimeout(() => {
        if (resultsRef.current) {
          const targetPosition = resultsRef.current.getBoundingClientRect().top + window.scrollY - 80;
          const startPosition = window.scrollY;
          const distance = targetPosition - startPosition;
          const duration = 1200; // 1.2 seconds
          let start: number | null = null;

          // easeInOutCubic: slow start, speed increase in middle, slow end
          const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percent = Math.min(progress / duration, 1);
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic(percent));
            
            if (progress < duration) {
              window.requestAnimationFrame(step);
            }
          };

          window.requestAnimationFrame(step);
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to find order.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput) return;
    await fetchOrderData(queryInput);
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    const confirmCancel = window.confirm("Are you sure you want to cancel this order? This action cannot be undone.");
    if (!confirmCancel) return;

    setIsCancelling(true);
    setError(null);

    try {
      const res = await fetch(`http://127.0.0.1:5001/api/orders/${currentOrder._id}/cancel`, {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order cancellation failed.");
      }
      setCurrentOrder(data);
      setCancelSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReturnOrder = async (orderId: string) => {
    const confirmReturn = window.confirm("Are you sure you want to request a return for this order?");
    if (!confirmReturn) return;

    setIsReturning(true);
    setError(null);

    try {
      const res = await fetch(`http://127.0.0.1:5001/api/orders/${orderId}/return`, {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order return request failed.");
      }
      
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(data);
      }
      
      setHistory(prevHistory => 
        prevHistory.map(order => order._id === orderId ? data : order)
      );

      setReturnSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to request return.");
    } finally {
      setIsReturning(false);
    }
  };

  const isReturnEligible = (order: any) => {
    if (order.status !== "Delivered") return false;
    const orderDate = order.updatedAt ? new Date(order.updatedAt) : new Date(order.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <div suppressHydrationWarning className={styles.page}>

      {/* Navigation Header */}
      <Navbar onCartClick={() => setShowCartDrawer(true)} />

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>TRACK & CANCEL ORDER</h1>
          <p className={styles.pageSubtitle}>Enter your order details below to monitor status or cancel processing orders.</p>

          {/* Form Box */}
          <div className={styles.formCard}>
            <form onSubmit={handleTrackSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Order ID, Email, or Phone Number</label>
                <input
                  type="text"
                  required
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className={styles.input}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.searchBtn} style={{ marginTop: "15px" }}>
                {loading ? "Searching..." : "Track Order"}
              </button>
            </form>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}
          {cancelSuccess && <div className={styles.successAlert}>Your order has been cancelled successfully.</div>}

          {/* Tracking Results */}
          {currentOrder && (() => {
            const order = currentOrder;
            return (
              <div ref={resultsRef}>
              <div className={styles.resultsContainer}>
              {/* Timeline Progress */}
              <div className={styles.timelineCard}>
                <h3 className={styles.cardHeader}>Delivery Progress</h3>

                <div className={styles.timeline}>
                  {order.status === "Cancelled" ? (
                    <div className={styles.cancelledTimelineRow}>
                      <div className={styles.cancelledCircle}>✕</div>
                      <div className={styles.timelineInfo}>
                        <span className={styles.timelineStepTitle}>ORDER CANCELLED</span>
                        <span className={styles.timelineStepDesc}>
                          {order.paymentMethod === "COD" 
                            ? "This order has been cancelled and will not be dispatched."
                            : order.refundStatus === "Refunded"
                              ? "This order has been cancelled. Your refund has been successfully processed and returned to your original payment method."
                              : "This order has been cancelled. Your refund is pending processing. If you have any questions, please contact support."}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Step 1: Placed */}
                      <div className={`${styles.timelineStep} ${styles.stepActive}`}>
                        <div className={styles.stepCircle}>✓</div>
                        <div className={styles.stepInfo}>
                          <span className={styles.stepTitle}>Order Placed</span>
                          <span className={styles.stepDesc}>Fulfillment processing.</span>
                        </div>
                      </div>

                      {/* Line connector */}
                      <div className={`${styles.stepLine} ${["Shipped", "Delivered"].includes(order.status) ? styles.lineActive : ""}`} />

                      {/* Step 2: Shipped */}
                      <div className={`${styles.timelineStep} ${["Shipped", "Delivered"].includes(order.status) ? styles.stepActive : ""}`}>
                        <div className={styles.stepCircle}>
                          {["Shipped", "Delivered"].includes(order.status) ? "✓" : "2"}
                        </div>
                        <div className={styles.stepInfo}>
                          <span className={styles.stepTitle}>Shipped</span>
                          <span className={styles.stepDesc}>Dispatched with courier tracking.</span>
                        </div>
                      </div>

                      {/* Line connector */}
                      <div className={`${styles.stepLine} ${order.status === "Delivered" ? styles.lineActive : ""}`} />

                      {/* Step 3: Delivered */}
                      <div className={`${styles.timelineStep} ${order.status === "Delivered" ? styles.stepActive : ""}`}>
                        <div className={styles.stepCircle}>
                          {order.status === "Delivered" ? "✓" : "3"}
                        </div>
                        <div className={styles.stepInfo}>
                          <span className={styles.stepTitle}>Delivered</span>
                          <span className={styles.stepDesc}>Doorstep delivery completed.</span>
                        </div>
                      </div>
                    </>
                  )}
                  {returnSuccess && (
                    <div className={styles.successBanner} style={{ marginTop: "20px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "24px", height: "24px", flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <div>
                        <strong>Return Requested Successfully!</strong>
                        <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem" }}>Our support team will review your request shortly.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cancel Button Option */}
                {order.status === "Processing" && (
                  <div className={styles.cancellationBlock}>
                    <p className={styles.cancellationWarning}>
                      Need to make changes? You can cancel your order while it is still in the processing stage.
                    </p>
                    <button 
                      onClick={handleCancelOrder} 
                      disabled={isCancelling} 
                      className={styles.cancelBtn}
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </div>
                )}

                {/* Return Request Option */}
                {isReturnEligible(order) && (
                  <div className={styles.cancellationBlock} style={{ borderLeftColor: "#f59e0b", backgroundColor: "#fffbeb" }}>
                    <p className={styles.cancellationWarning} style={{ color: "#92400e" }}>
                      Not satisfied? You can request a return for this delivered order.
                    </p>
                    <button 
                      onClick={() => handleReturnOrder(order._id)} 
                      disabled={isReturning} 
                      className={styles.cancelBtn}
                      style={{ backgroundColor: "#f59e0b", borderColor: "#f59e0b", color: "#fff" }}
                    >
                      {isReturning ? "Requesting..." : "Request Return"}
                    </button>
                  </div>
                )}
              </div>

              {/* Order Invoice Details summary */}
              <div className={styles.detailsCard}>
                <h3 className={styles.cardHeader}>Order Details</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Order ID:</span>
                    <span className={styles.orderIdVal}>{order.orderId}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Recipient:</span>
                    <span>{order.customerName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Shipping Address:</span>
                    <span className={styles.addressVal}>{order.shippingAddress}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Payment Method:</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>

                <div className={styles.itemsBlock}>
                  <h4 style={{ margin: "20px 0 10px 0", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#888" }}>Items Summary</h4>
                  <div className={styles.itemsList}>
                    {order.cartItems.map((item, idx) => (
                      <div key={idx} className={styles.itemRow}>
                        {item.image && (
                          <img src={item.image} alt={item.name} className={styles.itemImage} />
                        )}
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#111" }}>{item.name}</span>
                          <span style={{ display: "block", fontSize: "0.75rem", color: "#6b7280" }}>Volume: {item.size} | Qty: {item.quantity}</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}.00</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.totalBlock}>
                  <span>Total Amount Paid</span>
                  <span className={styles.totalPrice}>₹{order.totalAmount.toLocaleString("en-IN")}.00</span>
                </div>
              </div>
            </div>
            
            {/* Previous Order History */}
            {history.length > 0 && (
              <div className={styles.historyContainer} style={{ marginTop: "40px" }}>
                <h3 className={styles.pageSubtitle} style={{ textAlign: "left", marginBottom: "20px", color: "#111", fontWeight: 700 }}>Previous Order History</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #eaeaea", backgroundColor: "#f9fafb" }}>
                        <th style={{ padding: "12px 16px", fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>OrderId</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>Date</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>Total</th>
                        <th style={{ padding: "12px 16px", fontSize: "0.75rem", textTransform: "uppercase", color: "#6b7280" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((histOrder, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #eaeaea" }}>
                          <td style={{ padding: "16px", fontSize: "0.85rem", fontWeight: 600, color: "#111" }}>
                            <button
                              type="button"
                              onClick={() => {
                                setQueryInput(histOrder.orderId);
                                fetchOrderData(histOrder.orderId);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: primaryColor,
                                cursor: 'pointer',
                                fontWeight: 700,
                                textDecoration: 'underline',
                                padding: 0
                              }}
                            >
                              {histOrder.orderId}
                            </button>
                          </td>
                          <td style={{ padding: "16px", fontSize: "0.85rem", color: "#4b5563" }}>{new Date(histOrder.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: "16px", fontSize: "0.85rem", fontWeight: 700 }}>₹{histOrder.totalAmount.toLocaleString("en-IN")}.00</td>
                          <td style={{ padding: "16px", fontSize: "0.85rem" }}>
                            <span style={{ 
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              fontSize: "0.75rem", 
                              fontWeight: 700, 
                              backgroundColor: histOrder.status === "Delivered" ? "#d1fae5" : histOrder.status === "Cancelled" ? "#fee2e2" : "#fef3c7",
                              color: histOrder.status === "Delivered" ? "#065f46" : histOrder.status === "Cancelled" ? "#991b1b" : "#92400e"
                            }}>
                              {histOrder.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            </div>
            );
          })()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
