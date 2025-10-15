"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CiClaimType = {
  rowId: number;
  sn: number;
  branch?: string;
  claimNo?: string;
  policyNo?: string;
  fullName?: string;
  intimationDate?: string;
  claimStatus?: string;
  createdBy?: string;
  createdDate?: string;
  preparedBy?: string;
  preparedDate?: string;
  recommendedBy?: string;
  recommendedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
};

type ActionCellProps = {
  row: Row<CiClaimType>;
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

// All List
export const ciAllColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<CiClaimType>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  { accessorKey: "branch", header: "Branch" },
  { accessorKey: "claimNo", header: "Claim No" },
  { accessorKey: "policyNo", header: "Policy No" },
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "intimationDate", header: "Intimation Date" },
  { accessorKey: "claimStatus", header: "Status" },
  { accessorKey: "createdBy", header: "Created By" },
  { accessorKey: "createdDate", header: "Created Date" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

// Pending List
export const ciPendingColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<CiClaimType>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  { accessorKey: "branch", header: "Branch" },
  { accessorKey: "policyNo", header: "Policy No" },
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "intimationDate", header: "Intimation Date" },
  { accessorKey: "claimStatus", header: "Status" },
  { accessorKey: "preparedBy", header: "Prepared By" },
  { accessorKey: "preparedDate", header: "Prepared Date" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

// Recommended List
export const ciRecommendedColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<CiClaimType>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  { accessorKey: "branch", header: "Branch" },
  { accessorKey: "policyNo", header: "Policy No" },
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "intimationDate", header: "Intimation Date" },
  { accessorKey: "claimStatus", header: "Status" },
  { accessorKey: "recommendedBy", header: "Recommended By" },
  { accessorKey: "recommendedDate", header: "Recommended Date" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

// Approved List
export const ciApprovedColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<CiClaimType>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  { accessorKey: "branch", header: "Branch" },
  { accessorKey: "policyNo", header: "Policy No" },
  { accessorKey: "fullName", header: "Full Name" },
  { accessorKey: "intimationDate", header: "Intimation Date" },
  { accessorKey: "claimStatus", header: "Status" },
  { accessorKey: "approvedBy", header: "Approve By" },
  { accessorKey: "approvedDate", header: "Approve Date" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
