"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";

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
			{/* <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
				<Button asChild>
					<Link
						href="/kyc/add"
						className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
					>
						<Plus color="#fff" size={18} />
						<span>Add New KYC</span>
					</Link>
				</Button>
			</div> */}
			<DataTable
				searchOptions={searchOptions}
				columns={createKycColumns}
				endpoint="proposal_list"
				queryKey="proposalData"
				staleTime={60000}
				refetchInterval={900000}
				enableBackground={true}
			/>
		</div>
	);
}
