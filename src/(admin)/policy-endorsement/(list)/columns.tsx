"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  Eye,
  Pencil,
  RefreshCcwDotIcon,
  Spline,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type PolicyList = {
  rowId: number;
  sn: number;
  kycNumber: string;
  kycNumberEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: "VERIFIED" | "NEW" | "DELETED";
  branch?: string;
  endorsementId?: string;
  policyNumber?: string;
  clientId?: string;
  Term?: string;
  payterm?: string;
  plan?: string;
  fullname?: string;
  agent?: string;
  sumAssured?: string;
  premium?: string;
  endorsementType?: string;
};

type ActionCellProps = {
  row: Row<PolicyList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const kycRow = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;

  return (
    <div className="flex gap-1">
      {/* View */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/kyc/view/${kycRow.kycNumberEncrypted}`)}
        className="cursor-pointer"
        title="View"
      >
        <Eye />
      </Button>

      {/* Edit + Verify (if not VERIFIED OR special user) */}
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

      {/* Proposal + Endorsement only for VERIFIED */}
      {kycRow.status === "VERIFIED" && (
        <>
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
        </>
      )}
    </div>
  );
};

export const createPolicyColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<PolicyList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  { accessorKey: "branch", header: "Branch" },
  { accessorKey: "endorsementId", header: "Endorsement ID" },
  { accessorKey: "policyNumber", header: "Policy Number" },
  { accessorKey: "clientId", header: "Client ID" },
  { accessorKey: "Term", header: "Term" },
  { accessorKey: "payterm", header: "Pay Term" },
  { accessorKey: "plan", header: "Plan" },
  { accessorKey: "fullname", header: "Full Name" },
  { accessorKey: "agent", header: "Agent" },
  { accessorKey: "sumAssured", header: "Sum Assured" },
  { accessorKey: "premium", header: "Premium" },
  { accessorKey: "endorsementType", header: "Endorsement Type" },

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

// ✅ Final export ready to use
export const columns: ColumnDef<PolicyList>[] = createPolicyColumns(0, 25);
