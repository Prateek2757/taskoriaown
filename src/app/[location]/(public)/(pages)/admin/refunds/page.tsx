"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Status = "pending" | "approved" | "rejected";
type IssueType = "credit_return" | "something_else";

interface RefundRequest {
  id: number;
  issue_type: IssueType;
  email: string;
  lead_name: string | null;
  lead_email: string | null;
  reason: string | null;
  support_topic: string | null;
  subject: string | null;
  description: string;
  status: Status;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: RefundRequest[];
}

const REASON_LABELS: Record<string, string> = {
  invalid_phone: "Invalid phone",
  wrong_person_phone: "Wrong person",
  no_response: "No response",
  unwanted_service: "Unwanted service",
  duplicate_purchase: "Duplicate purchase",
};

const TOPIC_LABELS: Record<string, string> = {
  getting_started: "Getting started",
  account_management: "Account management",
  cancel_subscription: "Cancel subscription",
  email_preferences: "Email preferences",
  technical_issue: "Technical issue",
  guarantee_claim: "Guarantee claim",
  billing: "Billing",
  other: "Other",
};

const PAGE_SIZE = 15;

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    pending: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
    approved: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
    rejected: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50",
  };
  const dot: Record<Status, string> = {
    pending: "bg-amber-400",
    approved: "bg-emerald-400",
    rejected: "bg-red-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function TypeBadge({ type }: { type: IssueType }) {
  return type === "credit_return" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
      💳 Credit Return
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50">
      💬 Support
    </span>
  );
}

