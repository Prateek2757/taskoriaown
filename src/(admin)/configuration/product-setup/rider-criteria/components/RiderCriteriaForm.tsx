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
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  type RiderCriteriaDTO,
  emptyRiderCriteria,
  RiderCriteriaSchema,
} from "../RiderCriteriaSchema";

type RiderCriteriaFormProps = {
  data?: RiderCriteriaDTO;
};

const fetchRiderCriteriaRequiredFields = async () => {
  const data: PostCallData = { endpoint: "ridercriteria_required_fields" };
  const response = await apiPostCall(data);
  console.log("Rider Criteria Required Fields Response:", response);
  if (response?.status === API_CONSTANTS.success) {
    return response.data;
  }
  throw new Error("Failed to fetch Rider Criteria required fields");
};
export const RiderCriteriaForm = ({ data }: RiderCriteriaFormProps) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<RiderCriteriaDTO>({
    defaultValues: emptyRiderCriteria,
    resolver: zodResolver(RiderCriteriaSchema),
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const { data: riderCriteriaRequiredFields } = useQuery({
    queryKey: ["riderCriteriaRequiredFields"],
    queryFn: fetchRiderCriteriaRequiredFields,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
  const onSubmit: SubmitHandler<RiderCriteriaDTO> = async (formData) => {
    try {
      setIsSubmitting(true);
      const submitData: PostCallData = {
        ...formData,
        endpoint: "ridercriteria_manage",
      };
      const response = await apiPostCall(submitData);

      if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Add Rider Criteria"
        );
        router.push("/configuration/product-setup/rider-criteria");
      } else {
        showToast(
          response.data.code,
          response.data.message,
          "Add Rider Criteria"
        );
      }
    } catch (error) {
      console.error("Error submitting Rider Criteria form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save Rider Criteria details"}`,
        "Add Rider Criteria"
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
            <CardTitle>Rider Criteria Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <FormSelect
                    options={riderCriteriaRequiredFields?.productCode}
                    form={form}
                    name="productCode"
                    label="Product ID"
                    caption="Select Product"
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormSelect
                    options={riderCriteriaRequiredFields?.rider}
                    form={form}
                    name="rider"
                    label="Rider ID"
                    caption="Select Rider"
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="minimumSumAssured"
                    type="text"
                    placeholder="Enter Min Sum Assured"
                    label="Min Sum Assured"
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="maximumSumAssured"
                    type="text"
                    placeholder="Enter Max Sum Assured"
                    label="Max Sum Assured"
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="riderMinimumTerm"
                    type="text"
                    placeholder="Enter Rider Min Term"
                    label="Rider Min Term"
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="riderMaximumTerm"
                    type="text"
                    placeholder="Enter Rider Max Term"
                    label="Rider Max Term"
                    required={true}
                  />
                </div>

                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="riderMinimumPayTerm"
                    type="text"
                    placeholder="Enter Rider Min. Paying Term"
                    label="Rider Min. Paying Term"
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="riderMaximumPayTerm"
                    type="text"
                    placeholder="Enter Rider Max. Paying Term"
                    label="Rider Max. Paying Term"
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="minimumAge"
                    type="text"
                    placeholder="Enter Min Age"
                    label="Min Age"
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="maximumAge"
                    type="number"
                    placeholder="Enter Max Age"
                    label="Max Age"
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormSelect
                    options={riderCriteriaRequiredFields?.riderFor}
                    form={form}
                    name="riderFor"
                    label="Rider For"
                    caption="Select Rider For"
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
              {data ? "Update Rider Criteria" : "Create Rider Criteria"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
