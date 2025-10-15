import { z } from "zod";
import type { FieldValues } from "react-hook-form";

export const AddTemplateSchema = z.object({
  templateType: z.string().min(1, { message: "Please select a valid Template Type" }),
  templateFor: z.string().min(1, { message: "Please select a valid Template For" }),
  templateDescription: z.string().min(1, { message: "Template Description is required" }),
  isActive: z.boolean().default(true),
});

export type AddTemplateDTO = z.infer<typeof AddTemplateSchema>;


export const AddEditTemplateSchema = AddTemplateSchema.extend({
  id: z.string().optional().nullable(), // Optional if you're editing an existing template
});

export type AddEditTemplateDTO = z.infer<typeof AddEditTemplateSchema> & FieldValues;

export const FullTemplateSchema = AddEditTemplateSchema.extend({
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type FullTemplateDTO = z.infer<typeof FullTemplateSchema>;


export const emptyTemplate: AddEditTemplateDTO = {
  id: null,
  templateType: "",
  templateFor: "",
  templateDescription: "",
  isActive: true,
};
