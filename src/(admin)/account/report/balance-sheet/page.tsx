"use client";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Button } from "@/components/ui/button";
import {
	BalanceSheetSchema,
	BalanceSheetSchemaDTO,
	emptyBalanceSheet,
} from "../../Schema/BalanceSheet";

const page = () => {
	const form = useForm<BalanceSheetSchemaDTO>({
		resolver: zodResolver(BalanceSheetSchema),
		mode: "onChange",
		defaultValues: emptyBalanceSheet,
	});

	const onSubmit = (data: any) => {
		console.log(data);
	};
	return (
		<div className="bg-white rounded-lg border-1 mb-6 mt-4">
			<div className="p-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<h2 className="text-xl font-bold text-gray-800 mb-6">
							Balance Sheet Report
						</h2>

						<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="space-y-2">
									<FormSelect
										name="filter"
										options={[]}
										label="Branch"
										caption="Select Dates"
										form={form}
										required={true}
									/>
								</div>
								<div className="space-y-2 flex space-x-1">
									<DateConverter
										form={form}
										name="date"
										labelNep="DOB in BS"
										labelEng="DOB in AD"
									/>{" "}
								</div>

								<div className="space-y-2 flex space-x-1">
									<DateConverter
										form={form}
										name="todate"
										labelNep="DOB in BS"
										labelEng="DOB in AD"
									/>{" "}
								</div>

								<div className="space-y-2">
									<FormSelect
										name="branch"
										options={[]}
										label="Branch"
										caption="Select Branch"
										form={form}
										required={true}
									/>
								</div>

								<div className="space-y-2">
									<FormSwitch
										name="branchWise"
										label="Branch Wise"
										form={form}
										required={true}
									/>
								</div>
							</div>
							<Button
								type="button"
								className="cursor-pointer mb-3 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
							>
								Search
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default page;
