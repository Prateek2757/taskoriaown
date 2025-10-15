"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormInputDate from "@/components/formElements/FormInputDate";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import InsuranceCalculationPage from "../../components/CalculatedDetail";
import {
  emptyforwardSurrender,
  type ForwardSurrenderDTO,
  forwardSurrenderForm,
} from "../../SurrenderSchema";
import RowField from "@/app/(admin)/policy-service/surrender/components/RowField";

const PolicySurrenderPage = () => {
  const router = useRouter();
  const [calculatedData, setCalculatedData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const params = useParams();

  const form = useForm<ForwardSurrenderDTO>({
    resolver: zodResolver(forwardSurrenderForm),
    defaultValues: emptyforwardSurrender(),
    mode: "all",
  });
  console.log("Form default values:", calculatedData);
  // Set policy number from URL params
  useEffect(() => {
    const policyNo = params.PolicyNumber;
    if (policyNo) {
      form.setValue("PolicyNumber", policyNo as string);
    }
  }, [params, form]);

  // Update form when calculatedData changes
  useEffect(() => {
    if (calculatedData) {
      form.setValue("Remarks", calculatedData.remarks || "");
      form.setValue(
        "policyNumberEncrypted",
        calculatedData.policyNumberEncrypted || ""
      );
    }
  }, [calculatedData, form]);

  // ✅ Fixed: Single submit handler that determines which action to take
  const onSubmit: SubmitHandler<ForwardSurrenderDTO> = async (
    formData: ForwardSurrenderDTO
  ) => {
    setIsSubmitting(true);

    try {
      // If we have calculated data, forward the surrender; otherwise, calculate first
      if (calculatedData?.policyNumberEncrypted) {
        await handleForwardSurrender(formData);
      } else {
        await handleCalculation(formData);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalculation = async (formData: ForwardSurrenderDTO) => {
    try {
      const submitData: PostCallData = {
        ...formData,
        endpoint: "surrender_calculation",
      };

      const response = await apiPostCall(submitData);
      console.log("Calculation response:", response);

      setCalculatedData(response.data);
      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Calculation completed successfully"
        );
      } else {
        showToast(
          response?.data.code || "ERROR",
          response?.data.message || "Calculation failed",
          "Calculation Failed"
        );
      }
    } catch (error) {
      console.error("Error in calculation:", error);
      throw error;
    }
  };

  // ✅ Handle forward surrender step
  const handleForwardSurrender = async (formData: ForwardSurrenderDTO) => {
    try {
      const submitData: PostCallData & {
        Remarks: string;
        policyNumberEncrypted: string;
      } = {
        Remarks: formData.Remarks ?? "",
        policyNumberEncrypted: formData.policyNumberEncrypted ?? "",
        endpoint: "surrender_forward",
      };

      console.log("Forward surrender payload:", submitData);
      const response = await apiPostCall(submitData);
      console.log("Forward surrender response:", response);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Surrender forwarded successfully"
        );
        // Optionally redirect or reset form here
        router.push("/surrender");
      } else {
        showToast(
          response?.data.code || "ERROR",
          response?.data.message || "Forward failed",
          "Forward Failed"
        );
      }
    } catch (error) {
      console.error("Error in forward surrender:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Policy Search Button */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium">
          Policy Search
        </Button>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proposal Details */}
          <div className="bg-white rounded-lg shadow-sm border relative overflow-hidden">
            {/* Background Pattern */}

            <div className=" bg-blue-50 px-4 py-3">
              <h2 className="text-lg font-semibold text-gray-900">
                PROPOSAL DETAILS
              </h2>
            </div>

            <div className="px-6 py-4 space-y-3 relative z-10">
              <RowField label="Proposal No" value="710001275" />
              <RowField label="Branch" value="710" />
              <RowField label="Full Name" value="Aashish Dhami" />

              <RowField label="DOB" value="1995-05-19" />

              <RowField label="Address" value="-" />
              <RowField label="Phone" value="-" />
              <RowField label="Nominee Name" value="Parvati Kumari Bohara" />
              <RowField label="Proposer Name" value="-" />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm border relative overflow-hidden">
            {/* Background Pattern */}

            <div className=" bg-blue-50 px-4 py-3">
              <h2 className="text-lg font-semibold text-gray-900">
                PRODUCT DETAILS
              </h2>
            </div>

            <div className="px-6 py-4 space-y-3 relative z-10">
              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">Product</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  710001275
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">Sum Assured</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  710
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">Premium</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  Aashish Dhami
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100">
                <span className="text-gray-600 ">Term|Pay Term</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  1995-05-19
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">MOP</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  -
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">DOC| Maturity Date</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  -
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">Instalment</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  Parvati Kumari Bohara
                </span>
              </div>

              <div className="flex justify-between items-center ">
                <span className="text-gray-600 ">Next Due Date</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  -
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Details */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Show calculated data if available */}
            {calculatedData && (
              <InsuranceCalculationPage data={calculatedData} />
            )}

            {/* Show calculation form if no calculated data */}
            {!calculatedData && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border">
                <div className="border-l-4 border-blue-500 bg-blue-50 px-4 py-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    CALCULATION DETAILS
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormInputDate
                        form={form}
                        name="SurrenderDate"
                        label="Surrender Date"
                        type="date"
                        placeholder="Select Date"
                        required={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show remarks field if calculated data exists */}
            {calculatedData && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border">
                <div className="border-l-4 border-blue-500 bg-blue-50 px-4 py-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    FORWARD SURRENDER
                  </h2>
                </div>
                <div className="p-6">
                  <div className="max-w-md">
                    <FormInput
                      form={form}
                      name="Remarks"
                      label="Are you sure you want to forward this surrender?"
                      type="text"
                      placeholder="Enter remarks for forwarding"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSubmitting
                  ? "Processing..."
                  : calculatedData?.policyNumberEncrypted
                  ? "Forward Surrender"
                  : "Calculate"}
              </Button>

              {calculatedData && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCalculatedData(null);
                    form.reset(emptyforwardSurrender());
                    const policyNo = params.PolicyNumber as string;
                    if (policyNo) {
                      form.setValue("PolicyNumber", policyNo);
                    }
                  }}
                  className="px-6 py-2 rounded-lg font-medium"
                >
                  Recalculate
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PolicySurrenderPage;
