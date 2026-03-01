import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Calendar,
  Building2,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  Shield,
  Download,
  Eye,
  EyeOff,
  Landmark,
  CreditCard,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { earningsSummary, payouts } from '@/lib/mockData';

const payoutStatusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
};

export function PayoutsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountName: 'Alex Johnson',
    bsb: '062-001',
    accountNumber: '12345678',
    bankName: 'Commonwealth Bank',
  });
  const [taxInfo, setTaxInfo] = useState({
    abn: '12 345 678 901',
    taxDeclarationUploaded: true,
  });

  const payoutProgress = (earningsSummary.approved / earningsSummary.payoutThreshold) * 100;
  const canWithdraw = earningsSummary.approved >= earningsSummary.payoutThreshold;

  const handleWithdraw = () => {
    if (!canWithdraw) {
      toast.error(`Minimum payout is $${earningsSummary.payoutThreshold}`);
      return;
    }
    toast.success('Withdrawal request submitted!');
    setWithdrawAmount('');
  };

  const handleSaveBankDetails = () => {
    toast.success('Bank details updated successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payouts</h2>
          <p className="text-slate-500">Manage your earnings and withdrawals</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary" disabled={!canWithdraw}>
              <DollarSign className="w-4 h-4 mr-2" />
              Request Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Withdrawal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">Available Balance</p>
                <p className="text-2xl font-bold text-slate-900">${earningsSummary.approved.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <Label>Withdrawal Amount (AUD)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <p className="text-xs text-slate-500">Minimum: ${earningsSummary.payoutThreshold}</p>
              </div>
              <div className="space-y-2">
                <Label>Payout Method</Label>
                <div className="p-3 border rounded-lg flex items-center">
                  <Landmark className="w-5 h-5 mr-3 text-slate-400" />
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-xs text-slate-500">{bankDetails.bankName} ****{bankDetails.accountNumber.slice(-4)}</p>
                  </div>
                </div>
              </div>
              <Button onClick={handleWithdraw} className="w-full gradient-primary">
                Confirm Withdrawal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="tax">Tax Information</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 mt-6">
            {/* Earnings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">Pending</Badge>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">${earningsSummary.pending.toLocaleString()}</p>
                  <p className="text-sm text-slate-500 mt-1">Awaiting approval</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Approved</Badge>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">${earningsSummary.approved.toLocaleString()}</p>
                  <p className="text-sm text-slate-500 mt-1">Ready to withdraw</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">Paid</Badge>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">${earningsSummary.paid.toLocaleString()}</p>
                  <p className="text-sm text-slate-500 mt-1">Total lifetime earnings</p>
                </CardContent>
              </Card>
            </div>

            {/* Payout Threshold */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Payout Threshold</h3>
                    <p className="text-sm text-slate-500">Minimum amount required to withdraw</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">${earningsSummary.payoutThreshold}</p>
                    <p className="text-sm text-slate-500">AUD</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium">{payoutProgress.toFixed(1)}%</span>
                  </div>
                  <div className="relative">
                    <Progress value={payoutProgress} className="h-4" />
                    <div 
                      className="absolute top-0 -translate-x-1/2 -mt-1 transition-all"
                      style={{ left: `${Math.min(payoutProgress, 100)}%` }}
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <DollarSign className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Current: ${earningsSummary.approved}</span>
                    <span className="text-slate-500">Target: ${earningsSummary.payoutThreshold}</span>
                  </div>
                </div>

                {!canWithdraw && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Almost there!</p>
                      <p className="text-sm text-amber-700">
                        You need ${(earningsSummary.payoutThreshold - earningsSummary.approved).toFixed(2)} more to reach the minimum payout threshold.
                      </p>
                    </div>
                  </div>
                )}

                {canWithdraw && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Ready to withdraw!</p>
                      <p className="text-sm text-green-700">
                        You have exceeded the minimum payout threshold. Request your withdrawal now.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Payout */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Next Payout Date</h3>
                      <p className="text-sm text-slate-500">Scheduled automatic payout</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {earningsSummary.nextPayoutDate.toLocaleDateString('en-AU', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                    <p className="text-sm text-slate-500">
                      {earningsSummary.nextPayoutDate.toLocaleDateString('en-AU', { 
                        weekday: 'long' 
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bank Details Tab */}
        {activeTab === 'bank' && (
          <div className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                  Bank Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Holder Name</Label>
                    <Input 
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input 
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>BSB</Label>
                    <Input 
                      value={bankDetails.bsb}
                      onChange={(e) => setBankDetails({...bankDetails, bsb: e.target.value})}
                      placeholder="062-001"
                    />
                    <p className="text-xs text-slate-500">6-digit BSB code</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <div className="relative">
                      <Input 
                        type={showAccountNumber ? 'text' : 'password'}
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccountNumber(!showAccountNumber)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-green-50 rounded-xl">
                  <Shield className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Secure Banking</p>
                    <p className="text-sm text-green-700">Your bank details are encrypted and secure.</p>
                  </div>
                </div>

                <Button onClick={handleSaveBankDetails} className="gradient-primary">
                  Save Bank Details
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tax Information Tab */}
        {activeTab === 'tax' && (
          <div className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Tax Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>ABN (Australian Business Number)</Label>
                  <Input 
                    value={taxInfo.abn}
                    onChange={(e) => setTaxInfo({...taxInfo, abn: e.target.value})}
                    placeholder="12 345 678 901"
                  />
                  <p className="text-xs text-slate-500">Required for tax reporting in Australia</p>
                </div>

                <div className="space-y-2">
                  <Label>Tax Declaration</Label>
                  {taxInfo.taxDeclarationUploaded ? (
                    <div className="p-4 bg-green-50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Tax Declaration Uploaded</p>
                          <p className="text-sm text-green-700">TFN Declaration Form - 24 Feb 2024</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 mb-2">Upload your TFN Declaration Form</p>
                      <p className="text-xs text-slate-400 mb-4">PDF, JPG, or PNG up to 5MB</p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start">
                    <Sparkles className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Tax Information</p>
                      <p className="text-sm text-blue-700">
                        As an Australian affiliate, you are responsible for reporting your earnings to the ATO. 
                        We will provide you with an annual payment summary for tax purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="gradient-primary">
                  Save Tax Information
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payout History Tab */}
        {activeTab === 'history' && (
          <div className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Payout History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Processed</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                        <TableCell className="font-medium">${payout.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={payoutStatusColors[payout.status]}>
                            {payout.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {payout.status === 'processing' && <ArrowRight className="w-3 h-3 mr-1" />}
                            {payout.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {payout.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {payout.requestedAt.toLocaleDateString('en-AU')}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {payout.processedAt ? payout.processedAt.toLocaleDateString('en-AU') : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="text-sm">Bank Transfer {payout.accountInfo}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
}
