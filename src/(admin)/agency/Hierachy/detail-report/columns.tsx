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
    accessorKey: "address",
    header: "Branch",
  },
  {
    accessorKey: "mobileNumber",
    header: "Current Position",
  },
  {
    accessorKey: "mobileN1umber",
    header: "Product",
  },
  {
    accessorKey: "mobile3Number",
    header: "PolicyNo",
  },
  {
    accessorKey: "mob5ileNumber",
    header: "DOC",
  },
  {
    accessorKey: "mobilesdfNumber",
    header: "Sum Assured",
  },
  {
    accessorKey: "mobilhesdfNumber",
    header: "Premium",
  },
  {
    accessorKey: "mobilhesdfN0umber",
    header: "PaymentMode",
  },
];

export const columns: ColumnDef<KycList>[] = createKycColumns(0, 25);
