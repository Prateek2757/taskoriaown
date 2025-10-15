"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type RiderType = {
  rowId: number;
  rider: string;
  riderName: string;
  riderNameLocal: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<RiderType>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const riderRow = row.original;
  const router = useRouter();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/configuration/product-setup/rider-type/edit/${riderRow.rowId}`
          )
        }
        className="cursor-pointer"
        title="Edit"
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createRiderTypeColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<RiderType>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "rider",
    header: "Rider ID",
  },
  {
    accessorKey: "riderName",
    header: "Rider Name ",
  },
  {
    accessorKey: "ridernameLocal",
    header: "Rider Name (local) ",
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

export const columns: ColumnDef<RiderType>[] = createRiderTypeColumns(0, 20);
