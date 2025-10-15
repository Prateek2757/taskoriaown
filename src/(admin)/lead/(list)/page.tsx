"use client";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import LeadForm from "../components/LeadForm";
import ViewModal from "./viewModal";

export default function Page() {
	const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
	const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
	const { showToast } = useToast();
	const [targetDetail, setTargetDetails] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const getLeadDetails = async () => {
		const formData = {
			Status: "Agent",
			FromDate: new Date().toISOString().split("T")[0],
			ToDate: new Date().toISOString().split("T")[0],
		};
		console.log("this is the form data", formData);

		try {
			setIsLoading(true);
			const submitData: PostCallData & {
				userName?: string | undefined | null;
			} = {
				...formData,
				endpoint: "lead_view_data",
			};
			const response = await apiPostCall(submitData);
			const { data } = response; // Real data

			console.log(
				"getLeadDetails information is in this log in in the log of the data",
				data.derReportList,
			);
			if (response.data.code === SYSTEM_CONSTANTS.success_code) {
				setTargetDetails(data.derReportList);
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

	const handlegetClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsReferralModalOpen(true);
		getLeadDetails();
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
				<LeadForm
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
							Add Lead
						</h2>
					</div>
					<p className="text-gray-600">Add lead for today</p>
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
							View Lead
						</h2>
					</div>
					<p className="text-gray-600">View lead for today</p>
				</Link>

				{/* <Link
                    href="#"
                    className=""
                > */}
				<ViewModal
					isOpen={isReferralModalOpen}
					onClose={() => setIsReferralModalOpen(false)}
				/>

				{/* </Link> */}
				{/* <DataTable
				searchOptions={searchOptions}
				columns={createProposalColumns}
				endpoint="online_proposal_list"
			/> */}
			</div>
		</div>
	);
}
