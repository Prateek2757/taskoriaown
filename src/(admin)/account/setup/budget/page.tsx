"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";

export default function Page() {
	const searchOptions = [
		{
			placeholder: "Filter Ledger Code",
			name: "LGCode",
			type: "text",
		},
		{
			placeholder: "Filter LedgerNumber",
			name: "LedgerNumber",
			type: "text",
		},
	];
	return (
            <div className="">
			<DataTable
				searchOptions={searchOptions}
				columns={createKycColumns}
				endpoint="ledger_list"
			/>
		</div>
	);
}
