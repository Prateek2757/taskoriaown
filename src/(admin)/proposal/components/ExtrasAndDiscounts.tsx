"use client";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import type { AddProposalDTO } from "../proposalSchema";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
}
export default function ExtrasAndDiscounts({ form }: ProposalDetailProps) {
	return (
		<div className="bg-white rounded-lg border-1 mb-6 mt-4">
			<div className="p-6">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					Extras and Discounts
				</h2>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2">
							<FormInput
								form={form}
								name="ProposalIdD"
								type="text"
								placeholder="Please enter health extra remarks"
								label="Health Extra(remarks)"
								required={true}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="ClientId"
								type="text"
								placeholder="0"
								label="Health Extra(Amount)"
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Please enter  age extra rate"
								label="Non Standard Age Extra Rate"
								required={true}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Please enter  extra rate"
								label="Extra Rate"
								required={true}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Please enter extra rate discount"
								label=" Extra Rate Discount"
								required={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
