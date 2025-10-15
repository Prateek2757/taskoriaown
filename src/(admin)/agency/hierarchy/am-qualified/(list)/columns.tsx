"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type BdQualified = {
  rowId: number;
  sn: number;
  branch: string;
  agentCode: string;
  agentName: string;
  policyCount: number;
  premium: number;
  agentCount: number;
  activeAgentCount: number;
  qualifiedDate?: string;
};

type ActionCellProps = {
  row: Row<BdQualified>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const agentRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/am-qualified/view/${agentRow.agentCode}`)
        }
        className="cursor-pointer"
        title="View"
      >
        <Eye />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/am-qualified/edit/${agentRow.agentCode}`)
        }
        className="cursor-pointer"
        title="Edit"
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createBdQualifiedColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<BdQualified>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "agentCode",
    header: "Agent Code",
  },
  {
    accessorKey: "agentName",
    header: "Agent Name",
  },
  {
    accessorKey: "policyCount",
    header: "Policy Count",
  },
  {
    accessorKey: "premium",
    header: "Premium",
    cell: ({ row }) => <div>{row.original.premium.toFixed(2)}</div>,
  },
  {
    accessorKey: "agentCount",
    header: "Agent Count",
  },
  {
    accessorKey: "activeAgentCount",
    header: "Active Agent Count",
  },
  {
    accessorKey: "qualifiedDate",
    header: "Qualified Date",
    cell: ({ row }) => row.original.qualifiedDate ?? "-",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<BdQualified>[] = createBdQualifiedColumns(
  0,
  25
);
