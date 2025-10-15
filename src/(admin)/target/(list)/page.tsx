"use client";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import DailyTargetForm from "../components/TargetForm";
import ViewModal from "./viewModal";

export default function Page() {
	const { showToast } = useToast();
	const [targetDetail, setTargetDetails] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);

	const getTargetDetails = async () => {
		try {
			setIsLoading(true);
			const submitData: PostCallData & {
				userName?: string | undefined | null;
			} = {
				endpoint: "get_target_details",
			};
			const response = await apiPostCall(submitData);
			console.log("getTargetDetails information is in this log", response.data);
			if (response.data.code === SYSTEM_CONSTANTS.success_code) {
				setTargetDetails(response.data);
			} else {
				showToast(
					response?.data.code,
					response?.data.message,
					"Target Addition Failed",
				);
			}
		} catch (_error) {
			showToast("103", "Something went wrong", "Target Addition Failed");
		} finally {
			setIsLoading(false);
		}
	};

	const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
	const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

	const handlegetClick = (e: React.MouseEvent) => {
		e.preventDefault();
		getTargetDetails();
		setIsReferralModalOpen(true);
	};
	const handleLeadClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLeadModalOpen(true);
	};
	const searchOptions = [
		{
			placeholder: "Filter Proposal Number",
			name: "proposalNumber",
			type: "text",
		},
		{
			placeholder: "Filter Name",
			name: "FullName",
			type: "text",
		},
		{
			placeholder: "Mobile Number",
			name: "MobileNumber",
			type: "tel",
		},
	];

	return (
		<div className="py-2">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<DailyTargetForm
					isOpen={isLeadModalOpen}
					onClose={() => setIsLeadModalOpen(false)}
				/>
				<Link
					href="#"
					onClick={handleLeadClick}
					className="block group bg-green-50 border border-green-200 rounded-lg p-6 hover:shadow-sm transition-all duration-200"
				>
					<div className="flex items-center mb-4">
						<div className="flex items-center justify-center p-2 rounded-full bg-green-100">
							<Plus />
						</div>
						<h2 className="ml-3 text-xl font-semibold text-gray-900">
							Add Target
						</h2>
					</div>
					<p className="text-gray-600">Add target for today</p>
				</Link>
				<Link
					href="#"
					onClick={handlegetClick}
					className="block group bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-sm transition-all duration-200"
				>
					<div className="flex items-center mb-4">
						<div className="flex items-center justify-center p-2 rounded-full bg-green-100">
							<Eye />
						</div>
						<h2 className="ml-3 text-xl font-semibold text-gray-900">
							View Target
						</h2>
					</div>
					<p className="text-gray-600">View target for today</p>
				</Link>

				<ViewModal
					isOpen={isReferralModalOpen}
					targetDetail={targetDetail}
					onClose={() => setIsReferralModalOpen(false)}
					isLoading={isLoading}
				/>
			</div>
			{/* <DataTable
                searchOptions={searchOptions}
                columns={createProposalColumns}
                endpoint="online_proposal_list"
            /> */}
		</div>
	);
}
