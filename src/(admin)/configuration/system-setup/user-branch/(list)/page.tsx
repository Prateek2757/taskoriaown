"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createUserWiseBranchColumns } from "./column";

export default function Page() {
  const searchOptions = [
    {
      placeholder: "Filter Role Name",
      name: "roleName",
      type: "text",
    },
  ];

  return (
    <div className="">
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild>
          <Link
            href="/configuration/system-setup/user-branch/add"
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <Plus color="#fff" size={18} />
            <span>Add User Wise Branch</span>
          </Link>
        </Button>
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createUserWiseBranchColumns}
        endpoint="role_list"
      />
    </div>
  );
}
