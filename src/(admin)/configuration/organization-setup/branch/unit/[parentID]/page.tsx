"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import Link from "next/link";
import { createBranchColumns } from "./column";

export default function Page() {
  const { parentID } = useParams();
  const [tableKey, setTableKey] = useState(0);

  console.log(" Extracted parentID from route:", parentID);

  useEffect(() => {
    setTableKey(prev => prev + 1);
    console.log(" tableKey updated to reload DataTable:", tableKey + 1);
  }, [parentID]);

  const searchOptions = [
    {
      placeholder: "Mobile Number",
      name: "MobileNumber",
      type: "tel",
    },
  ];

  return (
    <div className="p-4">
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild>
          <Link
            href={`/configuration/organization-setup/branch/unit/${parentID}/add`}
            className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
          >
            <Plus color="#fff" size={18} />
            <span>Add Unit</span>
          </Link>
        </Button>
      </div>

      <DataTable
        key={tableKey}
        searchOptions={searchOptions}
        columns={createBranchColumns}
        endpoint="branch_sub_list"
        extraData={{
          parentID: parentID?.toString(),
        }}
      />
    </div>
  );
}
