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
    accessorKey: "kycNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Branch Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Branch Name",
  },
  {
    accessorKey: "name",
    header: "Vouter No",
  },
  {
    accessorKey: "name",
    header: "Transiction Date",
  },
  {
    accessorKey: "address",
    header: "Created By",
  },
  {
    accessorKey: "mobileNumber",
    header: "Created Date",
  },
  // {
  //   accessorKey: "mobileNumber",
  //   header: "ReverseVoucherNo",
  // },
  // {
  //   accessorKey: "mobileNumber",
  //   header: "ReverseTransictionDate",
  // },
  // {
  //   accessorKey: "mobileNumber",
  //   header: "ReversedBy",
  // },
  // {
  //   accessorKey: "mobileNumber",
  //   header: "ReversedDateTime",
  // },
  // {
  //   accessorKey: "mobileNumber",
  //   header: "ReversalRemarks",
  // },
  // {
  //   accessorKey: "mobileNumber",
  //   header: "ReissudVouterNo",
  // },
  // {
  //   accessorKey: "name",
  //   header: "ReissudTransictionDate",
  // },
  // {
  //   accessorKey: "name",
  //   header: "ReissudBy",
  // },
  {
    accessorKey: "name",
    header: "ReissudDateTime",
  },
  {
    accessorKey: "name",
    header: "PolicyNo",
  },
  {
    accessorKey: "name",
    header: "Installment",
  },
  {
    accessorKey: "name",
    header: "InsuredName",
  },
  {
    accessorKey: "name",
    header: "Premium",
  },
  {
    accessorKey: "name",
    header: "AgentCode",
  },
  {
    accessorKey: "name",
    header: "AgentName",
  },
  {
    accessorKey: "name",
    header: "NetCommission",
  },

];

export const columns: ColumnDef<KycList>[] = createKycColumns(0, 25);
