"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createProfileColumns } from "./Column";
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

      <DataTable
        searchOptions={searchOptions}
        columns={createProfileColumns}
        endpoint="kyc_list"
      />
    </div>
  );
}
