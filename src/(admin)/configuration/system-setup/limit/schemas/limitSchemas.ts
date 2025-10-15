import { z } from "zod";
import type { FieldValues } from "react-hook-form";

export const AddLimitSchema = z.object({
  limitName: z.string().min(1, { message: "Please enter the Limit Name" }),

  // Underwriting
  minMedicalSA: z.string().optional().nullable(),
  maxMedicalSA: z.string().optional().nullable(),
  minMedicalAge: z.string().optional().nullable(),
  maxMedicalAge: z.string().optional().nullable(),

  minNonMedicalSA: z.string().optional().nullable(),
  maxNonMedicalSA: z.string().optional().nullable(),
  minNonMedicalAge: z.string().optional().nullable(),
  maxNonMedicalAge: z.string().optional().nullable(),

  // Loan
  minPolicyLoanAmount: z.string().optional().nullable(),
  maxPolicyLoanAmount: z.string().optional().nullable(),
  minAgentLoanAmount: z.string().optional().nullable(),
  maxAgentLoanAmount: z.string().optional().nullable(),

  // Policy Servicing
  minSurrenderAmount: z.string().optional().nullable(),
  maxSurrenderAmount: z.string().optional().nullable(),
  minMaturityAmount: z.string().optional().nullable(),
  maxMaturityAmount: z.string().optional().nullable(),
  minSurvivalAmount: z.string().optional().nullable(),
  maxSurvivalAmount: z.string().optional().nullable(),

  // Claims
  minDeathClaimAmount: z.string().optional().nullable(),
  maxDeathClaimAmount: z.string().optional().nullable(),
  minAdultRiderAmount: z.string().optional().nullable(),
  maxAdultRiderAmount: z.string().optional().nullable(),
  minChildRiderAmount: z.string().optional().nullable(),
  maxChildRiderAmount: z.string().optional().nullable(),
  minForeignClaimAmount: z.string().optional().nullable(),
  maxForeignClaimAmount: z.string().optional().nullable(),

  // Journal
  minVoucherAmount: z.string().optional().nullable(),
  maxVoucherAmount: z.string().optional().nullable(),

  isActive: z.boolean().optional(),
});

export type AddLimitDTO = z.infer<typeof AddLimitSchema>;

export const emptyLimitManagement: AddLimitDTO = {
  limitName: "",

  minMedicalSA: null,
  maxMedicalSA: null,
  minMedicalAge: null,
  maxMedicalAge: null,

  minNonMedicalSA: null,
  maxNonMedicalSA: null,
  minNonMedicalAge: null,
  maxNonMedicalAge: null,

  minPolicyLoanAmount: null,
  maxPolicyLoanAmount: null,
  minAgentLoanAmount: null,
  maxAgentLoanAmount: null,

  minSurrenderAmount: null,
  maxSurrenderAmount: null,
  minMaturityAmount: null,
  maxMaturityAmount: null,
  minSurvivalAmount: null,
  maxSurvivalAmount: null,

  minDeathClaimAmount: null,
  maxDeathClaimAmount: null,
  minAdultRiderAmount: null,
  maxAdultRiderAmount: null,
  minChildRiderAmount: null,
  maxChildRiderAmount: null,
  minForeignClaimAmount: null,
  maxForeignClaimAmount: null,

  minVoucherAmount: null,
  maxVoucherAmount: null,

  isActive: false,
};

export const AddEditLimitSchema = AddLimitSchema.extend({
  id: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

export type AddEditLimitDTO = z.infer<typeof AddEditLimitSchema> & FieldValues;

export const emptyEditLimitManagement: AddEditLimitDTO = {
  id: null,
  updatedAt: null,
  limitName: "",

  minMedicalSA: null,
  maxMedicalSA: null,
  minMedicalAge: null,
  maxMedicalAge: null,

  minNonMedicalSA: null,
  maxNonMedicalSA: null,
  minNonMedicalAge: null,
  maxNonMedicalAge: null,

  minPolicyLoanAmount: null,
  maxPolicyLoanAmount: null,
  minAgentLoanAmount: null,
  maxAgentLoanAmount: null,

  minSurrenderAmount: null,
  maxSurrenderAmount: null,
  minMaturityAmount: null,
  maxMaturityAmount: null,
  minSurvivalAmount: null,
  maxSurvivalAmount: null,

  minDeathClaimAmount: null,
  maxDeathClaimAmount: null,
  minAdultRiderAmount: null,
  maxAdultRiderAmount: null,
  minChildRiderAmount: null,
  maxChildRiderAmount: null,
  minForeignClaimAmount: null,
  maxForeignClaimAmount: null,

  minVoucherAmount: null,
  maxVoucherAmount: null,

  isActive: false,
};
