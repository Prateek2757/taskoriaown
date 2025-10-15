"use client";

import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import type { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	occupationList?: ProposalRequiredFields;
	proposalRequiredFields?: ProposalRequiredFields;
}

export default function RegistrationDetails({
	form,
	proposalRequiredFields,
}: ProposalDetailProps) {
	return (
		<div className="p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Registration Details
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{/* Employee ID */}
					<div className="space-y-2">
						<FormInput
							form={form}
							name="company registration no"
							type="text"
							placeholder="Company Registration No"
							label="Company Registration No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="company tax registration no"
							type="text"
							placeholder="Company Tax Registration No"
							label="Company Tax Registration No"
							required
						/>
					</div>
					<DateConverter
						form={form}
						name="dateOfBirth"
						labelNep=" Company Date of Operation in BS"
						labelEng=" Company Date of Operation in AD"
					/>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="pan number"
							type="text"
							placeholder="Pan Number"
							label="Pan Number"
							required
						/>
					</div>

					<div className="space-y-2">
						<FormInputNepali
							form={form}
							name="pan number (In Local)"
							type="text"
							placeholder="Pan Number (In Local)"
							label="Pan Number (In Local)"
							required
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
