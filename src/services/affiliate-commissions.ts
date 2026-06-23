import { api } from "@/lib/api-client";
import type { CommissionRecord, CommissionType } from "@/types/afffiliate";

type StatusFilter = "pending" | "approved" | "paid" | "rejected" | "all";

export function listAffiliateCommissions(
  statusFilter: StatusFilter = "all",
  typeFilter: CommissionType | "all" = "all"
) {
  const params = new URLSearchParams();
  if (statusFilter !== "all") params.set("status", statusFilter);
  if (typeFilter !== "all") params.set("type", typeFilter);

  const query = params.toString();
  return api.get<CommissionRecord[]>(
    `/api/affiliate/commissions${query ? `?${query}` : ""}`
  );
}

export function reviewAffiliateCommission({
  commissionId,
  action,
  adminNote,
}: {
  commissionId: number;
  action: "approved" | "rejected";
  adminNote?: string;
}) {
  return api.patch<void>("/api/affiliate/commissions", {
    commissionId,
    action,
    adminNote,
  });
}
