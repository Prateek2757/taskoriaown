import { z } from "zod";

export const AddDoctorSchema = z.object({
  doctorName: z
    .string()
    .min(1, { message: "Please enter Department Name" })
    .nullable(),
  nMCNo: z
    .string()
    .min(1, { message: "Please enter Department Name" })
    .nullable(),
  branch: z
    .string()
    .min(1, { message: "Please enter Department Name" })
    .nullable(),
  officeContact: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  doctorType: z.string().optional().nullable(),
  mobileNo: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  doctorAddress: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export type AddDoctorDTO = z.infer<typeof AddDoctorSchema>;

export const emptyDoctor: AddDoctorDTO = {
  doctorName: "",
  nMCNo: "",
  branch: "",
  officeContact: "",
  email: "",
  doctorType: "",
  mobileNo: "",
  remarks: "",
  doctorAddress: "",
  isActive: true,
};
