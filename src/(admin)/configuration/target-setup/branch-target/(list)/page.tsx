"use client";
import { LinkIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import { createProposalColumns } from "./columns";

export default function ProposalList() {
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const searchOptions = [
    // {
    // 	placeholder: "product id",
    // 	name: "ProductId",
    // 	type: "text",
    // },
    // {
    // 	placeholder: "min term",
    // 	name: "MinTerm",
    // 	type: "text",
    // },
    {
      placeholder: "target amount",
      name: "FiscalYear",
      type: "text",
    },
  ];

  return (
    <div className="">
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="/configuration/target-setup/branch-target/add">
            <Plus size={18} />
            <span>ADD</span>
          </Link>
        </Button>

        {/* <Button
					onClick={handleReferralClick}
					className="cursor-pointer flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
				>
					<LinkIcon color="#fff" size={18} />
					<span>Generate Referral Link</span>
				</Button>
				 */}
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createProposalColumns}
        endpoint="online_proposal_list"
      />
    </div>
  );
}
