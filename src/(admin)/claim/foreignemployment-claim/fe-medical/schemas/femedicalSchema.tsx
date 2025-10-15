import type { FieldValues } from "react-hook-form";
import { z } from "zod";

// Schema for FE Medical Policy Search
export const feMedicalSearchSchema = z.object({
  policyOrPassport: z
    .string()
    .min(1, { message: "Please select Policy No or Passport No" }),
});

// DTO type
export type FeMedicalSearchDTO = z.infer<typeof feMedicalSearchSchema> &
  FieldValues;

// Empty default values
export const emptyFeMedicalSearch: FeMedicalSearchDTO = {
  policyOrPassport: "",
};
