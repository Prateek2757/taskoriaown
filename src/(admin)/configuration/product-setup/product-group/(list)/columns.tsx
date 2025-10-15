"use client";

import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type ProductGroupList = {
  rowId: number;
  GroupName: string;
  GroupNameLocal: string;
};

type ActionCellProps = {
  row: Row<ProductGroupList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const productGroupRow = row.original;
  const router = useRouter();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/configuration/product-setup/product-group/edit/${productGroupRow.rowId}`
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

export const createProductGroupColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<ProductGroupList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "productGroupName",
    header: "Group Name",
  },
  {
    accessorKey: "productGroupNameLocal",
    header: "Group Name (Local)",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<ProductGroupList>[] = createProductGroupColumns(
  0,
  25
);
