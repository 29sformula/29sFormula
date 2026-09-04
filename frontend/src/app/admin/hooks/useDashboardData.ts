import { useState } from 'react';
import { DashboardStats } from '../types';

export function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const fetchDashboardStats = async (timeline: string = "all", retries = 3) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/admin/dashboard-stats?timeline=${timeline}&t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setDashboardStats(data);
    } catch (err: any) {
      if (retries > 0) {
        console.warn(`Dashboard fetch failed, retrying... (${retries} retries left)`);
        setTimeout(() => fetchDashboardStats(timeline, retries - 1), 1500);
      } else {
        console.error(err);
      }
    }
  };

  return {
    dashboardStats,
    fetchDashboardStats
  };
}
