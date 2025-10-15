import type React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InsuranceCalculationPageProps {
	data: any;
}
const InsuranceCalculationPage = ({ data }: InsuranceCalculationPageProps) => {
	interface DetailRowProps {
		label: string;
		value: React.ReactNode;
		isRightColumn?: boolean;
	}

	const DetailRow: React.FC<DetailRowProps> = ({
		label,
		value,
		isRightColumn = false,
	}) => (
		<div className={`grid grid-cols-3 py-1 ${isRightColumn ? "pl-8" : ""}`}>
			<span className="text-gray-700 text-sm">{label} </span>:
			<span className="text-gray-900 text-sm font-medium"> {value}</span>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 py-6">
			<div className=" mx-auto space-y-6">
				{/* Calculation Details Section */}
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="bg-blue-100  px-6 py-3">
						<h2 className="text-lg font-semibold text-gray-800">
							CALCULATION DETAILS
						</h2>
					</div>

					<div className="p-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Left Column */}
							<div className="space-y-2">
								<DetailRow label="Surrender Date" value={data?.surrenderDate} />
								<DetailRow
									label="Paid Instalment"
									value={data?.instalment ?? "0"}
								/>
								<DetailRow
									label="Remaining Period (in Years)"
									value={data?.remainingPeriod}
								/>
								<DetailRow label="SVF" value={data?.surrenderValueFactor} />
								<DetailRow
									label="PaidUp Sum Assured"
									value={data?.paidUpSumAssured}
								/>
								<DetailRow
									label="Adjusted PaidUp SA"
									value={data?.paidUpSumAssuredAfterAdjustment}
								/>
								<DetailRow
									label="Surrender Value"
									value={data?.surrenderValue}
								/>
								<DetailRow label="Tax" value={data?.tax} />
								<DetailRow
									label="Anticipation Paid"
									value={data?.anticipationPaid}
								/>
							</div>

							{/* Right Column */}
							<div className="space-y-2">
								<DetailRow
									label="Anniversary Date"
									value={data?.anniversaryDate}
									isRightColumn
								/>
								<DetailRow
									label="Total Premium Paid"
									value={data?.totalPremiumPaid}
									isRightColumn
								/>
								<DetailRow
									label="Completed Months"
									value={data?.completedMonth}
									isRightColumn
								/>
								<DetailRow
									label="Monthly Adjustment Factor"
									value={data?.monthlyAdjustmentFactor}
									isRightColumn
								/>
								<DetailRow
									label="Bonus"
									value={data?.vestedBonus}
									isRightColumn
								/>
								<DetailRow
									label="Adjusted Bonus"
									value={data?.bonusAfterAdjustment}
									isRightColumn
								/>
								<DetailRow
									label="Taxable Amount"
									value={data?.taxableAmount}
									isRightColumn
								/>
								<DetailRow
									label="Excess / Short"
									value={data?.excessShort}
									isRightColumn
								/>
								<DetailRow
									label="Net Payable"
									value={data?.netPayable}
									isRightColumn
								/>
							</div>
						</div>
					</div>
				</div>

				{/* PSA Details Section */}
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="bg-blue-100  px-6 py-3">
						<h2 className="text-lg font-semibold text-gray-800">PSA DETAILS</h2>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-blue-600 text-white">
								<tr>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Instalment
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Term
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Rate
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Interval
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Amount
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Period
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										SVF
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Surrender Value
									</th>
								</tr>
							</thead>
							<tbody className="bg-white">
								{data?.paidUpSumAssuredList &&
								data.paidUpSumAssuredList.length > 0 ? (
									data.paidUpSumAssuredList.map((row: any, index: number) => (
										<tr
											key={row.instalment}
											className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-150`}
										>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.instalment}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.term}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.rate.toFixed(2)}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.interval}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.amount.toFixed(2)}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.period}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{typeof row.svf === "number"
													? row.svf.toFixed(2)
													: row.svf}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.surrenderValue}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={8} className="text-center py-4 text-gray-500">
											No Data Available
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Bonus Details Section */}
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<div className="bg-blue-100  px-6 py-3">
						<h2 className="text-lg font-semibold text-gray-800">
							BONUS DETAILS
						</h2>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-blue-600 text-white">
								<tr>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										SN
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Sum Assured
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Start Date
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										End Date
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Installment
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Rate
									</th>
									<th className="px-4 py-3 text-left text-sm font-semibold">
										Bonus
									</th>
								</tr>
							</thead>
							<tbody className="bg-white">
								{data?.bonusList && data.bonusList.length > 0 ? (
									data.bonusList.map((row: any, index: number) => (
										<tr
											key={index}
											className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors duration-150`}
										>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.sn}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.sumAssured}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.startDate}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.endDate}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.noOfInstalment}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.bonusRate}
											</td>
											<td className="px-4 py-3 text-sm text-gray-900">
												{row.bonus}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={7} className="text-center py-4 text-gray-500">
											No Data Available
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
                <Link href={`/policy-service/surrender/memo/${data?.policyNumberEncrypted}`}><Button type="button" className="bg-white hover:bg-blue-200 text-black border-2  border-gray-600 font-bold mb-6">Generate Memo</Button></Link>


                                {/* Calculation Details Section */}
				<div className="bg-white rounded-lg shadow-md  overflow-hidden">
					<div className=" px-6 flex justify-between">
						<h2 className="text-lg font-semibold text-gray-800">
							Verification DETAILS
						</h2>
                        <Button className="border-2 border-gray-600 bg-white hover:bg-blue-200 text-black font-bold">Download application</Button>
					</div>

					<div className="p-6">
						<h2>All surrender Document in Pdf</h2>
					</div>
				</div>
				{/* Print Button */}
				
			</div>
		</div>
	);
};

export default InsuranceCalculationPage;
