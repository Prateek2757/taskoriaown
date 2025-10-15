"use client";

import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { pwbColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Printer, FileText, ArrowDown } from "lucide-react";
import { useRef } from "react";

export default function PwbListPage() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
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
      {/* Top-right buttons */}
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
      </div>

      {/* Table content */}
      <div ref={printRef} className="print-content">
        <DataTable
          columns={pwbColumns}
          endpoint="pwb_list"
          searchOptions={[
            { placeholder: "Filter Policy No", name: "policyNo", type: "text" },
            { placeholder: "Filter Full Name", name: "fullName", type: "text" },
          ]}
        />
      </div>
    </div>
  );
}
