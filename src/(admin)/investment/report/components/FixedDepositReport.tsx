"use client";

import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import type { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormSelect from "@/components/formElements/FormSelect";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	occupationList?: ProposalRequiredFields;
	proposalRequiredFields?: ProposalRequiredFields;
}

export default function FixedDepositReport({
	form,
	proposalRequiredFields,
}: ProposalDetailProps) {
	return (
		<div className="p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Fixed Deposit Report
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<DateConverter
						form={form}
						name="fromdate"
						labelNep=" From Date in BS"
						labelEng=" From Date in AD"
					/>
					<DateConverter
						form={form}
						name="todate"
						labelNep=" To Date in BS"
						labelEng=" To Date in AD"
					/>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="fdno"
							type="text"
							placeholder="Enter FD No"
							label="FD No"
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="bank name"
							options={proposalRequiredFields?.branchList}
							label=" Bank"
							caption="Select Bank"
							form={form}
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="report type"
							options={proposalRequiredFields?.branchList}
							label=" Report Type"
							caption="Select Report Type"
							form={form}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
