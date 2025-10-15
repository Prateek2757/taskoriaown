"use client";

import { Plus, Printer, FileText, ArrowDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createClaimColumns } from "./columns";
import { useRef } from "react";

export default function Page() {
  const printRef = useRef<HTMLDivElement>(null);

  const searchOptions = [
    { placeholder: "Filter Claim Type", name: "claimType", type: "text" },
    { placeholder: "Filter Policy No", name: "policyNo", type: "text" },
    { placeholder: "Filter Name", name: "name", type: "text" },
    { placeholder: "Filter Status", name: "status", type: "text" },
  ];

  const handlePrint = () => {
    if (!printRef.current) return;

    const printStyles = `
      <style>
        @media print {
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content { position: absolute; left: 0; top: 0; width: 100%; }
        }
      </style>
    `;
    const styleElement = document.createElement("div");
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    window.print();

    setTimeout(() => document.head.removeChild(styleElement), 1000);
  };

  return (
    <div>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 font-medium">
          <ArrowDown color="#fff" size={18} />
          <span>Export</span>
        </Button>

        <Button className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 font-medium">
          <FileText color="#fff" size={18} />
          <span>PDF</span>
        </Button>

        <Button
          onClick={handlePrint}
          className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 font-medium"
        >
          <Printer color="#fff" size={18} />
          <span>Print</span>
        </Button>

        <Button asChild>
          <Link
            href="/claim/maturity-anticipation/maturity-anticipation-request/add"
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <Plus color="#fff" size={18} />
            <span>Add Claim Detail</span>
          </Link>
        </Button>
      </div>

      <div ref={printRef} className="print-content ">
        <DataTable
          searchOptions={searchOptions}
          columns={createClaimColumns}
          endpoint="claim_list"
        />
      </div>
    </div>
  );
}
