"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import type { ColumnDef } from "@tanstack/react-table";

type BonusList = {
    startDate: string;
    endDate: string;
    installment: string;
    rate: string;
    bonus: string;
};

export default function PsaTable() {
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



    const createBonusColumns = (
        pageIndex: number,
	pageSize: number,
): ColumnDef<BonusList>[] => [
    {
		accessorKey: "sn",
		header: "SN",
		cell: ({ row }) => {
			const dynamicSN = pageIndex * pageSize + row.index + 1;
			return <div>{dynamicSN}</div>;
		},
	},
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End date",
  },
    {
    accessorKey: "installment",
    header: "Installment",
  },
    {
    accessorKey: "rate",
    header: "Rate",
  },
    {
    accessorKey: "bonus",
    header: "Bonus",
  },
];

  return (
        
            <DataTable
                searchOptions={searchOptions}
                columns={createBonusColumns}
                endpoint="kyc_list"
            />
        
    );
}
