"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createLoanColumns } from "./Column";

export default function Page() {
  const searchOptions = [
    {
      placeholder: "Mobile Number",
      name: "MobileNumber",
      type: "tel",
    },
  ];

  return (
    <>
      <div className="">
        <DataTable
          searchOptions={searchOptions}
          columns={createLoanColumns}
          endpoint="kyc_list"
        />
      </div>

      <div className="flex mt-2">
        <Button>
          <span>Approve</span>
        </Button>
      </div>
    </>
  );
}
