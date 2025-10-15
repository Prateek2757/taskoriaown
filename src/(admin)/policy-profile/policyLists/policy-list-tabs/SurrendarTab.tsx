"use client";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { Button } from "@/components/ui/button";

export default function SurrenderTab() {
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
			<h2 className="text-xl font-semibold mb-4">Surrender Information</h2>
			<div className="p-4 bg-white w-1/2 border border-dashed border-gray-300 rounded-lg">
				<div className="flex flex-col gap-3">
					<div className="space-y-1">
						<div className="flex text-gray-700 text-sm">
							Surrender Amount:
							<span className="ml-1">
								<b>{displayData("kycNumber")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-1">
						<div className="flex text-gray-700 text-sm">
							Accured Bonus:
							<span className="ml-1">
								<b>{displayData("branchCode")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-1">
						<div className="flex text-gray-700 text-sm">
							Total Surrender Amount:
							<span className="ml-1">
								<b>{displayData("residenceStatus")}</b>
							</span>
						</div>
					</div>
				</div>
			</div>
			<Button className="mt-4">View Memo</Button>
		</div>
	);
}
