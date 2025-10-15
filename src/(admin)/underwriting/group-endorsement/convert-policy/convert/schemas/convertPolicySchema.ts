import { z } from "zod";

export const ConvertPolicySchema = z.object({
  kycNo: z
    .string()
    .min(1, { message: "Please Select KYC No" }),
  // Insured Details - these will be populated after KYC selection
  groupCode: z.string().optional(),
  policyNo: z.string().optional(),
  dob: z.string().optional(),
  doc: z.string().optional(),
  term: z.string().optional(),
  basicPremium: z.string().optional(),
  totalRiderPremium: z.string().optional(),
  groupName: z.string().optional(),
  insuredName: z.string().optional(),
  age: z.string().optional(),
  nextDueDate: z.string().optional(),
  payTerm: z.string().optional(),
  premium: z.string().optional(),
  totalInstallment: z.string().optional(),
});

export type ConvertPolicyDTO = z.infer<typeof ConvertPolicySchema>;
