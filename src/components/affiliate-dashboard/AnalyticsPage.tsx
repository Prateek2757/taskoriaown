"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateChartData, referralTypeData, geoData } from '@/lib/mockData';
import { Calendar, Download, TrendingUp, MapPin, MousePointer, CheckCircle, DollarSign } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days');
  const [chartType, setChartType] = useState('clicks');
  
  const chartData = generateChartData(dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90);
  
  const stats = [
    { label: 'Total Clicks', value: '12,458', change: '+23.5%', icon: MousePointer, color: 'blue' },
    { label: 'Conversions', value: '892', change: '+31.4%', icon: CheckCircle, color: 'green' },
    { label: 'Revenue', value: '$15,847', change: '+42.8%', icon: DollarSign, color: 'amber' },
    { label: 'Avg. Order Value', value: '$178', change: '+8.2%', icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
          <p className="text-slate-500">Deep insights into your affiliate performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={dateRange} onValueChange={setDateRange}>
            <TabsList className="bg-white">
              <TabsTrigger value="7days">7 Days</TabsTrigger>
              <TabsTrigger value="30days">30 Days</TabsTrigger>
              <TabsTrigger value="90days">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 text-${stat.color}-500`} />
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Clicks vs Conversions */}
        <Card className="border-0 shadow-card lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Clicks vs Conversions</CardTitle>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clicks">Clicks</SelectItem>
                  <SelectItem value="conversions">Conversions</SelectItem>
                  <SelectItem value="earnings">Earnings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#94A3B8" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="clicks" 
                    name="Clicks"
                    stroke="#2563EB" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="conversions" 
                    name="Conversions"
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Daily Earnings */}
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Daily Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)' 
                    }} 
                    formatter={(value: number) => [`$${value}`, 'Earnings']}
                  />
                  <Bar 
                    dataKey="earnings" 
                    fill="url(#earningsGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Referral Types */}
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Referral Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={referralTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {referralTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)' 
                    }} 
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Performance */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            Geographic Performance - Brisbane Suburbs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geoData.map((location, index) => (
              <div key={location.suburb} className="flex items-center">
                <div className="w-8 text-sm font-medium text-slate-400">#{index + 1}</div>
                <div className="w-32 font-medium text-slate-900">{location.suburb}</div>
                <div className="flex-1 mx-4">
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-primary rounded-full transition-all"
                      style={{ width: `${(location.conversions / geoData[0].conversions) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-medium text-slate-900">{location.conversions}</span>
                  <span className="text-xs text-slate-500 ml-1">conv.</span>
                </div>
                <div className="w-24 text-right">
                  <span className="text-sm font-medium text-green-600">${location.earnings.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              {[
                { label: 'Impressions', value: '45,230', percentage: '100%' },
                { label: 'Clicks', value: '12,458', percentage: '27.5%' },
                { label: 'Signups', value: '3,247', percentage: '26.0%' },
                { label: 'Conversions', value: '892', percentage: '27.5%' },
              ].map((step, index, arr) => (
                <div key={step.label} className="flex items-center">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${
                      index === 0 ? 'bg-blue-100' :
                      index === 1 ? 'bg-cyan-100' :
                      index === 2 ? 'bg-amber-100' : 'bg-green-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        index === 0 ? 'text-blue-600' :
                        index === 1 ? 'text-cyan-600' :
                        index === 2 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {step.percentage}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{step.label}</p>
                    <p className="text-xs text-slate-500">{step.value}</p>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="w-16 h-0.5 bg-slate-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
