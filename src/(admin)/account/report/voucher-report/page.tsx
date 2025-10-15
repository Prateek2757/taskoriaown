"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, Printer, Upload } from "lucide-react";

export default function Page() {
  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="">
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button
          asChild
          className="bg-blue-500 hover:bg-blue-600 focus:ring-green-500"
        >
          <Link
            href="#"
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <Download color="#fff" size={18} className="rotate-180" />
            <span>Export </span>
          </Link>
        </Button>
        <Button
          asChild
          className="bg-blue-500 hover:bg-blue-600 focus:ring-green-500"
        >
          <Link
            href="#"
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <Upload color="#fff" size={18} />
            <span>PDF</span>
          </Link>
        </Button>
        <Button
          asChild
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-600 focus:ring-green-500"
        >
          <Link
            href="#"
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <Printer color="#fff" size={18} />
            <span>Print</span>
          </Link>
        </Button>
      </div>
      <div className="print-content">
        <DataTable
          searchOptions={[]}
          columns={createKycColumns}
          endpoint="voucher_list"
        />
      </div>
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.3in;
            size: A4;
          }

          body * {
            visibility: hidden;
          }
          .first-part {
            zoom: 55%; /* Scale down content */
            margin: 0;
          }

          .print-content,
          .print-content * {
            visibility: visible;
            max-width: 100%;
            overflow: visible;
            zoom: 95%;
          }

          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .no-print {
            display: none !important;
          }
          .border-print {
            border: 1px solid black;
          }

          .page-break {
            page-break-after: always;
          }

          .compact-table {
            font-size: 9px;
          }

          .compact-table td,
          .compact-table th {
            padding: 2px 4px;
          }

          h1,
          h2,
          h3,
          h4 {
            margin: 5px 0;
          }

          .section-title {
            font-size: 14px;
            margin: 8px 0;
          }

          .main-title {
            font-size: 18px;
            margin: 10px 0;
          }
        }
      `}</style>
    </div>
  );
}
