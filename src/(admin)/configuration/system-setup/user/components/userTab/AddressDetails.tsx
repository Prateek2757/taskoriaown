"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { AddUserSchema } from "../../schemas/ApplicationUserSchemas"; // Adjust path
import FormInput from "@/components/formElements/FormInput";

type AddUserDTO = z.infer<typeof AddUserSchema>;

type AddressDetailsFormProps = {
  form: UseFormReturn<AddUserDTO>;
};

export default function AddressDetailsForm({ form }: AddressDetailsFormProps) {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Address Details</h2>

      <div className="border-blue-200 rounded-lg pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Permanent Address */}
          <div className="space-y-2">
            <FormInput
              form={form}
              type="text"
              name="permanentAddress"
              label="Permanent Address"
              placeholder="Enter Permanent Address"
              required
            />
          </div>

          {/* Temporary Address */}
          <div className="space-y-2">
            <FormInput
              form={form}
              type="text"
              name="temporaryAddress"
              label="Temporary Address"
              placeholder="Enter Temporary Address"
              required
            />
          </div>
        </div>
      </div>
    </>
  );
}
