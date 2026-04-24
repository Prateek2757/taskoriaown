"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Loader2,
  BadgePercent,
  Clock,
  DollarSign,
  Coins,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { CommissionRecord, CommissionType } from "@/types/afffiliate";
import { AdminBreadcrumb } from "../components/Adminbreadcrumb";
import { useCommissions } from "@/hooks/Admin/useCommissions";

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | string | null | undefined) {
  return Number(n ?? 0).toLocaleString("en-AU", { minimumFractionDigits: 2 });
}
function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function monthsRemaining(eligibleUntil?: string | null) {
  if (!eligibleUntil) return null;
  const ms = new Date(eligibleUntil).getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24 * 30.44));
}

const statusMeta: Record<string, { label: string; className: string }> = {
  pending:  { label: "Pending",  className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  paid:     { label: "Paid",     className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

// ─── Review Dialog ────────────────────────────────────────────────────────────

function ReviewDialog({
  commission,
  onClose,
  onSuccess,
}: {
  commission: CommissionRecord;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [note, setNote]       = useState("");
  const [loading, setLoading] = useState(false);
  const [act, setAct]         = useState<string | null>(null);

  const isTask = commission.commission_type === "task";
  const monthsLeft = monthsRemaining(commission.commission_eligible_until);

  const submit = async (action: "approved" | "rejected") => {
    setAct(action);
    setLoading(true);
    try {
      const res = await fetch("/api/affiliate/commissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionId: commission.commission_id,
          action,
          adminNote: note || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(action === "approved" ? "Commission approved!" : "Commission rejected");
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? "Action failed");
    } finally {
      setLoading(false);
      setAct(null);
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {isTask ? (
            <ClipboardList className="w-5 h-5 text-violet-500" />
          ) : (
            <BadgePercent className="w-5 h-5 text-blue-500" />
          )}
          Review {isTask ? "Task" : "Subscription"} Commission
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 pt-1">
        {/* Commission type pill */}
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={
              isTask
                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
            }
          >
            {isTask ? "Task Commission" : "Subscription Commission"}
          </Badge>
          <Badge variant="secondary" className={statusMeta[commission.status]?.className}>
            {statusMeta[commission.status]?.label}
          </Badge>
        </div>

        {/* People */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">Referrer</p>
            <p className="font-medium">{commission.referrer_name ?? commission.referrer_email}</p>
            <p className="text-xs text-slate-400 truncate">{commission.referrer_email}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">Referred User</p>
            <p className="font-medium">{commission.referred_name ?? commission.referred_email}</p>
            <p className="text-xs text-slate-400 truncate">{commission.referred_email}</p>
          </div>
        </div>

        {/* Type-specific details */}
        {isTask ? (
          <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl space-y-2.5">
            {commission.task_title && (
              <div className="flex justify-between text-sm">
                <span className="text-violet-600 dark:text-violet-400">Task</span>
                <span className="font-medium text-right max-w-48 truncate">{commission.task_title}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-violet-600 dark:text-violet-400">Task ID</span>
              <span className="font-medium font-mono">#{commission.task_id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-violet-600 dark:text-violet-400">Response ID</span>
              <span className="font-medium font-mono">#{commission.response_id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-violet-600 dark:text-violet-400">Total Responses</span>
              <span className="font-medium">{commission.total_responses}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-violet-600 dark:text-violet-400">Total Credits Used</span>
              <span className="font-medium">{commission.total_credits} credits</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-violet-600 dark:text-violet-400">Credit Value (×$3)</span>
              <span className="font-medium">${fmt(commission.credit_value)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-violet-600 dark:text-violet-400">Commission Rate</span>
              <span className="font-medium">{commission.commission_rate}%</span>
            </div>
            <div className="flex justify-between text-sm border-t border-violet-100 dark:border-violet-800 pt-2">
              <span className="text-violet-700 dark:text-violet-300 font-semibold">Commission Amount</span>
              <span className="text-lg font-bold text-violet-900 dark:text-violet-100">
                ${fmt(commission.commission_amount)}
              </span>
            </div>
            <div className="text-xs text-violet-500 dark:text-violet-400 text-right">
              {commission.total_credits} credits × $3 × {commission.commission_rate}% = ${fmt(commission.commission_amount)}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-blue-600 dark:text-blue-400">Package</span>
              <span className="font-medium">{commission.package_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600 dark:text-blue-400">Package Price</span>
              <span className="font-medium">${fmt(commission.package_price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600 dark:text-blue-400">Subscription Month</span>
              <span className="font-medium">Month {commission.subscription_month} of 12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600 dark:text-blue-400">Period</span>
              <span className="font-medium">
                {fmtDate(commission.period_start)} → {fmtDate(commission.period_end)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600 dark:text-blue-400">Commission Rate</span>
              <span className="font-medium">{commission.commission_rate}%</span>
            </div>
            {monthsLeft !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 dark:text-blue-400">Window Remaining</span>
                <span className={`font-medium ${monthsLeft <= 2 ? "text-amber-600" : "text-green-700"}`}>
                  {monthsLeft === 0 ? "Expired" : `${monthsLeft} month${monthsLeft !== 1 ? "s" : ""}`}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm border-t border-blue-100 dark:border-blue-800 pt-2">
              <span className="text-blue-700 dark:text-blue-300 font-semibold">Commission Amount</span>
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                ${fmt(commission.commission_amount)}
              </span>
            </div>
          </div>
        )}

        {/* Admin note */}
        {commission.admin_note && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-600 dark:text-slate-400">
            <p className="text-xs font-semibold text-slate-500 mb-1">Existing Note</p>
            {commission.admin_note}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Admin Note (optional)
          </label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason for approval or rejection…"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => submit("approved")}
            disabled={loading}
          >
            {loading && act === "approved" ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Approve ${fmt(commission.commission_amount)}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => submit("rejected")}
            disabled={loading}
          >
            {loading && act === "rejected" ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Reject
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminCommissionsTab() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("all");
  const [typeFilter, setType]       = useState<CommissionType | "all">("all");
  const [selected, setSelected]     = useState<CommissionRecord | null>(null);

  const { commissions, loading, refresh } = useCommissions(
    statusFilter as any,
    typeFilter
  );

  // Client-side text search
  const filtered = commissions.filter((c: CommissionRecord) => {
    const q = search.toLowerCase();
    return (
      (c.referrer_email  ?? "").toLowerCase().includes(q) ||
      (c.referred_email  ?? "").toLowerCase().includes(q) ||
      (c.referrer_name   ?? "").toLowerCase().includes(q) ||
      (c.referred_name   ?? "").toLowerCase().includes(q) ||
      (c.package_name    ?? "").toLowerCase().includes(q) ||
      (c.task_title      ?? "").toLowerCase().includes(q) ||
      String(c.task_id   ?? "").includes(q)
    );
  });

  // Summary stats (always computed from full `commissions` list, not filtered)
  const pendingCount    = commissions.filter((c: CommissionRecord) => c.status === "pending").length;
  const approvedAmount  = commissions
    .filter((c: CommissionRecord) => c.status === "approved")
    .reduce((s: number, c: CommissionRecord) => s + Number(c.commission_amount), 0);
  const filteredTotal   = filtered.reduce(
    (s: number, c: CommissionRecord) => s + Number(c.commission_amount),
    0
  );

  const subCount  = filtered.filter((c: CommissionRecord) => c.commission_type === "subscription").length;
  const taskCount = filtered.filter((c: CommissionRecord) => c.commission_type === "task").length;

  return (
    <div className="space-y-6 p-5">
      <AdminBreadcrumb />

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {/* Text search */}
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search name, email, package, task…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Commission type tabs */}
          <Tabs value={typeFilter} onValueChange={(v) => setType(v as any)}>
            <TabsList className="bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="task">Task</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatus}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl text-center">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{pendingCount}</p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Awaiting review</p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">${fmt(approvedAmount)}</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Approved balance</p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{subCount}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Subscription rows</p>
        </div>
        <div className="p-3 bg-violet-50 dark:bg-violet-900/10 rounded-xl text-center">
          <p className="text-2xl font-bold text-violet-700 dark:text-violet-400">{taskCount}</p>
          <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">Task rows</p>
        </div>
      </div>

      {/* ── Table ── */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Referred User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Window / Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                    <BadgePercent className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium">No commissions found</p>
                    <p className="text-sm">
                      {typeFilter === "task"
                        ? "Task commissions are generated when a referred professional responds to a task."
                        : "Commissions are created when referred users purchase a subscription."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c: CommissionRecord) => {
                  const meta       = statusMeta[c.status];
                  const isTask     = c.commission_type === "task";
                  const mLeft      = monthsRemaining(c.commission_eligible_until);

                  return (
                    <TableRow key={c.commission_id}>
                      {/* Type badge */}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            isTask
                              ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 whitespace-nowrap"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 whitespace-nowrap"
                          }
                        >
                          {isTask ? (
                            <ClipboardList className="w-3 h-3 mr-1" />
                          ) : (
                            <BadgePercent className="w-3 h-3 mr-1" />
                          )}
                          {isTask ? "Task" : "Sub"}
                        </Badge>
                      </TableCell>

                      {/* Referrer */}
                      <TableCell>
                        <p className="font-medium text-sm">{c.referrer_name ?? "Unnamed"}</p>
                        <p className="text-xs text-slate-500 truncate max-w-32">{c.referrer_email}</p>
                      </TableCell>

                      {/* Referred */}
                      <TableCell>
                        <p className="font-medium text-sm">{c.referred_name ?? "Unnamed"}</p>
                        <p className="text-xs text-slate-500 truncate max-w-32">{c.referred_email}</p>
                      </TableCell>

                      {/* Details — type-specific */}
                      <TableCell>
                        {isTask ? (
                          <div className="text-sm">
                            <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-40">
                              {c.task_title ? c.task_title : `Task #${c.task_id}`}
                            </p>
                            <p className="text-xs text-slate-500">
                              {c.total_credits} credits · {c.total_responses} response{c.total_responses !== 1 ? "s" : ""}
                            </p>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <p className="font-medium text-slate-800 dark:text-slate-200">{c.package_name}</p>
                            <p className="text-xs text-slate-500">
                              ${fmt(c.package_price)} · Month {c.subscription_month}/12
                            </p>
                          </div>
                        )}
                      </TableCell>

                      {/* Amount */}
                      <TableCell>
                        <span className="font-bold text-green-700 dark:text-green-400">
                          ${fmt(c.commission_amount)}
                        </span>
                      </TableCell>

                      {/* Rate */}
                      <TableCell className="text-sm text-slate-500">
                        {c.commission_rate}%
                      </TableCell>

                      {/* Window / Extra info */}
                      <TableCell>
                        {isTask ? (
                          <div className="text-xs text-slate-500">
                            <span className="font-mono">${fmt(c.credit_value)}</span>
                            <br />
                            credit value
                          </div>
                        ) : mLeft === null ? (
                          "—"
                        ) : mLeft === 0 ? (
                          <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
                            Expired
                          </Badge>
                        ) : (
                          <span className={`text-sm font-medium ${mLeft <= 2 ? "text-amber-600" : "text-green-700 dark:text-green-400"}`}>
                            {mLeft}mo left
                          </span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant="secondary" className={meta?.className}>
                          {meta?.label}
                        </Badge>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        {c.status === "pending" ? (
                          <Button
                            size="sm"
                            className="gradient-primary"
                            onClick={() => setSelected(c)}
                          >
                            Review
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {c.approved_at ? fmtDate(c.approved_at) : "—"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Showing total footer ── */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-slate-500 text-right">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""} ·{" "}
          total showing: <span className="font-semibold">${fmt(filteredTotal)}</span>
        </p>
      )}

      {/* ── Review Dialog ── */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => { if (!open) setSelected(null); }}
      >
        {selected && (
          <ReviewDialog
            commission={selected}
            onClose={() => setSelected(null)}
            onSuccess={refresh}
          />
        )}
      </Dialog>
    </div>
  );
}