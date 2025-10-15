import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Button } from "@/components/ui/button";

import type { ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
export const MaturityContent = () => {


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
                accessorKey: "policyNo",
                header: "Policy No",
            },
            {
                accessorKey: "sumAssured",
                header: "Sum Assured",
            },
            {
                accessorKey: "maturityDate",
                header: "Maturity Date",
            },
            {
                accessorKey: "nextDueDate",
                header: "Next Due Date",
            },
            {
                accessorKey: "paidUpSumAssured",
                header: "Paid Up Sum Assured",
            },
            {
                accessorKey: "bonus",
                header: "Bonus",
            },
            {
                accessorKey: "claimType",
                header: "Claim Type",
            },
        ];


    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Maturity Information</h2>
            <div className="p-0 md:px-6 md:py-4 border-1 rounded-lg">
                No Data found i dont know what to do i couldnt find any data that had the maturity information
            </div>
            <h2 className="text-xl font-bold mt-4">Maturity Information</h2>
            <DataTable
				searchOptions={searchOptions}
				columns={createKycColumns}
				endpoint="kyc_list"
			/>
        </div>
    );
}