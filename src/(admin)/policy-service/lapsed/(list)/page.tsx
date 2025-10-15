"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createLapsedColumns } from "./columns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
		<div>
			<Tabs defaultValue="All" className="w-[400px] mt-3">
                <TabsList>
                    <TabsTrigger value="All">All List</TabsTrigger>
                    <TabsTrigger value="Registered">Registered</TabsTrigger>
                    <TabsTrigger value="Pending">Revived</TabsTrigger>
                </TabsList>
            </Tabs>
			
			<DataTable
				searchOptions={searchOptions}
				columns={createLapsedColumns}
				endpoint="proposal_list"
			/>
		</div>
	);
}
