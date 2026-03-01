import type { 
  KPIData, 
  EarningsSummary, 
  ChartDataPoint, 
  ReferralTypeData, 
  GeoData, 
  Referral, 
  Payout,
  AIInsight,
  Resource,
  Campaign,
  Notification,
  AffiliateTier
} from "@/types";

export const kpiData: KPIData = {
  totalClicks: 12458,
  clicksGrowth: 23.5,
  totalSignups: 3247,
  signupsGrowth: 18.2,
  totalConversions: 892,
  conversionsGrowth: 31.4,
  totalEarnings: 15847.50,
  earningsGrowth: 42.8,
};

export const earningsSummary: EarningsSummary = {
  pending: 2847.50,
  approved: 5230.00,
  paid: 7770.00,
  nextPayoutDate: new Date('2024-03-15'),
  payoutThreshold: 200,
};

export const generateChartData = (days: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseClicks = 400 + Math.random() * 200;
    const baseConversions = baseClicks * (0.06 + Math.random() * 0.04);
    const baseEarnings = baseConversions * (15 + Math.random() * 5);
    
    data.push({
      date: date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric' }),
      clicks: Math.round(baseClicks),
      conversions: Math.round(baseConversions),
      earnings: Math.round(baseEarnings * 100) / 100,
    });
  }
  
  return data;
};

export const referralTypeData: ReferralTypeData[] = [
  { name: 'Customer Referrals', value: 65, color: '#2563EB' },
  { name: 'Provider Referrals', value: 35, color: '#06B6D4' },
];

export const geoData: GeoData[] = [
  { suburb: 'South Brisbane', conversions: 234, earnings: 4250 },
  { suburb: 'New Farm', conversions: 189, earnings: 3420 },
  { suburb: 'Fortitude Valley', conversions: 156, earnings: 2890 },
  { suburb: 'West End', conversions: 134, earnings: 2450 },
  { suburb: 'Paddington', conversions: 98, earnings: 1780 },
  { suburb: 'Bulimba', conversions: 81, earnings: 1520 },
];

export const referrals: Referral[] = [
  {
    id: '1',
    referralId: 'REF-2024-001',
    type: 'customer',
    status: 'converted',
    date: new Date('2024-02-20'),
    commission: 45.00,
    paymentStatus: 'approved',
    email: 'john.doe@email.com',
    name: 'John Doe',
  },
  {
    id: '2',
    referralId: 'REF-2024-002',
    type: 'provider',
    status: 'converted',
    date: new Date('2024-02-19'),
    commission: 120.00,
    paymentStatus: 'pending',
    email: 'sarah.smith@plumbing.com.au',
    name: 'Sarah Smith Plumbing',
  },
  {
    id: '3',
    referralId: 'REF-2024-003',
    type: 'customer',
    status: 'signed_up',
    date: new Date('2024-02-18'),
    commission: 0,
    paymentStatus: 'pending',
    email: 'mike.wilson@email.com',
    name: 'Mike Wilson',
  },
  {
    id: '4',
    referralId: 'REF-2024-004',
    type: 'customer',
    status: 'converted',
    date: new Date('2024-02-17'),
    commission: 32.50,
    paymentStatus: 'paid',
    email: 'emma.brown@email.com',
    name: 'Emma Brown',
  },
  {
    id: '5',
    referralId: 'REF-2024-005',
    type: 'provider',
    status: 'clicked',
    date: new Date('2024-02-16'),
    commission: 0,
    paymentStatus: 'pending',
    email: 'electro.pro@email.com',
    name: 'Electro Pro Services',
  },
  {
    id: '6',
    referralId: 'REF-2024-006',
    type: 'customer',
    status: 'converted',
    date: new Date('2024-02-15'),
    commission: 67.00,
    paymentStatus: 'approved',
    email: 'lisa.jones@email.com',
    name: 'Lisa Jones',
  },
  {
    id: '7',
    referralId: 'REF-2024-007',
    type: 'customer',
    status: 'converted',
    date: new Date('2024-02-14'),
    commission: 55.00,
    paymentStatus: 'paid',
    email: 'david.lee@email.com',
    name: 'David Lee',
  },
  {
    id: '8',
    referralId: 'REF-2024-008',
    type: 'provider',
    status: 'converted',
    date: new Date('2024-02-13'),
    commission: 150.00,
    paymentStatus: 'pending',
    email: 'clean.team@email.com.au',
    name: 'Clean Team Brisbane',
  },
];

