"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import UseDropDownList from "@/hooks/use-dropdownList";

import { useRouter } from "next/navigation";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import {
  EmptyEditPostedVoucherSchema,
  EditPostedVoucherDTO,
  EditPostedVoucherSchema,
} from "../../Schema/EditPostedVoucher";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";
import { FormSwitch } from "@/components/formElements/FormSwitch";

export default function InsurancePremiumUI() {
  const [agentList, setAgentList] = useState<SelectOption[]>([]);
  const { showToast } = useToast();
  const route = useRouter();

  const form = useForm({
    resolver: zodResolver(EditPostedVoucherSchema),
    defaultValues: EmptyEditPostedVoucherSchema(),
    mode: "all",
  });

  const onSubmit: SubmitHandler<EditPostedVoucherDTO> = async (
    formData: EditPostedVoucherDTO
  ) => {
    console.log("formData is being summitted underwritting", formData);

    try {
      console.log("this is Target form data", formData);

      const submitData: PostCallData & {
        userName?: string | undefined | null;
      } = {
        ...formData,
        endpoint: "add_payfirstPremium",
      };
      console.log("this is target form data payload", submitData);

      const response = await apiPostCall(submitData);

      console.log("this is target form data response", response.data);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Target Added Successfully"
        );
        route.push(`/first-premium/fpreceipt/${response.data.data}`);
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Target Addition Failed"
        );
      }
    } catch (error) {
      console.log("Error submitting underwritting form:", error);
    } finally {
      console.log("Underwritting Created");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="container mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Edit Posted Voucher
              </h3>
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FormInput
                  name="VoucherNo"
                  label="Posted Voucher No"
                  form={form}
                  required={true}
                  type={"text"}
                />
                </div>
                <FormSwitch
                  name=""
                  label="Voucher Number"
                  form={form}
                />
              </div>

              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-sm transition-colors"
              >
                {form.formState.isSubmitting ? "Processing..." : "Search "}
              </Button>
              <DataTable
                searchOptions={[]}
                columns={createKycColumns}
                endpoint="kyc_list"
              />
              {/* <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-sm transition-colors"
              >
                {form.formState.isSubmitting ? "Processing..." : "Reverse Voucher "}
              </Button> */}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
