import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";
import FormCombo from "../../../../../components/formElements/FormCombo";
import FormInput from "../../../../../components/formElements/FormInput";

type IdentificationDetailsProps = {
	kycRequiredFields?: KycRequiredFields;
	form: UseFormReturn<AddEditKycDTO>;
};

export default function IdentificationDetails({
	kycRequiredFields,
	form,
}: IdentificationDetailsProps) {
	const [isCitizenship, setIsCitizenship] = useState(false);
	const identityDocumentType = form.watch("identityDocumentType");
	console.log("identityDocumentType", isCitizenship);
	useEffect(() => {
		if (identityDocumentType === "CTZNP") {
			setIsCitizenship(true);
			console.log("identityDocumentNumber", identityDocumentType);
			form.setValue("identityDocumentNumber", form.watch("citizenShipNumber"));
			form.setValue(
				"identityDocumentIssuedDistrict",
				form.watch("citizenShipNumberIssuedDistrict"),
			);
			form.setValue(
				"identityDocumentIssuedDate",
				form.watch("citizenShipNumberIssuedDate"),
			);
			form.setValue(
				"identityDocumentIssuedDateLocal",
				form.watch("citizenShipNumberIssuedDateLocal"),
			);
		} else {
			setIsCitizenship(false);
			form.setValue("identityDocumentNumber", "");
			form.setValue("identityDocumentIssuedDistrict", "");
			form.setValue("identityDocumentIssuedDate", "");
			form.setValue("identityDocumentIssuedDateLocal", "");
		}
	}, [identityDocumentType, form]);

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Identification Details
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormInput
							form={form}
							name="citizenShipNumber"
							type="text"
							placeholder="Enter citizenship number"
							label="Citizenship No."
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormCombo
							form={form}
							name="citizenShipNumberIssuedDistrict"
							options={kycRequiredFields?.districtList}
							label="Issued District"
							required={true}
						/>
					</div>

					<DateConverter
						form={form}
						name="citizenShipNumberIssuedDate"
						labelNep="Citizenship Issued Date (BS)"
						labelEng="Citizenship Issued Date (AD)"
					/>

					<div className="space-y-2">
						<FormCombo
							form={form}
							name="identityDocumentType"
							options={kycRequiredFields?.identityDocumentTypeList}
							label="Identification Type"
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="identityDocumentNumber"
							type="text"
							placeholder="Enter identification number"
							label="Identification No."
							disabled={isCitizenship}
							onKeyDown={useOnlyNumbers()}
						/>
					</div>

					<div className="space-y-2">
						<FormCombo
							form={form}
							name="identityDocumentIssuedDistrict"
							options={kycRequiredFields?.districtList}
							label="Issued District"
							disabled={isCitizenship}
						/>
					</div>

					<DateConverter
						form={form}
						name="identityDocumentIssuedDate"
						labelNep="Identification Issued Date (BS)"
						labelEng="Identification Issued Date (AD)"
						disabled={isCitizenship}
					/>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="nationalIdentityNumber"
							type="text"
							placeholder="Enter national identity number"
							label="National Identity Number"
							onKeyDown={useOnlyNumbers()}
						/>
					</div>
				</div>
			</div>

			<h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
				Qualification Details
			</h2>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormCombo
							form={form}
							name="qualification"
							options={kycRequiredFields?.qualificationList}
							label="Qualification"
							required={true}
						/>
					</div>
				</div>
			</div>

			<h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
				Associated Profession / Business Information
			</h2>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormCombo
							form={form}
							name="profession"
							options={kycRequiredFields?.professionList}
							label="Profession"
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="companyName"
							type="text"
							placeholder="Enter company name"
							label="Company Name"
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="companyAddress"
							type="text"
							placeholder="Enter company address"
							label="Company Address"
						/>
					</div>

					<div className="space-y-2">
						<FormCombo
							form={form}
							name="incomeMode"
							options={kycRequiredFields?.incomeModeList}
							label="Income Mode"
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="incomeAmount"
							type="text"
							placeholder="Enter income amount"
							label="Income Amount"
							onKeyDown={useOnlyNumbers()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="panNumber"
							type="text"
							placeholder="Enter PAN number"
							label="Pan No."
							onKeyDown={useOnlyNumbers()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="pfNumber"
							type="text"
							placeholder="Enter PF number"
							label="PF No."
							onKeyDown={useOnlyNumbers()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="citNumber"
							type="text"
							placeholder="Enter CIT number"
							label="CIT No."
							onKeyDown={useOnlyNumbers()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="ssfNumber"
							type="text"
							placeholder="Enter SSF number"
							label="SSF No."
							onKeyDown={useOnlyNumbers()}
						/>
					</div>
				</div>
			</div>

			<h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
				Bank Details
			</h2>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormCombo
							name="bankName"
							options={kycRequiredFields?.bankList}
							label="Bank Name"
							form={form}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="bankAccountNumber"
							type="text"
							placeholder="Enter Bank Account Number"
							label="Bank Account Number"
							required={true}
							onKeyDown={useOnlyNumbers()}
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="bankAccountName"
							type="text"
							placeholder="Enter Bank Account Name"
							label="Bank Account Name"
							required={true}
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="bankBranchCode"
							type="text"
							placeholder="Enter Bank Branch"
							label="Bank Branch"
							required={true}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
