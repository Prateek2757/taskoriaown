"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createProvinceColumns } from "./column";

export default function ProvincePage() {
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
    <>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="province/add">
            <Plus size={18} />
            <span>Add Province</span>
          </Link>
        </Button>
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createProvinceColumns}
        endpoint="province_list"
      />
    </>
  );
}
