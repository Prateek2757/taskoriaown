"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  XCircle,
  Info,
  BadgePercent,
  Users,
} from "lucide-react";

import { useAffiliate } from "../../../../hooks/AffiliateDashboard/useAffiliate";
import type { PayoutStatus } from "../../../../types/afffiliate";
import { TaxInfoTab } from "./TaxInfoTab";

function fmt(n: number) {
  return n.toLocaleString("en-AU", { minimumFractionDigits: 2 });
}
function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU");
}

const statusMeta: Record<
  PayoutStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  pending: {
    label: "PENDING",
    className: "bg-amber-100 text-amber-700",
    icon: <Clock className="w-3 h-3 mr-1" />,
  },
  processing: {
    label: "PROCESSING",
    className: "bg-blue-100 text-blue-700",
    icon: <ArrowRight className="w-3 h-3 mr-1" />,
  },
  paid: {
    label: "PAID",
    className: "bg-green-100 text-green-700",
    icon: <CheckCircle className="w-3 h-3 mr-1" />,
  },
  rejected: {
    label: "REJECTED",
    className: "bg-red-100 text-red-700",
    icon: <XCircle className="w-3 h-3 mr-1" />,
  },
};

function StatusBadge({ status }: { status: PayoutStatus }) {
  const meta = statusMeta[status];
  return (
    <Badge variant="secondary" className={meta.className}>
      {meta.icon}
      {meta.label}
    </Badge>
  );
}

function CardSkeleton() {
  return (
    <Card className="border-0 shadow-card">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </CardContent>
    </Card>
  );
}

