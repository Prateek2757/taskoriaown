"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";

import type { ColumnDef } from "@tanstack/react-table";

export default function BonusEarnedTab() {
	const searchOptions = [
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



    const createKycColumns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<KycList>[] => [
  {
    accessorKey: "sn",
    header: "SN",
    cell: ({ row }) => {
      const dynamicSN = pageIndex * pageSize + row.index + 1;
      return <div>{dynamicSN}</div>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "bonusRate",
    header: "Bonus Rate",
  },
  {
    accessorKey: "noOfInstallment",
    header: "No of Installments",
  },
  {
    accessorKey: "bonusYear",
    header: "Bonus Year",
  },
  {
    accessorKey: "bonus",
    header: "Bonus ",
  },
];


	return (
		<div className="px-6">
			<DataTable
				searchOptions={searchOptions}
				columns={createKycColumns}
				endpoint="kyc_list"
			/>
		</div>
	);
}
