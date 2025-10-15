"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/formElements/FormSelect";

import {
  ciSearchSchema,
  type CiSearchDTO,
  emptyCiSearch,
} from "../schemas/cisearchSchemas";

export default function CiSearch() {
  const form = useForm<CiSearchDTO>({
    resolver: zodResolver(ciSearchSchema),
    defaultValues: emptyCiSearch,
  });

  const onSubmit = (data: CiSearchDTO) => {
    console.log("🔍 Search Data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Outer Box */}
        <div className="bg-white border rounded-lg p-6 space-y-6 mt-4 w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            CI Policy Search
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Policy Dropdown */}
            <div className="flex-1">
              <FormSelect
                form={form}
                name="policyNo"
                label="Policy No"
                caption="Select Policy No"
                options={[
                  { value: "POL001", text: "POL001" },
                  { value: "POL002", text: "POL002" },
                  { value: "POL003", text: "POL003" },
                ]}
                required
              />
            </div>

            {/* Placeholder to keep layout consistent */}
            <div className="flex-1" />
            <div className="flex-1" />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex mt-4">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2"
          >
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}
