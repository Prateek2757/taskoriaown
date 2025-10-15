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
    accessorKey: "installment",
    header: "Installment",
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
    accessorKey: "interest",
    header: "Interest",
  },
    {
    accessorKey: "interestTotal",
    header: "Interest Total",
  },
    {
    accessorKey: "totalPayable",
    header: "Total Payable",
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
