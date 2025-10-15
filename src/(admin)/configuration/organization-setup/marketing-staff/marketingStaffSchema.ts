import { z } from "zod";

export const AddMarketingStaffSchema = z.object({
  employeeId: z
    .string()
    .min(1, { message: "Please enter MarketingStaff Name" })
    .nullable(),
  branchCode: z
    .string()
    .min(1, { message: "Please enter MarketingStaff Name" })
    .nullable(),
  firstName: z
    .string()
    .min(1, { message: "Please enter MarketingStaff Name" })
    .nullable(),
  middleName: z.string().optional().nullable(),
  lastName: z
    .string()
    .min(1, { message: "Please enter MarketingStaff Name" })
    .nullable(),
  fullName: z.string().optional().nullable(),
  contactNo: z
    .string()
    .min(1, { message: "Please enter MarketingStaff Name" })
    .nullable(),
  email: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export type AddMarketingStaffDTO = z.infer<typeof AddMarketingStaffSchema>;

export const emptyMarketingStaff: AddMarketingStaffDTO = {
  employeeId: "",
  branchCode: "",
  firstName: "",
  middleName: "",
  lastName: "",
  fullName: "",
  contactNo: "",
  email: "",
  isActive: true,
};
