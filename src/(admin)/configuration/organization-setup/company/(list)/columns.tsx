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

export type CompanyList = {
   rowId: number;
  companyName: string;
  country: string;
  address: string;
  currencyCode: string;
  phoneNumber: string; // <- was `phonenumber`
  email: string;
  status: "ISSUED" | "NEW" | "DELETED";
  paymentStatus: "NEW" | "COMPLETE";
  proposalNumberEncrypted?: string;
};

type ActionCellProps = {
    row: Row<CompanyList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
    const policyRow = row.original;
    const router = useRouter();

    

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
                    {/* <Button
                        variant="outline"
                        size="icon"
                        onClick={() => console.log('first')}
                        className="cursor-pointer"
                        title="Delete"
                    >
                        <Trash />
                    </Button> */}
                </>
            )}
           
        </div>
    );
};

export const createProposalColumns = (
    pageIndex: number,
    pageSize: number,
): ColumnDef<CompanyList>[] => [
    {
        accessorKey: "companyName",
        header: "Company Name",
    },
    {
        accessorKey: "country",
        header: "Country",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "currencyCode",
        header: "Currency Code",
    },
    {
        accessorKey: "phonenumber",
        header: "Phone Number",
        
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    
    
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell row={row} />,
    },
];

export const columns: ColumnDef<CompanyList>[] = createProposalColumns(0, 25);
