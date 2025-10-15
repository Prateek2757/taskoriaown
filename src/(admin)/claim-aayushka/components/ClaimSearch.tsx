"use client";

import { useState } from "react";
import FormSelect from "@/components/formElements/FormSelect";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { UseFormReturn } from "react-hook-form";

type ClaimSearchFormProps = {
	form: UseFormReturn<any>;
	claimTypes: { label: string; value: string }[];
	statusOptions: { label: string; value: string }[];
	provinceOptions: { label: string; value: string }[];
	branchOptions: { label: string; value: string }[];
	policyOptions: { label: string; value: string }[];
	typeOptions: { label: string; value: string }[];
	onSearch: () => void;
};

export default function ClaimSearchForm({
	form,
	claimTypes,
	statusOptions,
	provinceOptions,
	branchOptions,
	policyOptions,
	typeOptions,
	onSearch,
}: ClaimSearchFormProps) {
	
	if (!form || !form.control) {
		console.error("Form or form.control is undefined in ClaimSearchForm");
		return <div>Error: form is not properly initialized.</div>;
	}

	return (
		<div className="border-0 md:border rounded-lg p-0 md:p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-4">Claim Search</h2>

			<div className="mb-6 border border-dashed border-blue-200 p-4 rounded-md">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<FormSelect
					name="province"
					label="Province"
					form={form}
					options={provinceOptions}
					caption="Please Select Province"
				/>

				<FormSelect
					name="branch"
					label="Branch"
					form={form}
					options={branchOptions}
					caption="Please Select Branch"
				/>

				<FormSelect
					name="policyNo"
					label="Policy No"
					form={form}
					options={provinceOptions}
					caption="Please Select Policy No"
				/>

				<DateConverter
					form={form}
					name="fromDate"
					labelEng="From Date"
					labelNep="From Date (BS)"
				/>

				<DateConverter
					form={form}
					name="toDate"
					labelEng="To Date"
					labelNep="To Date (BS)"
				/>

				<FormSelect
					name="claimType"
					label="Claim Type"
					form={form}
					options={claimTypes}
					caption="Select Claim Type"
				/>

				<FormSelect
					name="status"
					label="Status"
					form={form}
					options={statusOptions}
					caption="ALL"
				/>

				<FormSelect
					name="type"
					label="Type"
					form={form}
					options={typeOptions}
					caption="Requested Branch"
				/>
			</div>
			</div>
			 <div className="flex justify-start my-2">
				<button
					type="button"
					onClick={onSearch}
					className="px-6 py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800"
				>
					Search
				</button>
			</div>
		</div>
	);
}
