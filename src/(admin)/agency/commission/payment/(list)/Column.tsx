"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Check, Eye, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type EndorsementList = {
  rowId: number;
  sn: number;
  kycNumberEncrypted: string;
  KYCNumber: string;
  trainerId: string;
  trainerIdEncrypted: string;
  name: string;
  address: string;
  agentCode:string;
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
          router.push(`/agency/commission/payment/view/${kycRow.agentCode}`)
        }
        title="View"
      >
        <Eye />
      </Button>

      {/* <Button
          variant="outline"
          size="icon"
          onClick={() =>
            router.push(
              `/payment-list/edit`
            )
          }
          title="Remove"
        >
          <Trash />
        </Button> */}
    </div>
  );
};

export const createLoanColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<EndorsementList>[] => [
   {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "batchId",
    header: "BatchId",
  },
  {
    accessorKey: "voucherNo",
    header: "Voucher No",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "approvedBy",
    header: "Approved By",
  },
  {
    accessorKey: "approvedDate",
    header: "Arroved Date ",
  },
  {
    accessorKey: "initiatedBy",
    header: "Initiated By",
  },
  {
    accessorKey: "initiatedDate",
    header: "Initiated Date",
  },
  {
    accessorKey: "voucherPostDate",
    header: "Voucher Post Date",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payment Status
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

export const columns: ColumnDef<EndorsementList>[] = createLoanColumns(0, 25);
