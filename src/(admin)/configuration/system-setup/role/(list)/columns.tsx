"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type RoleList = {
  id: string;
  name: string;
};

const ActionsCell = ({ row }: { row: Row<RoleList> }) => {
  const router = useRouter();
  const role = row.original;

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Edit Role"
      onClick={() => router.push(`/configuration/system-setup/role/edit/${role.id}`)}
      className="text-orange-500 hover:bg-orange-100"
    >
      <Pencil className="w-4 h-4" />
    </Button>
  );
};

export const createRoleColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<RoleList>[] => [
  {
    id: "sn",
    header: "SN",
    cell: ({ row }) => <div>{pageIndex * pageSize + row.index + 1}</div>,
  },
  {
    accessorKey: "roleName",
    header: "Role",
    cell: ({ row }) => (
      <div className="uppercase font-semibold">{row.original.name}</div>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
export const columns: ColumnDef<RoleList>[] = createRoleColumns(0, 25);

export default columns;
