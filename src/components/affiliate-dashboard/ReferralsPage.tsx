import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  Copy,
  QrCode,
  Plus,
  ExternalLink,
  Facebook,
  Linkedin,
  MessageCircle,
  Twitter,
  Mail,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Link2,
  BarChart3,
  Calendar,
  Tag,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { campaigns, defaultReferralLink, referrals } from '@/lib/mockData';

const statusColors: Record<string, string> = {
  clicked: 'bg-slate-100 text-slate-700',
  signed_up: 'bg-blue-100 text-blue-700',
  converted: 'bg-green-100 text-green-700',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
};

export function ReferralsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showQR, setShowQR] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = 
      referral.referralId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(defaultReferralLink);
    toast.success('Referral link copied!');
  };

  const handleCreateCampaign = () => {
    toast.success('Campaign created successfully!');
    setCampaignName('');
    setUtmSource('');
    setUtmMedium('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Referrals</h2>
          <p className="text-slate-500">Manage your referral links and track performance</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input 
                  placeholder="e.g., Spring Promotion"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>UTM Source</Label>
                  <Input 
                    placeholder="e.g., facebook"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>UTM Medium</Label>
                  <Input 
                    placeholder="e.g., social"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleCreateCampaign} className="w-full gradient-primary">
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Referral Link Card */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm text-slate-500 mb-2 block">Your Default Referral Link</Label>
              <div className="relative">
                <input
                  type="text"
                  value={defaultReferralLink}
                  readOnly
                  className="w-full px-4 py-3 pr-32 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-mono"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setShowQR(!showQR)}>
                    <QrCode className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={handleCopyLink}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="w-4 h-4 text-blue-600" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="w-4 h-4 text-sky-500" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin className="w-4 h-4 text-blue-700" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <MessageCircle className="w-4 h-4 text-green-500" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Mail className="w-4 h-4 text-slate-600" />
              </Button>
            </div>
          </div>
          
          {showQR && (
            <div className="flex justify-center mt-4 p-4 bg-white rounded-xl">
              <QRCodeSVG value={defaultReferralLink} size={180} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaigns */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Active Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{campaign.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {campaign.utmSource}/{campaign.utmMedium}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{campaign.clicks.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Clicks</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{campaign.conversions}</p>
                    <p className="text-xs text-slate-500">Conversions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">
                      {((campaign.conversions / campaign.clicks) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-500">Conv. Rate</p>
                  </div>
                </div>
                <div className="flex items-center mt-3 text-xs text-slate-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  Created {campaign.createdAt.toLocaleDateString('en-AU')}
                </div>
              </div>
            ))}
            
            <button className="p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-colors flex flex-col items-center justify-center text-slate-400">
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Create New Campaign</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Link2 className="w-5 h-5 mr-2 text-blue-500" />
              Referral History
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search referrals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="bg-white border">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="clicked">Clicked</TabsTrigger>
                  <TabsTrigger value="signed_up">Signed Up</TabsTrigger>
                  <TabsTrigger value="converted">Converted</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referral ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-mono text-sm">{referral.referralId}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={
                        referral.type === 'customer' ? 'bg-blue-100 text-blue-700' : 'bg-cyan-100 text-cyan-700'
                      }>
                        {referral.type === 'customer' ? 'Customer' : 'Provider'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{referral.name}</p>
                        <p className="text-xs text-slate-500">{referral.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[referral.status]}>
                        {referral.status === 'clicked' && <Clock className="w-3 h-3 mr-1" />}
                        {referral.status === 'signed_up' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {referral.status === 'converted' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {referral.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {referral.date.toLocaleDateString('en-AU')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {referral.commission > 0 ? `$${referral.commission.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={paymentStatusColors[referral.paymentStatus]}>
                        {referral.paymentStatus.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredReferrals.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No referrals found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">
              Showing {filteredReferrals.length} of {referrals.length} referrals
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
