import FormTextarea from "@/components/formElements/FormTextarea";
import { UseFormReturn } from "react-hook-form";
import { AddAgentTrainingDTO } from "../schemas/agentTrainingSchema";
import { FormSwitch } from "@/components/formElements/FormSwitch";

type AdditionalDetailsProps = {
	form: UseFormReturn<AddAgentTrainingDTO>;
};

export default function AdditionalDetails({ form }: AdditionalDetailsProps) {
	return (
		<>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					Additional Details
				</h2>
				<FormTextarea
					name="remarks"
					form={form}
					label="Remarks"
					placeholder="Enter Remarks"
				/>

				<div className="flex items-center gap-3 pt-6">
					<FormSwitch form={form} name="isActive" label="IsActive" />
				</div>
			</div>
		</>
	);
}
