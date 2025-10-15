"use client";
import { Plus, Printer } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  deathAllColumns,
  deathPendingColumns,
  deathRecommendedColumns,
  deathPaymentColumns,
} from "./columns";

export default function DeathClaimListPage() {
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
        {/* Top-right container for Tabs + Register + Print buttons */}
        <div className="relative md:absolute md:top-3 md:right-3 md:z-50 flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All List</TabsTrigger>
            <TabsTrigger value="pending">Pending List</TabsTrigger>
            <TabsTrigger value="recommended">Recommended List</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          {/* Register Button */}
          <Button asChild>
            <Link
              href="/claim/rider-claim/disability-claim/add"
              className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
            >
              <Plus size={18} />
              <span>Register</span>
            </Link>
          </Button>

          {/* Print Button */}
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
          >
            <Printer size={18} />
            <span>Print</span>
          </Button>
        </div>

        {/* Tabs Content */}
        <div ref={printRef} className="print-content">
          <TabsContent value="all">
            <DataTable
              searchOptions={searchOptions}
              columns={deathAllColumns}
              endpoint="death_claim_all_list"
            />
          </TabsContent>

          <TabsContent value="pending">
            <DataTable
              searchOptions={searchOptions}
              columns={deathPendingColumns}
              endpoint="death_claim_pending_list"
            />
          </TabsContent>

          <TabsContent value="recommended">
            <DataTable
              searchOptions={searchOptions}
              columns={deathRecommendedColumns}
              endpoint="death_claim_recommended_list"
            />
          </TabsContent>

          <TabsContent value="payment">
            <DataTable
              searchOptions={searchOptions}
              columns={deathPaymentColumns}
              endpoint="death_claim_payment_list"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
