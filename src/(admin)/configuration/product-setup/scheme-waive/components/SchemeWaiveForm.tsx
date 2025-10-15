"use client";
import FormInput from "@/components/formElements/FormInput";
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
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  type SchemeWaiveDTO,
  emptySchemeWaive,
  SchemeWaiveSchema,
} from "../SchemeWaiveSchema";

type SchemeWaiveProps = {
  data?: SchemeWaiveDTO;
};

const fetchSchemeWaiveRequiredFields = async () => {
  const data: PostCallData = { endpoint: "schemewaive_required_fields" };
  const response = await apiPostCall(data);
  console.log("Scheme Waive Required Fields Response:", response);
  if (response?.status === API_CONSTANTS.success) {
    return response.data;
  }
  throw new Error("Failed to fetch Scheme Waive required fields");
};

export const SchemeWaiveForm = ({ data }: SchemeWaiveProps) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<SchemeWaiveDTO>({
    defaultValues: data ?? emptySchemeWaive,
    resolver: zodResolver(SchemeWaiveSchema),
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);
  const { data: schemeWaiveRequiredFields } = useQuery({
    queryKey: ["schemeWaiveRequiredFields"],
    queryFn: fetchSchemeWaiveRequiredFields,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const onSubmit: SubmitHandler<SchemeWaiveDTO> = async (formData) => {
    try {
      setIsSubmitting(true);
      const submitData: PostCallData = {
        ...formData,
        endpoint: "schemewaive_manage",
      };
      const response = await apiPostCall(submitData);

      if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Add Scheme Waive"
        );
        router.push("/configuration/product-setup/scheme-waive");
      } else {
        showToast(
          response.data.code,
          response.data.message,
          "Add Scheme Waive"
        );
      }
    } catch (error) {
      console.error("Error submitting Scheme Waive form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save Scheme Waive details"}`,
        "Add Scheme Waive"
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
            <CardTitle>Rider Type Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="schemeName"
                    type="text"
                    placeholder="Enter Scheme Name"
                    label="Scheme Name"
                    required={true}
                  />
                </div>

                <div className="space-y-2">
                  <FormSelect
                    options={schemeWaiveRequiredFields?.schemeType}
                    form={form}
                    name="schemeType"
                    label="Scheme Type"
                    caption="Select Scheme Type"
                    required={true}
                  />
                </div>

                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="schemePercent"
                    type="text"
                    placeholder="Enter Scheme Percent"
                    label="Scheme Percent"
                    required={true}
                  />
                </div>

                <DateConverter
                  form={form}
                  name="startDate"
                  labelNep="Scheme Waive Start Date in BS"
                  labelEng="Scheme Waive Start Date in AD"
                />
                <DateConverter
                  form={form}
                  name="endDate"
                  labelNep="Scheme Waive End Date in BS"
                  labelEng="Scheme Waive End Date in AD"
                />

                <div className="space-y-2">
                  <FormSelect
                    options={schemeWaiveRequiredFields?.product}
                    form={form}
                    name="productCode"
                    label="Product Code"
                    caption="Select Product Code"
                    required={true}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <FormSwitch form={form} label="Is Active?" name="isActive" />
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
              {data ? "Update Rider Type" : "Create Rider Type"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
