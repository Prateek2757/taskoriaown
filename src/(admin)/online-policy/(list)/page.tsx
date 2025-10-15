"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";

export default function Page() {
	const searchOptions = [
		{
			placeholder: "Filter Policy Number",
			name: "PolicyNumber",
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
				columns={createKycColumns}
				endpoint="policy_list"
				queryKey="policyData"
				staleTime={60000}
				refetchInterval={900000}
				enableBackground={true}
			/>
		</div>
	);
}
