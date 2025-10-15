"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {RiderRateSchemaDTO} from "./RiderRateSchema"

// export type RiderRate = {
//   rowId: number;
//   productId:number;
//   riderId:number;
//   minAge: string;
//   maxAge: string;
//   minriderTerm: string;
//   maxriderTerm: string;
//   minPremiumTerm: string;
//   maxPremiumTerm: string;
//   minSa: string;
//   maxSa: string;
//   isActive: boolean;
// };

type ActionCellProps = {
  row: Row<RiderRateSchemaDTO>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const riderRateRow = row.original;
  const router = useRouter();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/configuration/product-setup/rider-rate/edit/${riderRateRow.kycNumber}`)
        }
        className="cursor-pointer"
        title="Edit"
      >
        <Pencil />
      </Button>

    </div>
  );
};

export const createRiderRateColumns = (
): ColumnDef<RiderRate>[] => [
    {
      accessorKey: "productId",
      header: "Product ID",
    },
    {
      accessorKey: "riderId",
      header: "Rider ID",
    },
    {
      accessorKey: "minAge",
      header: "Min Age",
    },
    {
      accessorKey: "maxAge",
      header: "Max Age",
    },
    {
      accessorKey: "minRiderTerm",
      header: "Min Rider Term",
    },
    {
      accessorKey: "maxRiderTerm",
      header: "Max Rider Term",
    },
    {
      accessorKey: "riderMinPremiumTerm",
        header: "Min Premium Term",
    },
    {
      accessorKey: "riderMaxPremiumTerm",
      header: "Max Paying Term",
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

export const columns: ColumnDef<RiderRate>[] = createRiderRateColumns();
