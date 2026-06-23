// hooks/Admin/useCommissions.ts

import { useState, useEffect, useCallback } from "react";
import { CommissionRecord, CommissionType } from "@/types/afffiliate";
import { listAffiliateCommissions } from "@/services/affiliate-commissions";

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
      const data = await listAffiliateCommissions(statusFilter, typeFilter);
      setCommissions(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load commissions");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { commissions, loading, error, refresh: fetch_ };
}
