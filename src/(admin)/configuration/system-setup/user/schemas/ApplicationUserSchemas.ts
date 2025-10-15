import { z } from "zod";

export const AddApplicationUserSchemas = z.object({

  kycNumber: z.string().min(1, { message: "Please Enter KYC Number" }),

  firstName: z.string()
    .min(1, { message: "Please Enter First Name" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Only alphabets are allowed" }),

  middleName: z.string().optional().nullable(),

  lastName: z.string()
    .min(1, { message: "Please Enter Last Name" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Only alphabets are allowed" }),

  fullNameLocal: z.string().min(1, { message: "Please Enter Full Name in Nepali" }),

  gender: z.string().min(1, { message: "Please Select Gender" }),

  contactNumber: z.string()
    .regex(/^9/, { message: "Must start with 9" })
    .length(10, { message: "Must be 10 digits" })
    .regex(/^\d+$/, { message: "Numbers only" }),

  permanentAddress: z.string().min(1, { message: "Please Enter Permanent Address" }),
  temporaryAddress: z.string().min(1, { message: "Please Enter Temporary Address" }),

  branchCode: z.string().min(1, { message: "Please Select Branch" }),
  departmentId: z.string().min(1, { message: "Please Select departmentId" }),
  designationCode: z.string().min(1, { message: "Please Select designationCode" }),

  email: z.string().email({ message: "Invalid email" }).optional().or(z.literal("")),

  userName: z.string().min(5, { message: "username must be at least 5 characters" }),

  isAdmin: z.boolean().default(false),
  allowLogin: z.boolean().default(false).optional(),
  password:z.string().optional(),

  role: z.string().min(1, { message: "Please Select Role" }),

  employeeId: z.union([z.string(), z.number()]),

  profilePicture: z.any().optional(),
});

// For creating a user (password required)
export type AddApplicationUserDTO = z.infer<typeof AddUserSchema>;

export const AddEditUserSchemas = AddApplicationUserSchemas.extend({
  id: z.string().optional().nullable(),
});

export type AddEditApplicationUserDTO = z.infer<typeof AddEditUserSchemas>;

export const AddUserSchema = AddApplicationUserSchemas.extend({
  password: z.string().optional(),
});


export const emptyUser: AddApplicationUserDTO = {
  kycNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
  fullNameLocal: "",
  gender: "",
  contactNumber: "",
  permanentAddress: "",
  temporaryAddress: "",
  branchCode: "",
  departmentId: "",
  designationCode: "",
  email: "",
  username: "",
  isAdmin: false,
  allowLogin: false,
  password: "",
  role: "",
  employeeId: "",
  profilePicture: "",
};
