"use client";

import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createBranchColumns } from "./column";

export default function Page() {
  const searchOptions = [
    {
      placeholder: "Mobile Number",
      name: "branchPhoneNumber",
      type: "tel",
    },
  ];

  return (
    <div>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0"></div>
      <DataTable
        searchOptions={searchOptions}
        columns={createBranchColumns}
        endpoint="branch_list"
      />
    </div>
  );
}
