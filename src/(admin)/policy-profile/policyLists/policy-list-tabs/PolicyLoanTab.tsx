"use client";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";

export type LoanList = {
	loanId: string;
	loanDate: string;
	loanAmount: string;
	lastPaidDate: string;
	status: "NEW" | "VERIFIED" | "DELETED";
	policyNumber: string;
};

type ActionCellProps = {
	row: Row<LoanList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
	const loan = row.original;
	const router = useRouter();

	return (
		<div className="flex gap-1">
			<Button
				variant="outline"
				onClick={() => router.push(`/policy-loan/view/${loan.policyNumber}`)}
				className="cursor-pointer"
				title="View Loan Details"
			>
				Statement
			</Button>
		</div>
	);
};

export default function PolicyLoanTab() {
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

	const createLoanColumns = (
		pageIndex: number,
		pageSize: number,
	): ColumnDef<LoanList>[] => [
		{
			accessorKey: "loanId",
			header: "Loan ID",
			cell: ({ row }) => {
				const dynamicSN = pageIndex * pageSize + row.index + 1;
				return <div>{dynamicSN}</div>;
			},
		},
		{
			accessorKey: "loanDate",
			header: "Loan Date",
		},
		{
			accessorKey: "loanAmount",
			header: "Loan Amount",
		},
		{
			accessorKey: "lastPaidDate",
			header: "Last Paid Date",
		},
		{
			accessorKey: "policyNumber",
			header: "Policy Number",
		},
		{
			accessorKey: "status",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Status
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const status = row.original.status;
				switch (status) {
					case "NEW":
						return <Badge variant="secondary">{status}</Badge>;

					case "VERIFIED":
						return (
							<Badge
								variant="secondary"
								className="bg-green-500 text-white dark:bg-green-600"
							>
								{status}
							</Badge>
						);

					case "DELETED":
						return <Badge variant="destructive">{status}</Badge>;

					default:
						return <Badge variant="outline">{status}</Badge>;
				}
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => <ActionsCell row={row} />,
		},
	];

	return (
		<div className="p-6 grid grid-cols-[1fr_2fr] gap-5 items-start">
			<div className="">
					<h2 className="text-xl font-semibold mb-3">
						Policy Loan Information
					</h2>
				<div className="p-4 bg-white border border-dashed border-gray-300 rounded-lg mt-3 mb-3">
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
						<div className="space-y-1">
							<div className="flex text-gray-700 text-sm">
								Eligible Loan Amount:
								<span className="ml-1">
									<b>{displayData("residenceStatus")}</b>
								</span>
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex text-gray-700 text-sm">
								Principle Loan:
								<span className="ml-1">
									<b>{displayData("residenceStatus")}</b>
								</span>
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex text-gray-700 text-sm">
								Current Interest:
								<span className="ml-1">
									<b>{displayData("residenceStatus")}</b>
								</span>
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex text-gray-700 text-sm">
								Installment Paid:
								<span className="ml-1">
									<b>{displayData("residenceStatus")}</b>
								</span>
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex text-gray-700 text-sm">
								Principal Paid:
								<span className="ml-1">
									<b>{displayData("residenceStatus")}</b>
								</span>
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex text-gray-700 text-sm">
								Total Interest Paid:
								<span className="ml-1">
									<b>{displayData("residenceStatus")}</b>
								</span>
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex text-gray-700 text-sm">
								Total Actual Available Loan Amount:
								<span className="ml-1">
									<b>{displayData("residenceStatus")}</b>
								</span>
							</div>
						</div>
					</div>
				</div>

				<div>
					<Button> View Memo</Button>
				</div>
			</div>
			<div>
				<DataTable
					searchOptions={searchOptions}
					columns={createLoanColumns}
					endpoint="kyc_list"
				/>
			</div>
		</div>
	);
}
