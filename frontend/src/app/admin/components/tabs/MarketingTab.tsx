import React from 'react';
import styles from '../../page.module.css';

interface MarketingTabProps {
  activeTab: any;
  showTicker: any;
  setShowTicker: any;
  saveSettingsSilent: any;
  tickerText: any;
  setTickerText: any;

}

export default function MarketingTab({
  activeTab,
  showTicker,
  setShowTicker,
  saveSettingsSilent,
  tickerText,
  setTickerText,
  
}: MarketingTabProps) {
  return (
    <>
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
    </>
  );
}
