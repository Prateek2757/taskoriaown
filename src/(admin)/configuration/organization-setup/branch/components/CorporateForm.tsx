"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";

import CorporateDetails from "../components/CorporateDetails";

import {
  AddEditBranchDTO,
  AddEditBranchSchema,
  emptyBranch,
} from "../schemas/branchSchemas";

import { apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";

const branchType = [
  { text: "Corporate", value: "corporate" },
  { text: "Province", value: "province" },
  { text: "Branch", value: "branch" },
  { text: "Sub-branch", value: "sub-branch" },
  { text: "Unit", value: "unit" },
];

type CorporateFormProps = {
  data?: AddEditBranchDTO;
};

const CorporateForm = ({ data }: CorporateFormProps) => {
  const [kycRequiredFields, setKycRequiredFields] = useState<any>();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const parentIdFromURL = params?.parentID || "";
  const currentType = pathname?.split("/")[2]; // e.g. "branch", "province"

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

  // Stubbed submit function – currently does nothing
  const handleFormSubmit = () => {
    console.log("Submit is disabled for now.");
    showToast("info", "Form submission is disabled", "Corporate Form");
  };

  return (
    <FormProvider {...form}>
      <div className="p-6">
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CorporateDetails
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

export default CorporateForm;
