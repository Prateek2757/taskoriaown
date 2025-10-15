"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, Check, Eye, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type EndorsementList = {
  rowId: number;
  sn: number;
  kycNumberEncrypted: string;
  KYCNumber: string;
  trainerId: string;
  trainerIdEncrypted: string;
  name: string;
  address: string;
  mobileNumber: string;
  status: "VERIFIED" | "NEW" | "DELETED";
};

type ActionCellProps = {
  row: Row<EndorsementList>;
};

const ActionsCell = ({ row }: ActionCellProps) => {
  const kycRow = row.original;
  const router = useRouter();

  return (
    <div className="flex gap-1">
      
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            router.push(
              `/payment-list/edit`
            )
          }
          title="View"
        >
          <Eye />
        </Button>

    </div>
  );
};

export const createLoanColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<EndorsementList>[] => [
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
    header: "KYCNo",
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
    accessorKey: "bankName",
    header: "Bank Name",
  },
  {
    accessorKey: "bankAccountNumber",
    header: "Bank Account Number ",
  },
  {
    accessorKey: "bankAccountName",
    header: "Bank Account Name",
  },
  {
    accessorKey: "commissionAmount",
    header: "Commission Amount",
  },
  {
    accessorKey: "policyNo",
    header: "Policy No",
  },
  {
    accessorKey: "instalment",
    header: "Instalment",
  },
  {
    accessorKey: "bussinessType",
    header: "Bussiness Type",
  },
];

export const columns: ColumnDef<EndorsementList>[] = createLoanColumns(0, 25);
