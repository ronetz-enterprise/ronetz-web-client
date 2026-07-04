import api from "@/core/api/axiosConfig";

export interface DailyRevenue { date: string; count: number; revenue: number }
export interface ProductSales { productName: string; count: number; revenue: number }
export interface RecentSale { paidAt: string; productName: string; amount: number; currency: string }

export interface DashboardStats {
  subscriptions30d: number;
  revenue30d: number;
  activeSubscriptions: number;
  averageOrderValue: number;
  dailyRevenue: DailyRevenue[];
  topProducts: ProductSales[];
  recentSales: RecentSale[];
}

export const statsApi = {
  getDashboard: () => api.get<DashboardStats>("/api/stats/dashboard"),
};
