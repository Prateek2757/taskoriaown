'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
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
  Loader2,
  RefreshCw,
  Activity,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface EarningsSummary {
  pending: number;
  approved: number;
  paid: number;
  payoutThreshold: number;
  nextPayoutDate: string;
  affiliateStatus: 'active' | 'suspended';
}

interface BankDetails {
  account_name: string;
  bank_name: string;
  bsb: string;
  account_number: string;   // raw (for editing)
  account_number_masked?: string;
  abn: string;
  tax_file_name?: string;
  tax_uploaded_at?: string;
}

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'rejected';
  requested_at: string;
  processed_at?: string;
  bank_name?: string;
  last4?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  paid:       'bg-green-100 text-green-700',
  rejected:   'bg-red-100 text-red-700',
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'pending')    return <Clock      className="w-3 h-3 mr-1" />;
  if (status === 'processing') return <ArrowRight className="w-3 h-3 mr-1" />;
  if (status === 'paid')       return <CheckCircle className="w-3 h-3 mr-1" />;
  return <AlertCircle className="w-3 h-3 mr-1" />;
};

function fmt(n: number) { return n.toLocaleString('en-AU', { minimumFractionDigits: 2 }); }
function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-AU');
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <Card className="border-0 shadow-card">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PayoutsPage() {
  const [activeTab, setActiveTab]           = useState('overview');
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [dialogOpen, setDialogOpen]         = useState(false);

  const [earningsLoading, setEarningsLoading] = useState(true);
  const [bankLoading, setBankLoading]         = useState(true);
  const [historyLoading, setHistoryLoading]   = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [withdrawing, setWithdrawing]         = useState(false);

  const [earnings, setEarnings]     = useState<EarningsSummary | null>(null);
  const [payouts, setPayouts]       = useState<Payout[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    account_name: '', bank_name: '', bsb: '', account_number: '', abn: '',
  });

  const fetchEarnings = useCallback(async () => {
    setEarningsLoading(true);
    try {
      const res  = await fetch('/api/affiliate/earnings');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEarnings(data);
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load earnings');
    } finally {
      setEarningsLoading(false);
    }
  }, []);

  const fetchBankDetails = useCallback(async () => {
    setBankLoading(true);
    try {
      const res  = await fetch('/api/affiliate/bank-details');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data) {
        setBankDetails({
          account_name:   data.account_name   ?? '',
          bank_name:      data.bank_name      ?? '',
          bsb:            data.bsb            ?? '',
          account_number: data.account_number ?? '',   // raw for editing
          abn:            data.abn            ?? '',
          tax_file_name:  data.tax_file_name,
          tax_uploaded_at: data.tax_uploaded_at,
        });
      }
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load bank details');
    } finally {
      setBankLoading(false);
    }
  }, []);

  // ── Fetch payout history ──
  const fetchPayouts = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res  = await fetch('/api/affiliate/withdraw');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPayouts(data);
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load payout history');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => { fetchEarnings(); fetchBankDetails(); }, [fetchEarnings, fetchBankDetails]);
  useEffect(() => { if (activeTab === 'history') fetchPayouts(); }, [activeTab, fetchPayouts]);

  // ── Save bank / tax details ──
  const handleSaveBankDetails = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/affiliate/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountName:   bankDetails.account_name,
          bankName:      bankDetails.bank_name,
          bsb:           bankDetails.bsb,
          accountNumber: bankDetails.account_number,
          abn:           bankDetails.abn,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Bank details saved successfully!');
      fetchBankDetails();
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save bank details');
    } finally {
      setSaving(false);
    }
  };

  // ── Request withdrawal ──
  const handleWithdraw = async () => {
    if (!earnings) return;
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < earnings.payoutThreshold) {
      toast.error(`Minimum payout is $${earnings.payoutThreshold}`);
      return;
    }
    setWithdrawing(true);
    try {
      const res = await fetch('/api/affiliate/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Withdrawal request submitted!');
      setWithdrawAmount('');
      setDialogOpen(false);
      fetchEarnings();
      if (activeTab === 'history') fetchPayouts();
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to submit withdrawal');
    } finally {
      setWithdrawing(false);
    }
  };

  const canWithdraw = earnings
    ? earnings.approved >= earnings.payoutThreshold && earnings.affiliateStatus === 'active'
    : false;

  const payoutProgress = earnings
    ? Math.min((earnings.approved / earnings.payoutThreshold) * 100, 100)
    : 0;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Payouts</h2>
            {earnings && (
              <Badge
                variant="secondary"
                className={
                  earnings.affiliateStatus === 'active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }
              >
                <Activity className="w-3 h-3 mr-1" />
                {earnings.affiliateStatus === 'active' ? 'Active Affiliate' : 'Suspended'}
              </Badge>
            )}
          </div>
          <p className="text-slate-500">Manage your earnings and withdrawals</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchEarnings} disabled={earningsLoading}>
            <RefreshCw className={`w-4 h-4 ${earningsLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  <p className="text-2xl font-bold text-slate-900">
                    ${fmt(earnings?.approved ?? 0)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Withdrawal Amount (AUD)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min={earnings?.payoutThreshold}
                    max={earnings?.approved}
                  />
                  <p className="text-xs text-slate-500">
                    Minimum: ${earnings?.payoutThreshold}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Payout Method</Label>
                  <div className="p-3 border rounded-lg flex items-center">
                    <Landmark className="w-5 h-5 mr-3 text-slate-400" />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-xs text-slate-500">
                        {bankDetails.bank_name
                          ? `${bankDetails.bank_name} ****${bankDetails.account_number.slice(-4)}`
                          : 'No bank account on file'}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleWithdraw}
                  className="w-full gradient-primary"
                  disabled={withdrawing}
                >
                  {withdrawing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing…</>
                  ) : (
                    'Confirm Withdrawal'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="tax">Tax Information</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {earningsLoading ? (
                <><CardSkeleton /><CardSkeleton /><CardSkeleton /></>
              ) : (
                <>
                  <Card className="border-0 shadow-card">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <Clock className="w-5 h-5 text-amber-500" />
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">Pending</Badge>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">${fmt(earnings?.pending ?? 0)}</p>
                      <p className="text-sm text-slate-500 mt-1">Awaiting approval</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-card">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Approved</Badge>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">${fmt(earnings?.approved ?? 0)}</p>
                      <p className="text-sm text-slate-500 mt-1">Ready to withdraw</p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-card">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <DollarSign className="w-5 h-5 text-blue-500" />
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">Paid</Badge>
                      </div>
                      <p className="text-3xl font-bold text-slate-900">${fmt(earnings?.paid ?? 0)}</p>
                      <p className="text-sm text-slate-500 mt-1">Total lifetime earnings</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Threshold progress */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-6">
                {earningsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Payout Threshold</h3>
                        <p className="text-sm text-slate-500">Minimum amount required to withdraw</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          ${earnings?.payoutThreshold}
                        </p>
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
                        <span className="text-slate-500">
                          Current: ${fmt(earnings?.approved ?? 0)}
                        </span>
                        <span className="text-slate-500">
                          Target: ${earnings?.payoutThreshold}
                        </span>
                      </div>
                    </div>

                    {!canWithdraw && earnings && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-xl flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Almost there!</p>
                          <p className="text-sm text-amber-700">
                            You need $
                            {fmt(Math.max(earnings.payoutThreshold - earnings.approved, 0))}
                            {' '}more to reach the minimum payout threshold.
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
                            You have exceeded the minimum payout threshold.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Next payout date */}
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
                    {earningsLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-slate-900">
                          {earnings?.nextPayoutDate
                            ? new Date(earnings.nextPayoutDate).toLocaleDateString('en-AU', {
                                day: 'numeric', month: 'short',
                              })
                            : '—'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {earnings?.nextPayoutDate
                            ? new Date(earnings.nextPayoutDate).toLocaleDateString('en-AU', {
                                weekday: 'long',
                              })
                            : ''}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Bank Details ── */}
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
                {bankLoading ? (
                  <div className="space-y-4">
                    {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Account Holder Name</Label>
                        <Input
                          value={bankDetails.account_name}
                          onChange={(e) => setBankDetails(p => ({ ...p, account_name: e.target.value }))}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                          value={bankDetails.bank_name}
                          onChange={(e) => setBankDetails(p => ({ ...p, bank_name: e.target.value }))}
                          placeholder="e.g. Commonwealth Bank"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>BSB</Label>
                        <Input
                          value={bankDetails.bsb}
                          onChange={(e) => setBankDetails(p => ({ ...p, bsb: e.target.value }))}
                          placeholder="062-001"
                        />
                        <p className="text-xs text-slate-500">6-digit BSB code</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Account Number</Label>
                        <div className="relative">
                          <Input
                            type={showAccountNumber ? 'text' : 'password'}
                            value={bankDetails.account_number}
                            onChange={(e) => setBankDetails(p => ({ ...p, account_number: e.target.value }))}
                            placeholder="Your account number"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAccountNumber(v => !v)}
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
                        <p className="text-sm text-green-700">
                          Your bank details are encrypted and stored securely.
                        </p>
                      </div>
                    </div>

                    <Button onClick={handleSaveBankDetails} className="gradient-primary" disabled={saving}>
                      {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : 'Save Bank Details'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Tax Information ── */}
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
                {bankLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>ABN (Australian Business Number)</Label>
                      <Input
                        value={bankDetails.abn}
                        onChange={(e) => setBankDetails(p => ({ ...p, abn: e.target.value }))}
                        placeholder="12 345 678 901"
                      />
                      <p className="text-xs text-slate-500">Required for tax reporting in Australia</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Tax Declaration</Label>
                      {bankDetails.tax_file_name ? (
                        <div className="p-4 bg-green-50 rounded-xl flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-green-800">Tax Declaration Uploaded</p>
                              <p className="text-sm text-green-700">
                                {bankDetails.tax_file_name}
                                {bankDetails.tax_uploaded_at
                                  ? ` — ${fmtDate(bankDetails.tax_uploaded_at)}`
                                  : ''}
                              </p>
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
                          <Button variant="outline" size="sm">Choose File</Button>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-start">
                        <Sparkles className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Tax Information</p>
                          <p className="text-sm text-blue-700">
                            As an Australian affiliate, you are responsible for reporting your earnings
                            to the ATO. We will provide you with an annual payment summary for tax purposes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSaveBankDetails} className="gradient-primary" disabled={saving}>
                      {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : 'Save Tax Information'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Payout History ── */}
        {activeTab === 'history' && (
          <div className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Payout History</CardTitle>
                  <Button variant="outline" size="sm" onClick={fetchPayouts} disabled={historyLoading}>
                    <RefreshCw className={`w-4 h-4 ${historyLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : payouts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <DollarSign className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium">No payouts yet</p>
                    <p className="text-sm">Your withdrawal history will appear here.</p>
                  </div>
                ) : (
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
                      {payouts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-sm">
                            {p.id.slice(0, 8)}…
                          </TableCell>
                          <TableCell className="font-medium">${fmt(p.amount)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={statusColors[p.status]}>
                              <StatusIcon status={p.status} />
                              {p.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">{fmtDate(p.requested_at)}</TableCell>
                          <TableCell className="text-slate-600">{fmtDate(p.processed_at)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="text-sm">
                                {p.bank_name
                                  ? `${p.bank_name} ****${p.last4}`
                                  : 'Bank Transfer'}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
}