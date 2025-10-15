"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createBodListColumns } from "./columns";

export default function Page() {
  const searchOptions = [
    { placeholder: "Filter Name", name: "name", type: "text" },
    { placeholder: "Filter Position", name: "position", type: "text" },
    { placeholder: "Filter Phone", name: "phone", type: "text" },
    // { placeholder: "Filter Type", name: "type", type: "text" },
    // { placeholder: "Filter Created By", name: "createdBy", type: "text" },
  ];

  return (
    <div className="">
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild>
          <Link
            href="/configuration/crm-management/bod/add"
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <Plus color="#fff" size={18} />
            <span>Add</span>
          </Link>
        </Button>
      </div>

      <DataTable
        searchOptions={searchOptions}
        columns={createBodListColumns}
        endpoint="bod_list"
      />
    </div>
  );
}
