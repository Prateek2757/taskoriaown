import { z } from "zod";

export const GroupEndorsementSchema = z.object({
  groupName: z
    .string()
    .min(1, { message: "Please Enter Group Name" }),
  isCI: z.boolean(),
  isLSB: z.boolean(),
  isADB: z.boolean(),
  isFE: z.boolean(),
  isPWB: z.boolean(),
  isADBPTDPWB: z.boolean(),
  isIB: z.boolean(),
  ledger: z
    .string()
    .min(1, { message: "Please Select Ledger" }),
});

export type GroupEndorsementDTO = z.infer<typeof GroupEndorsementSchema>;
