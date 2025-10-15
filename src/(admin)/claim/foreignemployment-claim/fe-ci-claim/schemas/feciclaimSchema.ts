import type { FieldValues } from "react-hook-form";
import { z } from "zod";

// Schema for FE CI Claim Search/Add
export const feCiClaimSchema = z.object({
  policyOrPassport: z
    .string()
    .min(1, { message: "Please select Policy No or Passport No" }),
});

// DTO type
export type FECIClaimDTO = z.infer<typeof feCiClaimSchema> & FieldValues;

// Empty default values
export const emptyFECIClaim: FECIClaimDTO = {
  policyOrPassport: "",
};
