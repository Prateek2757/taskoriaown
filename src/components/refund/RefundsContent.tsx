"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { StatCard } from "./StatCard";
import { RefundFilters } from "./RefundFilters";
import { RefundsTable } from "./RefundsTable";
import { ReviewDialog } from "./ReviewDialog";
// import { Toast } from "./Toast";
import type { RefundRequest, ApiResponse, Status, IssueType } from "@/types/refunds";
import { toast } from "sonner";

export function RefundsContent() {
  const [allData, setAllData] = useState<RefundRequest[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selected, setSelected] = useState<RefundRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
//   const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [typeFilter, setTypeFilter] = useState<"" | IssueType>("");
  const [page, setPage] = useState(1);

//   const showToast = (msg: string, type: "success" | "error") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   };

  const fetchAll = useCallback(async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/admin/refunds?limit=1000");
      if (res.data.success) setAllData(res.data.data);
    } catch {
      toast.error("Failed to load requests.");
      
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

  const handleReview = (row: RefundRequest) => {
    setSelected(row);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTimeout(() => setSelected(null), 200); 
  };

  const handleAction = async (
    id: number,
    status: "approved" | "rejected",
    note: string,
    creditAmount?: number
  ) => {
    try {
      const res = await axios.patch(`/api/admin/refunds/${id}`, {
        status,
        admin_note: note,
        credit_amount: creditAmount,
      });
      if (res.data.success) {
        const creditMsg = creditAmount ? ` · ${creditAmount} credits refunded` : "";
        toast.success(`Request #${id} ${status}.${creditMsg}`);
        handleDialogClose();
        setAllData((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status, admin_note: note || null, updated_at: new Date().toISOString() }
              : r
          )
        );
      } else {
        toast.error(res.data.message || "Action failed.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  const toggleStatusFilter = (s: Status) =>
    setStatusFilter((prev) => (prev === s ? "" : s));

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 transition-colors">
      {/* {toast && <Toast msg={toast.msg} type={toast.type} />} */}


      <div className="max-w-7xl mx-auto px-3 py-10">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              Refund Requests
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Review, approve, or reject incoming requests.
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className={`w-4 h-4 ${fetchLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={counts.total} color="bg-zinc-100 dark:bg-zinc-800" icon="📋"
            active={statusFilter === ""} onClick={() => setStatusFilter("")} />
          <StatCard label="Pending" value={counts.pending} color="bg-amber-50 dark:bg-amber-900/20" icon="⏳"
            active={statusFilter === "pending"} onClick={() => toggleStatusFilter("pending")} />
          <StatCard label="Approved" value={counts.approved} color="bg-emerald-50 dark:bg-emerald-900/20" icon="✅"
            active={statusFilter === "approved"} onClick={() => toggleStatusFilter("approved")} />
          <StatCard label="Rejected" value={counts.rejected} color="bg-red-50 dark:bg-red-900/20" icon="❌"
            active={statusFilter === "rejected"} onClick={() => toggleStatusFilter("rejected")} />
        </div>

        <RefundFilters
          search={search}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          resultCount={filteredData.length}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
          onTypeChange={(v) => { setTypeFilter(v); setPage(1); }}
          onClear={() => { setSearch(""); setStatusFilter(""); setTypeFilter(""); setPage(1); }}
        />

        <RefundsTable
          data={filteredData}
          loading={fetchLoading}
          page={page}
          onPageChange={setPage}
          onReview={handleReview}
        />
      </div>

      <ReviewDialog
        request={selected}
        open={dialogOpen}
        onClose={handleDialogClose}
        onAction={handleAction}
      />
    </div>
  );
}