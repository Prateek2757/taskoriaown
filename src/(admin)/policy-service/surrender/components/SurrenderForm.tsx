"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import FormInputDate from "@/components/formElements/FormInputDate";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import UseDropDownList from "@/hooks/use-dropdownList";
import {
  createEmptyDefaults,
  emptySurrender,
  type SurrenderDTO,
  SurrenderSchema,
} from "../SurrenderSchema";
import { useRouter } from "next/navigation";
import RowField from "@/app/(admin)/policy-service/surrender/components/RowField";

export default function SurrenderForm({
  proposalData,
}: {
  proposalData?: any;
}) {
  const [ProposalList, setProposalList] = useState<SelectOption[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [surrenderDetails, setSurrenderDetails] = useState<SurrenderDTO>(
    emptySurrender()
  );
  const { showToast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SurrenderSchema),
    defaultValues: createEmptyDefaults(SurrenderSchema),
    mode: "all",
  });

  useEffect(() => {
    if (proposalData?.policyNumberEncrypted) form.reset(proposalData);
  }, [form, proposalData]);
  const proposalnumber = form.watch("PolicyNumber");
  const getSurrenderDetails = useCallback(
    async (id: string) => {
      try {
        const submitdata = {
          params: { id: id },
          endpoint: "surrender_details_edit",
        };
        const response = await apiPostCall(submitdata as PostCallData);
        const { data } = response;
        console.log("this is the response from first premium", response);

        if (response.data.code === SYSTEM_CONSTANTS.success_code) {
          form.setValue("policyNumberEncrypted", data.policyNumberEncrypted);
          setSurrenderDetails(data);
        } else {
          showToast(
            response?.data.code,
            response?.data.message,
            "Getting data failed"
          );
        }
      } catch (_error) {
        showToast("103", "Something went wrong", "Getting data failed");
      }
    },
    [showToast, form.setValue]
  );

  useEffect(() => {
    if (proposalnumber) {
      getSurrenderDetails(proposalnumber);
    }
  }, [getSurrenderDetails, proposalnumber]);

  const { getDataDropdown } = UseDropDownList();

  const getAllValidationErrors = (errors: any): string[] => {
    const errorMessages: string[] = [];

    const extractErrors = (obj: any, prefix = "") => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (value?.message) {
          const readableField = fieldPath
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .replace(/\./g, " - ");
          errorMessages.push(`${readableField}: ${value.message}`);
        } else if (typeof value === "object" && value !== null) {
          extractErrors(value, fieldPath);
        }
      });
    };

    extractErrors(errors);
    return errorMessages;
  };
  const onInvalid = (errors: any) => {
    console.log("Form validation errors:", errors);
    const errorMessages = getAllValidationErrors(errors);
    setValidationErrors(errorMessages);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onSubmit: SubmitHandler<SurrenderDTO> = async (
    formData: SurrenderDTO
  ) => {
    try {
      const submitData: PostCallData & {
        userName?: string | undefined | null;
      } = {
        ...formData,
        endpoint: "surrender_add",
      };

      console.log("Submit data:", submitData);
      const response = await apiPostCall(submitData);
      console.log("Response from API:", response);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Task Successfully"
        );
        router.push("/surrender");
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Surrender Addition Failed"
        );
      }
    } catch (error) {
      console.log("Error submitting underwritting form:", error);
    } finally {
      console.log("Underwritting Created");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6"
      >
        <div className="min-h-screen  bg-gray-50 p-4">
          {!proposalData?.rowId && (
            <div className="mb-6 px-4 sm:px-6 lg:px-8">
              <div className="space-y-2">
                <FormCombo
                  name="PolicyNumber"
                  options={ProposalList}
                  label="Proposal Number"
                  form={form}
                  required={true}
                  onSearch={async (value) => {
                    await getDataDropdown(
                      value,
                      "policynoautocomplete",
                      setProposalList
                    );
                  }}
                />
              </div>
            </div>
          )}
          {surrenderDetails?.policyNumberEncrypted ||proposalData?.rowId && (
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
                    <RowField
                      label={"Policy No"}
                      value={proposalData?.policyNumber}
                    />
                    <RowField
                      label={"Branch"}
                      value={proposalData?.branchCode}
                    />

                    <RowField
                      label={"Full Name"}
                      value={proposalData?.fullName}
                    />

                    <RowField label={"DOB"} value={proposalData?.dateOfBirth} />

                    <RowField label={"Address"} value={proposalData?.address} />

                    <RowField
                      label={"Phone"}
                      value={proposalData?.mobileNumber}
                    />
                    <RowField
                      label={"Nominee Name"}
                      value={proposalData?.nomineeName}
                    />
                    <RowField
                      label={"Proposer Name"}
                      value={proposalData?.proposerName}
                    />
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
                    <RowField
                      label={"Product"}
                      value={proposalData?.productCode}
                    />
                    <RowField
                      label={"Sum Assured"}
                      value={proposalData?.sumAssured}
                    />
                    <RowField label={"Premium"} value={proposalData?.premium} />
                    <RowField
                      label={"Term|Pay Term"}
                      value={proposalData?.term}
                    />
                    <RowField
                      label={"MOP"}
                      value={proposalData?.modeOfPayment}
                    />
                    <RowField
                      label={"DOC| Maturity Date"}
                      value={proposalData?.maturityDate}
                    />
                    <RowField
                      label={"Instalment"}
                      value={proposalData?.instalment}
                    />

                    <RowField
                      label={"Next Due Date"}
                      value={proposalData?.nextDueDate}
                    />
                  </div>
                </div>
              </div>

              {/* Calculation Details */}
              <div className="mt-6 bg-white rounded-lg shadow-sm border">
                <div className=" bg-blue-50 px-4 py-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    CALCULATION DETAILS
                  </h2>
                </div>
                <div className="p-6  w-full">
                  <div className="grid grid-cols-1  md:grid-cols-4 gap-4 mb-6">
                    <div className="max-w-md">
                      <FormInputDate
                        form={form}
                        name="surrenderDate"
                        label="Surrender Date"
                        type="date"
                        placeholder={"Select Date"}
                      />
                    </div>
                    <div className="max-w-md">
                      <FormInput
                        form={form}
                        name="remarks"
                        label="Remarks"
                        type="text"
                        placeholder={"Enter Remarks"}
                      />
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button type="submit">
                      {form.formState.isSubmitting ? "Submitting..." : proposalData?.policyNumberEncrypted ? "Update" : "Submit"}
                    </Button>
                  </div>
                  <div>
                    {validationErrors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <title>Title</title>
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              Please fix the following errors:
                            </h3>
                            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                              {validationErrors.map((error, index) => (
                                <li key={`${index * 1}-errors`}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
