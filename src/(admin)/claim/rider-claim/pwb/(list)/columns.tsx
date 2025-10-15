"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export type PwbList = {
  rowId: number;
  branch: string;
  pwbId: string;
  policyNo: string;
  fullName: string;
  status: "VERIFIED" | "NEW" | "DELETED";
};

type ActionCellProps = {
  row: Row<PwbList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const router = useRouter();
  const record = row.original;

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/pwb-list/view/${record.rowId}`)}
        title="View"
      >
        <Eye />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/pwb-list/edit/${record.rowId}`)}
        title="Edit"
      >
        <Pencil />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/pwb-list/verify/${record.rowId}`)}
        title="Verify"
      >
        <Check />
      </Button>
    </div>
  );
};

export const createPwbColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<PwbList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  { accessorKey: "branch", header: "Branch" },
  { accessorKey: "pwbId", header: "PWB Id" },
  { accessorKey: "policyNo", header: "Policy No" },
  { accessorKey: "fullName", header: "Full Name" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      switch (status) {
        case "NEW":
          return <Badge variant="secondary">{status}</Badge>;
        case "VERIFIED":
          return <Badge className="bg-green-500 text-white">{status}</Badge>;
        case "DELETED":
          return <Badge variant="destructive">{status}</Badge>;
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const pwbColumns: ColumnDef<PwbList>[] = createPwbColumns(0, 25);
