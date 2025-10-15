"use client";
import { FileDown, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./column";

export default function Page() {
  const searchOptions = [
    {
      placeholder: "Filter KYC Number",
      name: "kycNumber",
      type: "text",
    },
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
  return (
    <div className="">
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild>
          <Link
            href="/agency/registration/agent/add"
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <Plus color="#fff" size={18} />
            <span>Add Trainer</span>
          </Link>
        </Button>
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
            onClick={() => {
              console.log("Export clicked");
            }}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
            onClick={() => {
              console.log("PDF clicked");
            }}
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createKycColumns}
        endpoint="kyc_list"
      />
    </div>
  );
}
