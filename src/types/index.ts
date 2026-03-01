export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'affiliate' | 'admin';
  isVerified: boolean;
  createdAt: Date;
}

export interface KPIData {
  totalClicks: number;
  clicksGrowth: number;
  totalSignups: number;
  signupsGrowth: number;
  totalConversions: number;
  conversionsGrowth: number;
  totalEarnings: number;
  earningsGrowth: number;
}

export interface EarningsSummary {
  pending: number;
  approved: number;
  paid: number;
  nextPayoutDate: Date;
  payoutThreshold: number;
}

export interface ChartDataPoint {
  date: string;
  clicks: number;
  conversions: number;
  earnings: number;
}

export interface ReferralTypeData {
  name: string;
  value: number;
  color: string;
}

export interface GeoData {
  suburb: string;
  conversions: number;
  earnings: number;
}

export interface Referral {
  id: string;
  referralId: string;
  type: 'customer' | 'provider';
  status: 'clicked' | 'signed_up' | 'converted';
  date: Date;
  commission: number;
  paymentStatus: 'pending' | 'approved' | 'paid';
  email?: string;
  name?: string;
}

export interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid';
  requestedAt: Date;
  processedAt?: Date;
  method: 'bank_transfer';
  accountInfo: string;
}

export interface BankDetails {
  accountName: string;
  bsb: string;
  accountNumber: string;
  bankName: string;
}

export interface TaxInfo {
  abn: string;
  taxDeclarationUploaded: boolean;
  taxDeclarationUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: Date;
  clicks: number;
  conversions: number;
}

export interface AIInsight {
  id: string;
  type: 'performance' | 'suggestion' | 'opportunity';
  title: string;
  description: string;
  metric?: string;
  metricValue?: string;
  action?: string;
  createdAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'banner' | 'template' | 'video' | 'document' | 'email';
  thumbnailUrl?: string;
  downloadUrl: string;
  category: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export type DateRange = 'today' | '7days' | '30days' | 'custom';

export interface AffiliateTier {
  name: string;
  minEarnings: number;
  commissionRate: number;
  benefits: string[];
}
