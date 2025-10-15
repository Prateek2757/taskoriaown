"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type CrmManagement = {
  rowId: number;
  sn: number;
  title: string;
  type: string;
  priority: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<CrmManagement>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const crmRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/configuration/crm-management/view/${crmRow.rowId}`)
        }
        title="View"
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Eye />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/configuration/crm-management/edit/${crmRow.rowId}`)
        }
        title="Edit"
        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Pencil />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        onClick={() => console.log("Delete clicked:", crmRow.rowId)}
        title="Delete"
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export const createCrmManagementColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<CrmManagement>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge className="bg-green-500 text-white">Active</Badge>
      ) : (
        <Badge variant="destructive">Inactive</Badge>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<CrmManagement>[] = createCrmManagementColumns(
  0,
  25
);
