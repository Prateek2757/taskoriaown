"use client";

import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { useOnlyNumbers } from "@/hooks/useInputValidation";
import { UseFormReturn } from "react-hook-form";
import { AddEditBranchDTO } from "../schemas/branchSchemas";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import { FormSwitch } from "@/components/formElements/FormSwitch";

type corporateDetailsProps = {
	kycRequiredFields?: KycRequiredFields;
	form: UseFormReturn<AddEditBranchDTO>;
	isLoggedIn: boolean;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	branchTypeList?: { text: string; value: string }[];
	parentId?: string;
};

export default function CorporateDetails({
	kycRequiredFields,
	form,
	branchTypeList = [],
	parentId,
}: corporateDetailsProps) {
	console.log("BranchDetails: kycRequiredFields =", kycRequiredFields);

	return (
		<div>
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Corporate Branch Details
			</h2>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<FormInput
						form={form}
						name="branchCode"
						type="text"
						label=" Corporate Branch Code"
						placeholder="Enter Corporate Branch Code"
						required
					/>

					<FormSelect
						form={form}
						name="branchType"
						options={branchTypeList}
						label="Branch Type"
						caption="Select Branch Type"
						required
					/>

					<FormInput
						form={form}
						name="branchName"
						type="text"
						label=" Corporate Branch Name"
						placeholder="Enter Corporate Branch Name"
						required
					/>

					<FormInputNepali
						form={form}
						name="branchNameLocal"
						type="text"
						label="Corporate Branch Name (Local)"
						placeholder="Enter Corporate Branch Name in Local"
						required
					/>

					<FormInput
						form={form}
						name="branchAddress"
						type="text"
						label="Corporate Branch Address"
						placeholder="Enter Corporate Branch Address"
						required
					/>

					<FormInputNepali
						form={form}
						name="branchAddressLocal"
						type="text"
						label="Corporate Branch Address (Local)"
						placeholder="Enter Corporate Branch Address in Local"
						required
					/>

					<FormInput
						form={form}
						name="branchPhoneNumber"
						type="text"
						label="Corporate Phone Number"
						placeholder="Enter Corporate Phone Number"
						required
						onKeyDown={useOnlyNumbers()}
					/>

					<FormInput
						form={form}
						name="branchFaxNumber"
						type="text"
						label="Corporate Fax Number"
						placeholder="Enter Corporate Fax Number"
						onKeyDown={useOnlyNumbers()}
					/>

					<FormInput
						form={form}
						name="branchEmail"
						type="email"
						label="Corporate Branch Email"
						placeholder="Enter Corporate Branch Email"
						required
					/>

					<FormInput
						form={form}
						name="extensionNo"
						type="number"
						label="Corporate Extension Number"
						placeholder="Enter Extension Number"
						onKeyDown={useOnlyNumbers()}
					/>

					<FormInput
						form={form}
						name="latitude"
						type="number"
						label="Corporate Latitude"
						placeholder="Enter Corporate Latitude"
					/>

					<FormInput
						form={form}
						name="longitude"
						type="number"
						label="Longitude"
						placeholder="Enter Longitude"
					/>
					<FormSwitch label="Is Active" name="isActive" form={form} />
				</div>
			</div>
		</div>
	);
}
