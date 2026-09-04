export interface FaqItem {
  question: string;
  answer: string;
}

export interface DashboardStats {
  cardStats?: {
    totalRevenue: { value: number; change: number };
    totalOrders: { value: number; change: number };
    netProfit: { value: number; change: number };
    activeCustomers: { value: number; change: number };
  };
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
  recentOrders?: any[];
}

export interface Product {
  _id?: string;
  name: string;
  price: number;
  strikePrice?: number;
  makingPrice?: number;
  quantity?: number;
  description: string;
  additionalInformation?: string;
  category: string | string[];
  imageFront: string;
  imageBack?: string;
  images?: string[];
  sizes?: string[];
  sizeQuantities?: Record<string, number>;
  options?: { size: string; quantity: number; price: number; makingPrice?: number; category: string[] }[];
  variants?: { size: string; quantity: number; price: number; makingPrice?: number; category: string[] }[];
}

export interface LayoutCustomizationConfig {
  titleText: string;
  titleFontType: string;
  titleFontColor: string;
  titleFontSize: string;
  titleFontAlignment: string;
  titleFontWeight: string;
  showTitle: boolean;
  
  manifestoText: string;
  manifestoFontType: string;
  manifestoFontColor: string;
  manifestoFontSize: string;
  manifestoFontAlignment: string;
  manifestoFontWeight: string;
  showManifesto: boolean;
  
  buttonText: string;
  buttonStyle: string;
  buttonSize: string;
  buttonColor: string;
  buttonTextColor: string;
  showButton: boolean;
  
  layoutTemplate: string;
  bgType?: string;
  bgColor?: string;
  bgImage?: string;
  bgVideo?: string;
}