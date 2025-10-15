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
  feDisabilitySearchSchema,
  type FeDisabilitySearchDTO,
  emptyFeDisabilitySearch,
} from "../schemas/fedisabilitylistSchemas";

export default function FEDisabilityList() {
  const form = useForm<FeDisabilitySearchDTO>({
    resolver: zodResolver(feDisabilitySearchSchema),
    defaultValues: emptyFeDisabilitySearch,
  });

  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const policyOptions = [
    { value: "FED001", text: "FED001" },
    { value: "FED002", text: "FED002" },
    { value: "FED003", text: "FED003" },
  ];

  const branchOptions = [
    { value: "itahari", text: "Itahari Branch" },
    { value: "kathmandu", text: "Kathmandu Branch" },
    { value: "pokhara", text: "Pokhara Branch" },
  ];

  const bankOptions = [
    { value: "nabil", text: "Nabil Bank" },
    { value: "himalayan", text: "Himalayan Bank" },
    { value: "standard", text: "Standard Chartered" },
  ];

  const disabilityOptions = [
    "स्थायी पूर्ण अशक्तता",
    "निको नहुने गरी दुबै आँखाको दृष्टि पूर्ण क्षति",
    "दुबै हातको नाडी वा दुबै खुट्टाको गोली गाँठोको जोर्नी वा सो भन्दा माथि देखि शारीरिक रुपले काम नलाग्ने",
    "एउटा हातको नाडी वा एउटा खुट्टाको गोली गाँठोको जोर्नी वा सो भन्दा माथि देखि र एउटा आँखाका दृष्टि पूर्ण रुपले क्षति",
    "एउटा आँखाको दृष्टि पूर्ण रुपले क्षति",
    "एउटा हातको नाडी वा एउटा खुट्टाको गोली गाँठोको जोर्नी वा सो भन्दा माथि देखि शारीरिक रुपले काम नलाग्ने गरी क्षति",
    "बोल्ने क्षमता पूर्ण रुपले क्षति",
    "दुबै कानको सुन्ने शक्ति पूर्ण रुपले क्षति",
    "एउटा कानको सुन्ने शक्ति पूर्ण रुपले क्षति",
    "हातको बुढी औंला पूर्ण रुपले क्षति",
    "हातको चोरी औंला पूर्ण रुपले क्षति",
    "हातको अरु कुनै औंला पूर्ण रुपले क्षति",
    "खुट्टाको बुढी औंला पूर्ण रुपले क्षति",
    "खुट्टाको अरु कुनै औंला पूर्ण रुपले क्षति",
    "अन्य कुनै अंग भंग",
  ];

  const onSearch = (data: FeDisabilitySearchDTO) => {
    setSelectedPolicy(data.policyNo);
  };

  const onSubmitForm = () => {
    console.log("FE Disability Form Submitted", form.getValues());
    alert("Form submitted! Check console for details.");
  };

  return (
    <Form {...form}>
      {/* ===== Policy Search (Always Visible) ===== */}
      <form className="bg-white border rounded-lg p-6 space-y-6 mt-4 w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          FE Disability Policy Search
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

      {/* ===== Render FE Disability Form ===== */}
      {selectedPolicy && (
        <div className="bg-white border rounded-lg p-6 space-y-6 mt-6 text-gray-800 font-sans">
          <h2 className="text-xl font-bold mb-4">
            FE Disability Claim Details: {selectedPolicy}
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
                <strong>DOC | Maturity Date:</strong> NAN
              </p>
            </div>
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
                  { value: "death", text: "Death" },
                  { value: "disability", text: "Disability" },
                  { value: "ci", text: "Critical Illness" },
                ]}
                required
              />
              <DateConverter
                form={form}
                name="dateOfIncident"
                labelNep="Date Of Incident (BS)"
                labelEng="Date Of Incident (AD)"
              />
              <DateConverter
                form={form}
                name="intimationDate"
                labelNep="Intimation Date (BS)"
                labelEng="Intimation Date (AD)"
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
                label="Cause of Incident"
                placeholder="Enter cause"
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

          {/* Payee Details */}
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
              <FormSelect
                form={form}
                name="payeeBank"
                label="Bank Name"
                options={bankOptions}
                required
              />
              <FormInput
                form={form}
                name="payeeAccount"
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

          {/* Document Upload */}
          <div className="border border-dashed border-blue-200 rounded-lg p-6">
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
