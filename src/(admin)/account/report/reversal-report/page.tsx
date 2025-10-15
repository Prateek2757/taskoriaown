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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileUp } from "lucide-react";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";

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
		<div className="max-w-full overflow-hidden">
			<div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
				<Button asChild>
					<Link
						href="/kyc/add"
						className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
					>
						<FileUp color="#fff" size={18} />
						<span>Export</span>
					</Link>
				</Button>
			</div>
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<h2 className="text-xl font-bold text-gray-800 mb-6">
								Renual Due Report
							</h2>

							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									{/* {!kycNumberData && ( */}

									<div className="space-y-2 flex space-x-1">
										<DateConverter
											form={form}
											name="date"
											labelNep="From Date"
											labelEng="."
										/>{" "}
									</div>

									<div className="space-y-2 flex space-x-1">
										<DateConverter
											form={form}
											name="todate"
											labelNep="To Date"
											labelEng="."
										/>{" "}
									</div>
								</div>
								<div className="flex flex-col md:flex-row gap-2">
									<Button
										type="button"
										className="cursor-pointer mb-3 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
									>
										Search
									</Button>
									<Button
										type="button"
										className="cursor-pointer mb-3 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
									>
										Export Report
									</Button>
								</div>
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
							<div>
								<h1 className="text-gray-800 text-2xl font-bold">
									Reversal Review
								</h1>
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
								<span className="font-medium">UserName:</span>{" "}
								{new Date().toISOString().split("T")[0]}
							</div>
							<div className="text-gray-600">
								<span className="font-medium">GeneratedDate:</span>{" "}
								{new Date().toISOString().split("T")[0]}
							</div>
							<div className="text-gray-600">
								<span className="font-medium">FromDate:</span>{" "}
								{new Date().toISOString().split("T")[0]}
							</div>

							<div className="text-gray-600">
								<span className="font-medium">ToDate:</span>{" "}
								{new Date().toISOString().split("T")[0]}
							</div>
						</div>

						{/* Table */}
						<div className="overflow-x-auto overflow-y-hidden max-w-full">
							<DataTable
								searchOptions={[]}
								columns={createKycColumns}
								endpoint="kyc_list"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
