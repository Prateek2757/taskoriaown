"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type BodList = {
  rowId: number;
  sn: number;
  name: string;
  position: string;
  phone: string;
  type: string;
  createdBy: string;
};

type ActionCellProps = {
  row: Row<BodList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const bodRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/configuration/crm-management/bod-list/view/${bodRow.rowId}`
          )
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
          router.push(
            `/configuration/crm-management/bod-list/edit/${bodRow.rowId}`
          )
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
        onClick={() => console.log("Delete clicked:", bodRow.rowId)}
        title="Delete"
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export const createBodListColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<BodList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "phone",
    header: "Phone no",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "createdBy",
    header: "Created by",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<BodList>[] = createBodListColumns(0, 25);
