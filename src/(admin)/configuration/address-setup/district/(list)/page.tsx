"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createDistrictColumns } from "./column";

export default function DistrictPage() {
  const searchOptions = [
    {
      placeholder: "Search by Province",
      name: "province",
      type: "text",
    },
    {
      placeholder: "District Name",
      name: "name",
      type: "text",
    },
  ];

  return (
    <div>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
          <Button asChild className="dark:bg-gray-800 dark:text-white">
            <Link href="district/add">
              <Plus size={18} />
              <span>Add District</span>
            </Link>
          </Button>
        </div>
      </div>

      <DataTable
        searchOptions={searchOptions}
        columns={createDistrictColumns}
        endpoint="district_list"
      />
    </div>
  );
}
