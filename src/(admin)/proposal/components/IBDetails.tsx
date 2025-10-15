"use client";
import type { UseFormReturn } from "react-hook-form";
import FormSelect from "@/components/formElements/FormSelect";
import type { AddProposalDTO } from "../proposalSchema";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
}
export default function IBDetails({ form }: ProposalDetailProps) {
	return (
		<div className="bg-white rounded-lg border-1 mb-6 mt-4">
			<div className="p-6">
				<h2 className="text-xl font-bold text-gray-800 mb-6">IB Detail</h2>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2">
							<FormSelect
								options={[]}
								form={form}
								name="agentCode"
								label="Benifit Payment Options"
								required={true}
							/>
						</div>
						<div className="space-y-2">
							<FormSelect
								name="agentCode"
								options={[]}
								label="SA Percentage"
								caption="Select SA Percentage"
								form={form}
								required={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
