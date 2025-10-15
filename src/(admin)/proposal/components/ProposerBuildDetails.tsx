"use client";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import type { AddProposalDTO } from "../proposalSchema";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
}
export default function ProposerBuildDetails({ form }: ProposalDetailProps) {
	return (
		<div className="bg-white rounded-lg border-1 mb-6 mt-4">
			<div className="p-6">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					Proposer Build Detail
				</h2>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2">
							<FormInput
								form={form}
								name="ProposalIdD"
								type="text"
								placeholder="Height"
								label="Height"
								required={true}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="ClientId"
								type="text"
								disabled={true}
								placeholder=""
								label="Height in CM"
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Enter Weight"
								label="Weight"
								required={true}
							/>
						</div>
						<div className="space-y-2 flex flex-row justify-between">
							<FormSwitch form={form} label="Do Smoke?" name={"smoke"} />
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Smoke Remarks"
								label="Smoke Remarks"
								required={true}
							/>
						</div>

						<div className="space-y-2 flex flex-row justify-between">
							<FormSwitch
								form={form}
								label="Do Drink Alcohol?"
								name={"smoke"}
							/>
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Alcohol Remarks"
								label="Alcohol Remarks"
								required={true}
							/>
						</div>
						<div className="space-y-2 flex flex-row justify-between">
							<FormSwitch
								form={form}
								label="Do you use drugs?"
								name={"smoke"}
							/>
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Drug Remarks"
								label="Drug Remarks"
								required={true}
							/>
						</div>
						<div className="space-y-2 ">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="33"
								label="BMI"
								required={true}
								disabled={true}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								disabled
								placeholder="Healthy"
								label="BMI status"
								required={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
