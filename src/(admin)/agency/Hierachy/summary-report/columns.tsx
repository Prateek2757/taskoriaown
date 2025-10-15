"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import Link from "next/link";

export type KycList = {
  rowId: number;
  sn: number;
  kycNumber: string;
  kycNumberEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: "VERIFIED" | "NEW" | "DELETED";
};

type ActionCellProps = {
  row: Row<KycList>;
};


export const createKycColumns = (
  pageIndex: number,
  pageSize: number
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
    accessorKey: "branchCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Agent ID/ Agent Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "UplinerID/ Upliner Name",
  },
  {
    accessorKey: "mobileNumber",
    header: "Current Position",
  },
  {
    accessorKey: "mobileN1umber",
    header: "License No",
  },
  {
    accessorKey: "mobile3Number",
    header: "Status",
  },
  {
    accessorKey: "mob5ileNumber",
    header: "Policy Count",
  },
  {
    accessorKey: "mobilesdfNumber",
    header: "Sum Assured",
  },
  {
    accessorKey: "mobilhesdfNumber",
    header: "Premium",
  },
];

export const columns: ColumnDef<KycList>[] = createKycColumns(0, 25);
