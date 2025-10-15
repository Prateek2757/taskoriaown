"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { KycList } from "@/app/(admin)/proposal/(list)/columns";

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
): ColumnDef<KycList>[] => [
  {
    accessorKey: "installmentType",
    header: "Installment Type",
  },
  {
    accessorKey: "installment",
    header: "Installment",
  },
  {
    accessorKey: "premium",
    header: "Premium",
  },
    {
    accessorKey: "paidAmount",
    header: "Paid Amount",
  },
    {
    accessorKey: "transactionDate",
    header: "Transaction Date",
  },
    {
    accessorKey: "dueDate",
    header: "Due Date",
  },
    {
    accessorKey: "modeOfPayment",
    header: "Mode Of Payment",
  },
    {
    accessorKey: "lateFee",
    header: "Late Fee",
  },
    {
    accessorKey: "rebateNo",
    header: "Rebate No",
  },
    {
    accessorKey: "receiptNo",
    header: "Receipt No",
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
