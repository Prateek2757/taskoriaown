"use client";

import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { anticipatedAllColumns, anticipatedPaymentColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Printer, FileText, ArrowDown } from "lucide-react";
import { useRef, useState } from "react";

export default function AnticipatedListPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("all");

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
      <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value)}>
        {/* Top-right controls with tabs */}
        <div className="relative md:absolute md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="payment">Payment List</TabsTrigger>
          </TabsList>

          <Button className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600">
            <ArrowDown size={18} />
            <span>Export</span>
          </Button>

          <Button className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600">
            <FileText size={18} />
            <span>PDF</span>
          </Button>

          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
          >
            <Printer size={18} />
            <span>Print</span>
          </Button>
        </div>

        {/* All Tab */}
        <TabsContent value="all">
          <div
            ref={activeTab === "all" ? printRef : null}
            className="print-content"
          >
            <DataTable
              searchOptions={[
                {
                  placeholder: "Filter Policy No",
                  name: "policyNo",
                  type: "text",
                },
                {
                  placeholder: "Filter Full Name",
                  name: "fullName",
                  type: "text",
                },
              ]}
              columns={anticipatedAllColumns}
              endpoint="anticipated_all_list"
            />
          </div>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <div
            ref={activeTab === "payment" ? printRef : null}
            className="print-content "
          >
            <DataTable
              searchOptions={[
                {
                  placeholder: "Filter Claim Branch",
                  name: "claimBranch",
                  type: "text",
                },
                {
                  placeholder: "Filter Policy No",
                  name: "policyNo",
                  type: "text",
                },
              ]}
              columns={anticipatedPaymentColumns}
              endpoint="anticipated_payment_list"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
