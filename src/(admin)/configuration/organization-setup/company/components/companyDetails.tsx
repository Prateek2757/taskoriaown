"use client";

import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import type { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormInputFile from "@/components/formElements/FormInputFile";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	occupationList?: ProposalRequiredFields;
	proposalRequiredFields?: ProposalRequiredFields;
}

export default function CompanyDetails({
	form,
	proposalRequiredFields,
}: ProposalDetailProps) {
	return (
		<div className="p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">Company Details</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{/* Employee ID */}
					<div className="space-y-2">
						<FormInput
							form={form}
							name="companyName"
							type="text"
							placeholder="Company Name"
							label="Company Name"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInputNepali
							form={form}
							name="companyName (In Local)"
							type="text"
							placeholder="Company Name (In Local)"
							label="Company Name (In Local)"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="shortName"
							type="text"
							placeholder="Short Name"
							label="Short Name"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInputNepali
							form={form}
							name="shortName (In Local)"
							type="text"
							placeholder="Short Name (In Local)"
							label="Short Name (In Local)"
							required
						/>
					</div>

					{/* Branch (Select) */}
					<div className="space-y-2">
						<FormSelect
							name="country"
							options={proposalRequiredFields?.branchList}
							label="Select Country"
							caption="Select Country"
							form={form}
							required
						/>
					</div>

					{/* First Name */}
					<div className="space-y-2">
						<FormInput
							form={form}
							name="companyAddress"
							type="text"
							placeholder="Company Address"
							label="Company Address"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInputNepali
							form={form}
							name="companyAddress (In Local)"
							type="text"
							placeholder="Company Address (In Local)"
							label="Company Address (In Local)"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="currencycode"
							type="text"
							placeholder="Currency Code"
							label="Currency Code"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInputNepali
							form={form}
							name="currencycode (In Local)"
							type="text"
							placeholder="Currency Code (In Local)"
							label="Currency Code (In Local)"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInputFile
							form={form}
							name="companylogoInBase64"
							label={"Company Logo"}
							fileNameField="companylogoName"
							accept=".png,.jpg,.jpeg,.pdf"
							maxSize={5}
							validTypes={[
								"image/png",
								"image/jpg",
								"image/jpeg",
								"application/pdf",
							]}
							required={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
