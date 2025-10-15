"use client";

import {
  useForm,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import type { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import {
  AddMarketingStaffDTO,
  AddMarketingStaffSchema,
  emptyMarketingStaff,
} from "../marketingStaffSchema";
import { useEffect, useState } from "react";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

interface MarketingStaffFormProps {
  data?: AddMarketingStaffDTO;
}

export default function MarketingStaffForm({ data }: MarketingStaffFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(AddMarketingStaffSchema),
    defaultValues: {
      ...emptyMarketingStaff,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (data?.fullName) form.reset(data);
  }, [form, data]);

  const onSubmit: SubmitHandler<AddMarketingStaffDTO> = async (formData) => {
    try {
      setIsSubmitting(true);

      console.log("this is form data", formData);

      const submitData: PostCallData = {
        ...formData,
        endpoint: "marketingstaff_manage",
      };

      const response = await apiPostCall(submitData);
      console.log("this is department data response", response);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response?.data.code,
          response?.data.message,
          "Add Marketing Staff"
        );
        router.push("/configuration/organization-setup/marketing-staff");
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Add Marketing Staff"
        );
      }
    } catch (error) {
      console.error("Error submitting Marketing Staff:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save Marketing Staff details"}`,
        "Add Marketing Staff"
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
            <CardTitle> Marketing Staff Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="employeeId"
                    type="text"
                    placeholder="Enter Employee ID"
                    label="Employee ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <FormSelect
                    name="branchCode"
                    // options={proposalRequiredFields?.branchList}
                    label="Select Branch"
                    caption="Select Branch"
                    form={form}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    label="First Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="middleName"
                    type="text"
                    placeholder="Middle Name"
                    label="Middle Name"
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    label="Last Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="contactNo"
                    type="text"
                    placeholder="Contact Number"
                    label="Contact Number"
                    required
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
              {data ? "Update Marketing Staff" : "Create Marketing Staff"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
