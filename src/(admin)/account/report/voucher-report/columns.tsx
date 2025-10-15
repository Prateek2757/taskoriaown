"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Copy, Pencil, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type SurrenderList = {
  rowId: number;
  sn: number;
  kycNumber: string;
  policyNumberEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: any;
  remarks: string;
  policyNumber: string;
};

type ActionCellProps = {
  row: Row<SurrenderList>;
};


export const createKycColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<SurrenderList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "Branch",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Branch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "ledgerName",
    header: "Ledger",
  },
  {
    accessorKey: "ledgerNumber",
    header: "Sub Ledger",
  },
  {
    accessorKey: "productCode",
    header: "Transaction Description",
  },
  {
    accessorKey: "isActive",
    header: "Reference No.",
  },
  {
    accessorKey: "createdBy",
    header: "Reference Date",
  },
  {
    accessorKey: "cramount",
    header: "Dr Amount",
  },
  {
    accessorKey: "amountby",
    header: "Cr Amount",
  },
  
];

export const columns: ColumnDef<SurrenderList>[] = createKycColumns(0, 25);
