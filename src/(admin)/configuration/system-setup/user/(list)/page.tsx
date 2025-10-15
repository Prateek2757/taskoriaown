"use client";
import { FileDown, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createUserColumns } from "./Column";

export default function Page() {
	const searchOptions = [
		{
			placeholder: "Filter KYC Number",
			name: "kycNumber",
			type: "text",
		},
		{
			placeholder: "Filter Name",
			name: "FullName",
			type: "text",
		},
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
        columns={createUserColumns}
        endpoint="application_user_list"
        queryKey="aplicationuserData"
        staleTime={60000}
        refetchInterval={900000}
        enableBackground={true}
      />
    </div>
  );
}
