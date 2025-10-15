"use client";

import { Plus, Printer } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  feCiAllColumns,
  feCiPendingColumns,
  feCiRecommendedColumns,
  feCiApprovedColumns,
} from "./columns";

export default function FeCiClaimListPage() {
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

  const searchOptions = [
    { placeholder: "Filter Policy No", name: "policyNo", type: "text" },
    { placeholder: "Filter Full Name", name: "fullName", type: "text" },
  ];

  return (
    <div>
      <Tabs defaultValue="all">
        {/* Tabs + Buttons */}
        <div className="relative md:absolute md:top-3 md:right-3 md:z-50 flex items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All List</TabsTrigger>
            <TabsTrigger value="pending">Pending List</TabsTrigger>
            <TabsTrigger value="recommended">Recommended List</TabsTrigger>
            <TabsTrigger value="approved">Approved List</TabsTrigger>
          </TabsList>

          {/* Add Button */}
          <Button asChild>
            <Link
              href="/claim/fe-claim/fe-ci-claim/add"
              className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
            >
              <Plus size={18} />
              <span>Add</span>
            </Link>
          </Button>

          {/* Print Button - same color as Add */}
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
          >
            <Printer size={18} />
            <span>Print</span>
          </Button>
        </div>

        {/* Tab Contents */}
        <div ref={printRef} className="print-content">
          <TabsContent value="all">
            <DataTable
              searchOptions={searchOptions}
              columns={feCiAllColumns}
              endpoint="fe_ci_claim_all_list"
            />
          </TabsContent>

          <TabsContent value="pending">
            <DataTable
              searchOptions={searchOptions}
              columns={feCiPendingColumns}
              endpoint="fe_ci_claim_pending_list"
            />
          </TabsContent>

          <TabsContent value="recommended">
            <DataTable
              searchOptions={searchOptions}
              columns={feCiRecommendedColumns}
              endpoint="fe_ci_claim_recommended_list"
            />
          </TabsContent>

          <TabsContent value="approved">
            <DataTable
              searchOptions={searchOptions}
              columns={feCiApprovedColumns}
              endpoint="fe_ci_claim_approved_list"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
