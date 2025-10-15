"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type limitList = {
  id: string;
  name: string;
  minMedicalSa: number;
  maxMedicalSa: number;
  minNonMedicalSa: number;
  maxNonMedicalSa: number;
  isActive: boolean;
};

const ActionsCell = ({ row }: { row: Row<limitList> }) => {
  const router = useRouter();
  const limit = row.original;

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Edit limit"
      onClick={() =>
        router.push(`/configuration/system-setup/limit/edit/${limit.id}`)
      }
      className="text-orange-500 hover:bg-orange-100"
    >
      <Pencil className="w-4 h-4" />
    </Button>
  );
};

export const createlimitColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<limitList>[] => [
  {
    id: "sn",
    header: "SN",
    cell: ({ row }) => <div>{pageIndex * pageSize + row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: "Limit",
    cell: ({ row }) => (
      <div className="uppercase font-semibold">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "minMedicalSa",
    header: "Min Medical SA",
  },
  {
    accessorKey: "maxMedicalSa",
    header: "Max Medical SA",
  },
  {
    accessorKey: "minNonMedicalSa",
    header: "Min Non Medical SA",
  },
  {
    accessorKey: "maxNonMedicalSa",
    header: "Max Non Medical SA",
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

export const columns: ColumnDef<limitList>[] = createlimitColumns(0, 25);

export default columns;
