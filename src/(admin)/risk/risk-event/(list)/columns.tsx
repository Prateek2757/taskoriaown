"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Check, Forward, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RiskDTO } from "../RiskSchema";
import ForwardModal from "../components/ForwardModal";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import DeleteModal from "../components/DeleteModal";

export type KycList = {
	rowId: number;
	sn: number;
	branch: string;
	policyNo: string;
	risktype: string;
	department: string;
	createdDate: string;
	createdBy: string;
	status: "APPROVED" | "Reverted" | "DELETED" | "FORWARDED" | "REGISTERED";
};

type ActionCellProps = {
	row: Row<KycList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
	const proposalRow = row.original;
	const router = useRouter();
	const [isProposalVerifyOpen, setIsProposalVerifyOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);



	const handleVerifyProposalClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsProposalVerifyOpen(true);
	};

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsDeleteOpen(true);
	};



	return (
		<div className="flex gap-1">
			{proposalRow.status !== "FORWARDED" && proposalRow.status !== "APPROVED" && (
				<Button
					variant="outline"
					size="icon"
					onClick={handleVerifyProposalClick}
					className="cursor-pointer"
					title="Forward"
				>
					<Forward />
				</Button>
			)}
			{proposalRow.status !== "APPROVED" && (
				<>
					<Button
						variant="outline"
						size="icon"
						onClick={() =>
							router.push(
								`risk-event/edit/${proposalRow.proposalNumberEncrypted}`,
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
							router.push(`risk-event/approve/${proposalRow.proposalNumberEncrypted}`,)

						}
						className="cursor-pointer"
						title="Verify"
					>
						<Check />
					</Button>

				</>
			)}

			<Button
				variant="outline"
				size="icon"
				onClick={handleDeleteClick}
				className="cursor-pointer"
				title="Delete"
			>
				<Trash />
			</Button>
			<ForwardModal
				isOpen={isProposalVerifyOpen}
				onClose={() => setIsProposalVerifyOpen(false)}
				isSubmitting={isSubmittingDecision}
			/>
			<DeleteModal
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				isSubmitting={isSubmittingDecision}
			/>

		</div>
	);
};

export const createRiskColumns = (
	pageIndex: number,
	pageSize: number,
): ColumnDef<KycList>[] => [
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
			header: "Branch",
		},
		{
			accessorKey: "proposalNumber",
			header: "Policy Number",
		},
		{
			accessorKey: "fullName",
			header: "Risk Type",
		},

		{
			accessorKey: "mobileNumber",
			header: "Department",
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
					case "REGISTERED":
						return <Badge variant="secondary">{status}</Badge>;

					case "APPROVED":
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
			accessorKey: "createdDate",
			header: "Created Date",
		},
		{
			accessorKey: "createdBy",
			header: "Created By",
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => <ActionsCell row={row} />,
		},
	];

export const columns: ColumnDef<KycList>[] = createRiskColumns(0, 25);
