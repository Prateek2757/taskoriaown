"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type RiderCriteria = {
  rowId: number;
  productId: number;
  riderId: number;
  minimumSumAssured: string;
  maximumSumAssured: string;
  minimumTerm: string;
  maximumTerm: string;
  minimumAge: string;
  maximumAge: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<RiderCriteria>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const riderCriteriaRow = row.original;
  const router = useRouter();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/configuration/product-setup/rider-criteria/edit/${riderCriteriaRow.rowId}`
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

export const createRiderCriteriaColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<RiderCriteria>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "productCode",
    header: "Product",
  },
  {
    accessorKey: "rider",
    header: "Rider",
  },
  {
    accessorKey: "minimumSumAssured",
    header: "Min Sum Assured",
  },
  {
    accessorKey: "maximumSumAssured",
    header: "Max Sum Assured",
  },

  {
    accessorKey: "riderMinimumTerm",
    header: "Min Term",
  },
  {
    accessorKey: "riderMaximumTerm",
    header: "Max Term",
  },
  {
    accessorKey: "minimumAge",
    header: "Min Age",
  },
  {
    accessorKey: "maximumAge",
    header: "Max Age",
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Is Active
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      switch (isActive) {
        case true:
          return (
            <Badge
              variant="secondary"
              className="bg-green-500 text-white dark:bg-green-600"
            >
              {isActive} Active
            </Badge>
          );

        case false:
          return <Badge variant="destructive">{isActive} Inactive</Badge>;
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<RiderCriteria>[] = createRiderCriteriaColumns(
  0,
  20
);
