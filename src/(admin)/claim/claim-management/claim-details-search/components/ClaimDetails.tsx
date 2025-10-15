"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/formElements/FormSelect";
import { Button } from "@/components/ui/button";

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

// Types
type ReverseClaimFormFields = {
  claimType: string;
};

type ClaimRow = {
  claimType: string;
  name: string;
  policyNo: string;
  instalment: string;
  forwardedBranch: string;
  processBranch: string;
  processUser: string;
  approvedBranch: string;
  approvedUser: string;
  amount: string;
  paymentBranch: string;
  paymentUser: string;
  claimStatus: string;
  claimNo: string;
  voucherNo: string;
  registeredDate: string;
  approvedDate: string;
  paidDate: string;
  remarks: string;
};

// Column Helper
const columnHelper = createColumnHelper<ClaimRow>();

// Columns
const columns = [
  columnHelper.accessor("claimType", { header: "Claim Type" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("policyNo", { header: "Policy No" }),
  columnHelper.accessor("instalment", { header: "Installment" }),
  columnHelper.accessor("forwardedBranch", { header: "Forwarded Branch" }),
  columnHelper.accessor("processBranch", { header: "Process Branch" }),
  columnHelper.accessor("processUser", { header: "Process User" }),
  columnHelper.accessor("approvedBranch", { header: "Approved Branch" }),
  columnHelper.accessor("approvedUser", { header: "Approved User" }),
  columnHelper.accessor("amount", { header: "Amount" }),
  columnHelper.accessor("paymentBranch", { header: "Payment Branch" }),
  columnHelper.accessor("paymentUser", { header: "Payment User" }),
  columnHelper.accessor("claimStatus", { header: "Claim Status" }),
  columnHelper.accessor("claimNo", { header: "Claim No" }),
  columnHelper.accessor("voucherNo", { header: "Voucher No" }),
  columnHelper.accessor("registeredDate", { header: "Registered Date" }),
  columnHelper.accessor("approvedDate", { header: "Approved Date" }),
  columnHelper.accessor("paidDate", { header: "Paid Date" }),
  columnHelper.accessor("remarks", { header: "Remarks" }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => console.log("Edit:", row.original)}
        >
          <Pencil size={16} />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => console.log("Delete:", row.original)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    ),
  }),
];

export default function ReverseClaimVoucher() {
  const [tableData, setTableData] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<ReverseClaimFormFields>({
    defaultValues: { claimType: "" },
  });

  const onSubmit = async (data: ReverseClaimFormFields) => {
    console.log("Search Data:", data);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const dummyData: ClaimRow[] = [
        {
          claimType: data.claimType || "medical",
          name: "John Doe",
          policyNo: "P-123456",
          instalment: "2",
          forwardedBranch: "Kathmandu",
          processBranch: "Lalitpur",
          processUser: "user01",
          approvedBranch: "Pokhara",
          approvedUser: "manager01",
          amount: "150000",
          paymentBranch: "Thamel",
          paymentUser: "cashier01",
          claimStatus: "APPROVED",
          claimNo: "C-789456",
          voucherNo: "V-111222",
          registeredDate: "2025-09-01",
          approvedDate: "2025-09-02",
          paidDate: "2025-09-03",
          remarks: "Payment done successfully",
        },
      ];

      setTableData(dummyData);
      setLoading(false);
    }, 800);
  };

  const claimTypes = [
    { value: "medical", text: "Medical" },
    { value: "vehicle", text: "Vehicle" },
    { value: "property", text: "Property" },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      {/* Search Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white border rounded-lg p-6 space-y-6 mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Claim Details Search
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect
                form={form}
                name="claimType"
                label="Claim Type"
                caption="Select Claim Type"
                options={claimTypes}
              />
            </div>

            <div className="flex justify-start mt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
              >
                Search
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Table Section */}
      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : tableData.length === 0 ? (
          <p className="text-center py-4">No records found</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm bg-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border px-2 py-1 bg-gray-100"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border px-2 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