function StatCard({
  label, value, color, icon, active, onClick,
}: {
  label: string; value: number; color: string; icon: string;
  active?: boolean; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-zinc-900 border rounded-2xl p-5 flex items-center gap-4 transition-all
        ${onClick ? "cursor-pointer" : ""}
        ${active
          ? "border-[#2563EB] dark:border-[#3B82F6] ring-2 ring-[#2563EB]/20"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
        }`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-none">{value}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

function DetailModal({
  request, onClose, onAction,
}: {
  request: RefundRequest;
  onClose: () => void;
  onAction: (id: number, status: "approved" | "rejected", note: string) => Promise<void>;
}) {
  const [note, setNote] = useState(request.admin_note ?? "");
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(null);

  const handleAction = async (status: "approved" | "rejected") => {
    setLoading(status);
    await onAction(request.id, status, note);
    setLoading(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-black/20 flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TypeBadge type={request.issue_type} />
              <StatusBadge status={request.status} />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Request #{request.id}</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{fmtDate(request.created_at)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Requester</p>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{request.email}</p>
          </div>

          {request.issue_type === "credit_return" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Lead Name</p>
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{request.lead_name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Lead Email</p>
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{request.lead_email ?? "—"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Reason</p>
                <p className="text-sm text-zinc-800 dark:text-zinc-200">
                  {request.reason ? (REASON_LABELS[request.reason] ?? request.reason) : "—"}
                </p>
              </div>
            </div>
          )}

          {request.issue_type === "something_else" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Topic</p>
                <p className="text-sm text-zinc-800 dark:text-zinc-200">
                  {request.support_topic ? (TOPIC_LABELS[request.support_topic] ?? request.support_topic) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">Subject</p>
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{request.subject ?? "—"}</p>
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Description</p>
            <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
  {decodeHtml(request.description)}
</div>
          </div>

          {request.status === "pending" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2 block">
                Admin Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Add a note visible to your team…"
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent resize-none transition-all"
              />
            </div>
          )}

          {request.status !== "pending" && request.admin_note && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Admin Note</p>
              <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 italic">
                {request.admin_note}
              </div>
            </div>
          )}
        </div>

        {request.status === "pending" && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex gap-3">
            <button
              onClick={() => handleAction("rejected")}
              disabled={!!loading}
              className="flex-1 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading === "rejected" ? <Spinner /> : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              Reject
            </button>
            <button
              onClick={() => handleAction("approved")}
              disabled={!!loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
            >
              {loading === "approved" ? <Spinner /> : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              Approve
            </button>
          </div>
        )}

        {request.status !== "pending" && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-center text-zinc-400 dark:text-zinc-500">
              This request was <strong>{request.status}</strong> on {fmtDate(request.updated_at)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Auth shell — renders spinner until session confirmed ─────────────────────
export default function AdminRefundsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "unauthenticated") { router.replace("/signin"); return; }
    if (session?.user.adminrole !== "admin") router.replace("/provider/dashboard");
  }, [authStatus, session, router]);

  if (
    authStatus === "loading" ||
    authStatus === "unauthenticated" ||
    session?.user.adminrole !== "admin"
  ) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
          <Spinner />
          <span className="text-sm">Checking permissions…</span>
        </div>
      </div>
    );
  }

  return <AdminRefundsContent />;
}

function AdminRefundsContent() {
  const [allData, setAllData] = useState<RefundRequest[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selected, setSelected] = useState<RefundRequest | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [typeFilter, setTypeFilter] = useState<"" | IssueType>("");
  const [page, setPage] = useState(1);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/admin/refunds?limit=1000");
      if (res.data.success) setAllData(res.data.data);
    } catch {
      showToast("Failed to load requests.", "error");
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const counts = useMemo(() => ({
    total: allData.length,
    pending: allData.filter((r) => r.status === "pending").length,
    approved: allData.filter((r) => r.status === "approved").length,
    rejected: allData.filter((r) => r.status === "rejected").length,
  }), [allData]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allData.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (typeFilter && r.issue_type !== typeFilter) return false;
      if (q) {
        const haystack = [r.email, r.lead_name, r.lead_email, r.subject]
          .filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allData, search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
  const pagedData = useMemo(
    () => filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredData, page]
  );


  const handleAction = async (id: number, status: "approved" | "rejected", note: string) => {
    setActionLoading(id);
    try {
      const res = await axios.patch(`/api/admin/refunds/${id}`, { status, admin_note: note });
      if (res.data.success) {
        showToast(`Request #${id} ${status}.`, "success");
        setSelected(null);
        setAllData((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status, admin_note: note || null, updated_at: new Date().toISOString() }
              : r
          )
        );
      } else {
        showToast(res.data.message || "Action failed.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const inputCls = "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent transition-all";
  const selectCls = "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent transition-all appearance-none cursor-pointer pr-8";

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 transition-colors">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg
          ${toast.type === "success"
            ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400"
            : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 py-10">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">Refund Requests</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Review, approve, or reject incoming requests.</p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className={`w-4 h-4 ${fetchLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={counts.total} color="bg-zinc-100 dark:bg-zinc-800" icon="📋"
            active={statusFilter === ""} onClick={() => setStatusFilter("")} />
          <StatCard label="Pending" value={counts.pending} color="bg-amber-50 dark:bg-amber-900/20" icon="⏳"
            active={statusFilter === "pending"} onClick={() => setStatusFilter(statusFilter === "pending" ? "" : "pending")} />
          <StatCard label="Approved" value={counts.approved} color="bg-emerald-50 dark:bg-emerald-900/20" icon="✅"
            active={statusFilter === "approved"} onClick={() => setStatusFilter(statusFilter === "approved" ? "" : "approved")} />
          <StatCard label="Rejected" value={counts.rejected} color="bg-red-50 dark:bg-red-900/20" icon="❌"
            active={statusFilter === "rejected"} onClick={() => setStatusFilter(statusFilter === "rejected" ? "" : "rejected")} />
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email, lead name, lead email, subject…"
              className={`${inputCls} pl-10 w-full`}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "" | Status)} className={selectCls}>
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "" | IssueType)} className={selectCls}>
              <option value="">All types</option>
              <option value="credit_return">Credit Return</option>
              <option value="something_else">Support</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {(search || statusFilter || typeFilter) && (
            <button
              onClick={() => { setSearch(""); setStatusFilter(""); setTypeFilter(""); }}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear · {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          {fetchLoading ? (
            <div className="flex items-center justify-center py-24 gap-3 text-zinc-400 dark:text-zinc-500">
              <Spinner />
              <span className="text-sm">Loading requests…</span>
            </div>
          ) : pagedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-400 dark:text-zinc-500">
              <span className="text-4xl mb-3">📭</span>
              <p className="text-sm font-medium">No requests found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    {["#", "Type", "Requester Email", "Lead / Subject", "Lead Email", "Reason / Topic", "Status", "Submitted", "Actions"].map((h) => (
                      <th key={h} className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
                  {pagedData.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-3 py-4 text-xs font-mono text-zinc-400 dark:text-zinc-500 whitespace-nowrap">#{row.id}</td>
                      <td className="px-3 py-4 whitespace-nowrap"><TypeBadge type={row.issue_type} /></td>
                      <td className="px-3 py-4 text-sm text-zinc-700 dark:text-zinc-300 whitespace-nowrap max-w-45 truncate">{row.email}</td>
                      <td className="px-3 py-4 max-w-40">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
                          {row.issue_type === "credit_return" ? (row.lead_name ?? "—") : (row.subject ?? "—")}
                        </p>
                      </td>
                      <td className="px-3 py-4 max-w-40">
                        {row.issue_type === "credit_return" ? (
                          row.lead_email ? (
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate block" title={row.lead_email}>
                              {row.lead_email}
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>
                          )
                        ) : (
                          <span className="text-xs text-zinc-300 dark:text-zinc-600">N/A</span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap max-w-45 truncate">
                        {row.issue_type === "credit_return"
                          ? (row.reason ? (REASON_LABELS[row.reason] ?? row.reason) : "—")
                          : (row.support_topic ? (TOPIC_LABELS[row.support_topic] ?? row.support_topic) : "—")}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                      <td className="px-3 py-4 text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">{fmtDate(row.created_at)}</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(row)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            Review
                          </button>
                          {row.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAction(row.id, "approved", "")}
                                disabled={actionLoading === row.id}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                {actionLoading === row.id ? <Spinner /> : (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                              <button
                                onClick={() => handleAction(row.id, "rejected", "")}
                                disabled={actionLoading === row.id}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!fetchLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredData.length)} of {filteredData.length} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = totalPages <= 5
                    ? i + 1
                    : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                        p === page
                          ? "bg-[#2563EB] text-white"
                          : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <DetailModal
          request={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}