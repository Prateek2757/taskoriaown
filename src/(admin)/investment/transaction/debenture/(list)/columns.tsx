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

export type FixedDepositAdjustmentList = {
	rowId: number;
	sn:number;
	clientid: number;
	issusingagency: string;
	agencytype: string;
	debenturename: string;
	parvalue: string;
	maturitydate: string;
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
): ColumnDef<FixedDepositAdjustmentList>[] => [

	{
		accessorKey: "sn",
        header: "S.N",
       
	},
	{
		accessorKey: "client id",
		header: "Client ID",
	},
	{
		accessorKey: "issuing agency",
		header: "Issuing Agency",
	},
	{
		accessorKey: "agency type",
		header: "Agency Type",
	},
    {
		accessorKey: "debenture name",
		header: "Debenture Name",
	},
    {
		accessorKey: "par value",
		header: "Par Value",
	},
    {
		accessorKey: "maturity date",
		header: "Maturity Date",
	},
    {
		accessorKey: "coupon frequency",
		header: "Coupon Frequency",
	},
    {
		accessorKey: "debenture type",
		header: "Debenture Type",
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => <ActionsCell row={row} />,
	},
];

export const columns: ColumnDef<FixedDepositAdjustmentList>[] = createProposalColumns(0, 25);
