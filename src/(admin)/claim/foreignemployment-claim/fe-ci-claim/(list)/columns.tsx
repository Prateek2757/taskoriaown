"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FeCiClaimType = {
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
  bankStatus?: string;
};

type ActionCellProps = {
  row: Row<FeCiClaimType>;
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
export const feCiAllColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<FeCiClaimType>[] => [
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
export const feCiPendingColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<FeCiClaimType>[] => [
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
export const feCiRecommendedColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<FeCiClaimType>[] => [
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
export const feCiApprovedColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<FeCiClaimType>[] => [
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
  { accessorKey: "bankStatus", header: "Bank Status" },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
