import { z } from "zod";

export const AddProvinceSchema = z.object({
  provinceName: z
    .string()
    .min(1, { message: "Please enter Province Name" })
    .nullable(),
  provinceNameLocal: z
    .string()
    .min(1, { message: "Please enter Province Name" })
    .nullable(),
  isActive: z.boolean(),
  rowId: z.string().optional()
});

export type AddProvinceDTO = z.infer<typeof AddProvinceSchema>;

export const emptyProvince: AddProvinceDTO = {
  provinceName: "",
  provinceNameLocal: "",
  isActive: true,
};
