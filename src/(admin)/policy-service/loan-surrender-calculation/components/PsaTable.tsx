"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import type { ColumnDef } from "@tanstack/react-table";

type PsaList = {
    idnstallment: string;
    period: string;
    payBackTerm: string;
    percent: string;
    interval: string;
    psa: string;
    psaFactor: string;
    psaSv: string;
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



    const createKycColumns = (
): ColumnDef<PsaList>[] => [
  {
    accessorKey: "installment",
    header: "Installment",
  },
  {
    accessorKey: "period",
    header: "Period",
  },
    {
    accessorKey: "payBackTerm",
    header: "Pay Back Term",
  },
    {
    accessorKey: "percent",
    header: "Percent",
  },
    {
    accessorKey: "interval",
    header: "Interval",
  },
    {
    accessorKey: "psa",
    header: "PSA",
  },
    {
    accessorKey: "psaFactor",
    header: "PSA Factor",
  },
    {
    accessorKey: "psaSv",
    header: "PSA SV",
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
