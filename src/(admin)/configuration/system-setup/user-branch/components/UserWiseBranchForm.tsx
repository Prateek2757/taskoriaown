"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import UserDetails from "./UserDetails";
import UserWiseBranchList from "./UserWiseBranchList";

import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { apiPostCall } from "@/helper/apiService";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";

type BranchFormData = {
  id?: string;
  userName: string;
  [key: string]: string | boolean | undefined;
};

type UserWiseBranchFormProps = {
  data?: BranchFormData;
};

function UserWiseBranchForm({ data }: UserWiseBranchFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!data?.id;

  const methods = useForm<BranchFormData>({
    defaultValues: {
      id: "",
      userName: "",
    },
  });

  useEffect(() => {
    if (isEditMode && data) {
      const defaultValues: BranchFormData = {
        id: data.id,
        userName: data.userName,
      };

      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          defaultValues[key] = value;
        }
      });

      methods.reset(defaultValues);
    }
  }, [data, isEditMode, methods]);

  const onSubmit: SubmitHandler<BranchFormData> = async (formData) => {
    try {
      const { userName, id, ...rest } = formData;

      const selectedBranches: string[] = [];

      for (const [slug, value] of Object.entries(rest)) {
        if (value === true) {
          selectedBranches.push(slug);
        }
      }

      const payload = {
        UserId: id,
        UserName: userName,
        SelectedBranches: selectedBranches,
      };

      setIsSubmitting(true);

      const response = await apiPostCall({
        ...payload,
        endpoint: isEditMode ? "user_branch_edit" : "user_branch_add",
      });

      const success = response?.data?.code === SYSTEM_CONSTANTS.success_code;

      showToast(
        response?.data?.code || SYSTEM_CONSTANTS.error_code,
        response?.data?.message ||
          (success ? "Success" : "Failed to submit form"),
        isEditMode ? "Update User Branch" : "Add User Branch"
      );

      if (success) {
        router.push("/configuration/system-setup/user-branch");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        "Unexpected error occurred.",
        isEditMode ? "Update User Branch" : "Add User Branch"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 ">
        <UserDetails />

        <UserWiseBranchList />

        <div>
          <button
            type="submit"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700
                                text-white text-sm py-2 px-6 rounded-md flex
                                items-center"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Submitting..."
              : isEditMode
              ? "Update"
              : "Add"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default UserWiseBranchForm;
