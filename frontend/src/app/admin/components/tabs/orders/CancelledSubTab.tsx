import React from 'react';
import styles from '../../../page.module.css';

interface CancelledSubTabProps {
    orders: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  
  isRefundFilterOpen: boolean;
  setIsRefundFilterOpen: (val: boolean) => void;
  refundStatusFilter: string;
  setRefundStatusFilter: (val: string) => void;
  isStatusFilterOpen: boolean;
  setIsStatusFilterOpen: (val: boolean) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (val: string) => void;
  fetchOrders: () => void;
  openStatusDropdownId: string | null;
  setOpenStatusDropdownId: (val: string | null) => void;
  handleUpdateReturnStatus: (id: string, status: string) => void;
  handleUpdateOrderStatus: (id: string, status: string) => void;
  setSelectedOrder: (order: any) => void;
  handleDeleteOrder: (id: string) => void;
}

export default function CancelledSubTab({
  orders,
  searchQuery,
  setSearchQuery,
  
  isRefundFilterOpen,
  setIsRefundFilterOpen,
  refundStatusFilter,
  setRefundStatusFilter,
  isStatusFilterOpen,
  setIsStatusFilterOpen,
  orderStatusFilter,
  setOrderStatusFilter,
  fetchOrders,
  openStatusDropdownId,
  setOpenStatusDropdownId,
  handleUpdateReturnStatus,
  handleUpdateOrderStatus,
  setSelectedOrder,
  handleDeleteOrder
}: CancelledSubTabProps) {
  const activeSubTab = "cancelled" as string;

  return (
            <div className={styles.viewContainer} style={{ gap: "16px", marginTop: "-12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {activeSubTab === "returns" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#000" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-6-6m0 0l6-6m-6 6h12" />
                    </svg>
                  ) : activeSubTab === "cancelled" ? (
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
                    {activeSubTab === "returns" ? "Return Requests" : activeSubTab === "cancelled" ? "Cancelled" : activeSubTab === "completed" ? "Completed" : "Active Orders"}
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
                    {activeSubTab === "returns" ? "Return Requests" : activeSubTab === "cancelled" ? "Cancelled" : activeSubTab === "completed" ? "Completed" : "Customer Orders"}
                  </h2>

                  {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                      <p>No orders placed in the system yet. Placed orders will show up here in real-time.</p>
                    </div>
                  ) : (
                    <div className={styles.tableResponsive} style={{ overflow: openStatusDropdownId ? "visible" : "auto" }}>
                      <table className={styles.inventoryTable}>
                        <thead>
                          {activeSubTab === "returns" ? (
                            <tr>
                              <th>OrderId</th>
                              <th>Customer</th>
                              <th style={{ minWidth: "200px" }}>Damage Reason & Proof</th>
                              <th>Date Requested</th>
                              <th>Return Status</th>
                              <th>Admin Action</th>
                            </tr>
                          ) : (
                            <tr>
                              <th>OrderId</th>
                              <th>Customer</th>
                              <th>Amount</th>
                              <th>Order Date</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          )}
                        </thead>
                        <tbody>
                          {orders
                            .filter(o => !o.deletedByAdmin)
                            .filter(o => {
                              if (activeSubTab === "returns") {
                                return o.status === "Return Requested" || 
                                       (o.returnRequest && o.returnRequest.status === "Pending") ||
                                       (o.status === "Return Approved" && o.refundStatus !== "Refunded");
                              } else if (activeSubTab === "cancelled") {
                                const matchesRefund = refundStatusFilter === "All" || (o.refundStatus || "Not Refunded") === refundStatusFilter;
                                return o.status === "Cancelled" && (o.refundStatus || "Not Refunded") !== "Refunded" && matchesRefund;
                              } else if (activeSubTab === "completed") {
                                const hasPendingReturn = o.status === "Return Requested" || (o.returnRequest && o.returnRequest.status === "Pending");
                                const hasUnrefundedApprovedReturn = o.status === "Return Approved" && o.refundStatus !== "Refunded";
                                if (hasPendingReturn || hasUnrefundedApprovedReturn) return false;
                                return o.status === "Delivered" || 
                                       o.status === "Return Rejected" || 
                                       (o.status === "Return Approved" && o.refundStatus === "Refunded") || 
                                       (o.status === "Cancelled" && o.refundStatus === "Refunded");
                              } else {
                                const matchesStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
                                return o.status !== "Cancelled" && 
                                       o.status !== "Delivered" && 
                                       o.status !== "Return Requested" && 
                                       o.status !== "Return Approved" && 
                                       o.status !== "Return Rejected" && 
                                       matchesStatus;
                              }
                            })
                            .filter(o =>
                              o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((order, idx, arr) => {
                              const openUpwards = arr.length > 0 && idx >= arr.length - 2;
                              if (activeSubTab === "returns") {
                                return (
                                  <tr key={order._id}>
                                    <td>
                                      <span className={styles.tableName}>{order.orderId}</span>
                                    </td>
                                    <td>
                                      <span className={styles.tableName}>{order.customerName}</span>
                                      <span className={styles.tableDesc}>{order.customerEmail}</span>
                                    </td>
                                    <td>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                          <span style={{ fontSize: "0.7rem", fontWeight: 700, backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                            {order.returnRequest?.returnType || "Unknown"}
                                          </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#1e293b", whiteSpace: "normal", maxWidth: "250px", lineHeight: "1.3" }}>
                                          {order.returnRequest?.reason || "Reason not provided"}
                                        </p>
                                        {order.returnRequest?.images && order.returnRequest.images.length > 0 && (
                                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                                            {order.returnRequest.images.map((imgUrl: string, i: number) => (
                                              <a key={i} href={imgUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "40px", height: "40px", borderRadius: "4px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
                                                <img src={imgUrl} alt="Proof" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <span className={styles.tableDesc} style={{ whiteSpace: "normal" }}>
                                        {order.returnRequest?.createdAt 
                                          ? new Date(order.returnRequest.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                          : new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                        }
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
                                        backgroundColor: order.returnRequest?.status === "Approved" ? "#eaf7ee" : order.returnRequest?.status === "Rejected" ? "#fef2f2" : "#fffbeb",
                                        color: order.returnRequest?.status === "Approved" ? "#15803d" : order.returnRequest?.status === "Rejected" ? "#991b1b" : "#b45309"
                                      }}>
                                        {order.returnRequest?.status || "Pending"}
                                      </span>
                                    </td>
                                    <td>
                                      <div style={{ position: "relative", display: "inline-block" }}>
                                        <div
                                          onClick={() => setOpenStatusDropdownId(openStatusDropdownId === order._id ? null : order._id)}
                                          className={styles.selectInput}
                                          style={{ padding: "4px 8px", fontSize: "0.8rem", cursor: "pointer", minWidth: "110px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                        >
                                          Action
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
                                              top: openUpwards ? "auto" : "100%",
                                              bottom: openUpwards ? "100%" : "auto",
                                              marginTop: openUpwards ? "0" : "4px",
                                              marginBottom: openUpwards ? "4px" : "0"
                                            }}>
                                              {["Pending", "Approved", "Rejected"].map((opt) => (
                                                <div
                                                  key={opt}
                                                  onClick={() => { handleUpdateReturnStatus(order._id, opt); setOpenStatusDropdownId(null); }}
                                                  style={{
                                                    padding: "6px 12px",
                                                    fontSize: "0.8rem",
                                                    cursor: "pointer",
                                                    backgroundColor: order.returnRequest?.status === opt ? "#eff6ff" : "transparent",
                                                    fontWeight: order.returnRequest?.status === opt ? 600 : 400
                                                  }}
                                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = order.returnRequest?.status === opt ? "#eff6ff" : "transparent")}
                                                >
                                                  {opt}
                                                </div>
                                              ))}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }


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
  );
}
