import { api } from "@/lib/api-client";
import type { CreditPackage } from "@/hooks/useCredit";

export function getCreditBalance() {
  return api.get<{ balance?: number }>("/api/admin/credit-balance");
}

export function listCreditPackages() {
  return api.get<CreditPackage[]>("/api/admin/credit-packages");
}

export function estimateTaskCredits(taskId: number, action = "lead_response") {
  const params = new URLSearchParams({
    task_id: String(taskId),
    action,
  });
  return api.get<{ estimated?: number }>(`/api/credits/estimate?${params}`);
}

export function listTaskCreditEstimates() {
  return api.get<{
    tasks?: Array<{ task_id: number; estimated_credits: number }>;
  }>("/api/admin/create-credit-estimate");
}

export function deductProfessionalCredits({
  professionalId,
  taskId,
  credits,
}: {
  professionalId: string;
  taskId: number;
  credits: number;
}) {
  return api.post<{
    success: boolean;
    responseId?: number;
    balance?: number;
  }>("/api/admin/deduct-credit", {
    professionalId,
    taskId,
    credits,
  });
}

export function createCreditTopup({
  professionalId,
  packageId,
}: {
  professionalId: string;
  packageId: number;
}) {
  return api.post("/api/admin/credit-topups", {
    professional_id: professionalId,
    package_id: packageId,
    payment_method: "Card",
    transaction_ref: `TXN-${Date.now()}`,
  });
}
