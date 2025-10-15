"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type ClaimList = {
  rowId: number;
  sn: number;
  claimType: string;
  policyNo: string;
  name: string;
  requestedBranch: string;
  isPremiumAdjusted: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  remarks?: string;
  verifiedDate?: string;
};

type ActionCellProps = {
  row: Row<ClaimList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const claimRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      {/* View Claim */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/claim/view/${claimRow.rowId}`)}
        title="View"
      >
        <Eye />
      </Button>

      {/* Edit Claim */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/claim/edit/${claimRow.rowId}`)}
        title="Edit"
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createClaimColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<ClaimList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "claimType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Claim Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
    accessorKey: "requestedBranch",
    header: "Requested Branch",
  },
  {
    accessorKey: "isPremiumAdjusted",
    header: "Is Premium Adjusted",
    cell: ({ row }) =>
      row.original.isPremiumAdjusted ? (
        <Badge className="bg-green-500 text-white">Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      switch (row.original.status) {
        case "APPROVED":
          return (
            <Badge className="bg-green-500 text-white">
              {row.original.status}
            </Badge>
          );
        case "REJECTED":
          return <Badge variant="destructive">{row.original.status}</Badge>;
        default:
          return <Badge variant="secondary">{row.original.status}</Badge>;
      }
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    accessorKey: "verifiedDate",
    header: "Verified Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<ClaimList>[] = createClaimColumns(0, 25);
