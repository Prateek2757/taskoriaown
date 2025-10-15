"use client";
import { LinkIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import { createProposalColumns } from "./columns";

export default function CommissionList() {
  const searchOptions = [
    {
      placeholder: "product id",
      name: "ProductId",
      type: "text",
    },
    {
      placeholder: "min term",
      name: "MinTerm",
      type: "text",
    },
    {
      placeholder: "max term",
      name: "MaxTerm",
      type: "text",
    },
  ];

  return (
    <div className="">
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="/configuration/commission-setup/agent-commission-rate/add">
            <Plus size={18} />
            <span>ADD</span>
          </Link>
        </Button>
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createProposalColumns}
        endpoint="online_proposal_list"
      />
    </div>
  );
}
