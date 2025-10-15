"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import FormSelect from "@/components/formElements/FormSelect";
import FormInput from "@/components/formElements/FormInput";
import FormInputFile from "@/components/formElements/FormInputFile";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { Button } from "@/components/ui/button";

import {
  feMedicalSearchSchema,
  type FeMedicalSearchDTO,
  emptyFeMedicalSearch,
} from "../schemas/femedicalSchema";

export default function FeMedicalSearch() {
  const form = useForm<FeMedicalSearchDTO>({
    resolver: zodResolver(feMedicalSearchSchema),
    defaultValues: emptyFeMedicalSearch,
  });

  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const [payees, setPayees] = useState([
    { payeeName: "", payeeBank: "", payeeAccount: "", payeeAccountName: "" },
  ]);

  const policyOptions = [
    { value: "POL001", text: "POL001" },
    { value: "POL002", text: "POL002" },
    { value: "PASS123", text: "PASS123" },
    { value: "PASS456", text: "PASS456" },
  ];

  const bankOptions = [
    { value: "nabil", text: "Nabil Bank" },
    { value: "himalayan", text: "Himalayan Bank" },
    { value: "standard", text: "Standard Chartered" },
  ];

  const claimTypeOptions = [
    { value: "death", text: "Death" },
    { value: "disability", text: "Disability" },
    { value: "ci", text: "Critical Illness" },
  ];

  const incidentOptions = [
    { value: "accident", text: "Accident" },
    { value: "illness", text: "Illness" },
  ];

  const branchOptions = [
    { value: "itahari", text: "Itahari Branch" },
    { value: "kathmandu", text: "Kathmandu Branch" },
    { value: "pokhara", text: "Pokhara Branch" },
  ];

  const onSearch = (data: FeMedicalSearchDTO) => {
    setSelectedPolicy(data.policyOrPassport);
  };

  const handlePayeeChange = (
    index: number,
    field: keyof (typeof payees)[0],
    value: string
  ) => {
    const updated = [...payees];
    updated[index][field] = value;
    setPayees(updated);
  };

  const onSubmitForm = () => {
    console.log("Submitting form data...");
    console.log({ policy: selectedPolicy, payees });
    alert("Form submitted! Check console for details.");
  };

  return (
    <Form {...form}>
      {/* ===== Policy Search ===== */}
      {!selectedPolicy && (
        <form className="bg-white border rounded-lg p-6 space-y-6 mt-4 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Policy Search
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              form={form}
              name="policyOrPassport"
              label="Policy No | Passport No"
              caption="Select Policy No or Passport No"
              options={policyOptions}
              required
            />
          </div>

          <div className="flex justify-start mt-4">
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
              onClick={form.handleSubmit(onSearch)}
            >
              Search
            </Button>
          </div>
        </form>
      )}

      {/* ===== Render Details Page ===== */}
      {selectedPolicy && (
        <div className="bg-white border rounded-lg p-6 space-y-6 mt-6 text-gray-800 font-sans">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Claim Details: {selectedPolicy}
          </h2>

          {/* Insured Details */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Insured Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <p>
                <strong>Policy No:</strong> {selectedPolicy}
              </p>
              <p>
                <strong>Passport No:</strong> PASS123
              </p>
              <p>
                <strong>Branch:</strong> Itahari Branch
              </p>
              <p>
                <strong>Full Name:</strong> NAN
              </p>
              <p>
                <strong>DOB:</strong> NAN
              </p>
              <p>
                <strong>Address:</strong> NAN
              </p>
              <p>
                <strong>Nominee Name:</strong> NAN
              </p>
            </div>
          </div>

          {/* Policy Details */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Policy Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <p>
                <strong>Product:</strong> NAN
              </p>
              <p>
                <strong>Sum Assured:</strong> NAN
              </p>
              <p>
                <strong>Premium:</strong> NAN
              </p>
              <p>
                <strong>Term:</strong> NAN
              </p>
              <p>
                <strong>DOC:</strong> NAN
              </p>
              <p>
                <strong>Maturity Date:</strong> NAN
              </p>
            </div>
          </div>

          {/* Registration Details */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Registration Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <FormSelect
                form={form}
                name="claimBranch"
                label="Claim Branch"
                options={branchOptions}
                required
              />
              <DateConverter
                form={form}
                name="dateOfIncident"
                labelNep="Date of Incident (BS)"
                labelEng="Date of Incident (AD)"
              />
              <DateConverter
                form={form}
                name="intimationDate"
                labelNep="Intimation Date (BS)"
                labelEng="Intimation Date (AD)"
              />
            </div>
          </div>

          {/* Claimant Details */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Claimant Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <FormInput
                form={form}
                name="claimantName"
                label="Claimant Name"
                placeholder="NAN"
              />
              <FormInput
                form={form}
                name="claimantRelation"
                label="Claimant Relation"
                placeholder="NAN"
              />
              <FormInput
                form={form}
                name="claimantContact"
                label="Claimant Contact"
                placeholder="NAN"
              />
              <FormInput
                form={form}
                name="claimantAddress"
                label="Claimant Address"
                placeholder="NAN"
              />
              <FormInput
                form={form}
                name="claimReceivedVia"
                label="Claim Received Via"
                placeholder="NAN"
              />
            </div>
          </div>

          {/* Payee Details */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Payee Details
            </h3>
            {payees.map((payee, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4"
              >
                <FormInput
                  form={form}
                  name={`payeeName-${idx}`}
                  label="Payee Name"
                  placeholder="NAN"
                  value={payee.payeeName}
                  onChange={(e: any) =>
                    handlePayeeChange(idx, "payeeName", e.target.value)
                  }
                  required
                />
                <FormSelect
                  form={form}
                  name={`payeeBank-${idx}`}
                  label="Bank Name"
                  options={bankOptions}
                  value={payee.payeeBank}
                  onValueChange={(val: string) =>
                    handlePayeeChange(idx, "payeeBank", val)
                  }
                  required
                />
                <FormInput
                  form={form}
                  name={`payeeAccount-${idx}`}
                  label="Bank Account No"
                  placeholder="NAN"
                  value={payee.payeeAccount}
                  onChange={(e: any) =>
                    handlePayeeChange(idx, "payeeAccount", e.target.value)
                  }
                  required
                />
                <FormInput
                  form={form}
                  name={`payeeAccountName-${idx}`}
                  label="Bank Account Name"
                  placeholder="NAN"
                  value={payee.payeeAccountName}
                  onChange={(e: any) =>
                    handlePayeeChange(idx, "payeeAccountName", e.target.value)
                  }
                  required
                />
              </div>
            ))}
          </div>

          {/* Document Upload */}
          <div className="border border-dashed border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Document Upload
            </h3>
            <FormInputFile
              form={form}
              name="photoFile"
              label="Photo"
              fileNameField="photoFileName"
              accept=".png,.jpg,.jpeg,.pdf"
              maxSize={5}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-start mt-4">
            <Button
              type="button"
              onClick={onSubmitForm}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
}
