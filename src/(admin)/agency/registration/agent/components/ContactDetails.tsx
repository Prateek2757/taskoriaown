import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import { useOnlyNumbers } from "@/hooks/useInputValidation";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { AddEditTrainerDTO } from "../schemas/trainerSchema";

type ContactDetailsProps = {
  form: UseFormReturn<AddEditTrainerDTO>;
};

export default function ContactDetails({ form }: ContactDetailsProps) {
  const mobileNumber = form.watch("mobileNumber");

  useEffect(() => {
    // Optionally validate or update values when mobile changes
  }, [mobileNumber]);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Details</h2>

      <div className="border-0 md:border border-dashed border-blue-200 rounded-lg p-0 md:p-6 md:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <FormInput
              form={form}
              name="mobileNumber"
              label="Mobile Number"
              type="text"
              placeholder="Enter mobile number"
              maxLength={10}
              required={true}
              onKeyDown={useOnlyNumbers()}
            />
          </div>

          <div className="space-y-2">
            <FormInput
              form={form}
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter email"
            />
          </div>

          <div className="space-y-2">
            <FormInput
              form={form}
              name="remarks"
              label="Remarks"
              type="text"
              placeholder="Enter remarks"
            />
          </div>
        </div>

        <div className="mt-4">
          <FormSwitch form={form} name="isActive" label="IsActive" />
        </div>
      </div>
    </>
  );
}
