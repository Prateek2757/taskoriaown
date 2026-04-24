// hooks/Admin/useCommissions.ts

import { useState, useEffect, useCallback } from "react";
import { CommissionRecord, CommissionType } from "@/types/afffiliate";

type StatusFilter = "pending" | "approved" | "paid" | "rejected" | "all";

export function useCommissions(
  statusFilter: StatusFilter = "all",
  typeFilter: CommissionType | "all" = "all"
) {
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter   !== "all") params.set("type",   typeFilter);

      const res  = await fetch(`/api/affiliate/commissions?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load commissions");
      setCommissions(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { commissions, loading, error, refresh: fetch_ };
}