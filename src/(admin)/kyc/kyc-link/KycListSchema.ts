import { z } from "zod";

export const AddKycLinkSchema = z.object({
  kycNumber: z.string().min(1, "Kyc Number is required").optional().nullable(),
  policyNumber: z.string().optional().nullable(),
  agentCode: z.string().optional().nullable(),
  rowId: z.string().optional().nullable(),
});

export type AddKycLinkDTO = z.infer<typeof AddKycLinkSchema>;

export const emptyKycLink = {
  kycNumber: "",
  policyNumber: null,
  agentCode: null,
  rowId: null,
};
