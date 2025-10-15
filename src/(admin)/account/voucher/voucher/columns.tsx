"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Copy,
  Eye,
  Pencil,
  Printer,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type SurrenderList = {
  hiddenId: number;
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

const ActionsCell = ({ row }: ActionCellProps) => {
  const SurrenderRow = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;

  return (
    <div className="flex gap-1">
      {SurrenderRow.status !== "APPROVED" &&
        SurrenderRow.status !== "DELETED" && (
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(`/account/voucher/edit/${SurrenderRow.hiddenId}`)
            }
            className="cursor-pointer"
            title="Edit"
          >
            <Pencil />
          </Button>
        )}
      {SurrenderRow.status !== "APPROVED" &&
        SurrenderRow.status !== "DELETED" && (
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(
                `/account/voucher/uploadvoucher/${SurrenderRow.hiddenId}`
              )
            }
            className="cursor-pointer"
            title="Upload"
          >
            <Upload />
          </Button>
        )}

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/account/voucher/edit/?id=${SurrenderRow.hiddenId}`)
        }
        className="cursor-pointer"
        title="Print"
      >
        <Printer />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/account/voucher/summary/${SurrenderRow.hiddenId}`)
        }
        className="cursor-pointer"
        title="View"
      >
        <Eye />
      </Button>
      {SurrenderRow.status !== "APPROVED" &&
        SurrenderRow.status !== "DELETED" && (
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(
                `/account/voucher/voucherclone/${SurrenderRow.hiddenId}`
              )
            }
            className="cursor-pointer"
            title="Clone"
          >
            <Copy />
          </Button>
        )}
    </div>
  );
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
    accessorKey: "voucherNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Voucher No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "branchName",
    header: "Branch Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "transactionDate",
    header: "Trans Date",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
  },
  {
    accessorKey: "approvedBy",
    header: "Approve By",
  },
  {
    accessorKey: "approvedDate",
    header: "Approve Date",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      switch (status) {
        case "DRAFT":
          return (
            <Badge
              className="bg-blue-500 text-white dark:bg-blue-600"
              variant="secondary"
            >
              {status}
            </Badge>
          );

        case "APPROVED":
          return (
            <Badge
              variant="secondary"
              className="bg-green-500 text-white dark:bg-green-600"
            >
              {status}
            </Badge>
          );

        case "DELETED":
          return <Badge variant="destructive">{status}</Badge>;

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

export const columns: ColumnDef<SurrenderList>[] = createKycColumns(0, 25);
