"use client";
import { LinkIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import { createProposalColumns } from "./columns";

export default function FixedDepositAdjustmentList() {
  const searchOptions = [
    {
      placeholder: "client id",
      name: "ClientId",
      type: "text",
    },
  ];

  return (
    <div className="">
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="/investment/transaction/fixed-deposit/add">
            <Plus color="#fff" size={18} />
            <span>Add Fixed Deposit </span>
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
