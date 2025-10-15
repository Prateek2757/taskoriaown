import type { FieldValues } from "react-hook-form";
import { z } from "zod";

// Main schema
export const mibPaymentSchema = z.object({
  //  eligibleDate: z.string().min(1, { message: "Please select Eligible Date" }),
});

// DTO type (data transfer object)
export type MibPaymentDTO = z.infer<typeof mibPaymentSchema> & FieldValues;

// Empty object for defaultValues
export const emptyMibPayment: MibPaymentDTO = {
  eligibleDate: "",
};
