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
        onClick={() => router.push(`/kyc/view/${kycRow.kycNumberEncrypted}`)}
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
              router.push(`/kyc/edit/${kycRow.kycNumberEncrypted}`)
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
              router.push(`/kyc/verify/${kycRow.kycNumberEncrypted}`)
            }
            className="cursor-pointer"
            title="Verify"
          >
            <Check />
          </Button>
        </>
      )}

      {kycRow.status === "VERIFIED" && (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title="Generate Proposal"
          onClick={() =>
            router.push(`/proposal/add?kyc=${kycRow.kycNumberEncrypted}`)
          }
        >
          <Spline />
        </Button>
      )}

      {kycRow.status === "VERIFIED" && (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title="KYC Endorsement"
          onClick={() =>
            router.push(
              `/kyc-endorsement/updatekyc/${kycRow.kycNumberEncrypted}`
            )
          }
        >
          <RefreshCcwDotIcon />
        </Button>
      )}

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
    accessorKey: "branchCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Policy No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Transaction Date",
  },
  {
    accessorKey: "address",
    header: "SumAssured",
  },
  {
    accessorKey: "mobileNumber",
    header: "Premium",
  },
  {
    accessorKey: "mobileN1umber",
    header: "CommissionRate",
  },
  {
    accessorKey: "mobile3Number",
    header: "CommissionAmount",
  },
  {
    accessorKey: "mob5ileNumber",
    header: "CommissionTDS",
  },
  {
    accessorKey: "mobilesdfNumber",
    header: "NetCommission",
  },
  {
    accessorKey: "mobilhesdfNumber",
    header: "CommissionType",
  },
];

export const columns: ColumnDef<KycList>[] = createKycColumns(0, 25);
