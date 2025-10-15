"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/formElements/FormSelect";
import FormInputFile from "@/components/formElements/FormInputFile";
import FormInput from "@/components/formElements/FormInput"; // 👈 add this for text input
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FileDown } from "lucide-react";
import { ClaimSchema, ClaimDTO } from "../schemas/claimSchema";

export default function ClaimForm() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const form = useForm<ClaimDTO>({
    resolver: zodResolver(ClaimSchema),
    defaultValues: {
      policyNo: "",
      claimType: "maturity",
      isSignatureVerified: false,
      anticipatedInstallment: "", // 👈 add default
    },
  });

  const { handleSubmit, setValue, watch } = form;
  const selectedClaimType = watch("claimType"); // 👈 watch claim type

  const claimTypes = [
    { value: "maturity", text: "Maturity" },
    { value: "anticipation", text: "Anticipation" }, // 👈 new option
  ];

  const onSubmit = (data: ClaimDTO) => {
    console.log("Form Submitted:", data);
  };

  const onInvalid = (errors: any) => {
    const errorMessages: string[] = [];
    Object.entries(errors).forEach(([key, value]) => {
      if (value?.message) errorMessages.push(`${key}: ${value.message}`);
    });
    setValidationErrors(errorMessages);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 
                  1.414L8.586 10l-1.293 1.293a1 1 0 
                  101.414 1.414L10 11.414l1.293 1.293a1 
                  1 0 001.414-1.414L11.414 10l1.293-1.293a1 
                  1 0 00-1.414-1.414L10 8.586 
                  8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((err, idx) => (
                  <li key={`err-${idx}`}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <div className="bg-white border rounded-lg p-6 space-y-6 mt-4">
            {/* Claim Details */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Claim Details
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setValue("claimType", "maturity");
                    window.open("/files/maturity-application.pdf", "_blank");
                  }}
                >
                  <FileDown />
                  Maturity Application
                </Button>
              </div>

              <div className="mb-6 border border-dashed border-blue-200 p-4 rounded-md">
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <FormSelect
                      form={form}
                      name="policyNo"
                      type="text"
                      caption="Enter Policy No"
                      label="Policy No"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <FormSelect
                      form={form}
                      name="claimType"
                      label="Claim Type"
                      options={claimTypes}
                      caption="Please Select Claim Type"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <FormInputFile
                      form={form}
                      name="documents"
                      label="All Documents"
                      required
                    />
                  </div>
                </div>

                {/* 👇 Conditionally render new field */}
                {selectedClaimType === "anticipation" && (
                  <div className="mt-4">
                    <FormInput
                      form={form}
                      name="anticipatedInstallment"
                      type="text"
                      label="Anticipated Installment"
                      placeholder="Please Enter Anticipated Installment"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Update Claim Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Update Claim Details
              </h2>
              <div className="mb-6 border border-dashed border-blue-200 p-4 rounded-md">
                <FormSwitch
                  form={form}
                  name="isSignatureVerified"
                  label="Is Signature Verified?"
                />
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
