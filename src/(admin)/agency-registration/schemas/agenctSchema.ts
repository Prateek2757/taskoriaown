import { z } from "zod";

export const AddAgentInfoSchema = z.object({
  // Branch Info
  preferredBranch: z.string().min(1, { message: "Please select a Preferred Branch" }),
  superiorAgentCode: z.string().min(1, { message: "Please select Superior Agent Code" }),
  superiorAgentRemarks: z.string().min(1, { message: "Please enter Superior Agent Remarks" }),

  // Corporate Info
  corporateName: z.string().min(1, { message: "Please enter Corporate Name" }),
  corporateProvince: z.string().min(1, { message: "Please select Corporate Province" }),
  corporateDistrict: z.string().min(1, { message: "Please select Corporate District" }),
  corporateMunicipality: z.string().min(1, { message: "Please select Corporate Municipality" }),
  streetName: z.string().min(1, { message: "Please enter Street Name" }),
  wardNo: z.string().min(1, { message: "Please enter Ward Number" }),

  // Identification
  identificationType: z.enum(["PAN", "VAT"], { message: "Please select Identification Type" }),
  identificationNumber: z.string().min(1, { message: "Please enter Identification Number" }),

  // Bank Info
  commissionBankName: z.string().min(1, { message: "Please select Commission Bank Name" }),
  bankAccountNumber: z.string().min(1, { message: "Please enter Bank Account Number" }),
  bankBranch: z.string().min(1, { message: "Please enter Bank Branch" }),

  // Optional Info
  panNo: z.string().optional().nullable(),
  landLineNo: z.string().optional().nullable(),

  // Contact Info
  mobileNumber: z
    .string()
    .length(10, { message: "Please enter a valid 10-digit Mobile Number" })
    .regex(/^\d+$/, { message: "Mobile Number should contain digits only" }),

  email: z.string().email({ message: "Please enter a valid Email" }),

  // Document uploads (strings or file references)
  equivalent: z.string().min(1, { message: "Please upload Equivalent document" }),
  panCard: z.string().min(1, { message: "Please upload Pan Card" }),
  trainingCertificate: z.string().min(1, { message: "Please upload Training Certificate" }),
  marksheet: z.string().min(1, { message: "Please upload Marksheet" }),
  character: z.string().min(1, { message: "Please upload Character document" }),
  letterFromOrganization: z.string().min(1, { message: "Please upload Letter From Organization" }),
  organizationRegistered: z.string().min(1, { message: "Please upload Organization Registered Certificate" }),
  scheduleSevenLetter: z.string().min(1, { message: "Please upload Schedule-7 Letter" }),
  ceoAppointmentLetter: z.string().min(1, { message: "Please upload CEO Appointment Letter" }),
  applicationForm: z.string().min(1, { message: "Please upload Application Form" }),
  citizenship: z.string().min(1, { message: "Please upload Citizenship document" }),
  taxClearanceCertificate: z.string().min(1, { message: "Please upload Tax Clearance Certificate" }),
  articleOfAssociation: z.string().min(1, { message: "Please upload Article of Association" }),
  recommendationLetter: z.string().min(1, { message: "Please upload Recommendation Letter" }),
  noObjectionLetter: z.string().min(1, { message: "Please upload No Objection Letter" }),
  companyRegisterCertificate: z.string().min(1, { message: "Please upload Company Register Certificate" }),
  uplinerDocument: z.string().min(1, { message: "Please upload Upliner Document" }),
  bankVoucher: z.string().min(1, { message: "Please upload Bank Voucher" }),

  other: z.string().optional().nullable(),
});

export type AddAgentInfoDTO = z.infer<typeof AddAgentInfoSchema>;

// Optional: empty default values object similar to emptyKyc

export const emptyAgentInfo: AddAgentInfoDTO = {
  preferredBranch: "",
  superiorAgentCode: "",
  superiorAgentRemarks: "",

  corporateName: "",
  corporateProvince: "",
  corporateDistrict: "",
  corporateMunicipality: "",
  streetName: "",
  wardNo: "",

  identificationType: "PAN", // or "" if you want empty default, but enum expects one of "PAN" or "VAT"
  identificationNumber: "",

  commissionBankName: "",
  bankAccountNumber: "",
  bankBranch: "",

  panNo: null,
  landLineNo: null,

  mobileNumber: "",
  email: "",

  equivalent: "",
  panCard: "",
  trainingCertificate: "",
  marksheet: "",
  character: "",
  letterFromOrganization: "",
  organizationRegistered: "",
  scheduleSevenLetter: "",
  ceoAppointmentLetter: "",
  applicationForm: "",
  citizenship: "",
  taxClearanceCertificate: "",
  articleOfAssociation: "",
  recommendationLetter: "",
  noObjectionLetter: "",
  companyRegisterCertificate: "",
  uplinerDocument: "",
  bankVoucher: "",

  other: null,
};
