import type { FieldValues } from "react-hook-form";
import { z } from "zod";

// Schema for CI Policy Search
export const ciSearchSchema = z.object({
  policyNo: z.string().min(1, { message: "Please enter Policy No" }),
});

// DTO type (data transfer object)
export type CiSearchDTO = z.infer<typeof ciSearchSchema> & FieldValues;

// Empty default values
export const emptyCiSearch: CiSearchDTO = {
  policyNo: "",
};
