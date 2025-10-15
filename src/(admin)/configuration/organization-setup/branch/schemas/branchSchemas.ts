import { z } from "zod";
import { PostCallData } from "@/helper/apiService";

export const AddBranchSchema = z.object({
  branchCode: z.string().min(1, { message: "Please enter Branch Code" }),
  parentId: z.string().min(1, { message: "Please enter Parent ID" }),
  branchType: z.string().min(1, { message: "Please select Branch Type" }),
  branchName: z.string().min(1, { message: "Please enter Branch Name" }),
  branchNameLocal: z.string().min(1, { message: "Please enter Branch Name in Local" }),
  branchAddress: z.string().min(1, { message: "Please enter Branch Address" }),
  branchAddressLocal: z.string().min(1, { message: "Please enter Branch Address in Local" }),
  branchPhoneNumber: z.string().min(1, { message: "Please enter Branch Phone Number" }),
  branchFaxNumber: z.string().optional().nullable(),

  managerName: z.string().min(1, { message: "Please enter Manager Name" }),
  managerEmail: z.string().email({ message: "Please enter a valid Manager Email" }),
  managerMobileNumber: z
    .string()
    .regex(/^9\d{9}$/, { message: "Please enter a valid 10-digit Mobile Number starting with 9" }),

  branchEmail: z.string().email({ message: "Please enter a valid Branch Email" }),

  permanentProvince: z.string().min(1, { message: "Please select Province" }),
  permanentDistrict: z.string().min(1, { message: "Please select District" }),
  permanentMunicipality: z.string().min(1, { message: "Please select Municipality" }),

  extensionNo: z.string().optional().nullable(),
  latitude: z.string().optional().nullable(),
  longitude: z.string().optional().nullable(),

  isActive: z.boolean().optional(),
});

export const AddEditBranchSchema = AddBranchSchema.extend({
  rowId: z.string().optional().nullable(),
});


export type AddBranchDTO = z.infer<typeof AddBranchSchema>;
export type AddEditBranchDTO = z.infer<typeof AddEditBranchSchema>;


export const emptyBranch: AddBranchDTO = {
  branchCode: "",
  parentId: "",
  branchType: "",
  branchName: "",
  branchNameLocal: "",
  branchAddress: "",
  branchAddressLocal: "",
  branchPhoneNumber: "",
  branchFaxNumber: "",
  managerName: "",
  managerEmail: "",
  managerMobileNumber: "",
  branchEmail: "",
  permanentProvince: "",
  permanentDistrict: "",
  permanentMunicipality: "",
  extensionNo: "",
  latitude: "",
  longitude: "",
  isActive: false,
};


export const mapBranchTypeToApi = (type: string): string => {
  switch (type) {
    case "corporate":
      return "1";
    case "province":
      return "2";
    case "branch":
      return "3";
    case "sub-branch":
      return "4";
    case "unit":
      return "5";
    default:
      return "0";
  }
};

export const transformBranchData = (
  formData: AddEditBranchDTO,
  isUpdate: boolean
): PostCallData => {
  return {
    endpoint: "branch_add",
    ...(isUpdate && { rowId: formData.rowId }),
    branchCode: formData.branchCode,
    parentId: formData.parentId,
    branchType: mapBranchTypeToApi(formData.branchType),
    branchName: formData.branchName,
    branchNameLocal: formData.branchNameLocal,
    branchFaxNumber: formData.branchFaxNumber,
    branchPhoneNumber: formData.branchPhoneNumber,
    branchAddress: formData.branchAddress,
    branchAddressLocal: formData.branchAddressLocal,
    branchEmail: formData.branchEmail,
    managerName: formData.managerName,
    managerEmail: formData.managerEmail,
    politicalProvince: formData.permanentProvince,
    districtId: formData.permanentDistrict,
    municipalityId: formData.permanentMunicipality,
    latitude: formData.latitude ?? "",
    longitude: formData.longitude ?? "",
    isActive: formData.isActive ?? false,
  };
};
