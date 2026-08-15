import React from 'react';
import styles from '../../page.module.css';
import { DashboardStats } from '../../types';

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

interface HomeTabProps {
  dashboardStats: DashboardStats | null;
  setActiveTab: (val: any) => void;
  setActiveSubTab: (val: any) => void;
  timelineFilter: string;
  setTimelineFilter: (val: string) => void;
}

export default function HomeTab({
  dashboardStats,
  setActiveTab,
  setActiveSubTab,
  timelineFilter,
  setTimelineFilter
}: HomeTabProps) {
  return (
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
                      <select 
                        className={styles.chartSelect}
                        value={timelineFilter}
                        onChange={(e) => { setTimelineFilter(e.target.value); }}
                      >
                        <option value="today">Today</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
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
  );
}
