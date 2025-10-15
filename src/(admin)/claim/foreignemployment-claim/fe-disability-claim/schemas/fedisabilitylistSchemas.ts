import type { FieldValues } from "react-hook-form";
import { z } from "zod";

// Schema for FE Disability Policy Search
export const feDisabilitySearchSchema = z.object({
  policyNo: z.string().min(1, { message: "Please enter Policy No" }),
});

// DTO type (data transfer object)
export type FeDisabilitySearchDTO = z.infer<typeof feDisabilitySearchSchema> & FieldValues;

// Empty default values
export const emptyFeDisabilitySearch: FeDisabilitySearchDTO = {
  policyNo: "",
};
