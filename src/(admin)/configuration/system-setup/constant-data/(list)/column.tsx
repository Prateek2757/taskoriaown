"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type constantDataValueList = {
  id: string;
  name: string;
  minMedicalSa: number;
  maxMedicalSa: number;
  minNonMedicalSa: number;
  maxNonMedicalSa: number;
  isActive: boolean;
};

const ActionsCell = ({ row }: { row: Row<constantDataValueList> }) => {
  const router = useRouter();
  const limit = row.original;

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Edit Constant Data"
      onClick={() =>
        router.push(
          `/configuration/system-setup/constant-data/edit/${limit.id}`
        )
      }
      className="text-orange-500 hover:bg-orange-100"
    >
      <Pencil className="w-4 h-4" />
    </Button>
  );
};

export const createconstantDataValueColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<constantDataValueList>[] => [
  {
    accessorKey: "staticCode",
    header: "Static Code",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "descriptionInNepali",
    header: "Description In Nepali",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        IS Active
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<constantDataValueList>[] =
  createconstantDataValueColumns(0, 25);

export default columns;
