"use client";
import React, { useState } from "react";
import {
	Scale,
	Calendar,
	ChevronRight,
	ChevronDown,
	Minus,
	Plus,
} from "lucide-react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	emptyIncomeStatement,
	IncomeStatementSchema,
	IncomeStatementSchemaDTO,
} from "../../Schema/IncomeStatement";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Button } from "@/components/ui/button";

const budgetReportData = [
	{
		id: "1",
		code: "1",
		name: "Liabilities",
		count: 1,
		openingDr: 154857175.34,
		openingCr: 1001166461.12,
		turnoverDr: 72.4,
		turnoverCr: 952457.6,
		closingDr: 154857175.34,
		closingCr: 1002118846.32,
		children: [
			{
				id: "1.1",
				code: "1.1",
				name: "Paid Up",
				count: 5,
				openingDr: 0.0,
				openingCr: 750000000.0,
				turnoverDr: 0.0,
				turnoverCr: 0.0,
				closingDr: 0.0,
				closingCr: 750000000.0,
				children: [
					{
						id: "1.1.1",
						code: "1.1.1",
						name: "Share Capital - Ordinary Shares",
						count: 0,
						openingDr: 0.0,
						openingCr: 500000000.0,
						turnoverDr: 0.0,
						turnoverCr: 0.0,
						closingDr: 0.0,
						closingCr: 500000000.0,
					},
					{
						id: "1.1.2",
						code: "1.1.2",
						name: "Share Capital - Preference Shares",
						count: 0,
						openingDr: 0.0,
						openingCr: 250000000.0,
						turnoverDr: 0.0,
						turnoverCr: 0.0,
						closingDr: 0.0,
						closingCr: 250000000.0,
					},
				],
			},
			{
				id: "1.2",
				code: "1.2",
				name: "Call in Advance",
				count: 6,
				openingDr: 0.0,
				openingCr: 0.0,
				turnoverDr: 0.0,
				turnoverCr: 0.0,
				closingDr: 0.0,
				closingCr: 0.0,
			},
			{
				id: "1.3",
				code: "1.3",
				name: "Life Insurance Fund",
				count: 7,
				openingDr: 0.0,
				openingCr: 23405986.0,
				turnoverDr: 0.0,
				turnoverCr: 0.0,
				closingDr: 0.0,
				closingCr: 23405986.0,
			},
			{
				id: "1.4",
				code: "1.4",
				name: "Reserve and surplus",
				count: 14,
				openingDr: 0.0,
				openingCr: 180175599.67,
				turnoverDr: 0.0,
				turnoverCr: 0.0,
				closingDr: 0.0,
				closingCr: 180175599.67,
				children: [
					{
						id: "1.4.1",
						code: "1.4.1",
						name: "General Reserve",
						count: 0,
						openingDr: 0.0,
						openingCr: 150000000.0,
						turnoverDr: 0.0,
						turnoverCr: 0.0,
						closingDr: 0.0,
						closingCr: 150000000.0,
					},
					{
						id: "1.4.2",
						code: "1.4.2",
						name: "Retained Earnings",
						count: 0,
						openingDr: 0.0,
						openingCr: 30175599.67,
						turnoverDr: 0.0,
						turnoverCr: 0.0,
						closingDr: 0.0,
						closingCr: 30175599.67,
					},
				],
			},
			{
				id: "1.5",
				code: "1.5",
				name: "Long term Borrowings",
				count: 15,
				openingDr: 0.0,
				openingCr: 0.0,
				turnoverDr: 0.0,
				turnoverCr: 0.0,
				closingDr: 0.0,
				closingCr: 0.0,
			},
			{
				id: "1.6",
				code: "1.6",
				name: "Current Liabilities",
				count: 16,
				openingDr: 154857175.34,
				openingCr: 8910383.92,
				turnoverDr: 72.4,
				turnoverCr: 952457.6,
				closingDr: 154857175.34,
				closingCr: 9862769.12,
				children: [
					{
						id: "1.6.1",
						code: "1.6.1",
						name: "Trade Payables",
						count: 0,
						openingDr: 0.0,
						openingCr: 5500000.0,
						turnoverDr: 72.4,
						turnoverCr: 500000.0,
						closingDr: 0.0,
						closingCr: 6000000.0,
					},
					{
						id: "1.6.2",
						code: "1.6.2",
						name: "Other Current Liabilities",
						count: 0,
						openingDr: 154857175.34,
						openingCr: 3410383.92,
						turnoverDr: 0.0,
						turnoverCr: 452457.6,
						closingDr: 154857175.34,
						closingCr: 3862769.12,
					},
				],
			},
			{
				id: "1.7",
				code: "1.7",
				name: "Closing Unexpired Risk Reserve",
				count: 17,
				openingDr: 0.0,
				openingCr: 0.0,
				turnoverDr: 0.0,
				turnoverCr: 0.0,
				closingDr: 0.0,
				closingCr: 0.0,
			},
			{
				id: "1.8",
				code: "1.8",
				name: "Closing claim outstanding provision",
				count: 18,
				openingDr: 0.0,
				openingCr: 0.0,
				turnoverDr: 0.0,
				turnoverCr: 0.0,
				closingDr: 0.0,
				closingCr: 0.0,
			},
			{
				id: "1.9",
				code: "1.9",
				name: "Provisions",
				count: 19,
				openingDr: 0.0,
				openingCr: 32607504.93,
				turnoverDr: 0.0,
				turnoverCr: 0.0,
				closingDr: 0.0,
				closingCr: 32607504.93,
			},
			{
				id: "1.10",
				code: "1.10",
				name: "OTHER LIABILITY",
				count: 429,
				openingDr: 0.0,
				openingCr: 6066986.6,
				turnoverDr: 0.0,
				turnoverCr: 0.0,
				closingDr: 0.0,
				closingCr: 6066986.6,
			},
		],
	},
	{
		id: "2",
		code: "2",
		name: "Assets",
		count: 2,
		openingDr: 886255217.7,
		openingCr: 329115.98,
		turnoverDr: 952612.0,
		turnoverCr: 0.0,
		closingDr: 886941308.91,
		closingCr: 62595.19,
		children: [
			{
				id: "2.1",
				code: "2.1",
				name: "Fixed Assets",
				count: 0,
				openingDr: 450000000.0,
				openingCr: 0.0,
				turnoverDr: 500000.0,
				turnoverCr: 0.0,
				closingDr: 450500000.0,
				closingCr: 0.0,
			},
			{
				id: "2.2",
				code: "2.2",
				name: "Current Assets",
				count: 0,
				openingDr: 436255217.7,
				openingCr: 329115.98,
				turnoverDr: 452612.0,
				turnoverCr: 0.0,
				closingDr: 436441308.91,
				closingCr: 62595.19,
				children: [
					{
						id: "2.2.1",
						code: "2.2.1",
						name: "Cash and Cash Equivalents",
						count: 0,
						openingDr: 280000000.0,
						openingCr: 0.0,
						turnoverDr: 300000.0,
						turnoverCr: 0.0,
						closingDr: 280300000.0,
						closingCr: 0.0,
					},
					{
						id: "2.2.2",
						code: "2.2.2",
						name: "Trade Receivables",
						count: 0,
						openingDr: 156255217.7,
						openingCr: 329115.98,
						turnoverDr: 152612.0,
						turnoverCr: 0.0,
						closingDr: 156141308.91,
						closingCr: 62595.19,
					},
				],
			},
		],
	},
	{
		id: "3",
		code: "3",
		name: "Income",
		count: 3,
		openingDr: 0.0,
		openingCr: 64486990.19,
		turnoverDr: 724.0,
		turnoverCr: 976.0,
		closingDr: 0.0,
		closingCr: 64487242.19,
		children: [
			{
				id: "3.1",
				code: "3.1",
				name: "Premium Income",
				count: 0,
				openingDr: 0.0,
				openingCr: 45000000.0,
				turnoverDr: 500.0,
				turnoverCr: 800.0,
				closingDr: 0.0,
				closingCr: 45000300.0,
			},
			{
				id: "3.2",
				code: "3.2",
				name: "Investment Income",
				count: 0,
				openingDr: 0.0,
				openingCr: 12000000.0,
				turnoverDr: 124.0,
				turnoverCr: 76.0,
				closingDr: 0.0,
				closingCr: 11999952.0,
			},
			{
				id: "3.3",
				code: "3.3",
				name: "Other Income",
				count: 0,
				openingDr: 0.0,
				openingCr: 7486990.19,
				turnoverDr: 100.0,
				turnoverCr: 100.0,
				closingDr: 0.0,
				closingCr: 7486990.19,
			},
		],
	},
	{
		id: "4",
		code: "4",
		name: "Expenses",
		count: 4,
		openingDr: 24870174.25,
		openingCr: 0.0,
		turnoverDr: 97.6,
		turnoverCr: 72.4,
		closingDr: 24870199.45,
		closingCr: 0.0,
		children: [
			{
				id: "4.1",
				code: "4.1",
				name: "Claims Expenses",
				count: 0,
				openingDr: 15000000.0,
				openingCr: 0.0,
				turnoverDr: 50.0,
				turnoverCr: 30.0,
				closingDr: 15000020.0,
				closingCr: 0.0,
			},
			{
				id: "4.2",
				code: "4.2",
				name: "Commission Expenses",
				count: 0,
				openingDr: 5500000.0,
				openingCr: 0.0,
				turnoverDr: 25.6,
				turnoverCr: 22.4,
				closingDr: 5500003.2,
				closingCr: 0.0,
			},
			{
				id: "4.3",
				code: "4.3",
				name: "Administrative Expenses",
				count: 0,
				openingDr: 4370174.25,
				openingCr: 0.0,
				turnoverDr: 22.0,
				turnoverCr: 20.0,
				closingDr: 4370176.25,
				closingCr: 0.0,
			},
		],
	},
];

