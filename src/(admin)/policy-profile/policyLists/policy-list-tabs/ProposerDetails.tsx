// import PersonalInfo from "../../personal-information/components/PersonalInfo";
// import PersonDetails from "../components/PersonDetails"
// import PersonDetails2 from "../components/PersonDetails2";

import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";

export default function ProposerDetails() {
	const [kycData, setKycData] = useState<AddEditKycWithFileDTO>();
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const kycNumber = params.kycNumber;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = {
					KYCNumberEncrypted: kycNumber || null,
					endpoint: "kyc_view",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is form response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setKycData(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Kyc Detail data:", error);
			} finally {
				setLoading(false);
			}
		};
		if (kycNumber) {
			fetchData();
		}
	}, [kycNumber]);

	const displayData = (field: keyof AddEditKycWithFileDTO): string => {
		if (!kycData) return "N/A";
		const value = kycData[field];
		return value?.toString() || "N/A";
	};

	return (
		<div className="p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-3">Personal Details</h2>

			<div className="md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Name:
							<span className="ml-1">
								<b>{displayData("agentCode")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Email:
							<span className="ml-1">
								<b>{displayData("email")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Status:
							<span className="ml-1">
								<b>{displayData("status")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Age:
							<span className="ml-1">
								<b>{displayData("residenceStatus")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Gender:
							<span className="ml-1">
								<b>{displayData("nationality")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Mobile Number:
							<span className="ml-1">
								<b>{displayData("mobileNumber")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Address:
							<span className="ml-1">
								<b>{displayData("address")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Date Of Birth:
							<span className="ml-1">
								<b>{displayData("dateOfBirth")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Nationality:
							<span className="ml-1">
								<b>{displayData("nationality")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							CitizenShip No:
							<span className="ml-1">
								<b>{displayData("citizenshipNo")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Qualification:
							<span className="ml-1">
								<b>{displayData("qualification")}</b>
							</span>
						</div>
					</div>
				</div>
			</div>

			<h2 className="text-xl font-bold text-gray-800 mb-3 mt-3">
				Family Details
			</h2>

			<div className="md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Father&apos;s Name:
							<span className="ml-1">
								<b>{displayData("fatherName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Mother&apos;s Name:
							<span className="ml-1">
								<b>{displayData("motherName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Grand Father&apos;s Name:
							<span className="ml-1">
								<b>{displayData("grandFatherName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Spouse Name:
							<span className="ml-1">
								<b>{displayData("spouseName")}</b>
							</span>
						</div>
					</div>
				</div>
			</div>

			<h2 className="text-xl font-bold text-gray-800 mb-3 mt-3">
				Associated Profession / Business Information
			</h2>
			<div className="md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Profession:
							<span className="ml-1">
								<b>{displayData("profession")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Company Name:
							<span className="ml-1">
								<b>{displayData("companyName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Company Address:
							<span className="ml-1">
								<b>{displayData("companyAddress")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Income Amount:
							<span className="ml-1">
								<b>{displayData("incomeAmount")}</b>
							</span>
						</div>
					</div>
				</div>
			</div>
			{/* <PersonDetails />
            <PersonalInfo />
            <PersonDetails2 /> */}
		</div>
	);
}
