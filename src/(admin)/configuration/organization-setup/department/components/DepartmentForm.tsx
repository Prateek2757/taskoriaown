"use client";

import FormInput from "@/components/formElements/FormInput";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddDepartmentDTO,
  AddDepartmentSchema,
  emptyDepartment,
} from "../departmentSchema";

export type DepartmentFormProps = {
  data?: AddDepartmentDTO;
};

export default function DepartmentForm({ data }: DepartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(AddDepartmentSchema),
    defaultValues: {
      ...emptyDepartment,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (data?.departmentName) form.reset(data);
  }, [form, data]);

  const onSubmit: SubmitHandler<AddDepartmentDTO> = async (formData) => {
    try {
      setIsSubmitting(true);

      console.log("this is form data", formData);

      const submitData: PostCallData = {
        ...formData,
        endpoint: "department_manage",
      };

      const response = await apiPostCall(submitData);
      console.log("this is department data response", response);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response?.data.code,
          response?.data.message,
          "Add department"
        );
        router.push("/configuration/organization-setup/department");
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Add department"
        );
      }
    } catch (error) {
      console.error("Error submitting department:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save department details"}`,
        "Add department"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Department Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="departmentName"
                    type="text"
                    placeholder="Department Name"
                    label="Department Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <FormInputNepali
                    form={form}
                    name="departmentNameLocal"
                    type="text"
                    placeholder="Department Name (In local)"
                    label="Department Name (In local)"
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="shortName"
                    type="text"
                    placeholder="Short Name"
                    label="Short Name"
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="email"
                    type="email"
                    placeholder="Email"
                    label="Email"
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="departmentHead"
                    type="text"
                    placeholder="Department Head"
                    label="Department Head"
                  />
                </div>
                <div className="space-y-2">
                  <FormSwitch form={form} name="isActive" label="Is Active" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
            >
              {isSubmitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
              {data ? "Update Department" : "Create Department"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
