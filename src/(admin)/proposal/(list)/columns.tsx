"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  DollarSign,
  Eye,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type KycList = {
  rowId: number;
  sn: number;
  kycNumber: string;
  proposalNumberEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: "APPROVED" | "ISSUED" | "DELETED";
};

type ActionCellProps = {
  row: Row<KycList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const proposalRow = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/proposal/view/${proposalRow.proposalNumberEncrypted}`)
        }
        className="cursor-pointer"
        title="View"
      >
        <Eye />
      </Button>
      {proposalRow.status !== "APPROVED" && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(
                `/proposal/edit/${proposalRow.proposalNumberEncrypted}`
              )
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
              router.push(
                `/proposal/verify/${proposalRow.proposalNumberEncrypted}`
              )
            }
            className="cursor-pointer"
            title="Verify"
          >
            <Check />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/first-premium`)}
            className="cursor-pointer"
            title="First Premium"
          >
            <DollarSign />
          </Button>
        </>
      )}

      {/* {proposalRow.status === "APPROVED" && (
				<Button
					variant="outline"
					size="icon"
					className="cursor-pointer"
					title="Generate Proposal"
					  onClick={() =>
					    router.push(`/proposal?kyc=${kycRow.kycNumberEncrypted}`)
					  }
				>
					<Spline />
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
    accessorKey: "kycNumber",
    header: "kyc Number",
  },
  {
    accessorKey: "proposalNumber",
    header: "Proposal Number",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },

  {
    accessorKey: "mobileNumber",
    header: "Mobile Number",
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

export const columns: ColumnDef<KycList>[] = createKycColumns(0, 25);
