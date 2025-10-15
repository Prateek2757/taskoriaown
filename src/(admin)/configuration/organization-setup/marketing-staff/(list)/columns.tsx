"use client";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Banknote,
  Eye,
  Pencil,
  RefreshCcw,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type MarketingStaffList = {
  rowId: number;
  employeeId: string;
  branch: string;
  fullName: string;
  contactNo: string;
  email: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<MarketingStaffList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const marketingStaffRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(`/marketing-staff/view/${marketingStaffRow.rowId}`)
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
          router.push(`/marketing-staff/edit/${marketingStaffRow.rowId}`)
        }
        className="cursor-pointer"
        title="Edit"
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createMarketingStaffColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<MarketingStaffList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "contactNo",
    header: "Mobile Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<MarketingStaffList>[] =
  createMarketingStaffColumns(0, 25);
