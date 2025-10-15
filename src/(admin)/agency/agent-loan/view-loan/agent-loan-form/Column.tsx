"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type LoanScheduleList = {
  period: number | string;
  dueDate: string;
  interest: number | string;
  principal: number | string;
  payment: number | string;
  currentBalance: number | string;
  status?: "NEW" | "VERIFIED" | "DELETED" | string;
};

type ActionCellProps = {
  row: Row<LoanScheduleList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const router = useRouter();

  return (
    <div className="flex gap-1">
      
    </div>
  );
};

export const CreateloanScheduleColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<LoanScheduleList>[] => [
  {
    accessorKey: "period",
    header: "Period",
    cell: ({ row }) => {
      const actualIndex = pageIndex * pageSize + row.index + 1;
      return <span>{actualIndex}</span>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "interest",
    header: "Interest",
  },
  {
    accessorKey: "principal",
    header: "Principal",
  },
  {
    accessorKey: "payment",
    header: "Payment",
  },
  {
    accessorKey: "currentBalance",
    header: "Current Balance",
  },
 
];

export const columns: ColumnDef<LoanScheduleList>[] = CreateloanScheduleColumns(0, 25);
