"use client";

import { Button } from "@/components/ui/button";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Check, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export type KycLinkListProps = {
  rowId: number;
  kycNumber: string;
  policyNumber: string;
  agentCode: string;
  action: string[];
};

type ActionCellProps = {
  row: Row<KycLinkListProps>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const router = useRouter();
  const kycLinkRow = row.original;
  const rowId = row.original.rowId;
  const rawKyc = row.original.kycNumber;
  const kycNumber = rawKyc?.split("|")[0].trim();

  const isActionAllowed = (title: string) => {
    return kycLinkRow.action?.some(
      (action: any) => action.title === title && action.isAllow === true
    );
  };

  return (
    <div className="flex gap-1">
      {isActionAllowed("Edit") && (
        <Button
          variant="outline"
          size="icon"
          title="Edit"
          onClick={() =>
            router.push(`kyc-link/edit/?kycNumber=${kycNumber}&rowId=${rowId}`)
          }
        >
          <Pencil />
        </Button>
      )}
      {isActionAllowed("Verify") && (
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            router.push(
              `kyc-link/verify/?kycNumber=${kycNumber}&rowId=${rowId}`
            )
          }
          className="cursor-pointer"
          title="Verify"
        >
          <Check />
        </Button>
      )}
    </div>
  );
};

export const createKycLinkColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<KycLinkListProps>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "kycNumber",
    header: "Kyc No.",
  },
  {
    accessorKey: "policyNumber",
    header: "Policy No.",
  },
  {
    accessorKey: "agentCode",
    header: "Agent",
  },
  {
    accessorKey: "declinedBy",
    header: "Declined By",
  },
  {
    accessorKey: "declineRemarks",
    header: "Decline Remark",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

export const columns: ColumnDef<KycLinkListProps>[] = createKycLinkColumns(
  0,
  8
);
