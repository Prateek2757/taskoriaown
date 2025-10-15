"use client";

import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import type { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormInputFile from "@/components/formElements/FormInputFile";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	occupationList?: ProposalRequiredFields;
	proposalRequiredFields?: ProposalRequiredFields;
}

export default function TransactionDetails({
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
						<FormInput
							form={form}
							name="dr account no"
							type="text"
							placeholder="Dr Account No"
							label="Dr Account No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="cr account no"
							type="text"
							placeholder="Cr Account No"
							label="Cr Account No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="cheque no"
							type="text"
							placeholder="Cheque No"
							label="Cheque No"
						/>
					</div>

					<DateConverter
						form={form}
						name="transactiondate"
						labelNep="Transaction Date in BS"
						labelEng="Transaction Date in AD"
					/>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="voucher narration"
							type="text"
							placeholder="Voucher Narration"
							label="Voucher Narration"
							required
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
