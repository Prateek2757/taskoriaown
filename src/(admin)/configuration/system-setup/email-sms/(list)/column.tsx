"use client";

import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export type EmailSmsList = {
  rowId: number;
  uniqueId: string;
  type: string;
  recipient: string;
  subject: string;
  modifiedDate: string;
  createdOn: string;
  timeToSend: string;
  sentOn: string;
};

type ActionCellProps = {
  row: Row<EmailSmsList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const emailsms = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          router.push(
            `/configuration/system-setup/email-sms/edit/${emailsms.rowId}`
          )
        }
        className="cursor-pointer"
        title="Edit"
      >
        <Pencil />
      </Button>
    </div>
  );
};

export const createTemplateColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<EmailSmsList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "uniqueId",
    header: "Unique Id",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "recipient",
    header: "Recipient",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "modifiedDate",
    header: "Modified Date",
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
  },
  {
    accessorKey: "timeToSend",
    header: "Time To Send",
  },
  {
    accessorKey: "sentOn",
    header: "Sent On",
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<EmailSmsList>[] = createTemplateColumns(0, 25);
