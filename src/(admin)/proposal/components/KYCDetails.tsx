import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AddEditKycWithFileDTO } from "../../kyc/schemas/kycSchema";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KYCDetails({
	kycData,
	KycNumberEncrypted,
}: {
	kycData: AddEditKycWithFileDTO;
	KycNumberEncrypted?: string;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>KYC Details</CardTitle>
				<CardAction>
					<Button asChild>
						<Link
							href={`/kyc/view/${KycNumberEncrypted}`}
						>
							<Eye className="text-white dark:text-black" size={18} />
							<span>View Full KYC</span>
						</Link>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								KYC Number:
								<span className="ml-1">
									<b>{kycData?.kycNumber}</b>
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								Branch:
								<span className="ml-1">
									<b>{kycData?.branchCode}</b>
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								Name:
								<span className="ml-1">
									<b>
										{kycData?.firstName} {kycData?.lastName}
									</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								Nationality:
								<span className="ml-1">
									<b>{kycData?.nationality}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								DOB:
								<span className="ml-1">
									<b>{kycData?.dateOfBirth}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								Mobile No:
								<span className="ml-1">
									<b>{kycData?.mobileNumber}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								Email:
								<span className="ml-1">
									<b>{kycData?.email}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								Landline No:
								<span className="ml-1">
									<b>{kycData?.landLineNumber}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								Foreign Phone no:
								<span className="ml-1">
									<b>{kycData?.foreignPhone}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 dark:text-white text-sm">
								Foreign Address:
								<span className="ml-1">
									<b>{kycData?.foreignAddress}</b>
								</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
