import type { FieldValues } from "react-hook-form";
import { z } from "zod";


export const AddMediaServiceSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  priority: z.string().min(1, { message: "Priority is required" }),

  summary: z.string().optional(),
  date: z.string().optional(),
  isActive: z.boolean().default(true),
});


export type AddMediaServiceDTO = z.infer<typeof AddMediaServiceSchema>;


export const AddEditMediaServiceSchema = AddMediaServiceSchema.extend({
  id: z.string().optional(),
  createdAt: z.string().optional(),
});

export type AddEditMediaServiceDTO = z.infer<typeof AddEditMediaServiceSchema> &
  FieldValues;


export const emptyMediaService: AddMediaServiceDTO = {
  type: "",
  title: "",
  priority: "",
  summary: "",
  date: "",
  isActive: true,
};
