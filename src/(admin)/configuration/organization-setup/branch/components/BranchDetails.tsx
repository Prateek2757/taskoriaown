"use client";

import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";
import { UseFormReturn } from "react-hook-form";
import AddressSelect from "@/components/uiComponents/address-select/address-select";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { AddEditBranchDTO } from "../schemas/branchSchemas";

type BranchDetailsProps = {
	kycRequiredFields?: KycRequiredFields;
	form: UseFormReturn<AddEditBranchDTO>;
	isLoggedIn: boolean;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	branchTypeList?: { text: string; value: string }[];
	parentId?: string;
};

export default function BranchDetails({
	kycRequiredFields,
	form,
	branchTypeList = [],
	parentId,
}: BranchDetailsProps) {
	console.log("BranchDetails: kycRequiredFields =", kycRequiredFields);

	return (
		<div>
			<h2 className="text-xl font-bold text-gray-800 mb-6">Branch Details</h2>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<FormInput
						form={form}
						name="branchCode"
						type="text"
						label="Branch Code"
						placeholder="Enter Branch Code"
						required
					/>

					<FormInput
						form={form}
						name="parentId"
						type="text"
						label="Parent ID"
						placeholder="Parent ID"
						required
						disabled
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
						label="Branch Name"
						placeholder="Enter Branch Name"
						required
					/>

					<FormInputNepali
						form={form}
						name="branchNameLocal"
						type="text"
						label="Branch Name (Local)"
						placeholder="Enter Branch Name in Local"
						required
					/>

					<FormInput
						form={form}
						name="branchAddress"
						type="text"
						label="Branch Address"
						placeholder="Enter Branch Address"
						required
					/>

					<FormInputNepali
						form={form}
						name="branchAddressLocal"
						type="text"
						label="Branch Address (Local)"
						placeholder="Enter Branch Address in Local"
						required
					/>

					<FormInput
						form={form}
						name="branchPhoneNumber"
						type="text"
						label="Phone Number"
						placeholder="Enter Phone Number"
						required
						onKeyDown={useOnlyNumbers()}
					/>

					<FormInput
						form={form}
						name="branchFaxNumber"
						type="text"
						label="Fax Number"
						placeholder="Enter Fax Number"
						onKeyDown={useOnlyNumbers()}
					/>

					<FormInput
						form={form}
						name="branchEmail"
						type="email"
						label="Branch Email"
						placeholder="Enter Branch Email"
						required
					/>

					<FormInput
						form={form}
						name="managerName"
						type="text"
						label="Manager Name"
						placeholder="Enter Manager Name"
						required
						onKeyDown={useOnlyAlphabets()}
					/>

					<FormInput
						form={form}
						name="managerEmail"
						type="email"
						label="Manager Email"
						placeholder="Enter Manager Email"
						required
					/>

					<FormInput
						form={form}
						name="managerMobileNumber"
						type="text"
						label="Manager Mobile No"
						placeholder="Enter Manager Mobile No"
						required
						maxLength={10}
						onKeyDown={useOnlyNumbers()}
					/>
					<AddressSelect
						form={form}
						kycRequiredFields={kycRequiredFields}
						pName="permanentProvince"
						dName="permanentDistrict"
						mName="permanentMunicipality"
					/>

					<FormInput
						form={form}
						name="extensionNo"
						type="number"
						label="Extension Number"
						placeholder="Enter Extension Number"
						onKeyDown={useOnlyNumbers()}
					/>

					<FormInput
						form={form}
						name="latitude"
						type="text"
						label="Latitude"
						placeholder="Enter Latitude"
					/>

					<FormInput
						form={form}
						name="longitude"
						type="text"
						label="Longitude"
						placeholder="Enter Longitude"
					/>
					<FormSwitch label="Is Active" name="isActive" form={form} />
				</div>
			</div>
		</div>
	);
}
