"use client";

import FormInput from "@/components/formElements/FormInput";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormSelect from "@/components/formElements/FormSelect";
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
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddDistrictDTO,
  AddDistrictSchema,
  emptyDistrictSchema,
} from "../DistrictSchema";

type DistrictFormProps = {
  data?: AddDistrictDTO;
};

export default function DistrictForm({ data }: DistrictFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(AddDistrictSchema),
    defaultValues: {
      ...emptyDistrictSchema,
    },
    mode: "onChange",
  });

  const fetchDistrictRequiredFields = async () => {
    const data: PostCallData = { endpoint: "district_required_fields" };
    const response = await apiPostCall(data);
    if (response?.status === API_CONSTANTS.success) {
      console.log("this is district required fields", response);
      return response.data;
    }
    throw new Error("Failed to fetch district required fields");
  };
  const { data: districtRequiredFields } = useQuery({
    queryKey: ["districtRequiredList"],
    queryFn: fetchDistrictRequiredFields,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (data?.districtName) form.reset(data);
  }, [form, data]);

  const onSubmit: SubmitHandler<AddDistrictDTO> = async (formData) => {
    try {
      setIsSubmitting(true);

      console.log("this is form data", formData);

      const submitData: PostCallData = {
        ...formData,
        endpoint: "district_manage",
      };

      const response = await apiPostCall(submitData);
      console.log("this is District data response", response);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(response?.data.code, response?.data.message, "Add District");
        router.push("/configuration/address-setup/district");
      } else {
        showToast(response?.data.code, response?.data.message, "Add district");
      }
    } catch (error) {
      console.error("Error submitting district:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save district details"}`,
        "Add district"
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
            <CardTitle>District Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <FormSelect
                    name="province"
                    label="Province"
                    form={form}
                    options={districtRequiredFields}
                    caption="Select Province"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="districtName"
                    type="text"
                    placeholder="Enter District Name"
                    label="District Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <FormInputNepali
                    form={form}
                    name="districtNameLocal"
                    type="text"
                    label="District Name (In Local)"
                    placeholder="Enter District Name (in Nepali)"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <FormSwitch form={form} name="isActive" label="IsActive" />
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
              {data ? "Update Province" : "Create Province"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
