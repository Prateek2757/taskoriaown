"use client";

import { ColumnDef } from "@tanstack/react-table";

export type LoanPaymentDetail = {
  sn: string | number;
  paidDate: string;
  paidPrincipal: string;
  paidInterest: string;
  totalPaid: string;
  voucherNo: string;
};

export const LoanPaymentColumns: ColumnDef<LoanPaymentDetail>[] = [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.sn === "TOTAL" ? <strong>TOTAL</strong> : row.original.sn}
      </div>
    ),
  },
  {
    accessorKey: "paidDate",
    header: "Paid Date",
    cell: ({ row }) => (
      <div className="text-center">{row.original.paidDate}</div>
    ),
  },
  {
    accessorKey: "paidPrincipal",
    header: "Paid Principal",
    cell: ({ row }) => (
      <div className="text-center">{row.original.paidPrincipal}</div>
    ),
  },
  {
    accessorKey: "paidInterest",
    header: "Paid Interest",
    cell: ({ row }) => (
      <div className="text-center">{row.original.paidInterest}</div>
    ),
  },
  {
    accessorKey: "totalPaid",
    header: "Total Paid",
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalPaid}</div>
    ),
  },
  {
    accessorKey: "voucherNo",
    header: "Voucher No",
    cell: ({ row }) => (
      <div className="text-center">{row.original.voucherNo}</div>
    ),
  },
];
