"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
	ArrowUpDown,
	Check,
	Eye,
	Forward,
	Pencil,
	RefreshCcwDotIcon,
	Spline,
	Trash,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import Link from "next/link";

export type lapsedList = {
	rowId: number;
	sn: number;
	kycNumber: string;
	policyBranch: string;
	policyNo: number;
	fullName: string;
	DOC: string;
	nextDueDate: string;
	currentStatus: "Lapsed";
	revivalStatus: "Registered" | "Revived" ;
};

type ActionCellProps = {
	row: Row<lapsedList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
	const lapsedRow = row.original;
	const router = useRouter();

	return (
		<div className="flex gap-1">
			
				<Button
					variant="outline"
					size="icon"
					className="cursor-pointer"
					title="Register for Revival"
					onClick={() =>
						router.push(
							`/policy-service/lapsed/add/${lapsedRow.kycNumberEncrypted}`,
						)
					}
				>
					<Forward />
				</Button>
			

			
		</div>
	);
};

const ActionsCellRoles = ({ row }: ActionCellProps) => {
	const kycRow = row.original;
	const router = useRouter();

	const isActionAllowed = (title: string) => {
		return kycRow.actionRows?.some(
			(action: any) => action.title === title && action.isAllow === true,
		);
	};

	return (
		<div className="flex gap-1">
			{isActionAllowed("Register") && (
				<Button
					variant="outline"
					size="icon"
					onClick={() =>
						router.push(`/kyc/verify/${kycRow.kycNumberEncrypted}`)
					}
					className="cursor-pointer"
					title="h"
				>
					<Check />
				</Button>
			)}

			{isActionAllowed("Generate Proposal") && (
				<Button
					variant="outline"
					size="icon"
					className="cursor-pointer"
					title="Generate Proposal"
					onClick={() =>
						router.push(`/proposal/add?kyc=${kycRow.kycNumberEncrypted}`)
					}
				>
					<Spline />
				</Button>
			)}

			{isActionAllowed("Endorsment") && (
				<Button
					variant="outline"
					size="icon"
					className="cursor-pointer"
					title="KYC Endorsement"
					onClick={() =>
						router.push(
							`/kyc-endorsement/updatekyc/${kycRow.kycNumberEncrypted}`,
						)
					}
				>
					<RefreshCcwDotIcon />
				</Button>
			)}

			{isActionAllowed("Add Agent") && (
				<Button
					variant="outline"
					size="icon"
					className="cursor-pointer"
					title="Add Agent"
					onClick={() => router.push(`/agent-training/add`)}
				>
					<User />
				</Button>
			)}

			{isActionAllowed("Delete") && (
				<Button
					variant="destructive"
					size="icon"
					onClick={() => console.log("Delete clicked")}
					className="cursor-pointer"
					title="Delete"
				>
					<Trash />
				</Button>
			)}
		</div>
	);
};

export const createLapsedColumns = (
	pageIndex: number,
	pageSize: number,
): ColumnDef<lapsedList>[] => [
	{
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => {
			const dynamicSN = pageIndex * pageSize + row.index + 1;
			return <div>{dynamicSN}</div>;
		},
	},
	{
		accessorKey: "kycNumber",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					KYC Number
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "policyBranch",
		header: "Policy Branch",
	},
	{
		accessorKey: "policyNo",
		header: "Policy Number",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "dateOfCommencement",
		header: "Date of Commencement",
	},
	{
		accessorKey: "nextDueDate",
		header: "Next Due Date",
	},
	{
		accessorKey: "currentStatus",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Current Status
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.original.status;
			switch (status) {
				case "Lapsed":
					return <Badge variant="secondary">{status}</Badge>;

				default:
					return <Badge variant="outline">{status}</Badge>;
			}
		},
	},
	{
		accessorKey: "revivalStatus",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Revival Status
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.original.status;
			switch (status) {
				case "Lapsed":
					return <Badge variant="secondary">{status}</Badge>;

				default:
					return <Badge variant="outline">{status}</Badge>;
			}
		},
	},
	{
		id: "actions2",
		header: "Actions",
		cell: ({ row }) => <ActionsCell row={row} />,
	},
	
];

export const columns: ColumnDef<lapsedList>[] = createLapsedColumns(0, 25);
