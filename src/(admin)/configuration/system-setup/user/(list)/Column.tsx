"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ApplicationUserList = {
  rowId: number;
  sn: number;
  id: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: "VERIFIED" | "NEW" | "DELETED";
};

type ActionCellProps = {
  row: Row<ApplicationUserList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const user = row.original;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;

  return (
    <div className="flex gap-1">
      {(user.status !== "VERIFIED" || username === "Pradip Gautam") && (
        <>
          {/* Edit button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/configuration/system-setup/user/edit/${user.id}`)}
            className="cursor-pointer"
            title="Edit"
          >
            <Pencil />
          </Button>

          {/* Delete button (stubbed) */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => console.log("Delete user", user.id)}
            className="cursor-pointer"
            title="Reset User Password"
          >
            <User />
          </Button>
        </>
      )}
    </div>
  );
};

export const createUserColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<ApplicationUserList>[] => [
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
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Mobile Number",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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

export const columns: ColumnDef<ApplicationUserList>[] = createUserColumns(0, 25);
