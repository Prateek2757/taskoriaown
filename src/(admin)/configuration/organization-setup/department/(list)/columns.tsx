"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type DepartmentList = {
  rowId: number;
  departmentName: string;
  departmentNameLocal: string;
  departmentHead: string;
  shortName: string;
  email: string;
  isActive: boolean;
  status: "ISSUED" | "NEW" | "DELETED";
};

type ActionCellProps = {
  row: Row<DepartmentList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const departmentRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/department/view/${departmentRow.rowId}`)}
        className="cursor-pointer"
        title="View"
      >
        <Eye />
      </Button>

      <>
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/department/edit/${departmentRow.rowId}`)}
          className="cursor-pointer"
          title="Edit"
        >
          <Pencil />
        </Button>
      </>
    </div>
  );
};

export const createDepartmentColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<DepartmentList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "departmentName",
    header: "Department Name",
  },
  {
    accessorKey: "departmentNameLocal",
    header: "Department Name (Local)",
  },
  {
    accessorKey: "departmentHead",
    header: "Department Head",
  },
  {
    accessorKey: "short name",
    header: "Short Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Is Active
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.isActive;
      switch (status) {
        case true:
          return (
            <Badge
              variant="secondary"
              className="bg-green-500 text-white dark:bg-green-600"
            >
              True
            </Badge>
          );

        case false:
          return <Badge variant="destructive">False</Badge>;

        default:
          return <Badge variant="outline">Undefined</Badge>;
      }
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<DepartmentList>[] = createDepartmentColumns(
  0,
  25
);
