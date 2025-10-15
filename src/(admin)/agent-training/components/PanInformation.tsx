"use client";

import FormInput from "@/components/formElements/FormInput";
import type { UseFormReturn } from "react-hook-form";
import { useOnlyNumbers } from "@/hooks/useInputValidation";
import { AddAgentTrainingDTO } from "../schemas/agentTrainingSchema";

type PanInformationProps = {
	form: UseFormReturn<AddAgentTrainingDTO>;
};

export default function PanInformation({ form }: PanInformationProps) {
	return (
		<>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					PAN Information
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormInput
							form={form}
							name="panNumber"
							type="text"
							placeholder="Enter PAN Number"
							label="PAN Number"
							onKeyDown={useOnlyNumbers()}
							required={true}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
