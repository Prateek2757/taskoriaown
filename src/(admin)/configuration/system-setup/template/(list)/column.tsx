"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  BookCheckIcon,
  Check,
  Eye,
  FolderSync,
  Pencil,
  RefreshCcwDotIcon,
  Spline,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type TemplateList = {
  rowId: number;
  sn: number;
  kycNumber: string;
  kycNumberEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: "VERIFIED" | "NEW" | "DELETED";
};

type ActionCellProps = {
  row: Row<TemplateList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const kycRow = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;

  return (
    <div className="flex gap-1">
      {(kycRow.status !== "VERIFIED" || username === "Pradip Gautam") && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(
                `/configuration/system-setup/template/edit/${kycRow.kycNumberEncrypted}`
              )
            }
            className="cursor-pointer"
            title="Edit"
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => console.log("first")}
            className="cursor-pointer"
            title="Delete"
          >
            <Trash />
          </Button>
        </>
      )}
    </div>
  );
};

export const createTemplateColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<TemplateList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "templateType",
    header: "Template Type",
  },
  {
    accessorKey: "templateFor",
    header: "Template For",
  },
    {
    accessorKey: "createdDate",
    header: "Created Date",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "modifiedDate",
    header: "Modified Date",
  },
  {
    accessorKey: "modifiedBy",
    header: "Modified By",
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
      const status = row.original.status;
      switch (status) {
        case "NEW":
          return <Badge variant="secondary">{status}</Badge>;

        case "VERIFIED":
          return (
            <Badge
              variant="secondary"
              className="bg-green-500 text-white dark:bg-green-600"
            >
              {status}
            </Badge>
          );

        case "DELETED":
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

export const columns: ColumnDef<TemplateList>[] = createTemplateColumns(0, 25);
