'use client';

import styles from "./OrderSuccessModal.module.css";

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderId: string;
  orderDetails: any;
  onClose: () => void;
  primaryColor: string;
}

export default function OrderSuccessModal({ isOpen, orderId, orderDetails, onClose, primaryColor }: OrderSuccessModalProps) {
  if (!isOpen || !orderDetails) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ '--primary-color': primaryColor, position: 'relative' } as React.CSSProperties}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#9ca3af", padding: "4px", lineHeight: 1 }}>✕</button>
        {/* Animated Check Icon */}
        <div className={styles.successIconWrapper}>
          <div className={styles.successCircle}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={styles.checkIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
        </div>

        <h2 className={styles.title}>ORDER CONFIRMED</h2>
        <p className={styles.subtitle}>Thank you for your purchase! We have successfully received your order.</p>

        {/* Order Details Details Card */}
        <div className={styles.detailsCard}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Order Number</span>
            <span className={styles.orderId}>{orderId}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Deliver To</span>
            <span className={styles.value}>{orderDetails.customerName ? orderDetails.customerName.charAt(0).toUpperCase() + orderDetails.customerName.slice(1).toLowerCase() : "N/A"}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Shipping Address</span>
            {(() => {
              const addr = orderDetails.shippingAddress;
              if (typeof addr === 'string') {
                 const parts = addr.split(",").map((s: string) => s.trim());
                 if (parts.length >= 3) {
                   const street = parts[0];
                   const city = parts[1];
                   const statePin = parts.slice(2).join(", ");
                   const statePinParts = statePin.split("-");
                   const state = statePinParts[0].trim();
                   const pin = statePinParts.length > 1 ? statePinParts[1].trim() : "";
                   
                   return (
                     <span className={styles.addressText} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                       <span>{street}</span>
                       <span>{city}, {state}</span>
                       {pin && <span>{pin}</span>}
                     </span>
                   );
                 }
                 return <span className={styles.addressText}>{addr}</span>;
              } else if (addr) {
                return (
                  <span className={styles.addressText} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span>{addr.address}</span>
                    <span>{addr.city}, {addr.state}</span>
                    <span>{addr.zip}</span>
                  </span>
                );
              }
              return <span className={styles.addressText}>N/A</span>;
            })()}
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Payment Method</span>
            <span className={styles.value}>{orderDetails.paymentMethod}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Total Amount Paid</span>
            <span className={styles.totalPrice}>₹{orderDetails.totalAmount?.toLocaleString("en-IN")}.00</span>
          </div>
        </div>

        {/* Estimated delivery banner */}
        <div className={styles.estimateBanner}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.truckIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.208-3.32a1.875 1.875 0 0 0-1.875-1.756h-1.5V10.5h.75c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-3.75V4.5a1.125 1.125 0 0 0-1.125-1.125H8.25M6.75 12h.008v.008H6.75V12Zm0-3h.008v.008H6.75V9Zm3 3h.008v.008H9.75V12Zm0-3h.008v.008H9.75V9Z" />
          </svg>
          <div>
            <span className={styles.estimateTitle}>Estimated Delivery</span>
            <span className={styles.estimateDesc}>4-6 business days with active tracking.</span>
          </div>
        </div>

        <button onClick={onClose} className={styles.continueBtn}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
