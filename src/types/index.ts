export interface TrendingVideo {
  id: string;
  title: string;
  views: number;
  likes: number;
  shares: number;
  url: string;
  thumbnail: string;
  description: string;
  hashtags: string[];
  createdAt: Date;
  niche: string;
  profitPotential: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  margin: number;
  category: string;
  tags: string[];
  images: string[];
  variants: ProductVariant[];
  createdAt: Date;
  status: 'draft' | 'active' | 'paused';
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  inventory: number;
}

export interface ContentPiece {
  id: string;
  type: 'video' | 'image' | 'carousel';
  title: string;
  description: string;
  mediaUrl: string;
  hashtags: string[];
  platform: 'tiktok' | 'instagram' | 'youtube';
  scheduledFor: Date;
  status: 'scheduled' | 'posted' | 'failed';
  engagement: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface AffiliateProgram {
  id: string;
  name: string;
  commission: number;
  category: string;
  description: string;
  requirements: string[];
  payoutThreshold: number;
  cookieDuration: number;
  rating: number;
  estimatedEarnings: number;
}

export interface Niche {
  id: string;
  name: string;
  category: string;
  competition: 'low' | 'medium' | 'high';
  profitability: number;
  trendScore: number;
  subNiches: string[];
  keywords: string[];
  averagePrice: number;
  demandLevel: number;
}

export interface Campaign {
  id: string;
  name: string;
  niche: string;
  products: Product[];
  content: ContentPiece[];
  budget: number;
  spent: number;
  revenue: number;
  profit: number;
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
}

export interface Analytics {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: Product[];
  topNiches: Niche[];
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: 'product_created' | 'content_posted' | 'order_received' | 'trend_detected';
  message: string;
  timestamp: Date;
  data?: any;
}

export interface AutomationSettings {
  enabled: boolean;
  contentPostingFrequency: number; // posts per day
  trendAnalysisInterval: number; // hours
  budgetLimit: number;
  profitThreshold: number;
  niches: string[];
  platforms: string[];
  autoApproveContent: boolean;
  autoCreateProducts: boolean;
}