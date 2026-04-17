import { uploadToSupabase } from "@/lib/uploadFileToSupabase";
import { useMutation } from "./useApi";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface BankDetailsPayload {
  account_name: string;
  bank_name: string;
  bsb: string;
  account_number: string;
  abn?: string;
  tax_file?: File | null;
}

export interface BankDetailsResponse {
  id: string;
  user_id: number;
  account_name: string;
  bank_name: string;
  bsb: string;
  account_number: string;
  abn?: string;
  tax_file_url?: string;
  tax_file_name?: string;
  tax_uploaded_at?: string;
  status: "active" | "suspended";
  created_at: string;
  updated_at: string;
}

export interface PayoutPayload {
  amount: number;
}

export interface PayoutResponse {
  payout_id: string;
  user_id: number;
  amount: number;
  status: "pending" | "processing" | "paid" | "rejected";
  requested_at: string;
}

export async function saveBankDetails(
  payload: BankDetailsPayload
): Promise<BankDetailsResponse> {
  let tax_file_url: string | undefined;
  let tax_file_name: string | undefined;

  if (payload.tax_file) {
    tax_file_url = await uploadToSupabase(payload.tax_file, "affiliate-tax");
    tax_file_name = payload.tax_file.name;
  }

  const body = {
    account_name: payload.account_name,
    bank_name: payload.bank_name,
    bsb: payload.bsb,
    account_number: payload.account_number,
    ...(payload.abn ? { abn: payload.abn } : {}),
    ...(tax_file_url ? { tax_file_url, tax_file_name } : {}),
  };

  const res = await fetch("/api/affiliate/bank-details", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message ?? `Server error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetches the current user's bank details (if any).
 */
export async function fetchBankDetails(): Promise<BankDetailsResponse | null> {
  const res = await fetch("/api/affiliate/bank-details");
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load bank details: ${res.status}`);
  return res.json();
}

/**
 * Submits a payout request.
 */
export async function requestPayout(
  payload: PayoutPayload
): Promise<PayoutResponse> {
  const res = await fetch("/api/affiliate/payouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json?.message ?? `Server error: ${res.status}`);
  }

  return res.json();
}

/* ─── Hooks ──────────────────────────────────────────────────────────────── */

export function useSaveBankDetails(options?: {
  onSuccess?: (data: BankDetailsResponse) => void;
  onError?: (msg: string) => void;
}) {
  return useMutation<BankDetailsResponse, BankDetailsPayload>(
    saveBankDetails,
    options
  );
}

export function useRequestPayout(options?: {
  onSuccess?: (data: PayoutResponse) => void;
  onError?: (msg: string) => void;
}) {
  return useMutation<PayoutResponse, PayoutPayload>(requestPayout, options);
}