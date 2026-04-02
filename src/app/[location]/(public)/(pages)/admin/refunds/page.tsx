"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface RefundRequest {
  id: string;
  status: "pending" | "under_review" | "approved" | "rejected" | "cancelled";
  reason: string;
  description: string;
  credits_to_refund: number;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  task_title: string;
  task_budget: number;
  response_message: string;
  credits_spent: number;
  professional_id: string;
  professional_email: string;
  professional_name: string;
  professional_avatar: string | null;
  reviewer_email: string | null;
  attachments: { id: string; file_url: string; file_name: string; mime_type: string }[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Constants ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:      { label: "Pending",      bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200",   dot: "bg-amber-500"   },
  under_review: { label: "Under Review", bg: "bg-blue-50",    text: "text-blue-700",    ring: "ring-blue-200",    dot: "bg-blue-500"    },
  approved:     { label: "Approved",     bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-500" },
  rejected:     { label: "Rejected",     bg: "bg-red-50",     text: "text-red-700",     ring: "ring-red-200",     dot: "bg-red-500"     },
  cancelled:    { label: "Cancelled",    bg: "bg-slate-100",  text: "text-slate-500",   ring: "ring-slate-200",   dot: "bg-slate-400"   },
};

const REASON_LABELS: Record<string, string> = {
  fake_lead:             "Fake Lead",
  irrelevant_lead:       "Irrelevant Lead",
  spam:                  "Spam",
  duplicate_lead:        "Duplicate Lead",
  customer_no_show:      "Customer No-Show",
  incorrect_information: "Incorrect Information",
  technical_error:       "Technical Error",
  other:                 "Other",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────
function DetailDrawer({
  refund,
  onClose,
  onAction,
}: {
  refund: RefundRequest;
  onClose: () => void;
  onAction: (id: string, status: string, notes: string) => Promise<void>;
}) {
  const [adminNotes, setAdminNotes] = useState(refund.admin_notes || "");
  const [loading,    setLoading]    = useState(false);
  const [actionErr,  setActionErr]  = useState("");

  const isTerminal = ["approved", "rejected", "cancelled"].includes(refund.status);

  const handleAction = async (status: "approved" | "rejected" | "under_review") => {
    setLoading(true);
    setActionErr("");
    try {
      await onAction(refund.id, status, adminNotes);
    } catch (e) {
      setActionErr("Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="font-bold text-slate-900">Refund Request</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">#{refund.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between">
            <StatusBadge status={refund.status as keyof typeof STATUS_CONFIG} />
            <span className="text-xs text-slate-400">{formatDate(refund.created_at)}</span>
          </div>

          <Section title="Professional">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
                {refund.professional_avatar ? (
                  <img src={refund.professional_avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-indigo-700 font-bold text-sm">
                    {(refund.professional_name || refund.professional_email || "?")[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{refund.professional_name || "—"}</p>
                <p className="text-xs text-slate-500">{refund.professional_email}</p>
              </div>
            </div>
          </Section>

          <Section title="Task">
            <p className="font-semibold text-slate-800">{refund.task_title}</p>
            {refund.task_budget && <p className="text-xs text-slate-500 mt-0.5">Budget: £{refund.task_budget}</p>}
          </Section>

          <Section title="Their Response">
            <p className="text-sm text-slate-600 leading-relaxed">{refund.response_message}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full ring-1 ring-amber-200">
                {refund.credits_spent} credits spent
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full ring-1 ring-indigo-200">
                {refund.credits_to_refund} to refund
              </span>
            </div>
          </Section>

          <Section title="Reason">
            <span className="text-sm font-semibold text-slate-700">
              {REASON_LABELS[refund.reason] || refund.reason}
            </span>
          </Section>

          <Section title="Description">
            <div
              className="text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: refund.description }}
            />
          </Section>

          {refund.attachments.length > 0 && (
            <Section title={`Attachments (${refund.attachments.length})`}>
              <div className="space-y-2">
                {refund.attachments.map((a) => (
                  <a
                    key={a.id}
                    href={a.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors group"
                  >
                    <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-slate-700 truncate group-hover:text-indigo-700">{a.file_name}</span>
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Admin notes */}
          <Section title="Admin Notes">
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              disabled={isTerminal}
              placeholder="Add internal notes (visible to admin only)..."
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none disabled:bg-slate-50 disabled:text-slate-400 transition-all"
            />
          </Section>

          {refund.reviewer_email && (
            <p className="text-xs text-slate-400">
              Reviewed by <span className="font-medium">{refund.reviewer_email}</span>
              {refund.reviewed_at ? ` on ${formatDate(refund.reviewed_at)}` : ""}
            </p>
          )}

          {actionErr && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{actionErr}</p>
          )}
        </div>

        {/* Footer actions */}
        {!isTerminal && (
          <div className="border-t border-slate-100 p-5 bg-slate-50/60 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("approved")}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
              >
                {loading ? <SpinIcon /> : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Approve & Refund
              </button>
              <button
                onClick={() => handleAction("rejected")}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 disabled:opacity-50 transition-all shadow-md shadow-red-100 flex items-center justify-center gap-2"
              >
                {loading ? <SpinIcon /> : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                Reject
              </button>
            </div>
            {refund.status === "pending" && (
              <button
                onClick={() => handleAction("under_review")}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-white transition-colors"
              >
                Mark as Under Review
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

function SpinIcon() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function AdminRefundsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [refunds,    setRefunds]    = useState<RefundRequest[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState<RefundRequest | null>(null);
  const [error,      setError]      = useState("");

  const [filterStatus,   setFilterStatus]   = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo,   setFilterDateTo]   = useState("");
  const [page,           setPage]           = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, session, router]);

  const fetchRefunds = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterStatus)   params.set("status",   filterStatus);
      if (filterDateFrom) params.set("dateFrom",  filterDateFrom);
      if (filterDateTo)   params.set("dateTo",    filterDateTo);
      params.set("page",  String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/refund/admin?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRefunds(data.data);
      setPagination(data.pagination);
    } catch {
      setError("Failed to load refund requests.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterDateFrom, filterDateTo, page]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") fetchRefunds();
  }, [fetchRefunds, status, session]);

  const handleAction = async (id: string, newStatus: string, notes: string) => {
    const res = await fetch(`/api/refund/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, admin_notes: notes }),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.message);
    }
    // Refresh list and close drawer
    await fetchRefunds();
    setSelected(null);
  };

  // Computed stats
  const stats = {
    total:    refunds.length,
    pending:  refunds.filter((r) => r.status === "pending").length,
    approved: refunds.filter((r) => r.status === "approved").length,
    rejected: refunds.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">Refund Requests</h1>
              <p className="text-xs text-slate-400">Admin Panel · Taskoria</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:block">{session?.user?.email}</span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
              {(session?.user?.name || session?.user?.email || "A")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total (page)"  value={stats.total}    color="text-slate-900" />
          <StatCard label="Pending"        value={stats.pending}  color="text-amber-600" />
          <StatCard label="Approved"       value={stats.approved} color="text-emerald-600" />
          <StatCard label="Rejected"       value={stats.rejected} color="text-red-600" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">From</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1); }}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-semibold text-slate-500 mb-1 block">To</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => { setFilterDateTo(e.target.value); setPage(1); }}
                className="w-full h-10 px-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <button
              onClick={() => { setFilterStatus(""); setFilterDateFrom(""); setFilterDateTo(""); setPage(1); }}
              className="h-10 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>

            <button
              onClick={fetchRefunds}
              className="h-10 px-5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
            >
              Apply
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : refunds.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="font-medium">No refund requests found</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["ID", "Professional", "Task", "Reason", "Credits", "Status", "Submitted", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                      onClick={() => setSelected(r)}
                    >
                      <td className="px-4 py-4 font-mono text-xs text-slate-400">
                        #{r.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-xs font-bold text-indigo-700 overflow-hidden">
                            {r.professional_avatar ? (
                              <img src={r.professional_avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (r.professional_name || r.professional_email || "?")[0].toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[120px]">{r.professional_name || "—"}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[120px]">{r.professional_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-700 truncate max-w-[160px]">{r.task_title}</p>
                        {r.task_budget && <p className="text-xs text-slate-400">£{r.task_budget}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                          {REASON_LABELS[r.reason] || r.reason}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-bold text-amber-600">{r.credits_to_refund}</span>
                        <span className="text-xs text-slate-400"> cr</span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={r.status as keyof typeof STATUS_CONFIG} />
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(r); }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Review →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Showing {((page - 1) * pagination.limit) + 1}–{Math.min(page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 w-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pg = i + 1;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors
                        ${pg === page ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}
                      `}
                    >
                      {pg}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="h-8 w-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <DetailDrawer
          refund={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
