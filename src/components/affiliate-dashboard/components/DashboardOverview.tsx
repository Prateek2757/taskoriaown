import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { kpiData, earningsSummary, generateChartData, aiInsights, defaultReferralLink } from '@/lib/mockData';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  MousePointer,
  Users,
  CheckCircle,
  DollarSign,
  Copy,
  QrCode,
  Share2,
  Facebook,
  Linkedin,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Target,
  Zap,
  MapPin,
  Clock,
  Wallet,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';

const KPICard = ({ 
  title, 
  value, 
  growth, 
  icon: Icon, 
  color,
  data 
}: { 
  title: string; 
  value: string | number; 
  growth: number; 
  icon: any; 
  color: string;
  data: any[];
}) => {
  const isPositive = growth >= 0;
  
  return (
    <Card className="border-0 shadow-card hover:shadow-card-hover transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="font-medium">{isPositive ? '+' : ''}{growth}%</span>
              <span className="text-slate-400 ml-1">vs last 30 days</span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="h-16 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const SparklineData = (baseValue: number, growth: number) => {
  return Array.from({ length: 7 }, (_, i) => ({
    value: baseValue * (1 + (growth / 100) * (i / 6) + (Math.random() - 0.5) * 0.1),
  }));
};

export function DashboardOverview() {
  const [dateRange, setDateRange] = useState('30days');
  const [showQR, setShowQR] = useState(false);
  const chartData = generateChartData(7);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(defaultReferralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const payoutProgress = (earningsSummary.approved / earningsSummary.payoutThreshold) * 100;

  return (
    <div className="space-y-6 overflow-hidden  animate-fade-in">
      {/* Welcome Banner */}
      <div className="gradient-primary rounded-2xl p-3 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* <Sparkles className="w-5 h-5" /> */}
              <span className="text-blue-100 text-sm font-medium">Welcome back!</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Your Affiliate Dashboard</h2>
            <p className="text-blue-100">Track your performance and earnings in real-time</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Badge className="bg-white/20 text-white border-0">
              <Target className="w-3 h-3 mr-1" />
              Silver Tier
            </Badge>
            <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
              View Earnings
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex items-center justify-between">
        <Tabs value={dateRange} onValueChange={setDateRange}>
          <TabsList className="bg-white">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="7days">7 Days</TabsTrigger>
            <TabsTrigger value="30days">30 Days</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Clicks"
          value={kpiData.totalClicks.toLocaleString()}
          growth={kpiData.clicksGrowth}
          icon={MousePointer}
          color="bg-blue-500"
          data={SparklineData(kpiData.totalClicks, kpiData.clicksGrowth)}
        />
        <KPICard
          title="Total Signups"
          value={kpiData.totalSignups.toLocaleString()}
          growth={kpiData.signupsGrowth}
          icon={Users}
          color="bg-cyan-500"
          data={SparklineData(kpiData.totalSignups, kpiData.signupsGrowth)}
        />
        <KPICard
          title="Conversions"
          value={kpiData.totalConversions.toLocaleString()}
          growth={kpiData.conversionsGrowth}
          icon={CheckCircle}
          color="bg-green-500"
          data={SparklineData(kpiData.totalConversions, kpiData.conversionsGrowth)}
        />
        <KPICard
          title="Total Earnings"
          value={`$${kpiData.totalEarnings.toLocaleString()}`}
          growth={kpiData.earningsGrowth}
          icon={DollarSign}
          color="bg-amber-500"
          data={SparklineData(kpiData.totalEarnings, kpiData.earningsGrowth)}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Earnings Summary */}
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-blue-500" />
                Earnings Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Pending</p>
                  <p className="text-xl font-bold text-amber-600">${earningsSummary.pending.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Approved</p>
                  <p className="text-xl font-bold text-green-600">${earningsSummary.approved.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">Paid</p>
                  <p className="text-xl font-bold text-blue-600">${earningsSummary.paid.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Payout Threshold</span>
                  <span className="font-medium">${earningsSummary.payoutThreshold}</span>
                </div>
                <div className="relative">
                  <Progress value={payoutProgress} className="h-3" />
                  <div 
                    className="absolute top-0 -translate-x-1/2 -mt-1"
                    style={{ left: `${Math.min(payoutProgress, 100)}%` }}
                  >
                    <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Next Payout</span>
                  <span className="font-medium text-blue-600">
                    {earningsSummary.nextPayoutDate.toLocaleDateString('en-AU', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#2563EB" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                  <span className="text-sm text-slate-600">Clicks</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <span className="text-sm text-slate-600">Conversions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Referral Link */}
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Share2 className="w-5 h-5 mr-2 text-blue-500" />
                Your Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={defaultReferralLink}
                  readOnly
                  className="w-full px-4 py-3 pr-24 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600"
                />
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowQR(!showQR)}>
                  <QrCode className="w-4 h-4 mr-1" />
                  QR Code
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Zap className="w-4 h-4 mr-1" />
                  Short Link
                </Button>
              </div>

              {showQR && (
                <div className="flex justify-center p-4 bg-white rounded-xl">
                  <QRCodeSVG value={defaultReferralLink} size={150} />
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-3">Share on</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Linkedin className="w-4 h-4 text-blue-700" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiInsights.map((insight) => (
                <div 
                  key={insight.id} 
                  className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      insight.type === 'performance' ? 'bg-green-100' :
                      insight.type === 'opportunity' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      {insight.type === 'performance' ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                       insight.type === 'opportunity' ? <Target className="w-4 h-4 text-amber-600" /> :
                       <Zap className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{insight.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{insight.description}</p>
                      {insight.metric && (
                        <div className="flex items-center mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {insight.metric}: {insight.metricValue}
                          </Badge>
                        </div>
                      )}
                      {insight.action && (
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-2">
                          {insight.action}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                  <span className="text-sm text-slate-600">Top Location</span>
                </div>
                <span className="text-sm font-medium">South Brisbane</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-slate-400 mr-2" />
                  <span className="text-sm text-slate-600">Best Time</span>
                </div>
                <span className="text-sm font-medium">6PM - 8PM</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-slate-400 mr-2" />
                  <span className="text-sm text-slate-600">Conversion Rate</span>
                </div>
                <span className="text-sm font-medium text-green-600">7.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
