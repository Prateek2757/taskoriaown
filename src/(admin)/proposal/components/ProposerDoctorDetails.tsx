"use client";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import type { AddProposalDTO } from "../proposalSchema";

interface ProposerDoctorDetailsProps {
	form: UseFormReturn<AddProposalDTO>;
}
export default function ProposerDoctorDetails({
	form,
}: ProposerDoctorDetailsProps) {
	return (
		<div className="bg-white rounded-lg border-1 mb-6 mt-4">
			<div className="p-6">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					Proposer Doctor's Detail
				</h2>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2">
							<FormInput
								form={form}
								name="ClientId"
								type="text"
								placeholder="Please enter Doctor Name/NMC Number"
								label="Doctor Name/NMC Number"
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="ClientId"
								type="text"
								placeholder="Enter Doctor Remarks"
								label="Doctor Remarks"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
