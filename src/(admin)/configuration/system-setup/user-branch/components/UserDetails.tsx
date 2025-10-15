"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormSelect from "@/components/formElements/FormSelect";
import { Button } from "@/components/ui/button";

export default function UserDetails() {
  const form = useForm({
    defaultValues: {
      userName: "",
      isActive: false,
    },
  });

  return (
    <FormProvider {...form}>
      <section className="border border-gray-200 rounded-lg p-3 mb-8 bg-white mt-3">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            User Wise Branch Details
          </h2>
        </div>

        {/* Inner Container */}
        <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-dashed border-blue-200 rounded">
          <FormSelect
            form={form}
            name="userName"
            label="User Name"
            placeholder="Select User Name"
            required
          />
          <div className="flex items-center">
            <FormSwitch label="Is Active" name="isActive" form={form} />
          </div>
        </div>
      </section>
    </FormProvider>
  );
}
