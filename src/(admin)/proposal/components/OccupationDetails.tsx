"use client";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import type { AddProposalDTO } from "../proposalSchema";
import FormCombo from "@/components/formElements/FormCombo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	occupationList?: ProposalRequiredFields;
	proposalRequiredFields?: ProposalRequiredFields;
}
export default function OccupationDetails({
	form,
	occupationList,
	proposalRequiredFields,
}: ProposalDetailProps) {
	const occupationExtraId = form.getValues("occupationExtraId");
	console.log("occupationExtraId", occupationExtraId);
	const occupationChange = (e) => {
		console.log(e);
		form.setValue("occupationExtraRate", e.target.dataValue);
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Occupation Details</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2">
							<FormCombo
								onChange={occupationChange}
								options={occupationList?.occupationExtraList}
								form={form}
								name="occupationExtraId"
								label="Occupation"
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="occupationExtraRate"
								type="text"
								disabled
								placeholder="SA Occupation Extra Rate"
								label="SA Occupation Extra Rate"
							/>
						</div>

						{/* <div className="space-y-2">
							<FormInput
								form={form}
								name="OccupationDescription"
								type="text"
								placeholder="Occupation Description"
								label="Occupation Description"
								required={true}
							/>
						</div> */}

						<div className="space-y-2">
							<FormInput
								form={form}
								name="incomeAmount"
								type="text"
								placeholder="Income Amount"
								label="Income Amount"
								required={true}
							/>
						</div>
						<div className="space-y-2">
							<FormSelect
								name="incomeMode"
								options={proposalRequiredFields?.incomeModeList}
								label="Income Mode"
								caption="Select Income Mode"
								form={form}
								required={true}
							/>
						</div>
						{/* <div className="space-y-2">
							<FormSelect
								name="MISC"
								options={[]}
								label="MISC"
								caption="Select MISC"
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
