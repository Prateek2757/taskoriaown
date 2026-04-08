export type Status = "pending" | "approved" | "rejected";
export type IssueType = "credit_return" | "something_else";

export interface RefundRequest {
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

export interface ApiResponse {
  success: boolean;
  data: RefundRequest[];
}

export interface WalletCheckResponse {
  success: boolean;
  hasWallet: boolean;
  currentCredits?: number;
  userId?: number;
  message?: string;
}

export interface RefundCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const REASON_LABELS: Record<string, string> = {
    invalid_phone: "Invalid phone",
    wrong_person_phone: "Wrong person",
    no_response: "No response",
    unwanted_service: "Unwanted service",
    duplicate_purchase: "Duplicate purchase",
  };
  
  export const TOPIC_LABELS: Record<string, string> = {
    getting_started: "Getting started",
    account_management: "Account management",
    cancel_subscription: "Cancel subscription",
    email_preferences: "Email preferences",
    technical_issue: "Technical issue",
    guarantee_claim: "Guarantee claim",
    billing: "Billing",
    other: "Other",
  };
  
  export const PAGE_SIZE = 15;