function WithdrawDialog({
  withdraw,
  bankName,
  accountNumber,
  approvedBalance,
  threshold,
}: {
  withdraw: ReturnType<typeof useAffiliate>["withdraw"];
  bankName: string;
  accountNumber: string;
  approvedBalance: number;
  threshold: number;
}) {
  const { form, loading, open, setOpen, onSubmit, canWithdraw } = withdraw;
  const watchedAmount = form.watch("amount");
  const parsedAmount = parseFloat(watchedAmount) || 0;
  const remaining = Math.max(approvedBalance - parsedAmount, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary" disabled={!canWithdraw}>
          <DollarSign className="w-4 h-4 mr-2" />
          Request Withdrawal
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ${fmt(approvedBalance)}
              </p>
              {parsedAmount > 0 && (
                <p className="text-sm text-slate-500">
                  Remaining after withdrawal:{" "}
                  <span className="font-medium text-slate-700">
                    ${fmt(remaining)}
                  </span>
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Withdrawal Amount (AUD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        $
                      </span>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        min={threshold}
                        max={approvedBalance}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Minimum ${threshold} · Maximum ${fmt(approvedBalance)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1.5">
              <p className="text-sm font-medium leading-none">Payout Method</p>
              <div className="p-3 border rounded-lg flex items-center gap-3 bg-slate-50">
                <Landmark className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Bank Transfer</p>
                  <p className="text-xs text-slate-500">
                    {bankName
                      ? `${bankName} ****${accountNumber.slice(-4)}`
                      : "No bank account on file — add one in Bank Details"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary"
              disabled={loading || !form.formState.isValid}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing…
                </>
              ) : (
                "Confirm Withdrawal"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`px-3 py-2 rounded-lg ${color} flex items-center justify-between gap-4`}>
      <span className="text-xs font-medium opacity-80">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function OverviewTab({
  earnings,
  withdraw,
  bankName,
  accountNumber,
  WithdrawDialog,
}: {
  earnings:      ReturnType<typeof useAffiliate>['earnings'];
  withdraw:      ReturnType<typeof useAffiliate>['withdraw'];
  bankName:      string;
  accountNumber: string;
  WithdrawDialog: React.ComponentType<any>;
}) {
  const data           = earnings.data;
  const payoutProgress = data
    ? Math.min((data.approved / data.payoutThreshold) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">

      {/* ── How it works banner ── */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-none">
        <CardContent className="p-4 flex items-center gap-4 flex-wrap">
          <BadgePercent className="w-8 h-8 text-blue-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-900">How commissions work</p>
            <p className="text-sm text-blue-700">
              You earn <strong>20% of the subscription price</strong> each time a referred
              user pays — for the first <strong>12 months</strong> of their subscription.
              Commissions are approved by our team before becoming withdrawable.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Earnings cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {earnings.loading ? (
          <><EarningsSkeleton /><EarningsSkeleton /><EarningsSkeleton /></>
        ) : (
          <>
            <Card className="border-0 shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    Pending Review
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-slate-900">${fmt(data?.pending ?? 0)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {data?.pendingCount ?? 0} commission{data?.pendingCount !== 1 ? 's' : ''} awaiting admin approval
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Approved
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-slate-900">${fmt(data?.approved ?? 0)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {data?.approvedCount ?? 0} commission{data?.approvedCount !== 1 ? 's' : ''} ready to withdraw
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Paid Out
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-slate-900">${fmt(data?.paid ?? 0)}</p>
                <p className="text-xs text-slate-500 mt-1">Total lifetime earnings paid</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* ── Referral pipeline ── */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-slate-500" />
            <h3 className="text-base font-semibold text-slate-900">Referral Pipeline</h3>
          </div>
          {earnings.loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatPill
                label="Total referred"
                value={data?.referralStats.total ?? 0}
                color="bg-slate-100 text-slate-700"
              />
              <StatPill
                label="Awaiting subscription"
                value={data?.referralStats.awaitingSubscription ?? 0}
                color="bg-amber-50 text-amber-800"
              />
              <StatPill
                label="Actively earning"
                value={data?.referralStats.activeEarning ?? 0}
                color="bg-green-50 text-green-800"
              />
              <StatPill
                label="Completed"
                value={data?.referralStats.completed ?? 0}
                color="bg-blue-50 text-blue-800"
              />
            </div>
          )}
          <p className="text-xs text-slate-400 mt-3">
            "Awaiting subscription" users signed up via your link but haven't purchased a plan yet —
            you'll start earning once they subscribe.
          </p>
        </CardContent>
      </Card>

      {/* ── Payout threshold progress ── */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-6">
          {earnings.loading ? (
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
                  <p className="text-sm text-slate-500">
                    Approved commissions needed before you can withdraw
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">${data?.payoutThreshold}</p>
                  <p className="text-sm text-slate-500">AUD minimum</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium">{payoutProgress.toFixed(1)}%</span>
                </div>
                <div className="relative pb-1">
                  <Progress value={payoutProgress} className="h-4" />
                  <div
                    className="absolute top-0 -translate-x-1/2 -mt-1 transition-all duration-500"
                    style={{ left: `${Math.min(payoutProgress, 98)}%` }}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <DollarSign className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Approved: ${fmt(data?.approved ?? 0)}</span>
                  <span>Target: ${data?.payoutThreshold}</span>
                </div>
              </div>

              {!withdraw.canWithdraw && data && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Not yet eligible</p>
                    <p className="text-sm text-amber-700">
                      You need ${fmt(Math.max(data.payoutThreshold - data.approved, 0))} more in
                      approved commissions. Pending commissions are reviewed by our team
                      typically within 48 hours.
                    </p>
                  </div>
                </div>
              )}

              {withdraw.canWithdraw && data && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Ready to withdraw!</p>
                      <p className="text-sm text-green-700">
                        You have ${fmt(data.approved)} in approved commissions.
                      </p>
                    </div>
                  </div>
                  <WithdrawDialog
                    withdraw={withdraw}
                    bankName={bankName}
                    accountNumber={accountNumber}
                    approvedBalance={data.approved}
                    threshold={data.payoutThreshold}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Next payout date ── */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Next Payout Date</h3>
                <p className="text-sm text-slate-500">Automatic monthly payout cycle</p>
              </div>
            </div>
            <div className="text-right">
              {earnings.loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-slate-900">
                    {data?.nextPayoutDate
                      ? new Date(data.nextPayoutDate).toLocaleDateString('en-AU', {
                          day: 'numeric', month: 'short',
                        })
                      : '—'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {data?.nextPayoutDate
                      ? new Date(data.nextPayoutDate).toLocaleDateString('en-AU', { weekday: 'long' })
                      : ''}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

function EarningsSkeleton() {
  return (
    <Card className="border-0 shadow-card">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-3 w-4/5" />
      </CardContent>
    </Card>
  );
}

function BankDetailsTab({
  bankForm: { form, loading, saving, onSubmit },
}: {
  bankForm: ReturnType<typeof useAffiliate>["bankForm"];
}) {
  const [showAcct, setShowAcct] = useState(false);

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          Bank Account Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="account_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full legal name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Commonwealth Bank"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bsb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BSB</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="062-001" maxLength={7} />
                      </FormControl>
                      <FormDescription>6-digit BSB code</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showAcct ? "text" : "password"}
                            placeholder="Your account number"
                            autoComplete="off"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAcct((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label={
                              showAcct
                                ? "Hide account number"
                                : "Show account number"
                            }
                          >
                            {showAcct ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <Shield className="w-5 h-5 text-green-500  shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Secure Banking
                  </p>
                  <p className="text-sm text-green-700">
                    Your bank details are encrypted at rest. Account numbers are
                    never displayed in full after saving.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="gradient-primary"
                  disabled={saving || !form.formState.isDirty}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save Bank Details"
                  )}
                </Button>
                {form.formState.isDirty && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Unsaved changes
                  </p>
                )}
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

// function TaxInfoTab({
//   taxForm: { form, dto, loading, saving, onSubmit },
// }: {
//   taxForm: ReturnType<typeof useAffiliate>["taxForm"];
// }) {
//   return (
//     <Card className="border-0 shadow-card">
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold flex items-center gap-2">
//           <FileText className="w-5 h-5 text-blue-500" />
//           Tax Information
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <div className="space-y-4">
//             <Skeleton className="h-10 w-full rounded-md" />
//             <Skeleton className="h-24 w-full rounded-xl" />
//           </div>
//         ) : (
//           <Form {...form}>
//             <form onSubmit={onSubmit} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="abn"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>ABN (Australian Business Number)</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="12 345 678 901"
//                         maxLength={14}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       Required for tax reporting in Australia. 11 digits.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="space-y-2">
//                 <p className="text-sm font-medium leading-none">
//                   Tax Declaration
//                 </p>
//                 {dto?.tax_file_name ? (
//                   <div className="p-4 bg-green-50 rounded-xl flex items-center justify-between gap-3">
//                     <div className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-green-800">
//                           Tax Declaration Uploaded
//                         </p>
//                         <p className="text-sm text-green-700">
//                           {dto.tax_file_name}
//                           {dto.tax_uploaded_at
//                             ? ` — ${fmtDate(dto.tax_uploaded_at)}`
//                             : ""}
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       type="button"
//                       asChild={!!dto.tax_file_url}
//                     >
//                       {dto.tax_file_url ? (
//                         <a
//                           href={dto.tax_file_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <Download className="w-4 h-4 mr-1" />
//                           Download
//                         </a>
//                       ) : (
//                         <span>
//                           <Download className="w-4 h-4 mr-1" />
//                           Download
//                         </span>
//                       )}
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
//                     <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
//                     <p className="text-sm text-slate-600 mb-1">
//                       Upload your TFN Declaration Form
//                     </p>
//                     <p className="text-xs text-slate-400 mb-4">
//                       PDF, JPG, or PNG up to 5MB
//                     </p>
//                     <Button variant="outline" size="sm" type="button">
//                       Choose File
//                     </Button>
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
//                 <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-blue-800">
//                     Tax Information
//                   </p>
//                   <p className="text-sm text-blue-700">
//                     As an Australian affiliate, you are responsible for
//                     reporting earnings to the ATO. We will provide an annual
//                     payment summary for tax purposes.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Button
//                   type="submit"
//                   className="gradient-primary"
//                   disabled={saving || !form.formState.isDirty}
//                 >
//                   {saving ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Saving…
//                     </>
//                   ) : (
//                     "Save Tax Information"
//                   )}
//                 </Button>
//                 {form.formState.isDirty && (
//                   <p className="text-xs text-amber-600 flex items-center gap-1">
//                     <Info className="w-3.5 h-3.5" />
//                     Unsaved changes
//                   </p>
//                 )}
//               </div>
//             </form>
//           </Form>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({
  history,
}: {
  history: ReturnType<typeof useAffiliate>["history"];
}) {
  const { data, loading, fetch } = history;

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Payout History
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetch}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <DollarSign className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No payouts yet</p>
            <p className="text-sm">Your withdrawal history will appear here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm text-slate-500">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-default tabular-nums">
                          {p.id.slice(0, 8)}…
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-mono text-xs">{p.id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${fmt(p.amount)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {fmtDate(p.requested_at)}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {fmtDate(p.processed_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">
                        {p.bank_name
                          ? `${p.bank_name} ****${p.last4}`
                          : "Bank Transfer"}
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
  );
}


export function PayoutsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const { earnings, bankForm, taxForm, withdraw, history } = useAffiliate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "history") history.fetchOnce();
  };

  const bankName = bankForm.form.watch("bank_name");
  const accountNumber = bankForm.form.watch("account_number");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900">Payouts</h2>
            {earnings.data && (
              <Badge
                variant="secondary"
                className={
                  earnings.data.affiliateStatus === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }
              >
                <Activity className="w-3 h-3 mr-1" />
                {earnings.data.affiliateStatus === "active"
                  ? "Active Affiliate"
                  : "Account Suspended"}
              </Badge>
            )}
          </div>
          <p className="text-slate-500">Manage your earnings and withdrawals</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => earnings.refetch()}
            disabled={earnings.loading}
          >
            <RefreshCw
              className={`w-4 h-4 ${earnings.loading ? "animate-spin" : ""}`}
            />
          </Button>

          {!withdraw.canWithdraw && (
            <WithdrawDialog
              withdraw={withdraw}
              bankName={bankName}
              accountNumber={accountNumber}
              approvedBalance={earnings.data?.approved ?? 0}
              threshold={earnings.data?.payoutThreshold ?? 100}
            />
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-white">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bank">
            Bank Details
            {bankForm.form.formState.isDirty && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-amber-400 inline-block" />
            )}
          </TabsTrigger>
          <TabsTrigger value="tax">
            Tax Information
            {taxForm.form.formState.isDirty && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-amber-400 inline-block" />
            )}
          </TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {activeTab === "overview" && (
            <OverviewTab
              earnings={earnings}
              withdraw={withdraw}
              bankName={bankName}
              accountNumber={accountNumber}
              WithdrawDialog={WithdrawDialog}
            />
          )}
          {activeTab === "bank" && <BankDetailsTab bankForm={bankForm} />}
          {activeTab === "tax" && <TaxInfoTab taxForm={taxForm} />}
          {activeTab === "history" && <HistoryTab history={history} />}
        </div>
      </Tabs>
    </div>
  );
}
