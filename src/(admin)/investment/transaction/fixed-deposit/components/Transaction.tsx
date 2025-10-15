"use client";

import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import type { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormInputFile from "@/components/formElements/FormInputFile";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormTextarea from "@/components/formElements/FormTextarea";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	occupationList?: ProposalRequiredFields;
	proposalRequiredFields?: ProposalRequiredFields;
}

export default function FDTransactionDetails({
	form,
	proposalRequiredFields,
}: ProposalDetailProps) {
	return (
		<div className="pl-6 pb-6 pr-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Transaction Details
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{/* Employee ID */}
					<div className="space-y-2">
						<FormSelect
							form={form}
							name="Cr Ledger No"
							options={proposalRequiredFields?.branchList}
							caption="Select Ledger"
							label="Cr Ledger No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							form={form}
							name="Cr Sub Ledger No"
							options={proposalRequiredFields?.branchList}
							caption="Select Sub Ledger"
							label="Cr Sub Ledger No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="Receiving Bank"
							options={proposalRequiredFields?.branchList}
							label="Receiving Bank"
							caption="Select Ledger"
							form={form}
							required
						/>
					</div>
					<DateConverter
						form={form}
						name="transactiondate"
						labelNep="Transaction Date in BS"
						labelEng="Transaction Date in AD"
					/>
					<div className="space-y-2">
						<FormSelect
							form={form}
							name="FD Ledger No(Dr)"
							options={proposalRequiredFields?.branchList}
							caption="Select Ledger"
							label="FD Ledger No(Dr)"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="Company Branch"
							options={proposalRequiredFields?.branchList}
							label=" Company Branch"
							caption="Select Branch"
							form={form}
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="voucher narration"
							type="text"
							placeholder="Voucher Narration"
							label="Voucher Narration"
						/>
					</div>
					<div className="space-y-2">
						<FormTextarea
							form={form}
							name="Remarks"
							placeholder="Remarks"
							label="Remarks"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
