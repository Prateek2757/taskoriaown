import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AddEditAgentTrainingDTO } from "../schemas/agentTrainingSchema";

export default function KYCDetails({
	kycData,
	KycNumberEncrypted,
}: {
	kycData: AddEditAgentTrainingDTO;
	KycNumberEncrypted?: string;
}) {
	return (
		<div className="bg-white rounded-lg border-1  mt-4">
			<div className="p-6">
				<div className="flex justify-between">
					<h2 className="text-xl font-bold text-gray-800 mb-6">KYC Details</h2>
					<Button asChild>
						<Link
							href={`/kyc/view/${KycNumberEncrypted}`}
							className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
						>
							<Eye color="#fff" size={18} />
							<span>View Full KYC</span>
						</Link>
					</Button>
				</div>

				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								KYC Number:
								<span className="ml-1">
									<b>{kycData?.kycNumber}</b>
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								Branch:
								<span className="ml-1">
									<b>{kycData?.branchCode}</b>
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								Name:
								<span className="ml-1">
									<b>
										{kycData?.firstName} {kycData?.lastName}
									</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								Nationality:
								<span className="ml-1">
									<b>{kycData?.nationality}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								DOB:
								<span className="ml-1">
									<b>{kycData?.dateOfBirth}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								Mobile No:
								<span className="ml-1">
									<b>{kycData?.mobileNumber}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								Email:
								<span className="ml-1">
									<b>{kycData?.email}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								Landline No:
								<span className="ml-1">
									<b>{kycData?.landLineNumber}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								Foreign Phone no:
								<span className="ml-1">
									<b>{kycData?.foreignPhone}</b>
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center text-gray-700 text-sm">
								Foreign Address:
								<span className="ml-1">
									<b>{kycData?.foreignAddress}</b>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
