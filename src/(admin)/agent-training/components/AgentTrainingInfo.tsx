import { type UseFormReturn } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import FormSelect from "@/components/formElements/FormSelect";

type AgentTrainingInfoProps = {
  form: UseFormReturn<AddEditKycDTO>;
  trainingOptions: SelectOption[];
  agentOptions: SelectOption[];
  managerOptions: SelectOption[];
};

export default function AgentTrainingInfo({
  form,
  trainingOptions,
  agentOptions,
  managerOptions,
}: AgentTrainingInfoProps) {
  return (
    <div className="border border-dashed border-blue-200 rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Agent Training Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <FormSelect
            form={form}
            name="trainingId"
            options={trainingOptions}
            label="Training ID"
            caption="Select Training Id"
            required
          />
        </div>

        <div className="space-y-2">
          <FormSelect
            form={form}
            name="superiorAgentCode"
            options={agentOptions}
            label="Superior Agent Code"
            caption="Please Choose a Superior Agent"
            required
          />
        </div>

        <div className="space-y-2">
          <FormInput
            form={form}
            name="superiorAgentRemarks"
            type="text"
            placeholder="Enter Upper Agent ID Remarks"
            label="Superior Agent Remarks"
          />
        </div>

        <div className="space-y-2">
          <FormSelect
            form={form}
            name="reportingManager"
            options={managerOptions}
            label="Reporting Manager"
            caption="Select Reporting Manager"
          />
        </div>
      </div>
    </div>
  );
}
