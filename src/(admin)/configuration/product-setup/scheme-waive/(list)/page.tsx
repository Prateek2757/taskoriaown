"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createSchemeWaiveColumns } from "./columns";

export default function Page() {
  const searchOptions = [
    {
      placeholder: "Filter Scheme Name",
      name: "schemeName",
      type: "text",
    },
  ];
  return (
    <>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="scheme-waive/add">
            <Plus color="#fff" size={18} />
            <span>Add New Scheme Waive</span>
          </Link>
        </Button>
      </div>

      <DataTable
        searchOptions={searchOptions}
        columns={createSchemeWaiveColumns}
        endpoint="schemewaive_list"
      />
    </>
  );
}
