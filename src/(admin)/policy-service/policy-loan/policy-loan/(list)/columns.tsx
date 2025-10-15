"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Forward,
    Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


export type PolicyLoan = {
    rowId: number;
    productId: number;
    productName: string;
    ApprovedDate: string;
    minSa: number;
    maxSa: number;
    minAgeAtEntry: number;
    maxAgeAtEntry: number;
    minTerm: number;
    maxTerm: number;
    status: "REGISTERED" | "FORWARDED" | "APPROVED" | "REJECTED";
};

type ActionCellProps = {
    row: Row<PolicyLoan>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
    const kycRow = row.original;
    const router = useRouter();

    return (
        <div className="flex gap-1">

            <Button
                variant="outline"
                size="icon"
                className="cursor-pointer"
                title="Forward"
                onClick={() =>
                    router.push(
                        `/policy-service/policy-loan/policy-loan/forward/${kycRow.kycNumberEncrypted}`,
                    )
                }
            >
                <Forward />
            </Button>
        </div>
    );
};

export const createPolicyLoanColumns = (
): ColumnDef<PolicyLoan>[] => [
        {
            accessorKey: "requestBranch",
            header: "Request Branch",
        },
        {
            accessorKey: "policyNo",
            header: "Policy No",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "productName",
            header: "Product Name",
        },
        {
            accessorKey: "dateOfCommencement",
            header: "Date Of Commencement",
        },
        {
            accessorKey: "sa",
            header: "SA",
        },
        {
            accessorKey: "modeOfPayment",
            header: "Mode Of Payment",
        },
        {
            accessorKey: "premium",
            header: "Premium",
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

                    case "FORWARDED":
                        return (
                            <Badge
                                variant="secondary"
                                className="bg-blue-500 text-white dark:bg-green-600"
                            >
                                {status}
                            </Badge>
                        );
                    case "APPROVED":
                        return (
                            <Badge
                                variant="secondary"
                                className="bg-green-500 text-white dark:bg-green-600"
                            >
                                {status}
                            </Badge>
                        );

                    case "REJECTED":
                        return <Badge variant="destructive">{status}</Badge>;

                    default:
                        return <Badge variant="outline">{status}</Badge>;
                }
            },
        },
        {
            accessorKey: "createdBy",
            header: "Created By",
        },
        {
            accessorKey: "createdDate",
            header: "Created Date",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => <ActionsCell row={row} />,
        },
    ];

export const columns: ColumnDef<PolicyLoan>[] = createPolicyLoanColumns();
