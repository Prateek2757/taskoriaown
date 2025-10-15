"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import FormSelect from "@/components/formElements/FormSelect";
import FormInput from "@/components/formElements/FormInput";
import FormInputFile from "@/components/formElements/FormInputFile";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { Button } from "@/components/ui/button";

import {
  disabilitySearchSchema,
  type DisabilitySearchDTO,
  emptyDisabilitySearch,
} from "../schemas/disability";

export default function DisabilitySearch() {
  const form = useForm<DisabilitySearchDTO>({
    resolver: zodResolver(disabilitySearchSchema),
    defaultValues: emptyDisabilitySearch,
  });

  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const policyOptions = [
    { value: "DCL001", text: "DCL001" },
    { value: "DCL002", text: "DCL002" },
    { value: "DCL003", text: "DCL003" },
  ];

  const branchOptions = [
    { value: "itahari", text: "Itahari Branch" },
    { value: "kathmandu", text: "Kathmandu Branch" },
    { value: "pokhara", text: "Pokhara Branch" },
  ];

  const disabilityOptions = [
    "दुवै आँखा",
    "दुवै हात",
    "दुवै खुट्टा",
    "एउटा हात र एउटा खुट्टा",
    "Mentally and Physically Total Disability",
  ];

  const onSearch = (data: DisabilitySearchDTO) => {
    setSelectedPolicy(data.policyNo);
  };

  const onSubmitForm = () => {
    console.log("Disability Claim Submitted", form.getValues());
    alert("Form submitted! Check console for details.");
  };

  return (
    <Form {...form}>
      {/* ===== Policy Search (Always Visible) ===== */}
      <form className="bg-white border rounded-lg p-6 space-y-6 mt-4 w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Disability Policy Search
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <FormSelect
            form={form}
            name="policyNo"
            label="Policy No"
            caption="Select Policy No"
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

      {/* ===== Render Disability Claim Form ===== */}
      {selectedPolicy && (
        <div className="bg-white border rounded-lg p-6 space-y-6 mt-6 text-gray-800 font-sans">
          <h2 className="text-xl font-bold mb-4">
            Disability Claim Details: {selectedPolicy}
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
                <strong>Term | Pay Term:</strong> NAN
              </p>
              <p>
                <strong>MOP:</strong> NAN
              </p>
              <p>
                <strong>Next Due Date:</strong> NAN
              </p>
              <p>
                <strong>DOC | Maturity Date:</strong> NAN
              </p>
            </div>
          </div>

          {/* Insured Rider Details Table */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">
              Insured Rider Details
            </h3>
            <table className="w-full table-auto text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">SN</th>
                  <th className="border px-2 py-1">Rider</th>
                  <th className="border px-2 py-1">Rider SA</th>
                  <th className="border px-2 py-1">Rider Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">1</td>
                  <td className="border px-2 py-1">Sample Rider</td>
                  <td className="border px-2 py-1">NAN</td>
                  <td className="border px-2 py-1">NAN</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Registration Details */}
          <div className="border border-dashed border-blue-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect
                form={form}
                name="claimType"
                label="Claim Type"
                options={[
                  { value: "disability", text: "Disability" },
                  { value: "death", text: "Death" },
                ]}
                required
              />
              <FormInput
                form={form}
                name="incidentOf"
                label="Incident Of"
                placeholder="Enter Incident Of"
                required
              />
              <DateConverter
                form={form}
                name="dateOfIncident"
                labelNep="Date Of Incident (BS)"
                labelEng="Date Of Incident (AD)"
              />
              <FormSelect
                form={form}
                name="claimBranch"
                label="Claim Branch"
                options={branchOptions}
                required
              />
              <FormInput
                form={form}
                name="causeOfIncident"
                label="Cause Of Incident"
                placeholder="Enter Cause"
                required
              />
            </div>

            {/* Disability List as checkboxes */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Disability List</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {disabilityOptions.map((dis, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Controller
                      name={`disability-${idx}`}
                      control={form.control}
                      render={({ field }) => (
                        <input type="checkbox" {...field} className="w-4 h-4" />
                      )}
                    />
                    <label className="text-sm">{dis}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document Upload */}
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
