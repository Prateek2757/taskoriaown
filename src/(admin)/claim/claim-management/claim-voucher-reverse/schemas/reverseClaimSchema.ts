import { z } from "zod";


export const ReverseClaimSchema = z.object({
  claimType: z.string().min(1, "Claim Type is required"),
  voucherNo: z.string().min(1, "Voucher No is required"),
  policyNo: z.string().min(1, "Policy No is required"),
});


export type ReverseClaimDTO = z.infer<typeof ReverseClaimSchema>;
