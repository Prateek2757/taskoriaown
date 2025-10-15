"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Check, Eye, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type SchemeList = {
  id: number;
  sn: number;
  kycNumberEncrypted: string;
  KYCNumber: string;
  trainerId: string;
  trainerIdEncrypted: string;
  schemaName: string;
  address: string;
  mobileNumber: string;
  status: "VERIFIED" | "NEW" | "DELETED";
};

type ActionCellProps = {
  row: Row<SchemeList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const kycRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/agent-incentive/setup/edit/${kycRow.schemaName}`)}
        title="Edit Schema"
      >
        <Pencil />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/incentive/setup/incentive-criteria/${kycRow.id}`)}
        title="Add Incentive Criteria"
      >
        <Plus />
      </Button>
    </div>
  );
};

export const createIncentiveColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<SchemeList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "fiscalYear",
    header: "Fiscal Year",
  },
  {
    accessorKey: "schemeId",
    header: "Scheme Id",
  },
  {
    accessorKey: "schemeFor",
    header: "Scheme For",
  },
  {
    accessorKey: "schemeName",
    header: "Scheme Name",
  },
  {
    accessorKey: "month",
    header: "Month",
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

export const columns: ColumnDef<SchemeList>[] = createIncentiveColumns(0, 25);
