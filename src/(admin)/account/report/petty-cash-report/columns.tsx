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
          Branch Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Month",
  },
  {
    accessorKey: "address",
    header: "TotalFp",
  },
  {
    accessorKey: "mobileNumber",
    header: "ExpressDetails",
  },
  {
    accessorKey: "mobileNumber",
    header: "ClaimedAmount",
  },
  {
    accessorKey: "mobileNumber",
    header: "LimitAmount",
  },
  {
    accessorKey: "mobileNumber",
    header: "ApprovedAmount",
  },
  {
    accessorKey: "mobileNumber",
    header: "BillNo",
  },
  {
    accessorKey: "mobileNumber",
    header: "BillDate",
  },
  {
    accessorKey: "mobileNumber",
    header: "PriorApproval",
  },
  {
    accessorKey: "mobileNumber",
    header: "CreatedBy",
  },
  {
    accessorKey: "mobileNumber",
    header: "CreatedDate",
  },
  {
    accessorKey: "mobileNumber",
    header: "ForwardedBy",
  },{
    accessorKey: "mobileNumber",
    header: "ForwardedDate",
  },{
    accessorKey: "mobileNumber",
    header: "CheckedBy",
  },
  {
    accessorKey: "mobileNumber",
    header: "CheckedDate",
  },

];

export const columns: ColumnDef<KycList>[] = createKycColumns(0, 25);
