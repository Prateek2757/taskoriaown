"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import FormSelect from "@/components/formElements/FormSelect";
import FormInput from "@/components/formElements/FormInput";
import FormInputFile from "@/components/formElements/FormInputFile";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { Button } from "@/components/ui/button";

import {
  feCiClaimSchema,
  type FECIClaimDTO,
  emptyFECIClaim,
} from "../schemas/fedeath";

export default function FECIClaim() {
  const form = useForm<FECIClaimDTO>({
    resolver: zodResolver(feCiClaimSchema),
    defaultValues: emptyFECIClaim,
  });

  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const policyOptions = [
    { value: "POL001", text: "POL001" },
    { value: "POL002", text: "POL002" },
    { value: "PASS123", text: "PASS123" },
    { value: "PASS456", text: "PASS456" },
  ];

  const branchOptions = [
    { value: "itahari", text: "Itahari Branch" },
    { value: "kathmandu", text: "Kathmandu Branch" },
    { value: "pokhara", text: "Pokhara Branch" },
  ];

  const onSearch = (data: FECIClaimDTO) => {
    setSelectedPolicy(data.policyOrPassport);
  };

  const onSubmitForm = () => {
    console.log("FE CI Claim Submitted", form.getValues());
    alert("Form submitted! Check console for details.");
  };

  return (
    <Form {...form}>
      {/* ===== Policy Search (Always Visible) ===== */}
      <form className="bg-white border rounded-lg p-6 space-y-6 mt-4 w-full">
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

        <div className="flex mt-4">
          <Button
            type="button"
            onClick={form.handleSubmit(onSearch)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2"
          >
            Search
          </Button>
        </div>
      </form>

      {/* ===== Render FE CI Claim Form ===== */}
      {selectedPolicy && (
        <div className="bg-white border rounded-lg p-6 space-y-6 mt-6 text-gray-800 font-sans">
          <h2 className="text-xl font-bold mb-4">
            FE CI Claim Details: {selectedPolicy}
          </h2>

          {/* Insured / Personal Details */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">
              Insured / Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <p>
                <strong>Policy No:</strong> {selectedPolicy}
              </p>
              <p>
                <strong>Passport No:</strong> NAN
              </p>
              <p>
                <strong>Branch:</strong> NAN
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
            <h3 className="text-lg font-semibold mb-4">Policy Details</h3>
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
            <h3 className="text-lg font-semibold mb-4">Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect
                form={form}
                name="claimBranch"
                label="Claim Branch"
                options={branchOptions}
                required
              />
              <DateConverter
                form={form}
                name="dateOfDeath"
                labelNep="Date Of Death (BS)"
                labelEng="Date Of Death (AD)"
              />
              <DateConverter
                form={form}
                name="intimationDate"
                labelNep="Intimation Date (BS)"
                labelEng="Intimation Date (AD)"
              />
              <FormInput
                form={form}
                name="placeOfDeath"
                label="Place Of Death"
                placeholder="Enter Place"
                required
              />
              <FormInput
                form={form}
                name="causeOfDeath"
                label="Cause Of Death"
                placeholder="Enter Cause"
                required
              />
              <FormSwitch
                form={form}
                name="isCrematedAbroad"
                label="Is Cremated Abroad?"
              />
              <FormInput
                form={form}
                name="numberOfPolicies"
                label="No Of Policies"
                placeholder="Enter No Of Policies"
                required
              />
            </div>
          </div>

          {/* Claimant Details */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Claimant Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <FormInput
                form={form}
                name="claimantName"
                label="Claimant Name"
                placeholder="Enter Claimant Name"
                required
              />
              <FormInput
                form={form}
                name="claimantRelation"
                label="Claimant Relation"
                placeholder="Enter Relation"
                required
              />
              <FormInput
                form={form}
                name="claimantContact"
                label="Claimant Contact"
                placeholder="Enter Contact"
                required
              />
              <FormInput
                form={form}
                name="claimantAddress"
                label="Claimant Address"
                placeholder="Enter Address"
                required
              />
              <FormInput
                form={form}
                name="claimReceivedVia"
                label="Claim Received Via"
                placeholder="Enter Received Via"
                required
              />
            </div>
          </div>

          {/* ===== Payee Details (Separate Box) ===== */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Payee Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <FormInput
                form={form}
                name="payeeName"
                label="Payee Name"
                placeholder="Enter Payee Name"
                required
              />
              <FormInput
                form={form}
                name="payeeBankName"
                label="Bank Name"
                placeholder="Enter Bank Name"
                required
              />
              <FormInput
                form={form}
                name="payeeAccountNo"
                label="Bank Account No"
                placeholder="Enter Bank Account No"
                required
              />
              <FormInput
                form={form}
                name="payeeAccountName"
                label="Bank Account Name"
                placeholder="Enter Bank Account Name"
                required
              />
            </div>
          </div>

          {/* ===== Document Upload (Separate Box) ===== */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
            <FormInputFile
              form={form}
              name="documentFile"
              label="Upload Document"
              fileNameField="documentFileName"
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
