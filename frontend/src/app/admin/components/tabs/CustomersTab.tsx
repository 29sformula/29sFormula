import React from 'react';
import styles from '../../page.module.css';

interface CustomersTabProps {
  activeTab: any;
  customers: any;
  setSelectedCustomer: any;
  setDeleteCustomerTargetId: any;
}

export default function CustomersTab({
  activeTab,
  customers,
  setSelectedCustomer,
  setDeleteCustomerTargetId
}: CustomersTabProps) {
  return (
    <>
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
                        {customers.map((cust: any, idx: number) => (
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
    </>
  );
}
