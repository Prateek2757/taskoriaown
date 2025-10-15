import { z } from "zod";


export const AddConstantDataValueSchema = z.object({
  staticCode: z.string().min(1, "Static Code is required"),
  description: z.string().optional(),
  value: z.string().optional(),
  reference:z.string().optional(),
  descriptionInNepali: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const addConstantDataValueSchema = AddConstantDataValueSchema;

export const AddEditConstantDataValueSchema = AddConstantDataValueSchema.extend({
  id: z.string().min(1, "ID is required for editing"),
});

export type AddEditConstantDataValueDTO = z.infer<typeof AddConstantDataValueSchema>;
export type AddConstantDataValueDTO = z.infer<typeof addConstantDataValueSchema>;
export type EditConstantDataValueDTO = z.infer<typeof AddEditConstantDataValueSchema>;
