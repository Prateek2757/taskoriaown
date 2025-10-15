"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type Municipality = {
  rowId: number;
  province: string;
  district: string;
  municipalityName: string;
  municipalityNameLocal: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<Municipality>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const router = useRouter();
  const rowId = row.original.rowId;

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        title="Edit"
        onClick={() => router.push(`municipality/edit/${rowId}`)}
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createMunicipalityColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<Municipality>[] => [
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
    accessorKey: "district",
    header: "District",
  },
  {
    accessorKey: "municipalityName",
    header: "Municipality Name",
  },
  {
    accessorKey: "municipalityNameLocal",
    header: "Municipality Name (in Local)",
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

export const columns: ColumnDef<Municipality>[] = createMunicipalityColumns(
  0,
  8
);
