import { Button } from "@/components/ui/button";
import type { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type LoanList = {
	loanId: string;
	loanDate: string;
	loanAmount: string;
	lastPaidDate: string;
	status: "NEW" | "VERIFIED" | "DELETED";
	policyNumber: string;
};

export const PolicyInformation = () => {
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

	const searchOptions = [
		{
			placeholder: "Filter Name",
			name: "FullName",
			type: "text",
		},
		{
			placeholder: "Mobile Number",
			name: "MobileNumber",
			type: "tel",
		},
	];

	const createLoanColumns = (): ColumnDef<LoanList>[] => [
		{
			accessorKey: "rider",
			header: "Rider",
			cell: ({ row }) => {
				const rider = row.getValue("rider");
				return (
					<Badge
						variant="secondary"
						className="bg-green-500 text-white dark:bg-green-600"
					>
						{rider?.toString()}
					</Badge>
				);
			},
		},
		{
			accessorKey: "riderSa",
			header: "Rider SA",
		},
		{
			accessorKey: "term",
			header: "Term",
		},
		{
			accessorKey: "payTerm",
			header: "PayTerm",
		},
		{
			accessorKey: "Premium",
			header: "PayTerm",
		},
	];

	return (
		<div className="p-6">

			<h2 className="text-xl font-bold mb-3">Premium Information</h2>
			<div className="border border-dashed border-gray-300 rounded-lg p-0 md:px-6 pt-4 ">
				<div className="grid grid-cols-1 md:grid-cols-3  gap-4 mb-6">
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Proposal No:
							<span className="ml-1">
								<b>{displayData("kycNumber")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Policy No:
							<span className="ml-1">
								<b>{displayData("branchCode")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Agent Code:
							<span className="ml-1">
								<b>{displayData("residenceStatus")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Product:
							<span className="ml-1">
								<b>{displayData("nationality")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Policy Term:
							<span className="ml-1">
								<b>{displayData("religion")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							PayTerm:
							<span className="ml-1">
								<b>{displayData("salutation")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Mode Of Payment:
							<span className="ml-1">
								<b>{displayData("firstName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Date Of Birth:
							<span className="ml-1">
								<b>{displayData("middleName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Age:
							<span className="ml-1">
								<b>{displayData("lastName")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Next Due Date:
							<span className="ml-1">
								<b>{displayData("lastName")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Date Of Commencement:
							<span className="ml-1">
								<b>{displayData("lastName")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Date Of Maturity:
							<span className="ml-1">
								<b>{displayData("lastName")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Sum Assured:
							<span className="ml-1">
								<b>{displayData("lastName")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Current Status:
							<span className="ml-1">
								<b>{displayData("lastName")}</b>
							</span>
						</div>
					</div>
				</div>
			</div>
			<h2 className="text-xl font-bold my-3">Premium Summary</h2>
			<div className="border border-dashed border-gray-300 rounded-lg p-0 md:px-6 pt-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Basic Premium:
							<span className="ml-1">
								<b>{displayData("kycNumber")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Health Extra Amount:
							<span className="ml-1">
								<b>{displayData("branchCode")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Occupation Extra Amount:
							<span className="ml-1">
								<b>{displayData("residenceStatus")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Non Standard Age Extra Amount:
							<span className="ml-1">
								<b>{displayData("nationality")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Extra Premium:
							<span className="ml-1">
								<b>{displayData("religion")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Extra Discount:
							<span className="ml-1">
								<b>{displayData("salutation")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Net Premium:
							<span className="ml-1">
								<b>{displayData("firstName")}</b>
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-3 mt-4">
				<Button className="bg-blue-500">Underwriting Sheet</Button>
				<Button className="bg-green-500">Policy Print</Button>
			</div>
			<div>
				<div>
					<DataTable
						searchOptions={searchOptions}
						columns={createLoanColumns}
						endpoint="kyc_list"
					/>
				</div>
			</div>
		</div>
	);
};
