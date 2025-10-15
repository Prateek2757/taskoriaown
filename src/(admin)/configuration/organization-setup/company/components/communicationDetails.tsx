"use client";

import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import type { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	occupationList?: ProposalRequiredFields;
	proposalRequiredFields?: ProposalRequiredFields;
}

export default function CommunicationDetails({
	form,
	proposalRequiredFields,
}: ProposalDetailProps) {
	return (
		// <div className="bg-white rounded-lg border mb-6 mt-0 justify-start">
		<div className="px-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Communication Details
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{/* Employee ID */}
					<div className="space-y-2">
						<FormInput
							form={form}
							name="phoneNo1"
							type="text"
							placeholder="Phone No 1"
							label="Phone No 1"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="phoneNo2"
							type="text"
							placeholder="Phone No 2"
							label="Phone No 2"
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="phoneNo3"
							type="text"
							placeholder="Phone No 3"
							label="Phone No 3"
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="phoneNo4"
							type="text"
							placeholder="Phone No 4"
							label="Phone No 4"
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="faxno"
							type="text"
							placeholder="Fax No"
							label="Fax No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="post box no"
							type="text"
							placeholder="Post Box No"
							label="Post Box No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="company email"
							type="text"
							placeholder="Company Email"
							label="Company Email"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="company website"
							type="text"
							placeholder="Company Website"
							label="Company Website"
							required
						/>
					</div>
				</div>
			</div>
		</div>
		// </div>
	);
}
