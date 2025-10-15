"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ProductRate = {
  rowId: number;
  productId:number;
  age: string;
  term: string;
  payingTerm: string;
  rate: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<ProductRate>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const productRateRow = row.original;
  const router = useRouter();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/configuration/product-setup/product-rate/edit/${productRateRow.kycNumber}`)
        }
        className="cursor-pointer"
        title="Edit"
      >
        <Pencil />
      </Button>

    </div>
  );
};

export const createProductRateColumns = (
): ColumnDef<ProductRate>[] => [
    {
      accessorKey: "productId",
      header: "Product ID",
    },
    {
      accessorKey: "age",
      header: "Age",
    },
    {
      accessorKey: "term",
      header: "Term",
    },
    {
      accessorKey: "payingTerm",
      header: "Paying Term",
    },
    {
      accessorKey: "rate",
      header: "Rate",
    },
    {
      accessorKey: "status",
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
        const status = row.original.status;
        switch (status) {

          case "Active":
            return (
              <Badge
                variant="secondary"
                className="bg-green-500 text-white dark:bg-green-600"
              >
                {status}
              </Badge>
            );

          case "Not Active":
            return <Badge variant="destructive">{status}</Badge>;

          default:
            return <Badge variant="outline">{status}</Badge>;
        }
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];

export const columns: ColumnDef<ProductRate>[] = createProductRateColumns();
