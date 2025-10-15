"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createMunicipalityColumns } from "./column";

export default function MunicipalityPage() {
  const searchOptions = [
    {
      placeholder: "Search by Province",
      name: "province",
      type: "text",
    },
    {
      placeholder: "Search by District",
      name: "district",
      type: "text",
    },
    {
      placeholder: "Municipality Name",
      name: "municipalityName",
      type: "text",
    },
  ];

  return (
    <>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="municipality/add">
            <Plus size={18} />
            <span>Add Municipality</span>
          </Link>
        </Button>
      </div>

      <DataTable
        searchOptions={searchOptions}
        columns={createMunicipalityColumns}
        endpoint="municipality_list"
      />
    </>
  );
}
