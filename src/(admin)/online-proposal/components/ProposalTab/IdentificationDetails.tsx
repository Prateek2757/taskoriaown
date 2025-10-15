import { useCallback, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditOnlineProposalDTO } from "@/app/(admin)/online-proposal/onlineProposalSchema";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useOnlyNumbers } from "@/hooks/useInputValidation";
import FormCombo from "../../../../../components/formElements/FormCombo";
import FormInput from "../../../../../components/formElements/FormInput";

type IdentificationDetailsProps = {
	proposalRequiredFields?: ProposalRequiredFields;
	form: UseFormReturn<AddEditOnlineProposalDTO>;
	isLoggedIn: boolean;
	locale?: "en" | "ne"; // Optional locale prop, if needed
	onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
};

export default function IdentificationDetails({
	proposalRequiredFields,
	form,
	isLoggedIn,
	locale = "en", // Default to 'en' if not provided
}: IdentificationDetailsProps) {
	const [districtList, setDistrictList] = useState<SelectOption[]>([]);

	const getDistrict = useCallback(async () => {
		try {
			const submitData: PostCallData & {
				flag: string;
				// search: string;
				// extra: string;
			} = {
				flag: "DistrictAutoComplete",
				// search: '',
				// extra: value,
				endpoint: "get_utility_dropdown",
			};

			const response = await apiPostCall(submitData, isLoggedIn);

			if (response && response.status === API_CONSTANTS.success) {
				setDistrictList(response.data);
			} else {
				alert(`Failed to Get District: ${response || "Unknown error"}`);
			}
		} catch (error) {
			alert(`Error: ${error || "Failed to Get District"}`);
		} finally {
			console.log("District got successfully");
		}
	}, [isLoggedIn]);

	useEffect(() => {
		getDistrict();
	}, [getDistrict]);

	const onlyNumbers = useOnlyNumbers();

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				{locale === "ne" ? "पहिचान विवरण" : "Identification Details"}
			</h2>

			<div className=" border-blue-200 rounded-lg pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormCombo
							form={form}
							name="identityDocumentType"
							options={proposalRequiredFields?.documentTypeList}
							label={`${locale === "ne" ? "कागजात प्रकार" : " Document Type"}`}
							language={locale}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormCombo
							form={form}
							name="identityDocumentIssuedDistrict"
							options={districtList}
							label={`${locale === "ne" ? " जारी जिल्ला" : " Issued District"}`}
							language={locale}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="identityDocumentNumber"
							type="text"
							placeholder={`${
								locale === "ne"
									? "पहिचान नम्बर लेख्नुहोस्"
									: "Enter Identification Number"
							}`}
							label={`${
								locale === "ne" ? "पहिचान  नम्बर" : "Identification  Number"
							}`}
							required={true}
							onKeyDown={onlyNumbers}
						/>
					</div>

					<DateConverter
						form={form}
						name="identityDocumentIssuedDate"
						labelNep={
							locale === "ne"
								? "पहिचान जारी मिति (BS)"
								: "Identification Issued Date (BS)"
						}
						labelEng={`${
							locale === "ne"
								? "पहिचान जारी मिति (AD)"
								: "Identification Issued Date (AD)"
						}`} // labelEng="Identification Issued Date (AD)"
					/>
				</div>
			</div>
		</>
	);
}

// export default IdentificationDetails;
