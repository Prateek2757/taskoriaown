// columns.tsx
"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MaturityType = {
  rowId: number;
  sn: number;
  claimType?: string;
  policyNo?: string;
  fullName?: string;
  statusHold?: string;

  claimBranch?: string;
  claimDate?: string;
  sumAssured?: number;
  isBooked?: boolean;
  verificationStatus?: string;
  bankStatus?: string;
};

type ActionCellProps = {
  row: Row<MaturityType>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const data = row.original;
  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => console.log("Edit:", data)}
      >
        <Pencil size={16} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => console.log("Delete:", data)}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

// Columns for All tab
export const maturityAllColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<MaturityType>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  { accessorKey: "claimType", header: "Claim Type" },
  { accessorKey: "policyNo", header: "Policy No" },
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "product", header: "Product" },
  { accessorKey: "term", header: "Term" },
  { accessorKey: "maturity", header: "Maturity" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "hold", header: "Hold" },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const maturityPaymentColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<MaturityType>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  { accessorKey: "claimBranch", header: "Claim Branch" },
  { accessorKey: "claimDate", header: "Claim Date" },
  { accessorKey: "policyNo", header: "Policy No" },
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "claimType", header: "Claim Type" },
  { accessorKey: "sumAssured", header: "Sum Assured" },
  { accessorKey: "isBooked", header: "Is Booked" },
  { accessorKey: "verificationStatus", header: "Verification Status" },
  { accessorKey: "bankStatus", header: "Bank Status" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
