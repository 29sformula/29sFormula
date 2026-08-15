import { useState } from 'react';
import { DashboardStats } from '../types';

export function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const fetchDashboardStats = async (retries = 3) => {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/admin/dashboard-stats", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setDashboardStats(data);
    } catch (err: any) {
      if (retries > 0) {
        console.warn(`Dashboard fetch failed, retrying... (${retries} retries left)`);
        setTimeout(() => fetchDashboardStats(retries - 1), 1500);
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
