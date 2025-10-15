"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Banknote, Check, Currency, Eye, EyeIcon, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type EndorsementList = {
  rowId: number;
  sn: number;
  agentCode:number;
  kycNumberEncrypted: string;
  KYCNumber: string;
  trainerId: string;
  trainerIdEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: "VERIFIED" | "NEW" | "DELETED";
};

type ActionCellProps = {
  row: Row<EndorsementList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const kycRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/agency/agent-loan/view-loan/loan-statement/${kycRow.agentCode}`
          )
        }
        title="View Loan statement"
      >
        <EyeIcon />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/agency/agent-loan/view-loan/loan-memo/${kycRow.agentCode}`
          )
        }
        title="Loan Memo"
      >
        <Banknote />
      </Button>
    </div>
  );
};

export const createViewLoanColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<EndorsementList>[] => [
  {
    accessorKey: "fiscalYear",
    header: "Fiscal Year",
  },
  {
    accessorKey: "loanId",
    header: "Loan Id",
  },
  {
    accessorKey: "agentName",
    header: "Agent Name",
  },
  {
    accessorKey: "agentCode",
    header: "Agent Code",
  },
  {
    accessorKey: "loanDate",
    header: "Loan Date",
  },
  {
    accessorKey: "timePeriod",
    header: "Time Period",
  },
  {
    accessorKey: "createdBY",
    header: "Created BY",
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      switch (status) {
        case "NEW":
          return <Badge variant="secondary">NEW</Badge>;
        case "VERIFIED":
          return (
            <Badge className="bg-green-500 text-white dark:bg-green-600">
              VERIFIED
            </Badge>
          );
        case "DELETED":
          return <Badge variant="destructive">DELETED</Badge>;
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

export const columns: ColumnDef<EndorsementList>[] = createViewLoanColumns(0, 25);
