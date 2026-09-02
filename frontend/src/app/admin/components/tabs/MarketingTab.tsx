import React from 'react';
import styles from '../../page.module.css';
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";

interface MarketingTabProps {
  activeTab: any;
  customizeSubTab?: any;
  showTicker: any;
  setShowTicker: any;
  saveSettingsSilent: any;
  tickerText: any;
  setTickerText: any;
  tickerSpeed: any;
  setTickerSpeed: any;
  tickerBgColor: any;
  setTickerBgColor: any;
  tickerTextColor: any;
  setTickerTextColor: any;
  setSuccessMessage: any;
  hasUnsavedChanges: boolean;

}

export default function MarketingTab({
  activeTab,
  customizeSubTab,
  showTicker,
  setShowTicker,
  saveSettingsSilent,
  tickerText,
  setTickerText,
  tickerSpeed,
  setTickerSpeed,
  tickerBgColor,
  setTickerBgColor,
  tickerTextColor,
  setTickerTextColor,
  setSuccessMessage,
  hasUnsavedChanges,
}: MarketingTabProps) {
  return (
    <>
          {activeTab === "online-store" && customizeSubTab === "marketing" && (
            <div className={styles.viewContainer}>
              <div style={{ marginBottom: "20px" }}>
                <h1 className={styles.pageHeading} style={{ margin: 0 }}>Marketing Campaigns & Promos</h1>
              </div>

              <div className={styles.dashboardCard} style={{ marginTop: "20px", padding: "24px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "20px", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" }}>Active Marquee Announcements</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#374151" }}>Top Marquee Ticker Loop Status</span>
                    <CustomCheckbox
                      checked={showTicker}
                      onChange={(e) => setShowTicker(e.target.checked)}
                      style={{ '--checkbox-color': '#111827' } as React.CSSProperties}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Ticker Content Text</label>
                    <input
                      type="text"
                      value={tickerText}
                      onChange={(e) => setTickerText(e.target.value)}
                      className={styles.textInput}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
                    <div className={styles.inputGroup} style={{ flex: 1, marginBottom: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label className={styles.inputLabel} style={{ marginBottom: 0 }}>Scrolling Speed</label>
                        <span style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>{tickerSpeed}s</span>
                      </div>
                      <input
                        type="range"
                        value={tickerSpeed}
                        onChange={(e) => setTickerSpeed(Number(e.target.value))}
                        style={{ width: "100%", marginTop: "10px", cursor: "pointer" }}
                        min="5"
                        max="150"
                      />
                    </div>
                    <div className={styles.inputGroup} style={{ flex: 1, marginBottom: 0 }}>
                      <label className={styles.inputLabel}>Background Color</label>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="color"
                          value={tickerBgColor}
                          onChange={(e) => setTickerBgColor(e.target.value)}
                          style={{ width: "40px", height: "40px", padding: "0", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        />
                        <input
                          type="text"
                          value={tickerBgColor}
                          onChange={(e) => setTickerBgColor(e.target.value)}
                          className={styles.textInput}
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup} style={{ flex: 1, marginBottom: 0 }}>
                      <label className={styles.inputLabel}>Text Color</label>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="color"
                          value={tickerTextColor}
                          onChange={(e) => setTickerTextColor(e.target.value)}
                          style={{ width: "40px", height: "40px", padding: "0", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        />
                        <input
                          type="text"
                          value={tickerTextColor}
                          onChange={(e) => setTickerTextColor(e.target.value)}
                          className={styles.textInput}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                    <button 
                      disabled={!hasUnsavedChanges}
                      onClick={async () => {
                        await saveSettingsSilent();
                        setSuccessMessage("Marketing settings saved successfully!");
                        setTimeout(() => setSuccessMessage(null), 3000);
                      }} 
                      style={{
                        backgroundColor: hasUnsavedChanges ? "#111827" : "#e5e7eb",
                        color: hasUnsavedChanges ? "white" : "#9ca3af",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: hasUnsavedChanges ? "pointer" : "not-allowed",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      Save Marketing Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Redesigned Discount Coupons & Promo Codes Tab */}
    </>
  );
}
