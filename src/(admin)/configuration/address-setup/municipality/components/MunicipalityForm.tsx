"use client";

import FormInput from "@/components/formElements/FormInput";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddEditMunicipalityDTO,
  AddMunicipalityDTO,
  AddMunicipalitySchema,
  emptyMunicipality,
} from "../MunicipalitySchema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";

type MunicipalityFormProps = {
  data?: AddEditMunicipalityDTO;
};

const fetchMunicipalityRequiredFields = async () => {
  const data: PostCallData = { endpoint: "municipality_required_fields" };
  const response = await apiPostCall(data);
  if (response?.status === API_CONSTANTS.success) {
    return response.data;
  }
  throw new Error("Failed to fetch Municipality required fields");
};

export default function MunicipalityForm({ data }: MunicipalityFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<AddEditMunicipalityDTO>({
    defaultValues: emptyMunicipality,
    resolver: zodResolver(AddMunicipalitySchema),
  });

  useEffect(() => {
    if (data?.municipalityName) {
      form.reset(data);
    }
  }, [data, form]);

  const { data: municipalityRequiredFields } = useQuery({
    queryKey: ["municipalityRequiredFields"],
    queryFn: fetchMunicipalityRequiredFields,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const onSubmit: SubmitHandler<AddMunicipalityDTO> = async (formData) => {
    try {
      setIsSubmitting(true);
      const submitData: PostCallData = {
        ...formData,
        endpoint: "municipality_add",
      };
      const response = await apiPostCall(submitData);

      if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Add Municipality"
        );
        router.push("/configuration/address-setup/municipality");
      } else {
        showToast(
          response.data.code,
          response.data.message,
          "Add Municipality"
        );
      }
    } catch (error) {
      console.error("Error submitting Municipality form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save Municipality details"}`,
        "Add Municipality"
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
            <CardTitle>Municipality Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <FormSelect
                    name="province"
                    label="Province"
                    form={form}
                    options={municipalityRequiredFields?.provinceList}
                    caption="Select Province"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <FormSelect
                    name="district"
                    label="District"
                    form={form}
                    options={municipalityRequiredFields?.districtList}
                    caption="Select District"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <FormInput
                    name="municipalityName"
                    type="text"
                    label="Municipality Name"
                    placeholder="Enter Municipality Name"
                    form={form}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <FormInputNepali
                    form={form}
                    name="municipalityNameLocal"
                    type="text"
                    label="Municipality Name (In Local)"
                    placeholder="Enter Municipality Name (in Nepali)"
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
