"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type BranchList = {
  branchCode: number;
  parentId: number;
  rowId:number;
  name: string;
  address: string;
  mobileNumber: string;
  status: "VERIFIED" | "NEW" | "DELETED";
  isActive: "true" | "false";
};

type ActionCellProps = {
  row: Row<BranchList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const branch = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;

  return (
    <div className="flex gap-1">
      {(branch.status !== "VERIFIED" || username === "Pradip Gautam") && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/configuration/organization-setup/branch/unit/edit/${branch.rowId}`)}
            title="Edit"
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>router.push(`/configuration/organization-setup/branch/unit
              /${branch.branchCode}`)} 
            title="Get Unit List"
          >
            <Menu />
          </Button>
        </>
      )}
    </div>
  );
};

export const createBranchColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<BranchList>[] => [
  {
    accessorKey: "branchCode",
    header: "Branch Code",
  },
  {
    accessorKey: "branchName",
    header: "Branch Name",
  },
  {
    accessorKey: "branchPhoneNumber",
    header: "Branch Phone Number",
  },
  {
    accessorKey: "branchEmail",
    header: "Branch Email",
  },
  {
    accessorKey: "branchAddress",
    header: "Address",
  },
{
  accessorKey: "isActive",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center"
    >
      Is Active
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const isActive = row.original.isActive === "true";
    return (
      <Badge
        className={`text-white px-2 py-1 text-sm font-medium rounded-xl ${
          isActive ? "bg-green-600" : "bg-red-500"
        }`}
      >
        {isActive ? "true" : "false"}
      </Badge>
    );
  },
}
,
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
