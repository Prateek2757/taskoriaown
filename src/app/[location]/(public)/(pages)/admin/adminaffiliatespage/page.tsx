"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, 
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  RefreshCw,
  Search,
  Building2,
  FileText,
  Loader2,
  Eye,
  Activity,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Ban,
} from "lucide-react";
import { PayoutActionDialog } from "./components/payoutactiondialog";
import { AdminBreadcrumb } from "../components/Adminbreadcrumb";
import { usePendingPayouts } from "@/hooks/Admin/usePendingPayouts";
import { useAffiliateAdmin } from "@/hooks/Admin/useAffiliatesAdmin";

interface Affiliate {
  user_id: number;
  email: string;
  referral_code: string;
  display_name?: string;
  profile_image_url?: string;
  joined_at: string;
  pending_earnings: number;
  approved_earnings: number;
  processing_earnings: number;
  total_referrals: number;
  account_name?: string;
  bank_name?: string;
  bsb?: string;
  account_last4?: string;
  abn?: string;
  tax_file_url?: string;
  affiliate_status?: "active" | "suspended";
  total_paid_out: number;
  pending_payout_count: number;
}

interface Payout {
  payout_id: string;
  user_id: number;
  amount: number;
  status: "pending" | "processing" | "paid" | "rejected";
  requested_at: string;
  processed_at?: string;
  bank_snapshot?: {
    account_name?: string;
    bank_name?: string;
    bsb?: string;
    account_number?: string;
    abn?: string;
  };
  email?: string;
  display_name?: string;
}

