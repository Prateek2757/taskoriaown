import { useCallback, useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import AddressSelect from "@/components/uiComponents/address-select/address-select";

type GeneralDetailsProps = {
	kycRequiredFields?: KycRequiredFields;
	form: UseFormReturn<AddEditKycDTO>;
	setClientVerification: (value: boolean) => void;
	setMobileVerification: (value: boolean) => void;
	futureData: boolean;
};

export default function ChildDetails({
	kycRequiredFields,
	form,
}: GeneralDetailsProps) {
	const DEBOUNCE_DELAY = 500;
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const dateOfBirth = form.watch("dateOfBirth");
	const firstName = form.watch("firstName");
	const lastName = form.watch("lastName");
	const age = form.watch("age");
	const fatherName = form.watch("fatherName");
	const gender = form.watch("gender");
	const permanentDistrict = form.watch("permanentDistrict");
	const mobileNumber = form.watch("mobileNumber");

	return (
		<>
			<div className="bg-white rounded-lg border mb-6 mt-4 justify-start">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Child Details
					</h2>

					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							{/* {!kycNumberData && ( */}
							<div className="space-y-2">
								<FormSelect
									name="gender"
									options={kycRequiredFields?.genderList}
									label="Nationality"
									caption="Select Nationality"
									form={form}
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormSelect
									name="Salutation"
									options={kycRequiredFields?.genderList}
									label="Salutation"
									caption="Select Salutation"
									form={form}
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormSelect
									name="Relationship"
									options={kycRequiredFields?.genderList}
									label="Relationship"
									caption="Select Relationship"
									form={form}
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="firstName"
									type="text"
									placeholder="Enter first name"
									label="First Name"
									required={true}
									onKeyDown={useOnlyAlphabets()}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="middleName"
									type="text"
									placeholder="Enter Middle Name"
									label="Middle Name"
									onKeyDown={useOnlyAlphabets()}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="lastName"
									type="text"
									placeholder="Enter Last Name"
									label="Last Name"
									required={true}
									onKeyDown={useOnlyAlphabets()}
								/>
							</div>
							<div className="space-y-2">
								<FormInputNepali
									form={form}
									name="nameLocal"
									type="text"
									placeholder="Enter Full Name in Nepali"
									label="Full Name in Nepali"
									required={true}
								/>
							</div>
							<DateConverter
								form={form}
								name="dateOfBirth"
								labelNep="DOB in BS"
								labelEng="DOB in AD"
							/>
							<div className="space-y-2">
								<FormSelect
									name="gender"
									options={kycRequiredFields?.genderList}
									label="Gender"
									caption="Select Gender"
									form={form}
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="birthplace"
									type="text"
									placeholder="Enter Birthplace"
									label="Birthplace"
									required={true}
									onKeyDown={useOnlyAlphabets()}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="fatherName"
									type="text"
									placeholder="Father Name"
									label="Father Name"
									required={true}
									onKeyDown={useOnlyAlphabets()}
								/>
							</div>
							<div className="space-y-2">
								<FormInputNepali
									form={form}
									name="fatherNameLocals"
									type="text"
									placeholder="Enter father's name in Nepali"
									label="Father Name (Nepali)"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="motherName"
									type="text"
									placeholder="Enter mother's name"
									label="Mother Name"
									required={true}
									onKeyDown={useOnlyAlphabets()}
								/>
							</div>

							<div className="space-y-2">
								<FormInputNepali
									form={form}
									name="motherNameLocal"
									type="text"
									placeholder="Enter mother's name in Nepali"
									label="Mother Name (Nepali)"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormCombo
									name="permanentProvince"
									options={kycRequiredFields?.provinceList}
									label="Permanent Province"
									form={form}
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormCombo
									name="permanentDistrict"
									options={kycRequiredFields?.districtList}
									label="Permanent District"
									form={form}
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormCombo
									name="permanentMunicipality"
									options={kycRequiredFields?.municipalityList}
									label="Permanent Municipality"
									form={form}
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormCombo
									name="TemporaryProvince"
									options={kycRequiredFields?.provinceList}
									label="Temporary Province"
									form={form}
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormCombo
									name="TemporaryDistrict"
									options={kycRequiredFields?.districtList}
									label="Temporary District"
									form={form}
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormCombo
									name="TemporaryMunicipality"
									options={kycRequiredFields?.municipalityList}
									label="Temporary Municipality"
									form={form}
									required={true}
								/>
							</div>
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
									onKeyDown={useOnlyNumbers()}
								/>
							</div>

							<div className="space-y-2">
								<FormCombo
									form={form}
									name="identityDocumentIssuedDistrict"
									options={kycRequiredFields?.districtList}
									label="Identification Issued District"
								/>
							</div>

							<DateConverter
								form={form}
								name="identityDocumentIssuedDate"
								labelNep="Identification Issued Date (BS)"
								labelEng="Identification Issued Date (AD)"
							/>
						</div>

						{/* )} */}
					</div>
				</div>
			</div>
		</>
	);
}
