import { useCallback, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";
import FormCombo from "../../../../../components/formElements/FormCombo";
import FormInput from "../../../../../components/formElements/FormInput";
import FormInputNepali from "../../../../../components/formElements/FormInputNepali";
import FormSelect from "../../../../../components/formElements/FormSelect";

type PersonalDetailsProps = {
	kycRequiredFields?: KycRequiredFields;
	form: UseFormReturn<AddEditKycDTO>;
};

export default function PersonalDetails({
	kycRequiredFields,
	form,
}: PersonalDetailsProps) {
	const kycNumberData = form.getValues("kycNumber");
	const dateOfBirth = form.watch("dateOfBirth");
	const getAge = useCallback(
		async (value: string) => {
			try {
				const submitData: PostCallData & {
					flag: string;
					search: string;
				} = {
					flag: "CalculateAge",
					search: value,
					endpoint: "get_utility_result",
				};

				const response = await apiPostCall(submitData);

				if (response && response.status === API_CONSTANTS.success) {
					form.setValue("age", response.data.data.toString());
				} else {
					alert(
						`Failed to convert Date: ${
							response?.data.message || "Unknown error"
						}`,
					);
				}
			} catch (error) {
				console.error("Error getting age", error);
				alert(`Error: ${error || "Failed to convert Date"}`);
			} finally {
			}
		},
		[form],
	);

	useEffect(() => {
		if (!dateOfBirth) {
			return;
		}
		getAge(dateOfBirth);
	}, [dateOfBirth, getAge]);

	const onlyAlphabets = useOnlyAlphabets();
	const onlyNumbers = useOnlyNumbers();

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Personal Information
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{kycNumberData && (
						<div className="space-y-2">
							<FormInput
								form={form}
								name="kycNumber"
								type="text"
								placeholder="KYC Number"
								label="KYC Number"
								disabled
							/>
						</div>
					)}
					<div className="space-y-2">
						<FormCombo
							name="branchCode"
							options={kycRequiredFields?.branchList}
							label="Branch"
							form={form}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormSelect
							name="residenceStatus"
							options={kycRequiredFields?.residenceStatusList}
							label="Residence Status"
							caption="Select Residence Status"
							form={form}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormCombo
							name="nationality"
							options={kycRequiredFields?.nationalityList}
							label="Nationality"
							form={form}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormSelect
							name="religion"
							options={kycRequiredFields?.religionList}
							label="Religion"
							caption="Select Religion"
							form={form}
						/>
					</div>

					<div className="space-y-2">
						<FormSelect
							name="salutation"
							options={kycRequiredFields?.salutationList}
							label="Salutation"
							caption="Select Salutation"
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
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="middleName"
							type="text"
							placeholder="Enter Middle Name"
							label="Middle Name"
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
						<FormInput
							disabled={true}
							form={form}
							name="age"
							type="text"
							placeholder="Age"
							label="Age"
							required={true}
						/>
					</div>

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
							name="birthPlace"
							type="text"
							placeholder="Enter Place of Birth"
							label="Place of Birth"
							required={true}
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormSelect
							name="maritalStatus"
							options={kycRequiredFields?.maritalStatusList}
							label="Marital Status"
							caption="Select Marital Status"
							form={form}
							required={true}
						/>
					</div>
				</div>
			</div>
			<h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
				Contact Information
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormInput
							form={form}
							name="mobileNumber"
							type="text"
							placeholder="Enter Mobile Number"
							label="Mobile Number"
							required={true}
							maxLength={10}
							onKeyDown={useOnlyNumbers()}
							disabled={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="email"
							type="text"
							placeholder="Enter Email"
							label="Email"
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="landLineNumber"
							type="text"
							placeholder="Enter Land Line Number"
							label="Land Line Number"
							onKeyDown={useOnlyNumbers()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="foreignPhone"
							type="text"
							placeholder="Enter Foreign Phone"
							label="Foreign Phone"
							maxLength={10}
							onKeyDown={useOnlyNumbers()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="foreignAddress"
							type="text"
							placeholder="Enter Foreign Address"
							label="Foreign Address"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
