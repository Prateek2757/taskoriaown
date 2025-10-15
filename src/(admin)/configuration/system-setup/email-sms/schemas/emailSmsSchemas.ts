import type { FieldValues } from "react-hook-form";
import { z } from "zod";

// Main Add emailSms Schema
export const AddemailSmsSchema = z.object({
  emailSmsType: z.string().min(1, { message: "Please select a valid Type" }),

  uniqueId: z.string().min(1, { message: "Please enter Unique ID" }),

  subject: z.string().optional().nullable(),

  recipient: z.string().min(1, { message: "Please enter Recipient" }),

  message: z.string().optional().nullable(),

  timeToSend: z.string().optional().nullable(),
});

// Extended Edit emailSms Schema (used in edit mode)
export const EditemailSmsSchema = AddemailSmsSchema.extend({
  emailSmsId: z.string().optional().nullable(), // optional for edit operations
});

// Types
export type AddemailSmsDTO = z.infer<typeof AddemailSmsSchema>;
export type EditemailSmsDTO = z.infer<typeof EditemailSmsSchema> & FieldValues;

export const emptyemailSms: AddemailSmsDTO = {
  emailSmsType: "",
  uniqueId: "",
  subject: "",
  recipient: "",
  message: "",
  timeToSend: "",
};