export const payouts: Payout[] = [
  {
    id: 'PAY-001',
    amount: 2500.00,
    status: 'paid',
    requestedAt: new Date('2024-01-15'),
    processedAt: new Date('2024-01-18'),
    method: 'bank_transfer',
    accountInfo: '**** 4521',
  },
  {
    id: 'PAY-002',
    amount: 3270.00,
    status: 'paid',
    requestedAt: new Date('2024-02-01'),
    processedAt: new Date('2024-02-04'),
    method: 'bank_transfer',
    accountInfo: '**** 4521',
  },
  {
    id: 'PAY-003',
    amount: 2000.00,
    status: 'processing',
    requestedAt: new Date('2024-02-15'),
    method: 'bank_transfer',
    accountInfo: '**** 4521',
  },
];

export const aiInsights: AIInsight[] = [
  {
    id: '1',
    type: 'performance',
    title: 'Performance Boost',
    description: 'Your performance increased 18% this week compared to last week.',
    metric: 'Growth',
    metricValue: '+18%',
    createdAt: new Date(),
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Top Converting Category',
    description: 'Most conversions came from Plumbing category in South Brisbane.',
    metric: 'Conversions',
    metricValue: '234',
    action: 'Focus on Plumbing',
    createdAt: new Date(),
  },
  {
    id: '3',
    type: 'suggestion',
    title: 'AI Recommendation',
    description: 'Promote Electrical services this week - demand is up 34%',
    action: 'View Opportunity',
    createdAt: new Date(),
  },
  {
    id: '4',
    type: 'suggestion',
    title: 'Optimal Posting Time',
    description: 'Post at 6PM–8PM for higher engagement based on your audience.',
    action: 'Schedule Content',
    createdAt: new Date(),
  },
];

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Taskoria Logo Pack',
    description: 'High-resolution logos in various formats for your marketing.',
    type: 'banner',
    downloadUrl: '#',
    category: 'Branding',
  },
  {
    id: '2',
    title: 'Social Media Kit',
    description: 'Pre-designed Instagram, Facebook, and LinkedIn post templates.',
    type: 'template',
    downloadUrl: '#',
    category: 'Social Media',
  },
  {
    id: '3',
    title: 'Email Templates',
    description: 'Professional email templates for affiliate outreach.',
    type: 'email',
    downloadUrl: '#',
    category: 'Email Marketing',
  },
  {
    id: '4',
    title: 'Brand Guidelines',
    description: 'Complete brand guidelines for consistent messaging.',
    type: 'document',
    downloadUrl: '#',
    category: 'Branding',
  },
  {
    id: '5',
    title: 'Promo Video',
    description: '30-second promotional video for social sharing.',
    type: 'video',
    downloadUrl: '#',
    category: 'Video',
  },
  {
    id: '6',
    title: 'Web Banners',
    description: 'Banner ads in various sizes for your website.',
    type: 'banner',
    downloadUrl: '#',
    category: 'Banners',
  },
];

export const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'Spring Campaign',
    utmSource: 'social',
    utmMedium: 'instagram',
    utmCampaign: 'spring2024',
    createdAt: new Date('2024-02-01'),
    clicks: 1245,
    conversions: 89,
  },
  {
    id: '2',
    name: 'Blog Newsletter',
    utmSource: 'email',
    utmMedium: 'newsletter',
    utmCampaign: 'blog_feb',
    createdAt: new Date('2024-02-10'),
    clicks: 567,
    conversions: 34,
  },
];

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Conversion!',
    message: 'You earned $45.00 from a new customer referral.',
    type: 'success',
    read: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Payout Processing',
    message: 'Your $2,000.00 payout is being processed.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'Tier Upgrade Available',
    message: 'You\'re close to reaching Gold tier!',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 172800000),
  },
];

export const affiliateTiers: AffiliateTier[] = [
  {
    name: 'Bronze',
    minEarnings: 0,
    commissionRate: 10,
    benefits: ['Basic support', 'Standard commission rates'],
  },
  {
    name: 'Silver',
    minEarnings: 5000,
    commissionRate: 12,
    benefits: ['Priority support', 'Higher commission rates', 'Early access to features'],
  },
  {
    name: 'Gold',
    minEarnings: 20000,
    commissionRate: 15,
    benefits: ['Dedicated account manager', 'Premium commission rates', 'Exclusive promotions', 'API access'],
  },
  {
    name: 'Platinum',
    minEarnings: 50000,
    commissionRate: 20,
    benefits: ['VIP support', 'Maximum commission rates', 'Custom campaigns', 'Full API access', 'Co-marketing opportunities'],
  },
];

export const defaultReferralLink = 'https://taskoria.com.au/ref/AFF-2024-7842';
