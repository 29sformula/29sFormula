export interface FaqItem {
  question: string;
  answer: string;
}

export interface DashboardStats {
  totalSales: number;
  totalIncome: number;
  activeOrders: number;
  totalProducts: number;
  latestArrivalsCount: number;
  bestSellersCount: number;
  totalCustomers: number;
  topProducts: Product[];
  historicalData?: {
    date: string;
    sales: number;
    orders: number;
    profit?: number;
  }[];
  totalProfitThisMonth?: number;
}

export interface Product {
  _id?: string;
  name: string;
  price: number;
  makingPrice?: number;
  quantity?: number;
  description: string;
  category: string | string[];
  imageFront: string;
  imageBack?: string;
  images?: string[];
  sizes?: string[];
  sizeQuantities?: Record<string, number>;
  options?: { size: string; quantity: number; price: number; makingPrice?: number; category: string[] }[];
  variants?: { size: string; quantity: number; price: number; makingPrice?: number; category: string[] }[];
}