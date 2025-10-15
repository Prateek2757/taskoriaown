"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


export type ProductList = {
  rowId: number;
  productId: number;
  productName: string;
  ApprovedDate: string;
  minSa: number;
  maxSa: number;
  minAgeAtEntry: number;
  maxAgeAtEntry: number;
  minTerm: number;
  maxTerm: number;
  status:  "Active" | "Not Active";
};

type ActionCellProps = {
  row: Row<ProductList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const kycRow = row.original;
  const router = useRouter();

  return (
      <div>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            router.push(`/configuration/product-setup/product/edit/${kycRow.productId}`)
          }
          className="cursor-pointer"
          title="Edit"
        >
          <Pencil />
        </Button>

      </div>
  );
};

export const createProductColumns = (
): ColumnDef<ProductList>[] => [
    {
      accessorKey: "productId", // we will use the name that we get form the backend here
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "approvedDate", // we will use the name that we get form the backend here
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Approved Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "minSa",
      header: "Min SA",
    },
    {
      accessorKey: "maxSa",
      header: "Max SA",
    },
    {
      accessorKey: "minAgeAtEntry",
      header: "Min Age At Entry",
    },
    {
      accessorKey: "maxAgeAtEntry",
      header: "Max Age At Entry",
    },
    {
      accessorKey: "minTerm",
      header: "Min Term",
    },
    {
      accessorKey: "maxTerm",
      header: "Max Term",
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
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

export const columns: ColumnDef<ProductList>[] = createProductColumns();
