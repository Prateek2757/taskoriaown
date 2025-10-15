import { z } from "zod";

export const AddDepartmentSchema = z.object({
  shortName: z.string().optional().nullable(),
  departmentName: z
    .string()
    .min(1, { message: "Please enter Department Name" })
    .nullable(),
  departmentNameLocal: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  departmentHead: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export type AddDepartmentDTO = z.infer<typeof AddDepartmentSchema>;

export const emptyDepartment: AddDepartmentDTO = {
  shortName: "",
  departmentName: "",
  departmentNameLocal: "",
  email: "",
  departmentHead: "",
  isActive: true,
};
