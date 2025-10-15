import type { FieldValues } from "react-hook-form";
import { z } from "zod";

// Schema for Disability Policy Search
export const disabilitySearchSchema = z.object({
  policyNo: z.string().min(1, { message: "Please enter Policy No" }),
});

// DTO type (data transfer object)
export type DisabilitySearchDTO = z.infer<typeof disabilitySearchSchema> & FieldValues;

// Empty default values
export const emptyDisabilitySearch: DisabilitySearchDTO = {
  policyNo: "",
};
