"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function NomineeTab() {
	const searchOptions = [
		{
			placeholder: "Filter Name",
			name: "FullName",
			type: "text",
		},
		{
			placeholder: "Mobile Number",
			name: "MobileNumber",
			type: "tel",
		},
	];



    const createKycColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<KycList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "nomineeName",
    header: "Nominee Name",
  },
  {
    accessorKey: "nomineeFatherName",
    header: "Nominee Father Name",
  },
  {
    accessorKey: "nomineeMotherName",
    header: "Nominee Mother Name",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Relationship
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
    accessorKey: "nomineeAddress",
    header: "Nominee Address",
  },
];


	return (
		<div className="px-6">
			<DataTable
				searchOptions={searchOptions}
				columns={createKycColumns}
				endpoint="kyc_list"
			/>
		</div>
	);
}
