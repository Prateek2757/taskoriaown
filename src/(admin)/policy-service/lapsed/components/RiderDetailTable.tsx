"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import type { ColumnDef } from "@tanstack/react-table";
import { lapsedList } from "../(list)/columns";

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
): ColumnDef<lapsedList>[] => [
  {
    accessorKey: "rider",
    header: "Rider",
  },
  {
    accessorKey: "riderSumAssured",
    header: "Rider Sum Assured",
  },
  {
    accessorKey: "term",
    header: "Term",
  },
  {
    accessorKey: "payTerm",
    header: "Pay Term",
  },
    {
    accessorKey: "premium",
    header: "Premium",
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
