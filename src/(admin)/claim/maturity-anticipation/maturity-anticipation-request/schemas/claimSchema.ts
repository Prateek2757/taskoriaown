
import { z } from "zod";

export const ClaimSchema = z.object({
  policyNo: z.string().min(1, { message: "Policy No is required" }),
  claimType: z.string().min(1, { message: "Claim Type is required" }),
  documents: z
    .any()
    .refine((files) => files && files.length > 0, { message: "Documents are required" }),
  isSignatureVerified: z.boolean().optional(),
});

export type ClaimDTO = z.infer<typeof ClaimSchema>;
