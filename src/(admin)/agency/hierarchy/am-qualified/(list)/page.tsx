"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createBdQualifiedColumns } from "./columns";

export default function Page() {
  const searchOptions = [
    {
      placeholder: "Filter Branch",
      name: "branch",
      type: "text",
    },
    {
      placeholder: "Filter Agent Code",
      name: "agentCode",
      type: "text",
    },
    {
      placeholder: "Filter Agent Name",
      name: "agentName",
      type: "text",
    },
  ];

  return (
    <div className="">
      <DataTable
        searchOptions={searchOptions}
        columns={createBdQualifiedColumns}
        endpoint="bd_qualified_list"
      />
    </div>
  );
}
