"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import FormSelect from "@/components/formElements/FormSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  ReverseClaimSchema,
  ReverseClaimDTO,
} from "../schemas/reverseClaimSchema";

export default function ReverseClaimVoucher() {
  const form = useForm<ReverseClaimDTO>({
    resolver: zodResolver(ReverseClaimSchema),
    defaultValues: { claimType: "", voucherNo: "", policyNo: "" },
  });

  const onSubmit = (data: ReverseClaimDTO) => {
    console.log("✅ Submitted:", data);
  };

  const claimTypes = [
    { value: "medical", text: "Medical" },
    { value: "vehicle", text: "Vehicle" },
    { value: "property", text: "Property" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-white border rounded-lg p-6 space-y-6 mt-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Reverse Claim Voucher
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-1">
              <FormSelect
                form={form}
                name="claimType"
                label="Claim Type"
                caption="Select Claim Type"
                options={claimTypes}
                required
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Controller
                name="voucherNo"
                control={form.control}
                render={({ field }) => (
                  <>
                    <label className="text-sm text-gray-600">
                      Voucher No <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...field}
                      placeholder="Enter Voucher No"
                      className="bg-white border border-gray-300 text-sm"
                    />
                    {form.formState.errors.voucherNo && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.voucherNo.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Controller
                name="policyNo"
                control={form.control}
                render={({ field }) => (
                  <>
                    <label className="text-sm text-gray-600">
                      Policy No <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...field}
                      placeholder="Enter Policy No"
                      className="bg-white border border-gray-300 text-sm"
                    />
                    {form.formState.errors.policyNo && (
                      <p className="text-red-500 text-xs">
                        {form.formState.errors.policyNo.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-start mt-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
