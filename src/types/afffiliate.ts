import { z } from 'zod';

export type AffiliateStatus = 'active' | 'suspended';
export type PayoutStatus    = 'pending' | 'processing' | 'paid' | 'rejected';
export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'rejected';
export type ReferralStatus  = 'pending' | 'subscribed' | 'expired' | 'paid' | 'rejected';
export type CommissionType = "subscription" | "task";

export interface ReferralStats {
  total:                number;
  awaitingSubscription: number;  // signed up, no subscription yet
  activeEarning:        number;  // subscribed + within 12-month window
  completed:            number;  // expired or paid out
}

export interface EarningsSummary {
  pending:  number;
  approved: number;
  paid:     number;

  pendingCount:  number;
  approvedCount: number;

  // Referral breakdown
  referralStats: ReferralStats;

  // Config
  commissionRate:  number;   // 20
  payoutThreshold: number;   // 100
  nextPayoutDate:  string;   // ISO
  affiliateStatus: AffiliateStatus;
}

export interface BankDetailsDTO {
  id?:              string;
  user_id?:         number;
  account_name:     string;
  bank_name:        string;
  bsb:              string;
  account_number:   string;
  abn:              string;
  tax_file_name?:   string | null;
  tax_file_url?:    string | null;
  tax_uploaded_at?: string | null;
  status?:          AffiliateStatus;
  updated_at?:      string;
}

export interface PayoutRecord {
  id:               string;
  amount:           number;
  status:           PayoutStatus;
  requested_at:     string;
  processed_at?:    string | null;
  bank_name?:       string | null;
  last4?:           string | null;
  admin_note?:      string | null;
  commission_count: number;
}

export interface CommissionRecord {
  commission_id: string;
  referral_id: string;
  referrer_id: number;
  referred_user_id: number;
 
  /** Discriminator – determines which set of fields are populated */
  commission_type: CommissionType;
 
  // ── Subscription-only fields ──────────────────────────────────────────────
  subscription_id?: string | null;
  package_id?: number | null;
  payment_transaction_id?: number | null;
  package_name?: string | null;
  package_price?: number | null;
  subscription_month?: number | null;
  period_start?: string | null;
  period_end?: string | null;
  /** ISO timestamp: 12-month eligibility window end */
  commission_eligible_until?: string | null;
 
  // ── Task-only fields ──────────────────────────────────────────────────────
  task_id?: number | null;
  response_id?: number | null;
  credits_spent?: number | null;
  credit_value?: number | null;
  total_responses?: number | null;
  total_credits?: number | null;
  /** Short task title joined from tasks table */
  task_title?: string | null;
 
  // ── Common fields ─────────────────────────────────────────────────────────
  commission_rate: number;
  commission_amount: number;
  status: CommissionStatus;
  approved_at?: string | null;
  approved_by?: number | null;
  payout_id?: string | null;
  admin_note?: string | null;
  created_at: string;
  updated_at: string;
 
  // ── Joined display fields ─────────────────────────────────────────────────
  referrer_name?: string | null;
  referrer_email?: string | null;
  referred_name?: string | null;
  referred_email?: string | null;
}
 

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const bsbRegex = /^\d{3}-?\d{3}$/;
const abnRegex = /^(\d{2} \d{3} \d{3} \d{3}|\d{11})$/;

export const bankDetailsSchema = z.object({
  account_name:   z.string().min(2, 'Name must be at least 2 characters').max(120),
  bank_name:      z.string().min(2, 'Bank name is required').max(120),
  bsb:            z.string().regex(bsbRegex, 'BSB must be 6 digits (e.g. 062-001)'),
  account_number: z
    .string()
    .min(6, 'Account number must be at least 6 digits')
    .max(10, 'Account number too long')
    .regex(/^\d+$/, 'Digits only'),
});

export const taxInfoSchema = z.object({
  abn: z
    .string()
    .regex(abnRegex, 'Enter a valid 11-digit ABN (e.g. 12 345 678 901)')
    .or(z.literal('')),
});

export const withdrawSchema = (approvedBalance: number, threshold: number) =>
  z.object({
    amount: z
      .string()
      .min(1, 'Enter an amount')
      .refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Must be a positive number')
      .refine(v => Number(v) >= threshold, `Minimum withdrawal is $${threshold}`)
      .refine(v => Number(v) <= approvedBalance, `Cannot exceed $${approvedBalance.toFixed(2)}`),
  });

export type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;
export type TaxInfoFormValues     = z.infer<typeof taxInfoSchema>;
export type WithdrawFormValues    = z.infer<ReturnType<typeof withdrawSchema>>;