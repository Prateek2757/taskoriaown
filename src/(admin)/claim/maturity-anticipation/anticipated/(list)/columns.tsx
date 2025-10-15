"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AnticipatedType = {
  rowId: number;
  sn: number;
  survivalId?: string;
  policyNo?: string;
  fullName?: string;
  eligibleDate?: string;
  payBackTerm?: string;
  instalment?: number;
  percentage?: number;
  amount?: number;
  status?: string;
  approvedDate?: string;

  claimBranch?: string;
  claimDate?: string;
  anticipatedInstalment?: number;
  anticipatedAmount?: number;
  verificationStatus?: string;
  bankStatus?: string;
};

type ActionCellProps = {
  row: Row<AnticipatedType>;
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

// 🔹 Columns for All tab
export const anticipatedAllColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<AnticipatedType>[] => [
  {
    accessorKey: "sn",
    header: "S.N.",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  { accessorKey: "survivalId", header: "Survival Id" },
  { accessorKey: "policyNo", header: "Policy No" },
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "eligibleDate", header: "Eligible Date" },
  { accessorKey: "payBackTerm", header: "Pay Back Term" },
  { accessorKey: "instalment", header: "Instalment" },
  { accessorKey: "percentage", header: "Percentage" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "approvedDate", header: "Approved Date" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

// 🔹 Columns for Payment List tab
export const anticipatedPaymentColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<AnticipatedType>[] => [
  {
    accessorKey: "sn",
    header: "S.N.",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  { accessorKey: "policyNo", header: "Policy No" },
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "claimBranch", header: "Claim Branch" },
  { accessorKey: "claimDate", header: "Claim Date" },
  { accessorKey: "anticipatedInstalment", header: "Anticipated Instalment" },
  { accessorKey: "anticipatedAmount", header: "Anticipated Amount" },
  { accessorKey: "verificationStatus", header: "Verification Status" },
  { accessorKey: "bankStatus", header: "Bank Status" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
