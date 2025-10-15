"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PrintModal from "../../../policy-endorsement/components/endorsementRequest/PrintModal";
import { useState } from "react";


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
    status: "Registered" | "Forwarded" | "Approved" | "Rejected";
};

type ActionCellProps = {
    row: Row<PolicyLoan>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
    const kycRow = row.original;
    const router = useRouter();
    const [isProposalVerifyOpen, setIsProposalVerifyOpen] = useState(false);
    const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

    const handleVerifyProposalClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsProposalVerifyOpen(true);
    };

    return (
        <div className="flex gap-1">

            <Button
                variant="outline"
                size="icon"
                className="cursor-pointer"
                title="Forward"
                onClick={handleVerifyProposalClick}
            >
                <Plus />
            </Button>
            <PrintModal
                isOpen={isProposalVerifyOpen}
                onClose={() => setIsProposalVerifyOpen(false)}
                isSubmitting={isSubmittingDecision}
            />
        </div>
    );
};

export const createPolicyLoanColumns = (
    pageIndex: number,
    pageSize: number
): ColumnDef<PolicyLoan>[] => [
        {
            accessorKey: "sn",
            header: "SN",
            cell: ({ row }) => {
                const dynamicSN = pageIndex * pageSize + row.index + 1;
                return <div>{dynamicSN}</div>;
            },
        },
        {
            accessorKey: "requestBranch",
            header: "Request Branch",
        },
        {
            accessorKey: "policyName",
            header: "Policy Name",
        },
        {
            accessorKey: "policyNo",
            header: "Policy No",
        },
        {
            accessorKey: "printType",
            header: "Print Type",
        },
        {
            accessorKey: "printCount",
            header: "Print Count",
        },
        {
            accessorKey: "allowReprint",
            header: "Allow Reprint",
        },
        {
            accessorKey: "lastPrintDate",
            header: "Last Print Date",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => <ActionsCell row={row} />,
        },
    ];

export const columns: ColumnDef<PolicyLoan>[] = createPolicyLoanColumns(0,25);
