"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Banknote, Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type DoctorList = {
  rowId: number;
  branch: string;
  nmcno: string;
  doctorName: string;
  doctorType: string;
  doctorAddress: string;
  mobileNumber: string;
  email: string;
  isActive: boolean;
};

type ActionCellProps = {
  row: Row<DoctorList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const doctorRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/doctor/view/${doctorRow.rowId}`)}
        className="cursor-pointer"
        title="View"
      >
        <Eye />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/doctor/edit/${doctorRow.rowId}`)}
        className="cursor-pointer"
        title="Edit"
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createDoctorColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<DoctorList>[] => [
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
    accessorKey: "nmcno",
    header: "NMCNo",
  },
  {
    accessorKey: "doctorName",
    header: "Doctor Name",
  },
  {
    accessorKey: "doctorType",
    header: "Doctor Type",
  },
  {
    accessorKey: "doctorAddress",
    header: "Doctor Address",
  },

  {
    accessorKey: "mobileNo",
    header: "Mobile Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isActive",
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
      const status = row.original.isActive;
      switch (status) {
        case true:
          return (
            <Badge
              variant="secondary"
              className="bg-green-500 text-white dark:bg-green-600"
            >
              True
            </Badge>
          );

        case false:
          return <Badge variant="destructive">False</Badge>;

        default:
          return <Badge variant="outline">Undefined</Badge>;
      }
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<DoctorList>[] = createDoctorColumns(0, 25);
