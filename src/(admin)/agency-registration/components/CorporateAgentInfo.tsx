import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AddAgentInfoDTO } from "../schemas/agenctSchema";
import FormSelect from "@/components/formElements/FormSelect";
import FormInput from "@/components/formElements/FormInput";

type CorporateAgentInfoProps = {
  form: UseFormReturn<AddAgentInfoDTO>;
};

const CorporateAgentInfo: React.FC<CorporateAgentInfoProps> = ({ form }) => {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Corporate Agent Information
      </h2>
      <div className="border border-dashed border-blue-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preferred Branch */}
          <FormSelect
            form={form}
            name="preferredBranch"
            label="Preferred Branch"
            placeholder="Select Preferred Branch"
            options={[]} // Fill dynamically
            required
          />

          {/* Superior Agent Code */}
          <FormSelect
            form={form}
            name="superiorAgentCode"
            label="Superior Agent Code"
            placeholder="Choose Superior Agent"
            options={[]} // Fill dynamically
            required
          />

          {/* Superior Agent Remarks */}
          <FormInput
            form={form}
            name="superiorAgentRemarks"
            label="Superior Agent Remarks"
            placeholder="Enter Remarks"
            required
          />

          {/* Corporate Name */}
          <FormInput
            form={form}
            name="corporateName"
            label="Corporate Name"
            placeholder="Enter Corporate Name"
            required
          />

          {/* Corporate Province */}
          <FormSelect
            form={form}
            name="corporateProvince"
            label="Corporate Province"
            placeholder="Select Province"
            options={[]} // Fill dynamically
            required
          />

          {/* Corporate District */}
          <FormSelect
            form={form}
            name="corporateDistrict"
            label="Corporate District"
            placeholder="Select District"
            options={[]} // Fill dynamically
            required
          />

          {/* Municipality */}
          <FormSelect
            form={form}
            name="corporateMunicipality"
            label="Municipality"
            placeholder="Select Municipality"
            options={[]} // Fill dynamically
            required
          />

          {/* Street Name */}
          <FormInput
            form={form}
            name="streetName"
            label="Street Name"
            placeholder="Enter Street Name"
            required
          />

          {/* Ward No */}
          <FormInput
            form={form}
            name="wardNo"
            label="Ward No"
            placeholder="Enter Ward Number"
            required
          />

          {/* Identification Type */}
          <FormSelect
            form={form}
            name="identificationType"
            label="Identification Type"
            placeholder="Select Type"
            options={[
              { value: "PAN", label: "PAN" },
              { value: "VAT", label: "VAT" },
            ]}
            required
          />

          {/* Identification No */}
          <FormInput
            form={form}
            name="identificationNumber"
            label="Identification Number"
            placeholder="Enter Identification Number"
            required
          />

          {/* Commission Bank Name */}
          <FormSelect
            form={form}
            name="commissionBankName"
            label="Commission Bank Name"
            placeholder="Select Bank Name"
            options={[]} // Fill dynamically
            required
          />

          {/* Bank Account Number */}
          <FormInput
            form={form}
            name="bankAccountNumber"
            label="Bank Account No"
            placeholder="Enter Bank Account Number"
            required
          />

          {/* Bank Branch */}
          <FormInput
            form={form}
            name="bankBranch"
            label="Bank Branch"
            placeholder="Enter Bank Branch"
            required
          />

          {/* PAN No */}
          <FormInput
            form={form}
            name="panNo"
            label="PAN No"
            placeholder="Enter PAN No"
          />

          {/* Landline No */}
          <FormInput
            form={form}
            name="landLineNo"
            label="Landline No"
            placeholder="Enter Landline Number"
          />

          {/* Mobile Number */}
          <FormInput
            form={form}
            name="mobileNumber"
            label="Mobile Number"
            placeholder="Enter Mobile Number"
            required
          />

          {/* Email */}
          <FormInput
            form={form}
            name="email"
            label="Email"
            placeholder="Enter Email"
            required
          />
        </div>
      </div>
    </>
  );
};

export default CorporateAgentInfo;
