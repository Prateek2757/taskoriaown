"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type Province = {
  rowId: number;
  province: string;
  district: string;
  provinceName: string;
  provinceNameLocal: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<Province>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const router = useRouter();
  const province = row.original;

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        title="Edit"
        onClick={() => router.push(`province/edit/${province.rowId}`)}
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createProvinceColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<Province>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },

  {
    accessorKey: "provinceName",
    header: "Province Name",
  },
  {
    accessorKey: "provinceNameLocal",
    header: "Province Name (in Local)",
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
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

export const columns: ColumnDef<Province>[] = createProvinceColumns(0, 8);
