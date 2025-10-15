import { z } from "zod";

export const hierarchyformSchema = z.object({
  
  fiscalYear: z.string().min(1, { message: "Fiscal Year is required" }),
  positionType: z.string().min(1, { message: "Position Type is required" }),
  positionDescription: z
    .string()
    .min(1, { message: "Position Description is required" }),

  
  remarks: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});


export type HierarchyFormDTO = z.infer<typeof hierarchyformSchema>;


export const emptyHierarchyForm: HierarchyFormDTO = {
  fiscalYear: "",
  positionType: "",
  positionDescription: "",
  remarks: "",
  isActive: true,
};
