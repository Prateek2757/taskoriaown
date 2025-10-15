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

export default function DebentureDetails({
	form,
	proposalRequiredFields,
}: ProposalDetailProps) {
	return (
		<div className="p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Debenture Details
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{/* Employee ID */}
					<div className="space-y-2">
						<FormInput
							form={form}
							name="certificate no"
							type="text"
							placeholder="Certificate No"
							label="Certificate No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="client id"
							type="text"
							placeholder="Client ID"
							label="Client ID"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="issuing agency"
							options={proposalRequiredFields?.branchList}
							label="Select Issuing Agency"
							caption="Select Issuing Agency"
							form={form}
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="debenture name"
							type="text"
							placeholder="Debenture Name"
							label="Debenture Name"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="debenture start no"
							type="text"
							placeholder="Debenture Start No"
							label="Debenture Start No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="debenture end no"
							type="text"
							placeholder="Debenture End No"
							label="Debenture End No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="total debenture no"
							type="text"
							placeholder="Total Debenture No"
							label="Total Debenture No"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="par value"
							type="text"
							placeholder="Par Value"
							label="Par Value"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="total value"
							type="text"
							placeholder="Total Value"
							label="Total Value"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="par value"
							type="text"
							placeholder="Par Value"
							label="Par Value"
							required
						/>
					</div>
					<DateConverter
						form={form}
						name="issuedDate"
						labelNep="Issued Date in BS"
						labelEng="Issued Date in AD"
					/>
					<DateConverter
						form={form}
						name="maturityDate"
						labelNep="Maturity Date in BS"
						labelEng="Maturity Date in AD"
					/>
					<div className="space-y-2">
						<FormSelect
							name="coupon frequency"
							options={proposalRequiredFields?.branchList}
							label="Select coupon frequency"
							caption="Select coupon frequency"
							form={form}
							required
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="coupon rate"
							type="text"
							placeholder="Coupon Rate"
							label="Coupon Rate"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="coupon amount"
							type="text"
							placeholder="Coupon Amount"
							label="Coupon Amount"
							required
						/>
					</div>
					<DateConverter
						form={form}
						name="couponDate"
						labelNep="Coupon Date in BS"
						labelEng="Coupon Date in AD"
					/>
					<div className="space-y-2">
						<FormSelect
							name="debentureType"
							options={proposalRequiredFields?.branchList}
							label="Select Debenture Type"
							caption="Select Debenture Type"
							form={form}
							required
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="terms"
							type="text"
							placeholder="Terms"
							label="Terms"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="status"
							type="text"
							placeholder="Status"
							label="Status"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInputFile
							form={form}
							name="certificate"
							label={"Certificate"}
							fileNameField="certificateName"
							accept=".png,.jpg,.jpeg,.pdf"
							maxSize={5}
							validTypes={[
								"image/png",
								"image/jpg",
								"image/jpeg",
								"application/pdf",
							]}
						/>
					</div>
					<div className="space-y-2">
						<FormSwitch form={form} name="isactive" label="Is Active" />
					</div>
				</div>
			</div>
		</div>
	);
}
