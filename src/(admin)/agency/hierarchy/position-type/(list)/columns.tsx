"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

export type HierarchyType = {
  fiscalYear: string;
  hierarchyType: string;
  hierarchyDescription: string;
  status: "Active" | "Inactive";
};

export const createHierarchyTypeColumns = (
  onEdit: (row: HierarchyType) => void,
  onDelete: (row: HierarchyType) => void
): ColumnDef<HierarchyType>[] => [
  {
    accessorKey: "fiscalYear",
    header: "Fiscal Year",
  },
  {
    accessorKey: "hierarchyType",
    header: "Hierarchy Type",
  },
  {
    accessorKey: "hierarchyDescription",
    header: "Hierarchy Description",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Active" ? "success" : "destructive"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="h-4 w-4 text-orange-500" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
  },
];
