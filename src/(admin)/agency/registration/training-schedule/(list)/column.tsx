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
  trainerId: string;
  trainerIdEncrypted: string;
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
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/agency/registration/training-schedule/edit/${kycRow.trainerIdEncrypted}`
          )
        }
        title="Edit"
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createKycColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<EndorsementList>[] => [
  {
    accessorKey: "trainingId",
    header: "Training Id",
  },
  {
    accessorKey: "fiscalYear",
    header: "Fiscal Year",
  },
  {
    accessorKey: "venuName",
    header: "Venu Name",
  },
  {
    accessorKey: "venueAddress",
    header: "Venue Address",
  },
  {
    accessorKey: "venueAddress",
    header: "Venue Address",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "startTime",
    header: "Start Date",
  },
  {
    accessorKey: "endTime",
    header: "End Time",
  },
  {
    accessorKey: "createdBY",
    header: "Created BY",
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
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