export default function page() {
	const form = useForm<IncomeStatementSchemaDTO>({
		resolver: zodResolver(IncomeStatementSchema),
		mode: "onChange",
		defaultValues: emptyIncomeStatement,
	});

	const onSubmit = (data: any) => {
		console.log(data);
	};
	const [expandedItems, setExpandedItems] = useState(new Set());
	const [expandAll, setExpandAll] = useState(false);

	const toggleExpansion = (id: unknown) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
			// Also collapse all children
			const collapseChildren = (items: any[]) => {
				items.forEach((item) => {
					if (item.children) {
						newExpanded.delete(item.id);
						collapseChildren(item.children);
					}
				});
			};
			const item = findItemById(budgetReportData, id);
			if (item && item.children) {
				collapseChildren(item.children);
			}
		} else {
			newExpanded.add(id);
		}
		setExpandedItems(newExpanded);
	};

	const toggleExpandAll = () => {
		if (expandAll) {
			setExpandedItems(new Set());
		} else {
			const allIds = new Set();
			const addAllIds = (items: any[]) => {
				items.forEach((item) => {
					if (item.children && item.children.length > 0) {
						allIds.add(item.id);
						addAllIds(item.children);
					}
				});
			};
			addAllIds(budgetReportData);
			setExpandedItems(allIds);
		}
		setExpandAll(!expandAll);
	};

	const findItemById = (
		items: any[],
		id: unknown,
	): (typeof budgetReportData)[number] | null => {
		for (const item of items) {
			if (item.id === id) return item;
			if (item.children) {
				const found = findItemById(item.children, id);
				if (found) return found;
			}
		}
		return null;
	};

	const formatAmount = (amount: number) => {
		return amount.toLocaleString("en-IN", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const calculateTotals = () => {
		const totals = {
			openingDr: 0,
			openingCr: 0,
			turnoverDr: 0,
			turnoverCr: 0,
			closingDr: 0,
			closingCr: 0,
		};

		budgetReportData.forEach((item) => {
			totals.openingDr += item.openingDr;
			totals.openingCr += item.openingCr;
			totals.turnoverDr += item.turnoverDr;
			totals.turnoverCr += item.turnoverCr;
			totals.closingDr += item.closingDr;
			totals.closingCr += item.closingCr;
		});

		return totals;
	};

	const renderRow = (item: any, level = 0) => {
		const hasChildren = item.children && item.children.length > 0;
		const isExpanded = expandedItems.has(item.id);
		const paddingLeft = level * 20 + 12;

		return (
			<React.Fragment key={item.id}>
				<tr
					className={`border-b border-gray-200 hover:bg-gray-50 ${
						level > 0 ? "bg-gray-25" : ""
					}`}
				>
					<td
						className="py-3 text-sm"
						style={{ paddingLeft: `${paddingLeft}px` }}
					>
						<div className="flex items-center">
							{hasChildren && (
								<button
									onClick={() => toggleExpansion(item.id)}
									className="mr-2 p-1 hover:bg-gray-200 rounded"
								>
									{isExpanded ? (
										<ChevronDown className="w-4 h-4 text-gray-600" />
									) : (
										<ChevronRight className="w-4 h-4 text-gray-600" />
									)}
								</button>
							)}
							{!hasChildren && level > 0 && <div className="w-6 mr-2"></div>}
							<div className="flex items-center">
								{hasChildren && (
									<div className="w-6 h-6 bg-blue-600 text-white text-xs rounded flex items-center justify-center mr-2">
										{isExpanded ? (
											<Minus className="w-3 h-3" />
										) : (
											<Plus className="w-3 h-3" />
										)}
									</div>
								)}
								<span className="font-medium text-gray-800">{item.code}</span>
							</div>
						</div>
					</td>
					<td className="px-4 py-3 text-sm text-gray-800">
						<div className="flex items-center">
							<span>{item.name}</span>
							{item.count !== undefined && (
								<span className="ml-1 text-gray-500">({item.count})</span>
							)}
						</div>
					</td>
					<td className="px-4 py-3 text-sm text-right text-gray-800">
						{formatAmount(item.openingDr)}
					</td>
					<td className="px-4 py-3 text-sm text-right text-gray-800">
						{formatAmount(item.openingCr)}
					</td>
					<td className="px-4 py-3 text-sm text-right text-gray-800">
						{formatAmount(item.turnoverDr)}
					</td>
					<td className="px-4 py-3 text-sm text-right text-gray-800">
						{formatAmount(item.turnoverCr)}
					</td>
					<td className="px-4 py-3 text-sm text-right text-gray-800">
						{formatAmount(item.closingDr)}
					</td>
				</tr>
				{hasChildren &&
					isExpanded &&
					item.children.map((child: any) => renderRow(child, level + 1))}
			</React.Fragment>
		);
	};

	const totals = calculateTotals();

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<h2 className="text-xl font-bold text-gray-800 mb-6">
								Budget Report
							</h2>

							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									{/* {!kycNumberData && ( */}
									<div className="space-y-2">
										<FormSelect
											name="branch"
											options={[]}
											label="Fiscal Year"
											caption="Select Fiscal Year"
											form={form}
											required={true}
										/>
									</div>
									<div className="space-y-2 flex space-x-1">
										<DateConverter
											form={form}
											name="date"
											labelNep="from Date"
											labelEng="."
										/>{" "}
									</div>

									<div className="space-y-2 flex space-x-1">
										<DateConverter
											form={form}
											name="todate"
											labelNep="to Date"
											labelEng="."
										/>{" "}
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
			<div className="max-w-full mx-auto">
				{/* Header */}
				<div className="text-center mb-6">
					<div className="flex items-center justify-center mb-4">
						<Scale className="w-6 h-6 mr-3 text-gray-600" />
						<h1 className="text-2xl font-semibold text-gray-800">
							Budget Report
						</h1>
					</div>

					<div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
						<div className="flex items-center">
							<Calendar className="w-4 h-4 mr-2" />
							<span>From: 2025-08-26</span>
						</div>
						<span>→</span>
						<div className="flex items-center">
							<Calendar className="w-4 h-4 mr-2" />
							<span>To: 2025-08-26</span>
						</div>
					</div>

					{/* Expand All Toggle */}
					<div className="flex items-center justify-start mb-4">
						<label className="flex items-center cursor-pointer">
							<span className="text-sm text-gray-700 mr-3">Expand All</span>
							<div className="relative">
								<input
									type="checkbox"
									checked={expandAll}
									onChange={toggleExpandAll}
									className="sr-only"
								/>
								<div
									className={`w-10 h-6 rounded-full transition-colors ${
										expandAll ? "bg-blue-600" : "bg-gray-300"
									}`}
								>
									<div
										className={`w-4 h-4 bg-white rounded-full transition-transform translate-y-1 ${
											expandAll ? "translate-x-5" : "translate-x-1"
										}`}
									></div>
								</div>
							</div>
						</label>
					</div>
				</div>

				{/* Table */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-slate-600 text-white">
								<tr>
									<th className="px-4 py-4 text-left text-sm font-medium border border-slate-500">
										LG. Name
									</th>
									<th className="px-4 py-4 text-left text-sm font-medium border border-slate-500">
										Ledger Name
									</th>
									<th className="px-4 py-4 text-left text-sm font-medium border border-slate-500">
										Ledger No
									</th>
									<th className="px-4 py-4 text-left text-sm font-medium border border-slate-500">
										Budget Amount
									</th>

									{/* OPENING */}
									<th className="px-4 py-2 text-center text-sm font-medium border border-slate-500">
										Expense Amount
									</th>

									{/* TURNOVER */}
									<th className="px-4 py-2 text-center text-sm font-medium border border-slate-500">
										Expense Percent
									</th>

									{/* CLOSING */}
									<th className="px-4 py-2 text-center text-sm font-medium border border-slate-500">
										Remaining Budget
									</th>
								</tr>
							</thead>

							<tbody className="bg-white">
								{budgetReportData.map((item) => renderRow(item))}

								{/* Total Row */}
								<tr className="bg-gray-100 border-t-2 border-gray-300 font-semibold">
									<td className="px-4 py-4 text-sm text-gray-800"></td>
									<td className="px-4 py-4 text-sm text-gray-800 font-bold">
										Total
									</td>
									<td className="px-4 py-4 text-sm text-right text-gray-800 font-bold">
										{formatAmount(totals.openingDr)}
									</td>
									<td className="px-4 py-4 text-sm text-right text-gray-800 font-bold">
										{formatAmount(totals.openingCr)}
									</td>
									<td className="px-4 py-4 text-sm text-right text-gray-800 font-bold">
										{formatAmount(totals.turnoverDr)}
									</td>
									<td className="px-4 py-4 text-sm text-right text-gray-800 font-bold">
										{formatAmount(totals.turnoverCr)}
									</td>
									<td className="px-4 py-4 text-sm text-right text-gray-800 font-bold">
										{formatAmount(totals.closingDr)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
