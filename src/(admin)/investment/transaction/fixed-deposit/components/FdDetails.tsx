"use client";

import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import type { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormInputFile from "@/components/formElements/FormInputFile";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	occupationList?: ProposalRequiredFields;
	proposalRequiredFields?: ProposalRequiredFields;
}

export default function FixedDepositDetails({
	form,
	proposalRequiredFields,
}: ProposalDetailProps) {
	return (
		<div className="p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">FD Details</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{/* Employee ID */}
					<div className="space-y-2">
						<FormSelect
							name="Bank Name"
							options={proposalRequiredFields?.branchList}
							label="Bank Name"
							caption="Select Bank"
							form={form}
							required
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="Sector Name"
							options={proposalRequiredFields?.branchList}
							label=" Sector"
							caption="Select Sector"
							form={form}
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="Sub Sector"
							options={proposalRequiredFields?.branchList}
							label=" Sub Sector"
							caption="Select Sub Sector"
							form={form}
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="Bank Branch"
							type="text"
							placeholder="Enter Bank Branch"
							label="Bank Branch"
						/>
					</div>
					<DateConverter
						form={form}
						name="StartDate"
						labelNep="Start Date in BS"
						labelEng="Start Date in AD"
					/>
					<div className="space-y-2">
						<FormSelect
							name="MOP"
							options={proposalRequiredFields?.branchList}
							label="MOP"
							caption="Select Mode of Payment"
							form={form}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="Interest Rate"
							type="text"
							placeholder="Enter Interest Rate"
							label="Interest Rate"
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="FD Amount"
							type="text"
							placeholder="Enter FD Amount"
							label="FD Amount"
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="Interest Ason"
							type="text"
							placeholder="Enter Interest Ason"
							label="Interest Ason"
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="Terms"
							type="text"
							placeholder="Terms"
							label="Terms(Month)"
						/>
					</div>
					<DateConverter
						form={form}
						name="maturityDate"
						labelNep="Maturity Date in BS"
						labelEng="Maturity Date in AD"
					/>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="FD No"
							type="text"
							placeholder="Enter FD No"
							label="FD No"
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="Receipt No"
							type="text"
							placeholder="Enter Receipt No"
							label="Receipt No"
						/>
					</div>
					<div className="space-y-2">
						<FormSwitch form={form} name="IsRenew" label="IsRenew" />
					</div>
					<div className="space-y-2">
						<FormSelect
							name="Interest Book Type"
							options={proposalRequiredFields?.branchList}
							label="Interest Book Type"
							caption="Select Interest Book Type"
							form={form}
						/>
					</div>
					<div className="space-y-2">
						<FormSwitch form={form} name="IsActive" label="IsActive" />
					</div>
				</div>
			</div>
		</div>
	);
}
