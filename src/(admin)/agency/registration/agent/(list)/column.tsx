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

const ActionsCell = ({ row }: ActionCellProps) => {
  const kycRow = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/agency/registration/agent/view/${kycRow.kycNumberEncrypted}`)
        }
        className="cursor-pointer"
        title="View"
      >
        <Eye />
      </Button>
      {(kycRow.status !== "VERIFIED" || username === "Pradip Gautam") && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(`/agency/registration/agent/edit/${kycRow.kycNumberEncrypted}`)
            }
            className="cursor-pointer"
            title="Edit"
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(`/agency/registration/agent/verify/${kycRow.kycNumberEncrypted}`)
            }
            className="cursor-pointer"
            title="Verify"
          >
            <Check />
          </Button>
        </>
      )}

      {/* {kycRow.status === "VERIFIED" && (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title="Generate Proposal"
          onClick={() =>
            router.push(`/agency/registration/agent/add?kyc=${kycRow.kycNumberEncrypted}`)
          }
        >
          <Spline />
        </Button>
      )} */}
      {/* 
      {kycRow.status === "VERIFIED" && (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title="KYC Endorsement"
          onClick={() =>
            router.push(
              `/agency/registration/agent/${kycRow.kycNumberEncrypted}`
            )
          }
        >
          <RefreshCcwDotIcon />
        </Button>
      )} */}

      {/* <Button
                variant="outline"
                size="icon"
                onClick={() => console.log('first')}
                className="cursor-pointer"
                title="Delete"
            >
                <Trash />
            </Button> */}
    </div>
  );
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
    accessorKey: "trainerName",
    header: "Trainer Name",
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
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
        case "NEW":
          return <Badge variant="secondary">{status}</Badge>;

        case "VERIFIED":
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

export const columns: ColumnDef<KycList>[] = createKycColumns(0, 25);
