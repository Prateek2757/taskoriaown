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
				<h2 className="text-xl font-bold text-gray-800 mb-6">Claims</h2>

				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<FormInput
							form={form}
							type="number"
							name="minDeathClaimAmount"
							label="Min. Death Claim Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="maxDeathClaimAmount"
							label="Max. Death Claim Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="minAdultRiderAmount"
							label="Min. Adult Rider Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="maxAdultRiderAmount"
							label="Max. Adult Rider Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="minChildRiderAmount"
							label="Min. Child Rider Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="maxChildRiderAmount"
							label="Max. Child Rider Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="minForeignClaimAmount"
							label="Min. Foreign Claim Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="maxForeignClaimAmount"
							label="Max. Foreign Claim Amount"
						/>
					</div>
				</div>
			</section>
		</>
	);
}
