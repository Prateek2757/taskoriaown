"use client";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import type { AddProposalDTO } from "../proposalSchema";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	proposalRequiredFields?: ProposalRequiredFields;
}
export default function AssumedTarget({
	form,
	proposalRequiredFields,
}: ProposalDetailProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Assumed Detail</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						{/* <div className="space-y-2">
						<FormInput
							form={form}
							name="Age"
							type="text"
							placeholder="0"
							label="Age"
							disabled
						/>
					</div> */}
						<div className="space-y-2">
							<FormSelect
								options={proposalRequiredFields?.incomeSourceList}
								form={form}
								name="incomeSource"
								label="Income Source"
								required={true}
							/>
						</div>
						{/* <div className="space-y-2">
						<FormSelect
							name="IncomeAmount"
							options={[]}
							label="Business Branch"
							caption="Select Business Branch"
							form={form}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="branchCodes"
							type="text"
							disabled
							placeholder="Age"
							label="Proposer Age"
							required={true}
						/>
					</div> */}
						<div className="space-y-2">
							<FormSwitch
								form={form}
								label="Is sum Assured with Tax"
								name="isSuMAssuredWithTax"
							/>
						</div>
						{/* <div className="space-y-2">
						<FormSelect
							name="modeOfPayments"
							options={[]}
							label="Mode of Payment"
							caption="Select"
							form={form}
							required={true}
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="terms"
							options={[]}
							label="Term"
							caption="Select"
							form={form}
							required={true}
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="payTerms"
							options={[]}
							label="Pay Term"
							caption="Select"
							form={form}
							required={true}
						/>
					</div> */}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
