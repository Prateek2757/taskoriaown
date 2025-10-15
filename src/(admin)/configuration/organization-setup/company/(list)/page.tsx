"use client";
import { LinkIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createProposalColumns } from "./columns";

export default function CompanyList() {


	const searchOptions = [
		
		{
			placeholder: "Company Name",
			name: "CompanyName",
			type: "text",
		},
	];


	return (
		<div className="">
			<div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
				{/* <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
  <Link
    href="/online-proposal/add"
    className="flex items-center gap-2 px-4 py-2 rounded-md"
  >
    <Plus size={18} />
    <span>ADD</span>
  </Link>
</Button> */}


				
				
			</div>
			<DataTable
				searchOptions={searchOptions}
				columns={createProposalColumns}
				endpoint="online_proposal_list"
			/>
		</div>
	);
}
