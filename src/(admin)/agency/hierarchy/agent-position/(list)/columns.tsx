"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type AgentPositionList = {
  rowId: number;
  sn: number;
  agentPositionIdEncrypted: string;
  agentCode: string;
  qualifiedFor: string;
  qualifiedDate: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<AgentPositionList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const router = useRouter();
  const agentRow = row.original;

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/aagency/hierarchy/agent-position/view/${agentRow.agentPositionIdEncrypted}`
          )
        }
        title="View"
      >
        <Eye />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/agency/hierarchy/agent-position/edit/${agentRow.agentPositionIdEncrypted}`
          )
        }
        title="Edit"
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createAgentPositionColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<AgentPositionList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "agentCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Agent Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "qualifiedFor",
    header: "Qualified For",
  },
  {
    accessorKey: "qualifiedDate",
    header: "Qualified Date",
  },
  {
    accessorKey: "isActive",
    header: "Status",
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

export const columns: ColumnDef<AgentPositionList>[] =
  createAgentPositionColumns(0, 25);
