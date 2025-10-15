"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Check, Eye, Pencil, Printer, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type EndorsementList = {
  rowId: number;
  sn: number;
  kycNumberEncrypted: string;
  KYCNumber: string;
  agentId: string;
  agentIdEncrypted: string;
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
      {/* View Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/kyc-endorsement/view/${kycRow.agentIdEncrypted}`)
        }
        title="Print Agent Profile"
      >
        <Printer/>
      </Button>
    

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/agency`
          )
        }
        title="View Agent Profile"
      >
        <User/>
      </Button>
    </div>
  );
};

export const createProfileColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<EndorsementList>[] => [
 
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "kycNumber",
    header: "KYC No",
  },
  {
    accessorKey: "agentCode",
    header: "Agent Code",
  },
  {
    accessorKey: "agentType",
    header: "Agent Type",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "superiorAgent",
    header: "Superior Agent",
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile Number",
    cell: ({ row }) => (
      <div>
        {row.original.mobileNumber || (
          <span className="text-gray-400">N/A</span>
        )}
      </div>
    ),
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

export const columns: ColumnDef<EndorsementList>[] = createProfileColumns(0, 25);
