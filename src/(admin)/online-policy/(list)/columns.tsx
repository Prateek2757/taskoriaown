"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Eye, File, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";

export type PolicyList = {
	rowNum: number;
	fullName: string;
	payTerm: string;
	premium: string;
	sumAssured: string;
	term: string;
	status: "ISSUED" | "NEW" | "DELETED";
	policyNumber: string;
	policyNumberEncrypted: string;
};

type ActionCellProps = {
	row: Row<PolicyList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
	const policyRow = row.original;
	const router = useRouter();

	return (
		<div className="flex gap-1">
			{/* <Button
                variant="outline"
                size="icon"
                onClick={() =>
                    router.push(`/online-policy/view/${policyRow.policyNumberEncrypted}`)
                }
                className="cursor-pointer"
                title="View"
            >
                <Eye />
            </Button> */}
			<Button
				variant="outline"
				size="icon"
				onClick={() =>
					router.push(
						`/online-policy/policypaper/${policyRow.policyNumberEncrypted}`,
					)
				}
				className="cursor-pointer"
				title="Policy Print"
			>
				<File />
			</Button>
			<Button
				variant="outline"
				size="icon"
				onClick={() =>
					router.push(
						`/online-policy/receipt/${policyRow.policyNumberEncrypted}`,
					)
				}
				className="cursor-pointer"
				title="Receipt Print"
			>
				<Receipt />
			</Button>
		</div>
	);
};

export const createKycColumns = (
	pageIndex: number,
	pageSize: number,
): ColumnDef<PolicyList>[] => [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => {
			return row.index + 1;
		},
	},
	{
		accessorKey: "policyNumber",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Policy Number
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "name",
		header: "Full Name",
		cell: ({ row }) => {
			return `${row.original.fullName}`;
		},
	},
	{
		accessorKey: "sumAssured",
		header: "Sum Assured",
	},
	{
		accessorKey: "premium",
		header: "Premium",
	},
	{
		accessorKey: "term",
		header: "Term",
	},
	{
		accessorKey: "payTerm",
		header: "Pay Term",
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

				case "ISSUED":
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
export const columns: ColumnDef<PolicyList>[] = createKycColumns(0, 25);
