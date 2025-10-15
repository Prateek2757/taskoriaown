"use client";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import {
	emptyIncomeStatement,
	IncomeStatementSchema,
	IncomeStatementSchemaDTO,
} from "../../Schema/IncomeStatement";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormSelect from "@/components/formElements/FormSelect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, FileUp, Printer } from "lucide-react";
import FormInput from "@/components/formElements/FormInput";

const page = () => {
	const form = useForm<IncomeStatementSchemaDTO>({
		resolver: zodResolver(IncomeStatementSchema),
		mode: "onChange",
		defaultValues: emptyIncomeStatement,
	});

	const onSubmit = (data: any) => {
		console.log(data);
	};
	return (
		<div>
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<h2 className="text-xl font-bold text-gray-800 mb-6">
								Transaction Log Report
							</h2>

							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									{/* {!kycNumberData && ( */}

									<div className="space-y-2 flex space-x-1">
										<DateConverter
											form={form}
											name="date"
											labelNep="Transaction (From Date)"
											labelEng="."
										/>{" "}
									</div>

									<div className="space-y-2 flex space-x-1">
										<DateConverter
											form={form}
											name="todate"
											labelNep="Transaction (To Date)"
											labelEng="."
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
									<div className="space-y-2 flex space-x-1">
										<DateConverter
											form={form}
											name="todate"
											labelNep="Transaction (Modified from Date)"
											labelEng="."
										/>{" "}
									</div>
									<div className="space-y-2 flex space-x-1">
										<DateConverter
											form={form}
											name="todate"
											labelNep="Transaction (Modified to Date)"
											labelEng="."
										/>{" "}
									</div>
									<div className="space-y-2 flex space-x-1">
										<FormInput
											form={form}
											name="todate"
											type="text"
											placeholder="Enter Voucher No."
											label="Voucher No."
											disabled
										/>
									</div>

									<div className="space-y-2">
										<FormSelect
											name="branch"
											options={[]}
											label="Voucher Type"
											caption="Select Voucher Type"
											form={form}
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormSelect
											name="branch"
											options={[]}
											label="Ledger"
											caption="Select Ledger"
											form={form}
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormSelect
											name="branch"
											options={[]}
											label="Sub Ledger"
											caption="Select Sub Ledger"
											form={form}
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormSelect
											name="branch"
											options={[]}
											label="User"
											caption="Select User"
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
					<div className="bg-white py-6 font-sans">
						{/* Header Section */}
						<div className="flex justify-between items-start mb-8">
							{/* Logo Section */}
							<div>
								<Image
									src={"/images/logo.png"}
									alt="IME Life Logo"
									width={100}
									height={100}
								/>
							</div>

							{/* Company Info */}
							<div className="text-right text-gray-700">
								<h2 className="font-bold text-lg mb-2">
									Sun Nepal Life Insurance Company Limited
								</h2>
								<div className="text-sm space-y-1">
									<div className="flex items-center justify-end">
										<span className="mr-2">📍</span>
										<span>
											4th Floor, Simkhada PlazaNew Plaza, Road, Kathmandu 44600
										</span>
									</div>
									<div className="flex items-center justify-end">
										<span className="mr-2">📞</span>
										<span>Ph No. 014024071, Fax No. 4024075, PO No. 740</span>
									</div>
								</div>
							</div>
						</div>

						{/* Report Header */}
						<div className="flex justify-between items-center mb-6">
							<div className="text-gray-600">
								<span className="font-medium">From Date:</span>{" "}
								{new Date().toISOString().split("T")[0]}
							</div>

							<div className="flex items-center space-x-3">
								<h3 className="text-gray-600 font-medium text-lg">
									Transaction Log Report
								</h3>
							</div>

							<div className="text-gray-600">
								<span className="font-medium">To Date:</span>{" "}
								{new Date().toISOString().split("T")[0]}
							</div>
						</div>

						{/* Table */}
						<div className="overflow-hidden border border-gray-300">
							<table className="w-full">
								<thead>
									<tr className="bg-blue-400">
										<th className="border border-gray-300 px-4 py-3 text-left font-bold text-black">
											Entered By
										</th>
										<th className="border border-gray-300 px-4 py-3 text-center font-bold text-black">
											Policy Branch
										</th>
										<th className="border border-gray-300 px-4 py-3 text-center font-bold text-black">
											Tran Date(A.D)
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Tran Date(B.S)
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Deposite Date
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Sub Ledget Name
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Receipt No.
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Sub ledger No.
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Agent Name
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Description
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Dr.Amount
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Cr.Amount
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Ledger Name
										</th>
										<th
											className="border border-gray-300 px-4 py-3 text-center font-bold text-black"
											rowSpan={2}
										>
											Receipt by Branch
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="bg-white">
										<td className="border border-gray-300 px-4 py-3 font-medium text-black">
											Total
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											00.00
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											00.00
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											00.00
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											00.00
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											00.00
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											00.00
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											00.00
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											12
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											12
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											00.00
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											12
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											00.00
										</td>
										<td className="border border-gray-300 px-4 py-3 text-center text-black">
											12
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
