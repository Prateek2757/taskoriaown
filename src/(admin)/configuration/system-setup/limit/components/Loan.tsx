import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditOnlineProposalDTO } from "@/app/(admin)/online-proposal/onlineProposalSchema";
import FormInput from "@/components/formElements/FormInput";

type ClaimsProps = {
	form: UseFormReturn<AddEditOnlineProposalDTO>;
};

export default function Claims({ form }: ClaimsProps) {
	return (
		<>
			<section className="border border-gray-200 rounded-lg p-6 mb-8 bg-white">
				<h2 className="text-xl font-bold text-gray-800 mb-6">Loan</h2>

				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<FormInput
							form={form}
							type="number"
							name="minPolicyLoanAmount"
							label="Min Policy Loan Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="maxPolicyLoanAmount"
							label="Max Policy Loan Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="minAgentLoanAmount"
							label="Min Agent Loan Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="maxAgentLoanAmount"
							label="Max Agent Loan Amount"
						/>
					</div>
				</div>
			</section>
		</>
	);
}
