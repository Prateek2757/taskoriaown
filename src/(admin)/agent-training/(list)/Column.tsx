"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Check, Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type EndorsementList = {
  rowId: number;
  sn: number;
  kycNumberEncrypted: string;
  KYCNumber: string;
  agentId: string;
  agentIdEncrypted: string;
  name: string;
  address: string;
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
      {/* View Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/kyc-endorsement/view/${kycRow.agentIdEncrypted}`)
        }
        title="View"
      >
        <Eye />
      </Button>
      {kycRow.status !== "VERIFIED" && (
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            router.push(`/agent-training/edit/${kycRow.agentIdEncrypted}`)
          }
          title="Edit"
        >
          <Pencil />
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/kyc-endorsement/verify/${kycRow.agentIdEncrypted}?KYCNumberEncrypted=${kycRow.kycNumberEncrypted}`
          )
        }
        title="Verify"
      >
        <Check />
      </Button>

      {/* Generate Proposal – only if VERIFIED */}
      {/* {kycRow.status === "VERIFIED" && (
        <Button
          variant="outline"
          size="icon"
          title="Generate Proposal"
          onClick={() =>
            router.push(`/proposal?kyc=${kycRow.endorsementIdEncrypted}`)
          }
        >
          <Spline />
        </Button>
      )} */}
    </div>
  );
};

export const createKycColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<EndorsementList>[] => [
  //   {
  //     accessorKey: "sn",
  //     header: "SN",
  //     cell: ({ row }) => {
  //       const dynamicSN = pageIndex * pageSize + row.index + 1;
  //       return <div>{dynamicSN}</div>;
  //     },
  //   },
  //   {
  //     accessorKey: "endorsementId",
  //     header: ({ column }) => (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Endorsement ID
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     ),
  //   },
  {
    accessorKey: "trainingId",
    header: "Traning ID",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "kycNumber",
    header: "KYCNumber",
  },
  {
    accessorKey: "agentCode",
    header: "Agent Code",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "superiorAgent",
    header: "Superior Agent",
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile Number",
    cell: ({ row }) => (
      <div>
        {row.original.mobileNumber || (
          <span className="text-gray-400">N/A</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
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

export const columns: ColumnDef<EndorsementList>[] = createKycColumns(0, 25);
