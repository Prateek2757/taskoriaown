"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Cable,
  Check,
  Eye,
  Pencil,
  RefreshCcwDotIcon,
  Spline,
  Trash,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export type KycList = {
  rowId: number;
  sn: number;
  kycNumber: string;
  kycNumberEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: "VERIFIED" | "NEW" | "DELETED";
  actionRows: string[];
};

type ActionCellProps = {
  row: Row<KycList>;
};

const ActionsCellRoles = ({ row }: ActionCellProps) => {
  const kycRow = row.original;
  const router = useRouter();

  const isActionAllowed = (title: string) => {
    return kycRow.actionRows?.some(
      (action: any) => action.title === title && action.isAllow === true
    );
  };

  return (
    <div className="flex gap-1">
      {isActionAllowed("ViewDetails") && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/kyc/view/${kycRow.kycNumberEncrypted}`)}
          className="cursor-pointer"
          title="View"
        >
          <Eye />
        </Button>
      )}

      {isActionAllowed("Edit") && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/kyc/edit/${kycRow.kycNumberEncrypted}`)}
          className="cursor-pointer"
          title="Edit"
        >
          <Pencil />
        </Button>
      )}

      {isActionAllowed("Verify") && (
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
      )}

      {isActionAllowed("Generate Proposal") && (
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

      {isActionAllowed("Endorsment") && (
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

      {isActionAllowed("Add Agent") && (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title="Add Agent"
          onClick={() => router.push(`/agent-training/add`)}
        >
          <User />
        </Button>
      )}

      {isActionAllowed("Delete") && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => console.log("Delete clicked")}
          className="cursor-pointer"
          title="Delete"
        >
          <Trash />
        </Button>
      )}
      {isActionAllowed("KYCLink") && (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title="Kyc Link"
          onClick={() => router.push(`/kyc/kyc-link/add/${kycRow.kycNumber}`)}
        >
          <Cable />
        </Button>
      )}
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          KYC Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "address",
    header: "Address",
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
    cell: ({ row }) => <ActionsCellRoles row={row} />,
  },
];

export const columns: ColumnDef<KycList>[] = createKycColumns(0, 25);
