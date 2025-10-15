import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditOnlineProposalDTO } from "@/app/(admin)/online-proposal/onlineProposalSchema";
import FormInput from "@/components/formElements/FormInput";

type UnderwritingDetailsProps = {
  form: UseFormReturn<AddEditOnlineProposalDTO>;
};

export default function UnderwritingDetails({
  form,
}: UnderwritingDetailsProps) {
  return (
    <section className="border border-gray-200 rounded-lg p-6 mb-8 bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 ">
        Underwriting
      </h2>

      {/* Dashed inner border */}
      <div className="border border-dashed border-blue-300 rounded-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormInput
            form={form}
            type="number"
            name="minMedicalSA"
            label="Min. Medical SA"
            required
          />
          <FormInput
            form={form}
            type="number"
            name="maxMedicalSA"
            label="Max. Medical SA"
            required
          />
          <FormInput
            form={form}
            type="number"
            name="minMedicalAge"
            label="Min. Medical Age"
          />
          <FormInput
            form={form}
            type="number"
            name="maxMedicalAge"
            label="Max. Medical Age"
          />
          <FormInput
            form={form}
            type="number"
            name="minNonMedicalSA"
            label="Min. Non Medical SA"
          />
          <FormInput
            form={form}
            type="number"
            name="maxNonMedicalSA"
            label="Max. Non Medical SA"
          />
          <FormInput
            form={form}
            type="number"
            name="minNonMedicalAge"
            label="Min. Non Medical Age"
          />
          <FormInput
            form={form}
            type="number"
            name="maxNonMedicalAge"
            label="Max. Non Medical Age"
          />
        </div>
      </div>
    </section>
  );
}
