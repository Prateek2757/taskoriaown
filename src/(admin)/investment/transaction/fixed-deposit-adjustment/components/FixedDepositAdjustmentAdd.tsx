"use client";
import { LinkIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createProposalColumns } from "../add/(list)/columns";
import FormSelect from "@/components/formElements/FormSelect";

import { FormProvider, useForm } from "react-hook-form";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";

export default function FixedDepositAdjustmentAdd() {
	const form = useForm({
		defaultValues: {
			fiscalYear: "",
		},
	});

	const FixedDepositAdjustment = [
		{ text: "2025/26", value: "2025-26" },
		{ text: "2024/25", value: "2024-25" },
		{ text: "2023/24", value: "2023-24" },
	];

	const searchOptions = [
		{
			placeholder: "fiscal year",
			name: "FiscalYear",
			type: "text",
		},
	];

	return (
		<FormProvider {...form}>
			<div className="">
				<div className="p-6">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-semibold text-gray-900">
							Fixed Deposit Interest Booking Details
						</h2>
					</div>
					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-2 md:p-6 md:pb-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="y-2">
								<FormSelect
									form={form}
									name="fd no"
									label="FD No"
									options={FixedDepositAdjustment}
									required
								/>
							</div>
							<DateConverter
								form={form}
								name="transactionDate"
								labelNep="Transaction Date of Operation in BS"
								labelEng="Transaction Date of Operation in AD"
							/>
						</div>
						<div className="y-2">
							<DataTable
								searchOptions={searchOptions}
								columns={createProposalColumns}
								endpoint="online_proposal_list"
							/>
						</div>
					</div>
				</div>
			</div>
		</FormProvider>
	);
}
