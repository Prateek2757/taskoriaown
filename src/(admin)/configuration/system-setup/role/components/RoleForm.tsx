"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import RoleDetails from "./roleTab/RoleDetails";
import RoleList from "./roleTab/RoleList";
import { apiPostCall } from "@/helper/apiService";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import {
  AddEditRoleDTO,
  AddEditRoleSchema,
  emptyRole,
} from "../schemas/RoleSchemas";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { Button } from "@/components/ui/button";

type AddRoleDTO = {
  id?: string;
  roleName: string;
  [key: string]: any;
};

type RoleFormProps = {
  data?: AddEditRoleDTO;
};

function RoleForm({ data }: RoleFormProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!data?.roleId;

  // Debug logging
  console.log("data:", data);
  console.log("isEditMode:", isEditMode);

  const methods = useForm<AddRoleDTO>({
    defaultValues: {
      id: "",
      roleName: "",
    },
  });

  useEffect(() => {
    if (data?.roleId) {
      console.log("Setting form data:", data);
      console.log("data.id:", data.roleId);

      methods.reset(data);
      const defaultValues: AddRoleDTO = {
        id: data.roleId || "",
        roleName: data.roleName || "",
      };

      // Handle selectedRoles - convert to checkbox format
      if (data.selectedRoles && Array.isArray(data.selectedRoles)) {
        data.selectedRoles.forEach((slug: string) => {
          defaultValues[slug] = true;
        });
      }

      console.log("Form default values:", defaultValues);
      methods.reset(defaultValues);
    }
  }, [data, methods]);

  const onSubmit: SubmitHandler<AddRoleDTO> = async (formData) => {
    try {
      const { roleName, ...permissions } = formData;

      const selectedRoles: string[] = [];
      for (const [slug, value] of Object.entries(permissions)) {
        if (value === true) {
          selectedRoles.push(slug);
        }
      }

      const submitData = {
        RoleName: roleName,
        SelectedRoles: selectedRoles,
      };

      setIsSubmitting(true);

      console.log("Submitting to role_add:", submitData);

      const response = await apiPostCall({
        ...submitData,
        endpoint: "role_add",
      });

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(response.data.code, response.data.message, "Add Role");
        router.push("/configuration/system-setup/role");
      } else {
        showToast(response?.data.code, response?.data.message, "Add Role");
      }
    } catch (error) {
      console.error("Error submitting Role form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save role details"}`,
        "Add Role"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdate: SubmitHandler<AddRoleDTO> = async (formData) => {
    try {
      const { roleName, id, ...permissions } = formData;

      const selectedRoles: string[] = [];
      for (const [slug, value] of Object.entries(permissions)) {
        if (value === true) {
          selectedRoles.push(slug);
        }
      }

      const submitData = {
        RoleId: id,
        RoleName: roleName,
        SelectedRoles: selectedRoles,
      };

      console.log("Update submit data:", submitData);

      setIsSubmitting(true);

      console.log("Updating via role_edit:", submitData);

      const response = await apiPostCall({
        ...submitData,
        endpoint: "role_edit",
      });

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(response.data.code, response.data.message, "Update Role");
        router.push("/configuration/system-setup/role");
      } else {
        showToast(
          response?.data.code || SYSTEM_CONSTANTS.error_code,
          response?.data.message || "Update failed",
          "Update Role"
        );
      }
    } catch (error) {
      console.error("Error updating role:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to update role details"}`,
        "Update Role"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(isEditMode ? onUpdate : onSubmit)}
        className="mt-3"
      >
        <RoleDetails />
        <RoleList selectedRoles={data?.selectedRoles || []} />

        <div>
          <Button
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
              ? "Update Role"
              : "Submit Role"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default RoleForm;