function fmt(n: number | string) {
  return Number(n).toLocaleString("en-AU", { minimumFractionDigits: 2 });
}
function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusColors: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  processing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function StatCard({
  icon: Icon,
  label,
  value,
  lightColor,
  darkColor,
  loading,
}: {
  icon: any;
  label: string;
  value: string;
  lightColor: string;
  darkColor: string; 
  loading: boolean;
}) {
  return (
    <Card className={`border-0 shadow-card ${lightColor} ${darkColor} p-0`}>
      <CardContent className="p-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${lightColor} ${darkColor}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {loading ? (
          <>
            <Skeleton className="h-7 w-3/4 mb-1 dark:bg-slate-700" />
            <Skeleton className="h-3 w-1/2 dark:bg-slate-700" />
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {label}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AffiliateDetailRow({ affiliate }: { affiliate: Affiliate }) {
  return (
    <TableRow className="bg-slate-50 dark:bg-slate-800/40">
      <TableCell colSpan={8} className="py-4 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bank Details */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Bank Details
            </p>
            {affiliate.bank_name ? (
              <>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {affiliate.account_name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {affiliate.bank_name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                  BSB: {affiliate.bsb} | Acct: ****{affiliate.account_last4}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                No bank details on file
              </p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Tax Info
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              ABN:{" "}
              {affiliate.abn ?? (
                <span className="text-slate-400 dark:text-slate-500">
                  Not provided
                </span>
              )}
            </p>
            {affiliate.tax_file_url && (
              <a
                href={affiliate.tax_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
              >
                <FileText className="w-3.5 h-3.5" /> View TFN Declaration
              </a>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Earnings Breakdown
            </p>
            <div className="text-sm space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Pending
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  ${fmt(affiliate.pending_earnings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Approved
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  ${fmt(affiliate.approved_earnings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Processing
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  ${fmt(affiliate.processing_earnings)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-1 mt-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Total Paid Out
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  ${fmt(affiliate.total_paid_out)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminAffiliatesPage() {
  const [activeTab, setActiveTab] = useState("affiliates");
  // const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  // // const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([]);
  // const [affiliatesLoading, setAffiliatesLoading] = useState(true);
  // const [payoutsLoading, setPayoutsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const {
    payouts: pendingPayouts,
    loading: payoutsLoading,
    error,
    refresh:payoutsRefresh,
  } = usePendingPayouts();

  const {
    affiliates,
    loading: affiliatesLoading,
    refresh: affiliateRefresh,
  } = useAffiliateAdmin();

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load payouts");
    }
  }, [error]);

  // const fetchAffiliates = useCallback(async () => {
  //   setAffiliatesLoading(true);
  //   try {
  //     const res = await fetch("/api/admin/affiliates/affiliate-admin");
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.error);
  //     setAffiliates(data);
  //   } catch (e: any) {
  //     toast.error(e.message ?? "Failed to load affiliates");
  //   } finally {
  //     setAffiliatesLoading(false);
  //   }
  // }, []);

  // const fetchPendingPayouts = useCallback(async () => {
  //   setPayoutsLoading(true);
  //   try {
  //     const { payouts ,payoutLoading ,error} = usePendingPayouts();
  //     setPendingPayouts(payouts);
  //     toast.error(error ?? "Failed to load payouts");

  //   } catch (e: any) {
  //     toast.error(e.message ?? "Failed to load payouts");
  //   } finally {
  //     setPayoutsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchAffiliates();
  // }, [fetchAffiliates]);

  const filtered = affiliates.filter(
    (a: any) =>
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      a.referral_code.toLowerCase().includes(search.toLowerCase())
  );

  const totalApproved = affiliates.reduce(
    (s: number, a: Affiliate) => s + Number(a.approved_earnings),
    0
  );
  const totalPaidOut = affiliates.reduce(
    (s: number, a: Affiliate) => s + Number(a.total_paid_out),
    0
  );
  const pendingPayoutCount = pendingPayouts.length;

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <AdminBreadcrumb />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Affiliate Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            View affiliates, bank details, and process payouts
          </p>
        </div>
        <Button
          variant="outline"
          onClick={affiliateRefresh}
          disabled={affiliatesLoading}
          className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${affiliatesLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Affiliates"
          value={String(affiliates.length)}
          lightColor="bg-blue-100 text-blue-600"
          darkColor="dark:bg-blue-900/30 dark:text-blue-400"
          loading={affiliatesLoading}
        />
        <StatCard
          icon={AlertTriangle}
          label="Pending Payouts"
          value={String(pendingPayoutCount)}
          lightColor="bg-amber-100 text-amber-600"
          darkColor="dark:bg-amber-900/30 dark:text-amber-400"
          loading={payoutsLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Approved Balance"
          value={`$${fmt(totalApproved)}`}
          lightColor="bg-green-100 text-green-600"
          darkColor="dark:bg-green-900/30 dark:text-green-400"
          loading={affiliatesLoading}
        />
        <StatCard
          icon={DollarSign}
          label="Total Paid Out"
          value={`$${fmt(totalPaidOut)}`}
          lightColor="bg-blue-50 text-blue-600"
          darkColor="dark:bg-blue-900/20 dark:text-blue-400"
          loading={affiliatesLoading}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800 border-0">
          <TabsTrigger
            value="affiliates"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 text-slate-600 dark:text-slate-400"
          >
            All Affiliates
            <Badge
              variant="secondary"
              className="ml-2 bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              {affiliates.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 text-slate-600 dark:text-slate-400"
          >
            Pending Payouts
            {pendingPayoutCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
              >
                {pendingPayoutCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {activeTab === "affiliates" && (
          <div className="mt-6 space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <Input
                className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Search by email, name, or referral code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Card className="border-0 shadow-card bg-white dark:bg-slate-800/60 dark:border dark:border-slate-700/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 dark:border-slate-700">
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Affiliate
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Referral Code
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Referrals
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Approved Balance
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Total Paid Out
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Pending Payouts
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Status
                      </TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliatesLoading ? (
                      [1, 2, 3, 4].map((i) => (
                        <TableRow
                          key={i}
                          className="border-slate-100 dark:border-slate-700/50"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-5 w-full bg-slate-100 dark:bg-slate-700" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filtered.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-12 text-slate-500 dark:text-slate-400"
                        >
                          <Users className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                          No affiliates found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.flatMap((a:Affiliate) => {
                        const isExpanded = expandedRow === a.user_id;
                        return [
                          <TableRow
                            key={a.user_id}
                            className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40 border-slate-100 dark:border-slate-700/50 transition-colors"
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : a.user_id)
                            }
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {a.profile_image_url ? (
                                  <img
                                    src={a.profile_image_url}
                                    alt=""
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                    {(a.display_name ??
                                      a.email)[0].toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                    {a.display_name ?? "Unnamed"}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {a.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            {/* Referral code */}
                            <TableCell>
                              <code className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                                {a.referral_code}
                              </code>
                            </TableCell>

                            {/* Referrals count */}
                            <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                              {a.total_referrals}
                            </TableCell>

                            {/* Approved balance */}
                            <TableCell>
                              <span className="font-medium text-green-700 dark:text-green-400">
                                ${fmt(a.approved_earnings)}
                              </span>
                            </TableCell>

                            {/* Total paid out */}
                            <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                              ${fmt(a.total_paid_out)}
                            </TableCell>

                            {/* Pending payout badge */}
                            <TableCell>
                              {Number(a.pending_payout_count) > 0 ? (
                                <Badge
                                  variant="secondary"
                                  className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                >
                                  <Clock className="w-3 h-3 mr-1" />
                                  {a.pending_payout_count} pending
                                </Badge>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500 text-sm">
                                  —
                                </span>
                              )}
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={
                                  a.affiliate_status === "active"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                }
                              >
                                <Activity className="w-3 h-3 mr-1" />
                                {a.affiliate_status === "active" ? "Active":"Inactive" }
                              </Badge>
                            </TableCell>

                            <TableCell>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                              )}
                            </TableCell>
                          </TableRow>,

                          ...(isExpanded
                            ? [
                                <AffiliateDetailRow
                                  key={`${a.user_id}-detail`}
                                  affiliate={a}
                                />,
                              ]
                            : []),
                        ];
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Pending Payouts Tab ── */}
        {activeTab === "payouts" && (
          <div className="mt-6">
            <Card className="border-0 shadow-card bg-white dark:bg-slate-800/60 dark:border dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between text-slate-900 dark:text-slate-100">
                  <span>Payouts Awaiting Action</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={payoutsRefresh}
                    disabled={payoutsLoading}
                    className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${payoutsLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 dark:border-slate-700">
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Affiliate
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Amount
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Status
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Bank
                      </TableHead>
                      <TableHead className="text-slate-500 dark:text-slate-400">
                        Requested
                      </TableHead>
                      <TableHead className="text-right text-slate-500 dark:text-slate-400">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payoutsLoading ? (
                      [1, 2, 3].map((i) => (
                        <TableRow
                          key={i}
                          className="border-slate-100 dark:border-slate-700/50"
                        >
                          {[1, 2, 3, 4, 5, 6].map((j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-5 w-full bg-slate-100 dark:bg-slate-700" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : pendingPayouts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-slate-500 dark:text-slate-400"
                        >
                          <CheckCircle className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                          <p className="font-medium text-slate-700 dark:text-slate-300">
                            All clear!
                          </p>
                          <p className="text-sm">
                            No pending payouts to process.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingPayouts.map((p: Payout) => (
                        <TableRow
                          key={p.payout_id}
                          className="border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                        >
                          {/* Affiliate */}
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                {p.display_name ?? "Unnamed"}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {p.email}
                              </p>
                            </div>
                          </TableCell>

                          {/* Amount */}
                          <TableCell>
                            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              ${fmt(p.amount)}
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={statusColors[p.status]}
                            >
                              {p.status.toUpperCase()}
                            </Badge>
                          </TableCell>

                          {/* Bank */}
                          <TableCell>
                            {p.bank_snapshot?.bank_name ? (
                              <div className="text-sm">
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                  {p.bank_snapshot.bank_name}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 font-mono">
                                  BSB {p.bank_snapshot.bsb} | ****
                                  {p.bank_snapshot.account_number?.slice(-4)}
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 text-sm">
                                —
                              </span>
                            )}
                          </TableCell>

                          {/* Date */}
                          <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                            {fmtDate(p.requested_at)}
                          </TableCell>

                          {/* Action */}
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="gradient-primary"
                              onClick={() => setSelectedPayout(p)}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Process
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>

      {/* ── Payout Action Dialog ── */}
      <Dialog
        open={!!selectedPayout}
        onOpenChange={(open) => {
          if (!open) setSelectedPayout(null);
        }}
      >
        {selectedPayout && (
          <PayoutActionDialog
            payout={selectedPayout}
            onClose={() => setSelectedPayout(null)}
            onSuccess={() => {
              payoutsRefresh()
              affiliateRefresh()
              // fetchPendingPayouts();
              // fetchAffiliates();
            }}
          />
        )}
      </Dialog>
    </div>
  );
}
