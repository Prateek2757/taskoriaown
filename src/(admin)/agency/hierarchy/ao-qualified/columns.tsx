"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type HierarchyType = {
  rowId: number;
  sn: number;
  branch: string;
  agentCode: string;
  agentName: string;
  policyCount: number;
  premium: number;
  qualifiedType: string;
  qualifiedDate: string;
};

type ActionCellProps = {
  row: Row<HierarchyType>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const data = row.original;

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        title="Edit"
        onClick={() => console.log("Edit:", data)}
      >
        <Pencil size={16} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        title="Delete"
        onClick={() => console.log("Delete:", data)}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

export const createHierarchyTypeColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<HierarchyType>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "agentCode",
    header: "AgentCode",
  },
  {
    accessorKey: "agentName",
    header: "AgentName",
  },
  {
    accessorKey: "policyCount",
    header: "PolicyCount",
  },
  {
    accessorKey: "premium",
    header: "Premium",
  },
  {
    accessorKey: "qualifiedType",
    header: "QualifiedType",
  },
  {
    accessorKey: "qualifiedDate",
    header: "QualifiedDate",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
