"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import ProposalForm from "../../components/ProposalForm";
import type { AddEditOnlineProposalDTO } from "../../onlineProposalSchema";

export default function Page() {
	const [proposalData, setProposalData] = useState<AddEditOnlineProposalDTO>();

	const params = useParams();
	useEffect(() => {
		const proposalNumber = params.proposalNumber;
		const fetchData = async () => {
			try {
				const data = {
					proposalNumberEncrypted: proposalNumber || null,
					endpoint: "online_proposal_detail",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is --- proposal edit ------ response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setProposalData(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Proposal Detail data:", error);
			} finally {
			}
		};
		if (proposalNumber) {
			fetchData();
		}
	}, [params.proposalNumber]);
	return <ProposalForm isLoggedIn={true} data={proposalData} />;
}
