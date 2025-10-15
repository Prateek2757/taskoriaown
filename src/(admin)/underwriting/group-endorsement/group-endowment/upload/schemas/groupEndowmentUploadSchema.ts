import { z } from "zod";

export const GroupEndowmentUploadSchema = z.object({
  group: z
    .string()
    .min(1, { message: "Please Select Group" }),
  uploadFile: z
    .any()
    .refine((file) => file && file.length > 0, {
      message: "Please Upload File",
    }),
  uploadFileName: z.string().optional(),
  remarks: z
    .string()
    .min(1, { message: "Please Enter Remarks" }),
});

export type GroupEndowmentUploadDTO = z.infer<typeof GroupEndowmentUploadSchema>;
