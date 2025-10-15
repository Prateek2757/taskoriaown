"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createRiderTypeColumns } from "./columns";

export default function Page() {
  const searchOptions = [
    {
      placeholder: "Filter Rider Id",
      name: "riderId",
      type: "text",
    },
    {
      placeholder: "Rider Name",
      name: "riderName",
      type: "text",
    },
  ];
  return (
    <>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="rider-type/add">
            <Plus color="#fff" size={18} />
            <span>Add New Rider Type</span>
          </Link>
        </Button>
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createRiderTypeColumns}
        endpoint="ridertype_list"
      />
    </>
  );
}
