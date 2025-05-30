// Define portfolio section types
export type SectionType = 'about' | 'projects' | 'skills' | 'resume' | 'testimonials' | 'blog' | 'contact' | 'services' | 'gallery';

// Define portfolio section
export interface PortfolioSection {
  id: string;
  type: SectionType;
  title: string;
  content: any;
  order: number;
  layout: 'full' | 'half' | 'two-columns';
  settings?: Record<string, any>;
}

// Alias for API compatibility
export type Section = PortfolioSection;

// Define portfolio theme
export interface PortfolioTheme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  headingColor?: string;
  paragraphColor?: string;
  linkColor?: string;
  accentColor?: string;
  fontFamily: string;
  fontSize: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string;
  headingFontFamily?: string;
  headingFontWeight?: string;
  borderRadius?: string;
  spacing?: 'compact' | 'comfortable' | 'spacious';
}

// Alias for API compatibility
export type Theme = PortfolioTheme;

// Define portfolio data
export interface Portfolio {
  id?: string;
  _id?: string; // MongoDB-style ID field
  title: string;
  description?: string;
  sections: PortfolioSection[];
  theme: PortfolioTheme;
  isPublished: boolean;
  subdomain?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  visits?: number;
  template?: string;
  thumbnail?: string;
  __v?: number; // MongoDB version field
}

// Define template data
export interface Template {
  popularity: number;
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  tags: string[];
  sections: PortfolioSection[];
  theme: PortfolioTheme;
  isPublic: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  isCustom: boolean;
}

// Define user data
export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

// Define preview device type
export type PreviewDeviceType = 'desktop' | 'tablet' | 'mobile';

// Define analytics data
export interface PortfolioAnalytics {
  visits: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  topReferrers: { source: string; count: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  dailyVisits: { date: string; count: number }[];
}

// Define overall analytics data
export interface OverallAnalytics {
  totalUsers: number;
  totalPortfolios: number;
  totalVisits: number;
  activeUsers: number;
  newUsersToday: number;
  topTemplates: { name: string; count: number }[];
}
