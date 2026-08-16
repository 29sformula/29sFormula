import React, { useState } from 'react';
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
    if (i === 0) {
      path += `M ${x} ${y} `;
    } else {
      const prevX = minX + (i - 1) * step;
      const prevY = minY - ((data[i - 1][key] || 0) / maxValue) * height;
      const cpX = prevX + (x - prevX) / 2;
      path += `C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y} `;
    }
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
    if (i === 0) {
      path += `M ${x} ${y} `;
    } else {
      const prevX = minX + (i - 1) * step;
      const prevY = minY - (sliceData[i - 1][key] / maxValue) * height;
      const cpX = prevX + (x - prevX) / 2;
      path += `C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y} `;
    }
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
  const [hoveredData, setHoveredData] = useState<{x: number, y: number, date: string, sales: number} | null>(null);
  
  const data = dashboardStats?.historicalData || [];
  const minX = 50, maxX = 750, minY = 205, maxY = 30;
  const maxValue = Math.max(...data.map(d => d.sales || 0), 1);
  const width = maxX - minX;
  const height = minY - maxY;
  const step = width / Math.max(data.length - 1, 1);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (data.length === 0) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - svgRect.left) / svgRect.width) * 800;
    
    let closest = data[0];
    let closestDist = Infinity;
    let closestIndex = 0;
    
    data.forEach((d, i) => {
      const x = minX + i * step;
      const dist = Math.abs(x - mouseX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = d;
        closestIndex = i;
      }
    });

    const x = minX + closestIndex * step;
    const y = minY - ((closest.sales || 0) / maxValue) * height;
    setHoveredData({ x, y, date: closest.date, sales: closest.sales || 0 });
  };

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
                  <div className={styles.chartCanvasArea} style={{ position: "relative" }}>
                    <svg 
                      viewBox="0 0 800 240" 
                      className={styles.mainSvgChart}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setHoveredData(null)}
                      style={{ cursor: 'crosshair', overflow: 'visible' }}
                    >
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
                      
                      {/* Continuous Tracking Crosshair */}
                      {hoveredData && (
                        <>
                          <line 
                            x1={hoveredData.x} y1="30" x2={hoveredData.x} y2="205" 
                            stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 4" 
                          />
                          <circle
                            cx={hoveredData.x} cy={hoveredData.y} r="5"
                            fill="#000000" stroke="#ffffff" strokeWidth="2"
                            style={{ pointerEvents: 'none', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
                          />
                        </>
                      )}
                    </svg>

                    {/* Tooltip Overlay */}
                    {hoveredData && (
                      <div style={{
                        position: 'absolute',
                        left: `calc(${(hoveredData.x / 800) * 100}% - 50px)`,
                        top: `calc(${(hoveredData.y / 240) * 100}% - 50px)`,
                        backgroundColor: '#111827',
                        color: '#ffffff',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        pointerEvents: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        zIndex: 10,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        transform: 'translateY(-10px)',
                        transition: 'opacity 0.2s',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{ fontWeight: 600, marginBottom: '2px', color: '#f9fafb' }}>{hoveredData.date}</div>
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '14px' }}>₹{hoveredData.sales.toLocaleString('en-IN')}</div>
                      </div>
                    )}
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

              {/* Recent Orders Table */}
              <section className={styles.chartPanelGrid} style={{ marginTop: '24px', display: 'block' }}>
                <div className={styles.chartContainerCard}>
                  <div className={styles.chartHeader} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div className={styles.chartHeaderLeft}>
                      <span className={styles.chartHeaderLabel}>Recent Orders</span>
                    </div>
                    <button 
                      onClick={() => { setActiveTab("orders"); setActiveSubTab("all"); }}
                      style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                    >
                      View All
                    </button>
                  </div>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>Order ID</th>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>Date</th>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>Status</th>
                          <th style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!dashboardStats ? (
                          <tr><td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>Loading...</td></tr>
                        ) : !dashboardStats.recentOrders || dashboardStats.recentOrders.length === 0 ? (
                          <tr><td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>No recent orders found.</td></tr>
                        ) : (
                          dashboardStats.recentOrders.map((order: any) => (
                            <tr key={order._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                              <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                                ORD-{order._id.substring(order._id.length - 4).toUpperCase()}
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6b7280' }}>
                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{ 
                                  padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                                  backgroundColor: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Pending' ? '#fef9c3' : '#f3f4f6',
                                  color: order.status === 'Delivered' ? '#166534' : order.status === 'Pending' ? '#854d0e' : '#4b5563'
                                }}>
                                  {order.status || 'Pending'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#111827', textAlign: 'right' }}>
                                ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
  );
}
