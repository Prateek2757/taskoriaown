import { z } from "zod";

export const AddPolicyAssigneeSchema = z.object({
  // Policy Information
  policyNo: z.string().min(1, { message: "Please Select Policy No" }),
  
  // Assignee Information
  assigneeId: z.string().min(1, { message: "Please Enter Assignee Id" }),
  
  // Company Information
  companyName: z.string().min(1, { message: "Please Enter Company Name" }),
  companyNameNepali: z.string().min(1, { message: "Please Enter Company Name (Nepali)" }),
  companyAddressNepali: z.string().min(1, { message: "Please Enter Company Address (Nepali)" }),
  
  // Assignment Details
  type: z.string().min(1, { message: "Please Select Type" }),
  assignedDate: z.string().optional(),
  isActive: z.boolean(),
  
  // Additional Information
  remarks: z.string().optional().nullable(),
  
  // Document Upload
  assigneeDocument: z.string().optional().nullable(),
  assigneeDocumentName: z.string().optional().nullable(),
});

export type AddPolicyAssigneeDTO = z.infer<typeof AddPolicyAssigneeSchema>;

export const emptyPolicyAssignee = {
  policyNo: "",
  assigneeId: "",
  companyName: "",
  companyNameNepali: "",
  companyAddressNepali: "",
  type: "Assign",
  assignedDate: "",
  isActive: true,
  remarks: "",
  assigneeDocument: "",
  assigneeDocumentName: "",
};
