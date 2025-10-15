"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type CaseSetup = {
  rowId: number;
  sn: number;
  name: string;
  amount: number;
  uniqueId: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<CaseSetup>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const caseRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/configuration/case-setup/view/${caseRow.uniqueId}`)
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
          router.push(`/configuration/case-setup/edit/${caseRow.uniqueId}`)
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
        onClick={() => console.log("Delete clicked:", caseRow.uniqueId)}
        title="Delete"
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export const createCaseSetupColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<CaseSetup>[] => [
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
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "uniqueId",
    header: "Unique Id",
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge className="bg-green-500 text-white">Active</Badge>
      ) : (
        <Badge variant="destructive">Inactive</Badge>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<CaseSetup>[] = createCaseSetupColumns(0, 25);
