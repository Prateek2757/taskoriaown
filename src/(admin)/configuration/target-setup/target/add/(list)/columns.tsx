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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type TargetSetUpList = {
	fiscalYear: number;
	branch: string;
    targetAmount: number;
	status: "ISSUED" | "NEW" | "DELETED";
	paymentStatus: "NEW" | "COMPLETE";
};

type ActionCellProps = {
	row: Row<TargetSetUpList>;
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
): ColumnDef<TargetSetUpList>[] => [
    {
		accessorKey: "✅",
		header: "✅",
	},
	{
		accessorKey: "sn",
		header: "SN",
	},
    {
		accessorKey: "branch",
		header: "Branch",
	},
    {
		accessorKey: "FPIConvTarget",
		header: "FPIConvTarget",
	},
    {
		accessorKey: "NOPConvTarget",
		header: "NOPConvTarget",
	},
    {
		accessorKey: "FPIIndTermTarget",
		header: "FPIIndTermTarget",
	},
    {
		accessorKey: "NOPINIndTermTarget",
		header: "NOPINIndTermTarget",
	},
    {
		accessorKey: "FPIMicroTarget",
		header: "FPIMicroTarget",
	},
    {
		accessorKey: "NOPMICROTarget",
		header: "NOPMICROTarget",
	},
   
    {
		accessorKey: "NOATarget",
		header: "NOATarget",
	},
	{
		accessorKey: "target amount",
		header: "Target Amount",
	},
];

export const columns: ColumnDef<TargetSetUpList>[] = createProposalColumns(0, 25);
