"use client";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
	ArrowUpDown,
	Banknote,
	Eye,
	Pencil,
	RefreshCcw,
	Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type CommissionList = {
	rowId: number;
	firstName: string;
	lastName: string;
	payTerm: string;
	premium: string;
	sumAssured: string;
	term: string;
	status: "ISSUED" | "NEW" | "DELETED";
	paymentStatus: "NEW" | "COMPLETE";
	proposalNumber: string;
	proposalNumberEncrypted: string;
};

type ActionCellProps = {
	row: Row<ProposalList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
	const policyRow = row.original;
	const router = useRouter();

	const esewaRecheck = async (row) => {
		const url = `/api/esewa-recheck?total_amount=${row.premium}&transaction_uuid=${row.referenceId}`;
		try {
			const response = await fetch(url);
			const resultText = await response.text();

			let parsedData: any;

			try {
				parsedData = JSON.parse(resultText);
			} catch {
				parsedData = { raw: resultText };
			}
			if (resultText) {
				const encodedData = btoa(JSON.stringify(parsedData));
				router.push(
					`/online-proposal/proposalpayment/paymentresponse?data=${encodedData}`,
				);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="flex gap-1">
			<Button
				variant="outline"
				size="icon"
				onClick={() =>
					router.push(
						`/online-proposal/view/${policyRow.proposalNumberEncrypted}`,
					)
				}
				className="cursor-pointer"
				title="View"
			>
				<Eye />
			</Button>

			{policyRow.status === "NEW" && (
				<>
					<Button
						variant="outline"
						size="icon"
						onClick={() =>
							router.push(
								`/online-proposal/edit/${policyRow.proposalNumberEncrypted}`,
							)
						}
						className="cursor-pointer"
						title="Edit"
					>
						<Pencil />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() =>
							router.push(
								`/online-proposal/proposalpayment/${policyRow.proposalNumberEncrypted}`,
							)
						}
						className="cursor-pointer"
						title="Payment"
					>
						<Banknote className="text-green-500" />
					</Button>
				</>
			)}
			{policyRow.status === "NEW" &&
				(policyRow.paymentStatus == "NEW" ||
					policyRow.paymentStatus == "COMPLETE") && (
					<Button
						variant="outline"
						size="icon"
						onClick={() => esewaRecheck(policyRow)}
						className="cursor-pointer"
						title="ReCheck Payment"
					>
						<RefreshCcw />
					</Button>
				)}
		</div>
	);
};

export const createProposalColumns = (
	pageIndex: number,
	pageSize: number,
): ColumnDef<CommissionList>[] => [
	
	{
		accessorKey: "productId",
		header: "Product ID",
	},
	{
		accessorKey: "min paying term",
		header: "Min Paying Term",
	},
	{
		accessorKey: "max paying term",
		header: "Max Paying Term",
	},
	{
		accessorKey: "min term",
		header: "Min Term",
	},
    {
		accessorKey: "max term",
		header: "Max Term",
	},
	{
		accessorKey: "year",
		header: "Year",
	},
    {
		accessorKey: "rate",
		header: "Rate",
	},
	{
		accessorKey: "isactive",
		header: "Is Active",
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => <ActionsCell row={row} />,
	},
];

export const columns: ColumnDef<CommissionList>[] = createProposalColumns(0, 25);
