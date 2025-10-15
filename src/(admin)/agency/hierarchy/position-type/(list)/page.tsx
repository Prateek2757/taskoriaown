"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createHierarchyTypeColumns } from "./columns";

export default function HierarchyTypeListPage() {
  const searchOptions = [
    {
      placeholder: "Filter Fiscal Year",
      name: "fiscalYear",
      type: "text",
    },
    {
      placeholder: "Filter Hierarchy Type",
      name: "hierarchyType",
      type: "text",
    },
    {
      placeholder: "Filter Status",
      name: "status",
      type: "text",
    },
  ];

  return (
    <div>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild>
          <Link
            href="/agency/hierarchy/position-type/add"
            className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
          >
            <Plus size={18} />
            <span>Add Hierarchy</span>
          </Link>
        </Button>
      </div>

      <DataTable
        searchOptions={searchOptions}
        columns={createHierarchyTypeColumns}
        endpoint="hierarchy_list"
      />
    </div>
  );
}
