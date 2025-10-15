import type { AddEditOnlineProposalDTO } from "@/app/(admin)/online-proposal/onlineProposalSchema";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";

import { useCallback, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormCombo from "../../../../../components/formElements/FormCombo";
import FormInput from "../../../../../components/formElements/FormInput";
import FormSelect from "../../../../../components/formElements/FormSelect";
import AddressSelect from "../../../../../components/uiComponents/address-select/address-select";

type PersonalDetailsProps = {
	proposalRequiredFields?: ProposalRequiredFields;
	form: UseFormReturn<AddEditOnlineProposalDTO>;
	isLoggedIn: boolean;
	locale?: "en" | "ne"; // Optional locale prop, if needed
	// dict?: any; // Dictionary for translations, if needed
	onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
};

export default function PersonalDetails({
	// dict,
	proposalRequiredFields,
	form,
	isLoggedIn,
	locale,
}: PersonalDetailsProps) {
	const [wardNoList, setWardNoList] = useState<SelectOption[]>([]);
	const proposalNumberData = form.getValues("proposalNumber");
	const dateOfBirth = form.watch("dateOfBirth");
	const getAge = useCallback(
		async (value: Date) => {
			try {
				const submitData: PostCallData & {
					flag: string;
					search: Date;
				} = {
					flag: "CalculateAge",
					search: value,
					endpoint: "get_utility_result",
				};

				const response = await apiPostCall(submitData, isLoggedIn);

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
		[form, isLoggedIn],
	);

	const onlyNumbers = useOnlyNumbers();
	const onlyAlphabets = useOnlyAlphabets();

	const getWardNo = useCallback(async () => {
		try {
			const submitData: PostCallData & {
				flag: string;
			} = {
				flag: "WardNoAutoComplete",
				endpoint: "get_utility_dropdown",
			};

			const response = await apiPostCall(submitData, isLoggedIn);
			console.log("ward number list", response);

			if (response && response.status === API_CONSTANTS.success) {
				setWardNoList(response.data);
			} else {
				alert(`Failed to get Ward Number List: ${response || "Unknown error"}`);
			}
		} catch (error) {
			alert(`Error: ${error || "Failed to get Ward Number List"}`);
		} finally {
			console.log("Ward Number List got successfully");
		}
	}, [isLoggedIn]);

	useEffect(() => {
		getWardNo();
	}, [getWardNo]);

	useEffect(() => {
		if (!dateOfBirth) {
			return;
		}
		getAge(dateOfBirth);
	}, [dateOfBirth, getAge]);

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				{locale === "ne" ? "व्यक्तिगत विवरण" : "Personal Information"}
			</h2>

			<div className=" border-blue-200 rounded-lg pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{proposalNumberData && (
						<div className="space-y-2">
							<FormInput
								form={form}
								name="proposalNumber"
								type="text"
								placeholder={
									locale === "ne" ? "प्रस्ताव नम्बर" : "Proposal Number"
								}
								label={locale === "ne" ? "प्रस्ताव नम्बर" : "Proposal Number"}
								disabled
								onKeyDown={onlyNumbers}
							/>
						</div>
					)}
					<div className="space-y-2">
						<FormInput
							form={form}
							name="firstName"
							type="text"
							placeholder={
								locale === "ne" ? "पहिलो नाम लेख्नुहोस्" : "Enter First Name"
							}
							label={locale === "ne" ? "पहिलो नाम" : "First Name"}
							onKeyDown={onlyAlphabets}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="middleName"
							type="text"
							placeholder={
								locale === "ne" ? "मध्य नाम लेख्नुहोस्" : "Enter Middle Name"
							}
							label={locale === "ne" ? "मध्य नाम" : "Middle Name"}
							onKeyDown={onlyAlphabets}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="lastName"
							type="text"
							placeholder={locale === "ne" ? "थर लेख्नुहोस्" : "Enter Last Name"}
							label={locale === "ne" ? "थर" : "Last Name"}
							required={true}
							onKeyDown={onlyAlphabets}
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="mobileNumber"
							type="text"
							placeholder={
								locale === "ne" ? "मोबाइल नम्बर लेख्नुहोस्" : "Enter Mobile Number"
							}
							label={locale === "ne" ? "मोबाइल नम्बर" : "Mobile Number"}
							required={true}
							maxLength={10}
							onKeyDown={onlyNumbers}
						/>
					</div>
					<DateConverter
						form={form}
						name="dateOfBirth"
						labelNep={locale === "ne" ? "वि.सं. मा जन्म मिति" : "DOB in BS"}
						labelEng={locale === "ne" ? "ई.सं. मा जन्म मिति" : "DOB in AD"}
					/>

					<AddressSelect
						form={form}
						kycRequiredFields={
							proposalRequiredFields as unknown as KycRequiredFields
						}
						pName="provinceId"
						dName="districtId"
						mName="municipalityId"
					/>
					<div className="space-y-2">
						<FormCombo
							form={form}
							name="wardNumber"
							options={wardNoList}
							language={locale}
							label={locale === "ne" ? "वार्ड नम्बर" : "Ward Number"}
						/>
					</div>

					<div className="space-y-2">
						<FormSelect
							name="gender"
							options={proposalRequiredFields?.genderList}
							label={locale === "ne" ? "लिङ्ग" : "Gender"}
							caption={locale === "ne" ? "लिङ्ग छान्नुहोस्" : "Select Gender"}
							form={form}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormSelect
							name="maritalStatus"
							options={proposalRequiredFields?.maritalStatusList}
							label={locale === "ne" ? "वैवाहिक स्थिति" : "Marital Status"}
							caption={
								locale === "ne"
									? "वैवाहिक स्थिति छान्नुहोस्"
									: "Select Marital Status"
							}
							form={form}
							required={true}
						/>
					</div>
					<div className="space-y-2">
						<FormCombo
							form={form}
							name="qualification"
							language={locale}
							options={proposalRequiredFields?.qualificationList}
							label={locale === "ne" ? "शैक्षिक योग्यता" : "Qualification"}
							required={true}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
