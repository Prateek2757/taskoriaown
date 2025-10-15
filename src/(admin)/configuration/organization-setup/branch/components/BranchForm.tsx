"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";

import BranchDetails from "./BranchDetails";

import {
  AddEditBranchDTO,
  AddEditBranchSchema,
  emptyBranch,
  transformBranchData,
} from "../schemas/branchSchemas";

import { apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";

const branchType = [
  { text: "Corporate", value: "corporate" },
  { text: "Province", value: "province" },
  { text: "Branch", value: "branch" },
  { text: "Sub-branch", value: "sub-branch" },
  { text: "Unit", value: "unit" },
];

type BranchFormProps = {
  data?: AddEditBranchDTO;
};

const BranchForm = ({ data }: BranchFormProps) => {
  const [kycRequiredFields, setKycRequiredFields] = useState<any>();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();

  const parentIdFromURL = params?.parentID || "";

  console.log("URL params:", params);
  console.log("ParentID from URL:", parentIdFromURL);

  const form = useForm<AddEditBranchDTO>({
    resolver: zodResolver(AddEditBranchSchema),
    mode: "onChange",
    defaultValues: {
      ...emptyBranch,
      ...(data || {}),
      parentId: data?.parentId || parentIdFromURL,
    },
  });

  useEffect(() => {
    if (data?.rowId) {
      form.reset(data);
    }
  }, [data, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiPostCall({
          endpoint: "kyc_required_fields",
        });

        if (response?.data && response.status === API_CONSTANTS.success) {
          setKycRequiredFields(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching KYC detail data:", error);
      }
    };

    fetchData();
  }, []);

  const pathname = usePathname(); 
const currentType = pathname?.split("/")[2]; 

const getRedirectPath = (parentId?: string) => {
  if (!currentType) return "/corporate-branch";
  return parentId
    ? `/corporate-branch/${currentType}/${parentId}`
    : `/corporate-branch/${currentType}`;
};

const onSubmit = async (formData: AddEditBranchDTO) => {
  try {
    const transformedData = transformBranchData(formData, false);
    console.log("Send for Add Branch",transformedData);
    const response = await apiPostCall(transformedData);

    if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
      showToast(response.data.code, response.data.message, "Add Branch");
      router.push(getRedirectPath(formData.parentId));
    } else {
      showToast(response?.data?.code, response?.data?.message, "Add Branch");
    }
  } catch (error) {
    showToast(
      SYSTEM_CONSTANTS.error_code,
      `Error: ${error || "Failed to save branch details"}`,
      "Add Branch"
    );
  }
};

const onUpdate = async (formData: AddEditBranchDTO) => {
  try {
    const transformedData = transformBranchData(formData, true);
    const response = await apiPostCall(transformedData);

    if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
      showToast(response.data.code, response.data.message, "Update Branch");
      router.push(getRedirectPath(formData.parentId));
    } else {
      showToast(
        response?.data?.code,
        response?.data?.message,
        "Update Branch"
      );
    }
  } catch (error) {
    showToast(
      SYSTEM_CONSTANTS.error_code,
      `Error: ${error || "Failed to update branch details"}`,
      "Update Branch"
    );
  }
};

  return (
    <FormProvider {...form}>
      <div className="p-6">
        <form onSubmit={form.handleSubmit(data?.rowId ? onUpdate : onSubmit)}>
          <BranchDetails
            form={form}
            isLoggedIn={true}
            kycRequiredFields={kycRequiredFields}
            branchTypeList={branchType}
            isEditing={!!data?.rowId}
            parentId={form.watch("parentId")}
          />

          <div className="mt-6 flex">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {data?.rowId ? "Update Branch" : "Create Branch"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default BranchForm;
