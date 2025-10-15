"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type District = {
  rowId: number;
  province: string;
  district: string;
  name: string;
  nameLocal: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<District>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const router = useRouter();
  const municipality = row.original;

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        title="Edit"
        onClick={() => router.push(`district/edit/${municipality.rowId}`)}
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createDistrictColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<District>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "province",
    header: "Province",
  },
 
  {
    accessorKey: "districtName",
    header: "District Name",
  },
  {
    accessorKey: "districtNameLocal",
    header: "District Name (in Local)",
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
    cell: ({ row }) => {
      return row.original.isActive ? (
        <Badge className="bg-green-500 text-white">true</Badge>
      ) : (
        <Badge variant="destructive">false</Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<District>[] = createDistrictColumns(0, 8);
