"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { Landmark, MessageSquareShare, ScrollText } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddEditKycWithFileDTO } from "../../kyc/schemas/kycSchema";

export default function PersonalInformation() {
	const [kycData, setKycData] = useState<AddEditKycWithFileDTO>();
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const kycNumber = params.kycNumber;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = {
					KYCNumberEncrypted: kycNumber || null,
					endpoint: "kyc_view",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is form response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setKycData(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Kyc Detail data:", error);
			} finally {
				setLoading(false);
			}
		};
		if (kycNumber) {
			fetchData();
		}
	}, []);

	const displayData = (field: keyof AddEditKycWithFileDTO): string => {
		if (!kycData) return "N/A";
		const value = kycData[field];
		return value?.toString() || "N/A";
	};

	return (
		<div className="grid grid-cols-[1fr_2fr] items-start gap-3 py-2 ">
			<Card className="rounded-lg border-1 gap-3 sticky top-14">
				<div className="flex flex-wrap items-start gap-5 mx-5">
					<Image
						src="/images/profile.jpeg"
						alt="Description"
						width={120}
						height={120}
						className="rounded-lg flex-shrink-0 transition-all duration-300 w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover"
					/>
					<div className="flex flex-col flex-1 min-w-0 max-w-full break-words">
						<span className="text-lg font-bold break-words">
							Prithivi narayan bir bikram shah
						</span>
						<span className="text-md text-gray-400 font-bold break-words">
							#Agent Code
						</span>
						<Separator className="my-2 border-t-1 border-dashed border-gray-300 bg-transparent" />
						<span className="text-gray-700 text-sm">9841563155</span>
						<span className="text-gray-700 text-sm">
							ProposalEmail@gmail.com
						</span>
						<Button variant={"outline"} size={"sm"} className="mt-2">
							<MessageSquareShare />
							Message
						</Button>
					</div>
				</div>
				<CardContent>
					<Separator className="mb-2" />
					<div className=" space-y-4 mb-4">
						<h1 className="text-lg font-semibold mb-3">Address</h1>
						<div className="flex flex-col gap-2">
							<span className="text-gray-700">
								Province: <b>Bagmati</b>
							</span>
							<span className="text-gray-700">
								District: <b>Kathmandu</b>
							</span>
							<span className="text-gray-700">
								Municipality: <b>Nagarjun Municipality</b>
							</span>
						</div>
					</div>
					<Separator className="my-2" />
					<div className=" space-y-4 ">
						<h1 className="text-lg font-semibold mb-3">Account Status</h1>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Landmark className="h-5 w-5 text-gray-500" />{" "}
								<span>Bank Account</span>
							</div>
							<Badge className="bg-green-500 text-white dark:bg-green-600">
								Approved
							</Badge>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<ScrollText className="h-5 w-5 text-gray-500" />{" "}
								<span>KYC</span>
							</div>
							<Badge className="bg-red-500 text-white dark:bg-green-600">
								Not Approved
							</Badge>
						</div>
					</div>
				</CardContent>
			</Card>
			<div>
				<div className="bg-white rounded-lg border-1">
					<div className="p-6">
						<h2 className="text-lg font-bold text-gray-800 mb-3">
							User Information
						</h2>

						<div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Agent Code:
										<span className="ml-1">
											<b>{displayData("agentCode")}</b>
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Agent Name:
										<span className="ml-1">
											<b>{displayData("branchCode")}</b>
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Age:
										<span className="ml-1">
											<b>{displayData("residenceStatus")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Gender:
										<span className="ml-1">
											<b>{displayData("nationality")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Mobile Number:
										<span className="ml-1">
											<b>{displayData("religion")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Date Of Birth:
										<span className="ml-1">
											<b>{displayData("salutation")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Nationality:
										<span className="ml-1">
											<b>{displayData("nationality")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Religion:
										<span className="ml-1">
											<b>{displayData("religion")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Place Of Birth:
										<span className="ml-1">
											<b>{displayData("placeOfBirth")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										KYC ID:
										<span className="ml-1">
											<b>{displayData("kycId")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Client Number:
										<span className="ml-1">
											<b>{displayData("clientNumber")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Citizenship Number:
										<span className="ml-1">
											<b>{displayData("citizenshipNumber")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Registration Number:
										<span className="ml-1">
											<b>{displayData("registrationNumber")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Policy Number:
										<span className="ml-1">
											<b>{displayData("policyNumber")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Marital Status:
										<span className="ml-1">
											<b>{displayData("maritalStatus")}</b>
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Resident Status:
										<span className="ml-1">
											<b>{displayData("residentStatus")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Qualification:
										<span className="ml-1">
											<b>{displayData("qualification")}</b>
										</span>
									</div>
								</div>
							</div>
						</div>

						<h2 className="text-lg font-bold text-gray-800 mb-3 mt-3">
							Family Details
						</h2>

						<div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Father&apos;s Name:
										<span className="ml-1">
											<b>{displayData("fatherName")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Mother&apos;s Name:
										<span className="ml-1">
											<b>{displayData("motherName")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Grand Father&apos;s Name:
										<span className="ml-1">
											<b>{displayData("grandFatherName")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Spouse Name:
										<span className="ml-1">
											<b>{displayData("spouseName")}</b>
										</span>
									</div>
								</div>
							</div>
						</div>

						<h2 className="text-lg font-bold text-gray-800 mb-3 mt-3">
							Associated Profession / Business Information
						</h2>
						<div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Profession:
										<span className="ml-1">
											<b>{displayData("profession")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Company Name:
										<span className="ml-1">
											<b>{displayData("companyName")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Company Address:
										<span className="ml-1">
											<b>{displayData("companyAddress")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Branch:
										<span className="ml-1">
											<b>{displayData("incomeMode")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Income Amount:
										<span className="ml-1">
											<b>{displayData("incomeAmount")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										PAN No.:
										<span className="ml-1">
											<b>{displayData("panNumber")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										CIT No.:
										<span className="ml-1">
											<b>{displayData("citNumber")}</b>
										</span>
									</div>
								</div>
							</div>
						</div>

						<h2 className="text-lg font-bold text-gray-800 mb-3 mt-3">
							Bank Details
						</h2>
						<div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Bank Name:
										<span className="ml-1">
											<b>{displayData("bankName")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Bank Account No.:
										<span className="ml-1">
											<b>{displayData("bankAccountNumber")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Bank Account Name:
										<span className="ml-1">
											<b>{displayData("bankAccountName")}</b>
										</span>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-gray-700 text-sm">
										Bank Branch:
										<span className="ml-1">
											<b>{displayData("bankBranchCode")}</b>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* <BasicInfo1 />
                    <PersonalInfo /> */}
				{/* <BasicInfo2 /> */}
			</div>
		</div>
	);
}
