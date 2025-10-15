"use client";
import { FileDown, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createIncentiveColumns } from "./column";

export default function Page() {
  const searchOptions = [
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
            href="/agency/incentive/setup/add"
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <Plus color="#fff" size={18} />
            <span>Add New Scheme</span>
          </Link>
        </Button>

        <Button className="flex items-center gap-2 bg-orange-100 border border-orange-500 text-orange-600 hover:bg-orange-200">
          <FileText size={18} />
          <span>Export</span>
        </Button>

        <Button className="flex items-center gap-2 bg-blue-100 border border-blue-500 text-blue-600 hover:bg-blue-200">
          <FileDown size={18} />
          <span>PDF</span>
        </Button>
      </div>

      <DataTable
        searchOptions={searchOptions}
        columns={createIncentiveColumns}
        endpoint="kyc_list"
      />
    </div>
  );
}
