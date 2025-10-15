"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  BookCheckIcon,
  Check,
  Eye,
  FolderSync,
  Pencil,
  RefreshCcwDotIcon,
  Spline,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
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
    accessorKey: "kycNumber",
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
    accessorKey: "name",
    header: "Ledger",
  },
  {
    accessorKey: "address",
    header: "Subledger",
  },
  {
    accessorKey: "mobileNumber",
    header: "Sub Ledger Name",
  },
  {
    accessorKey: "mobileNumber",
    header: "Voucher No",
  },
  {
    accessorKey: "mobileNumber",
    header: "UserName",
  },
  {
    accessorKey: "mobileNumber",
    header: "Remarks",
  },
  {
    accessorKey: "mobileNumber",
    header: "Tran.Date",
  },
  {
    accessorKey: "mobileNumber",
    header: "Dr.Amount",
  },
  {
    accessorKey: "mobileNumber",
    header: "Cr.Amount",
  },

];

export const columns: ColumnDef<KycList>[] = createKycColumns(0, 25);
