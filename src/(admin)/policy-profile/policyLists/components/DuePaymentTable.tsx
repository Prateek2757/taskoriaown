"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import type { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "premium",
    header: "Premium",
  },
    {
    accessorKey: "lapseDays",
    header: "Lapse Days",
  },
    {
    accessorKey: "lateFee",
    header: "Late Fee",
  },
    {
    accessorKey: "totalLateFee",
    header: "Total Late Fee",
  },
    {
    accessorKey: "total",
    header: "Total",
  },
];


    return (
        
            <DataTable
                searchOptions={searchOptions}
                columns={createKycColumns}
                endpoint="kyc_list"
            />
        
    );
}
