import { useState } from 'react';
import { DashboardStats } from '../types';

export function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5001/api/admin/dashboard-stats", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      setDashboardStats(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  return {
    dashboardStats,
    fetchDashboardStats
  };
}
