"use client";

import KYCDetails from "@/app/(admin)/agent-training/components/kycDetails";
import { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { Button } from "@/components/ui/button";
import ImagePreview from "@/components/uiComponents/ImagePreview";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
		if (!kycData) return "Loading...";
		const value = kycData[field];
		return value?.toString() || "N/A";
	};
	return (
		<>
			<div className="bg-white rounded-lg border-1  mt-4">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Insured Details
					</h2>
					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									KYC Number:
									<span className="ml-1">
										<b>{kycData?.kycNumber}</b>
									</span>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									Branch:
									<span className="ml-1">
										<b>{kycData?.branchCode}</b>
									</span>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									Name:
									<span className="ml-1">
										<b>
											{kycData?.firstName} {kycData?.lastName}
										</b>
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									Nationality:
									<span className="ml-1">
										<b>{kycData?.nationality}</b>
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									DOB:
									<span className="ml-1">
										<b>{kycData?.dateOfBirth}</b>
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									Mobile No:
									<span className="ml-1">
										<b>{kycData?.mobileNumber}</b>
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									Email:
									<span className="ml-1">
										<b>{kycData?.email}</b>
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									Landline No:
									<span className="ml-1">
										<b>{kycData?.landLineNumber}</b>
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									Foreign Phone no:
									<span className="ml-1">
										<b>{kycData?.foreignPhone}</b>
									</span>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center text-gray-700 text-sm">
									Foreign Address:
									<span className="ml-1">
										<b>{kycData?.foreignAddress}</b>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-2 mt-4 gap-5 items-start">
				<div className="bg-white rounded-lg border-1">
					<div className="p-6">
						<h2 className="text-xl font-bold text-gray-800 mb-6">
							Endorsement Details
						</h2>
						<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
							<div className="grid grid-cols-1 gap-4 mb-6">
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Endorsement Id:
										<span className="ml-1">
											<b>{kycData?.kycNumber}</b>
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Endorsement Type:
										<span className="ml-1">
											<b>{kycData?.kycNumber}</b>
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Client Id:
										<span className="ml-1">
											<b>{kycData?.kycNumber}</b>
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Agent:
										<span className="ml-1">
											<b>{kycData?.kycNumber}</b>
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Endorsement Remarks:
										<span className="ml-1">
											<b>{kycData?.kycNumber}</b>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg border-1 ">
					<div className="p-6">
						<h2 className="text-xl font-bold text-gray-800 mb-6">
							Product Details
						</h2>
						<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
							<div className="grid grid-cols-1 gap-4 mb-6">
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Registration Date:
										<span className="ml-1">
											<b>{kycData?.kycNumber}</b>
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Product:
										<span className="ml-1">
											<b>{kycData?.kycNumber}</b>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-white rounded-lg border-1">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">Documents</h2>
					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="space-y-2">
								<ImagePreview
									label="Photo"
									imageUrl="photoFileUrl"
									displayData={displayData}
								/>
							</div>
							<div className="space-y-2">
								<ImagePreview
									label="Citizenship Front"
									imageUrl="citizenshipFrontFileUrl"
									displayData={displayData}
								/>
							</div>
							<div className="space-y-2">
								<ImagePreview
									label=" Citizenship Back"
									imageUrl="citizenshipBackFileUrl"
									displayData={displayData}
								/>
							</div>
							<div className="space-y-2">
								<ImagePreview
									label="Passport"
									imageUrl="passportFileUrl"
									displayData={displayData}
								/>
							</div>
							<div className="space-y-2">
								<ImagePreview
									label="Provident Fund"
									imageUrl="providentFundFileUrl"
									displayData={displayData}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex gap-4  p-6">
				<Button
					type="submit"
					className="cursor-pointer bg-green-600 hover:bg-black text-white text-sm py-2 px-6 rounded-md flex items-center"
				>
					Approve
				</Button>
				<Button
					type="submit"
					className="cursor-pointer bg-red-600 hover:bg-black text-white text-sm py-2 px-6 rounded-md flex items-center"
				>
					Reject
				</Button>
			</div>
		</>
	);
}
