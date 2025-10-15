"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import FormSelect from "@/components/formElements/FormSelect";
import FormInput from "@/components/formElements/FormInput";
import FormInputFile from "@/components/formElements/FormInputFile";
import DateConverter from "@/components/uiComponents/date-converter/date-converter"; // BS/AD converter
import { Button } from "@/components/ui/button";

import {
  feCiClaimSchema,
  type FECIClaimDTO,
  emptyFECIClaim,
} from "../schemas/feciclaimSchema";

export default function FECIClaim() {
  const form = useForm<FECIClaimDTO>({
    resolver: zodResolver(feCiClaimSchema),
    defaultValues: emptyFECIClaim,
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

  const onSearch = (data: FECIClaimDTO) => {
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
    console.log({ payees, policy: selectedPolicy });
    alert("Form submitted! Check console for details.");
  };

  return (
    <Form {...form}>
      {/* ===== Policy Search ===== */}
      <form className="bg-white border rounded-lg p-6 space-y-6 mt-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Policy Search</h2>

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

      {/* ===== Render Details Page BELOW Search ===== */}
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
                <strong>Full Name:</strong> Sudarshan Bhattarai
              </p>
              <p>
                <strong>Address:</strong> Itahari-4, Sunsari
              </p>
              <p>
                <strong>Nominee Name:</strong> Maya Bhattarai
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
                <strong>Product:</strong> Child Endowment Plan
              </p>
              <p>
                <strong>Premium:</strong> 15000
              </p>
              <p>
                <strong>Sum Assured:</strong> 500000
              </p>
              <p>
                <strong>Term:</strong> 20 Years
              </p>
              <p>
                <strong>DOC | Maturity Date:</strong> 2010-01-01 | 2030-01-01
              </p>
              <p>
                <strong>Additional Info:</strong> Example
              </p>
            </div>
          </div>

          {/* Registration Details with BS/AD dual date */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Registration Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <FormSelect
                form={form}
                name="claimType"
                label="Claim Type"
                options={claimTypeOptions}
                required
              />
              <FormSelect
                form={form}
                name="incidentOf"
                label="Incident Of"
                options={incidentOptions}
                required
              />
              <DateConverter
                form={form}
                name="dateOfDiagnosis"
                labelNep="Date of Diagnosis (BS)"
                labelEng="Date of Diagnosis (AD)"
              />
              <FormSelect
                form={form}
                name="claimBranch"
                label="Claim Branch"
                options={branchOptions}
                required
              />
              <DateConverter
                form={form}
                name="intimationDate"
                labelNep="Intimation Date (BS)"
                labelEng="Intimation Date (AD)"
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
                  placeholder="Enter Payee Name"
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
                  placeholder="Enter Bank Account No"
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
                  placeholder="Enter Bank Account Name"
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
