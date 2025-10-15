"use client";
import { LinkIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createMarketingStaffColumns } from "./columns";

export default function MarketingStaffList() {
  const searchOptions = [
    {
      placeholder: "Employee ID",
      name: "EmployeeID",
      type: "text",
    },
  ];

  return (
    <>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="/configuration/organization-setup/marketing-staff/add">
            <Plus size={18} />
            <span>Add New Marketing Staff</span>
          </Link>
        </Button>
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createMarketingStaffColumns}
        endpoint="marketingstaff_list"
      />
    </>
  );
}
