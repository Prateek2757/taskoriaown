"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { AddUserSchema } from "../../schemas/ApplicationUserSchemas"; // Adjust if needed

import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";

type AddUserDTO = z.infer<typeof AddUserSchema>;

type CorporateDetailsFormProps = {
  form: UseFormReturn<AddUserDTO>;
  branchList: { label: string; value: string }[];
  departmentList: { label: string; value: string }[];
  designationList: { label: string; value: string }[];
};

export default function CorporateDetails({
  form,
  branchList,
  departmentList,
  designationList,
}: CorporateDetailsFormProps) {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Corporate Details
      </h2>

      <div className="border-blue-200 rounded-lg pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Branch */}
          <div className="space-y-2">
            <FormSelect
              form={form}
              name="branchCode"
              label="Branch"
              caption="Select Branch"
              options={branchList}
              required
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <FormSelect
              form={form}
              name="departmentId"
              label="Department"
              caption="Select Department"
              options={departmentList}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <FormInput
              form={form}
              name="email"
              label="Email Address"
              placeholder="example@email.com"
              type="text"
              required
            />
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <FormSelect
              form={form}
              name="designationCode"
              label="Designation"
              caption="Select Designation"
              options={designationList}
              required
            />
          </div>
          {/* Is Admin Toggle */}
          <div className="space-y-2">
            <FormSwitch label="Is Admin" name="isAdmin" form={form} />
          </div>
        </div>
      </div>
    </>
  );
}
