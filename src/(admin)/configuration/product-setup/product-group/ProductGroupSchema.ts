import { z } from "zod";

export const AddProductGroupSchema = z.object({
  rowId: z.string().optional(),
  productGroupName: z.string().min(1, "Product group name is required").optional().nullable(),
  productGroupNameLocal: z.string().min(1, "Product group name (local) is required").optional().nullable(),
  description: z.string().min(1, "Description is required").optional().nullable(),
  productGroupFile: z.string().optional().nullable(),
  productGroupFileName: z.string().optional().nullable(),
});

export type AddProductGroupDTO = z.infer<typeof AddProductGroupSchema>;

export const emptyProductGroup: AddProductGroupDTO = {
  productGroupName: "",
  productGroupNameLocal: "",
  description: "",
  productGroupFile: "",
  productGroupFileName: "",
};
