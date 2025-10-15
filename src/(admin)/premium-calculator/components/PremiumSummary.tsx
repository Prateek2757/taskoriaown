import { CreditCard, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type PremiumDetails = {
	sumAssured?: number;
	age?: number;
	term?: number;
	payTerm?: number;
	premium?: number;
	basicPremium?: number;
	discountAmount?: number;
	tableRate?: number | string;
	modeOfPayment?: string;
	totalRiderPremium: number;
	ridersList?: {
		rider: string;
		riderPremium: number;
		sumAssured: number;
		rate: number | string;
		term: number;
		rowId: string;
	}[];
	sumAssuredRebateRate?: string;
	modeOfPaymentRebateRate?: string;
	modeOfPaymentOverLoadRate?: string;
	totalRiderExtraAmount?: string;
};

interface PremiumSummaryProps {
	premiumDetails: PremiumDetails;
}

const PremiumSummary = ({ premiumDetails }: PremiumSummaryProps) => {
	console.log("Premium Details:", premiumDetails);
	const formatCurrency = (value: number | undefined) =>
		value
			? `Rs. ${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
			: "N/A";

	const {
		sumAssured,
		age,
		term,
		payTerm,
		premium,
		basicPremium,
		tableRate,
		modeOfPayment,
		totalRiderPremium,
		ridersList = [],
		sumAssuredRebateRate,
		modeOfPaymentRebateRate,
		modeOfPaymentOverLoadRate,
		totalRiderExtraAmount,
	} = premiumDetails;

	return (
		<div className="">
			<div className="max-w-6xl mx-auto space-y-4">
				<div className="grid lg:grid-cols-1 gap-4">
					<Card className=" bg-blue-50 text-white justify-center pb-0 border-2 border-blue-400 p-0">
						<CardContent className="p-6">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
								<div className="flex items-center gap-4 flex-1">
									<div className="space-y-2 flex-1">
										<div className="flex gap-2">
											<Button
												variant="default"
												className="bg-blue-600 hover:bg-blue-700"
											>
												{modeOfPayment === "M"
													? "Monthly"
													: modeOfPayment === "Q"
														? "Quarterly"
														: "Yearly"}
											</Button>
											<div className="flex flex-wrap gap-2">
												<Badge
													variant="secondary"
													className="bg-blue-50 text-blue-700 hover:bg-blue-100"
												>
													Age: {age ?? "N/A"}
												</Badge>
												<Badge
													variant="secondary"
													className="bg-blue-50 text-blue-700 hover:bg-blue-100"
												>
													Term: {term} years
												</Badge>
												<Badge
													variant="secondary"
													className="bg-blue-50 text-blue-700 hover:bg-blue-100"
												>
													Paying: {payTerm} years
												</Badge>
											</div>
										</div>
										<hr className="border-gray-300 mt-5"></hr>
										<div className="flex items-center gap-2 justify-between">
											<h2 className="text-gray-700 font-medium">
												Sum Assured:
											</h2>
											<p className="text-xl font-bold text-gray-600">
												{formatCurrency(sumAssured)}
											</p>
										</div>
										<hr className="border-gray-300 mb-5"></hr>

										<div className="flex gap-2 justify-between items-center">
											<span className="text-gray-600 text-sm">
												Base Premium
											</span>
											<span className="text-gray-600 font-bold text-lg">
												{formatCurrency(basicPremium)}
											</span>
										</div>
										<div className="flex gap-2 justify-between items-center">
											<span className="text-gray-600 text-sm">
												Rider Premium
											</span>
											<span className="text-gray-600 font-bold text-lg">
												{formatCurrency(totalRiderPremium)}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="flex justify-between items-center bg-blue-400 p-5 rounded-bl-lg rounded-br-lg mt-4 -mx-6 -mb-6">
								<span className="text-white text-2xl font-bold">
									Net Premium:
								</span>
								<span className="font-bold text-2xl">
									{formatCurrency(premium)}
								</span>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-blue-600">
								<CreditCard className="w-5 h-5" />
								Premium Details
							</CardTitle>
						</CardHeader>
						<hr className="border-gray-200 -mt-3"></hr>
						<CardContent className="space-y-4">
							<div className="flex justify-between items-center">
								<div className="text-gray-600 flex-1">Basic Premium Rate:</div>
								<div className="font-medium">{tableRate}</div>
							</div>
							<div className="flex justify-between items-center">
								<div className="text-gray-600 flex-1">Large Sum Rebate:</div>
								<div className="font-medium">Rs.{sumAssuredRebateRate}</div>
							</div>
							<div className="flex justify-between items-center">
								<div className="text-gray-600 flex-1">Rebate on PayMode:</div>
								<div className="font-medium">{modeOfPaymentRebateRate}%</div>
							</div>
							<div className="flex justify-between items-center">
								<div className="text-gray-600 flex-1">OverLoad on PayMode:</div>
								<div className="font-medium">{modeOfPaymentOverLoadRate}</div>
							</div>
							<div className="flex justify-between items-center">
								<div className="text-gray-600 flex-1">Total (BP):</div>

								<div className="font-medium">{basicPremium}</div>
							</div>
							<div className="flex justify-between items-center">
								<div className="text-gray-600 flex-1">Total Rider Extra:</div>

								<div className="font-medium">{totalRiderExtraAmount}</div>
							</div>
							<div className="flex justify-between items-center">
								<div className="text-gray-600 flex-1">Total Rider Premium:</div>

								<div className="font-medium">{totalRiderPremium}</div>
							</div>
							<hr className="border-gray-200" />
							<div className="flex justify-between items-center">
								<div className="text-gray-600 flex-1 font-bold">
									Total Applicable Premium:
								</div>
								<div className="font-medium">{premium}</div>
							</div>
						</CardContent>
					</Card>
				</div>
				{ridersList && ridersList.length > 0 && (
					<div className="grid lg:grid-cols-1 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-blue-600">
									<Shield className="w-5 h-5" />
									Selected Riders
								</CardTitle>
							</CardHeader>
							<hr className="border-gray-200 -mt-3"></hr>

							<CardContent className="space-y-4">
								{ridersList.map((rider) => (
									<div key={rider.rowId} className="shadow-none">
										<div className="space-y-4">
											<div className="flex justify-between items-center">
												<span className="text-gray-600">
													<Button
														variant="default"
														className="bg-blue-600 hover:bg-blue-700"
													>
														{rider.rider}
													</Button>
												</span>
												<span className="font-medium">
													{formatCurrency(rider.riderPremium)}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-gray-600">Sum Assured:</span>
												<span className="font-medium">
													{formatCurrency(rider.sumAssured)}
												</span>
											</div>
											{/* <div className="flex justify-between items-center">
												<span className="text-gray-600">Rate:</span>
												<span className="font-medium">{rider.rate}</span>
											</div> */}
											<div className="flex justify-between items-center">
												<span className="text-gray-600">Term:</span>
												<span className="font-medium">{rider.term} years</span>
											</div>
										</div>
										<Separator className="mt-3" />
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
};

export default PremiumSummary;
