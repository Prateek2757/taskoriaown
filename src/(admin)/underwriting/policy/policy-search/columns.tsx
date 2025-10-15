"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export type SurrenderList = {
  rowId: number;
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
      {(SurrenderRow.status !== "VERIFIED" || username === "Pradip Gautam") && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(``)}
          className="cursor-pointer"
          title="Edit"
        >
          <Pencil />
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
    accessorKey: "lgCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Branch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    // accessorKey: "ledgerNumber",
    accessorKey:"ledgerName",
    header: "Kyc No",
  },
  {
    accessorKey: "ledgerNumber",
    header: "Proposal ID",
  },
  {
    accessorKey: "productCode",
    header: "Full name",
  },
  {
    accessorKey: "isActive",
    header: "Policy No",
  },
  {
    accessorKey: "createdBy",
    header: "ID document No",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<SurrenderList>[] = createKycColumns(0, 25);
