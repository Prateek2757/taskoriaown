"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type userList = {
  id: string;
  name: string;
  minMedicalSa: number;
  maxMedicalSa: number;
  minNonMedicalSa: number;
  maxNonMedicalSa: number;
  isActive: boolean;
};

const ActionsCell = ({ row }: { row: Row<userList> }) => {
  const router = useRouter();
  const user = row.original;

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Edit User Branh"
      onClick={() =>
        router.push(`/configuration/system-setup/user-branch/edit/${user.id}`)
      }
      className="text-orange-500 hover:bg-orange-100"
    >
      <Pencil className="w-4 h-4" />
    </Button>
  );
};

export const createUserWiseBranchColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<userList>[] => [
  {
    id: "sn",
    header: "SN",
    cell: ({ row }) => <div>{pageIndex * pageSize + row.index + 1}</div>,
  },
  {
    accessorKey: "user",
    header: "User",
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

export const columns: ColumnDef<userList>[] = createUserWiseBranchColumns(
  0,
  25
);

export default columns;
