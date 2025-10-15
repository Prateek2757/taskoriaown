"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type SchemeWaive = {
  rowId: string;
  schemeName: string;
  schemeType: string;
  schemePercent: string;
  productCode: string;
  StartDate: string;
  EndDate: string;
  isActive: string;
};

type ActionCellProps = {
  row: Row<SchemeWaive>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const schemeWaiveRow = row.original;
  const router = useRouter();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/configuration/product-setup/scheme-waive/edit/${schemeWaiveRow.rowId}`
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

export const createSchemeWaiveColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<SchemeWaive>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "schemeName",
    header: "Scheme Name",
  },
  {
    accessorKey: "schemeType",
    header: "Scheme Type",
  },
  {
    accessorKey: "schemePercent",
    header: "Scheme Percent",
  },
  {
    accessorKey: "productCode",
    header: "Product",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
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

export const columns: ColumnDef<SchemeWaive>[] = createSchemeWaiveColumns(
  0,
  20
);
