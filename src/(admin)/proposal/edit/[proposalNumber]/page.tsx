"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import type { AddEditKycDTO } from "@/app/(admin)/";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import ProposalForm from "../../proposalForm";
import { AddProposalDTO } from "../../proposalSchema";

export default function Page() {

const [proposalData, setProposalData] = useState<AddProposalDTO>();

	const params = useParams();
	useEffect(() => {
		const proposalNumber = params.proposalNumber;
		const fetchData = async () => {
			try {
				const data = {
					ProposalNumberEncrypted: proposalNumber || null,
					endpoint: "proposal_detail",
				};
			

				const response = await apiPostCall(data as PostCallData);
				console.log("this is proposal detail response", response.data);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setProposalData(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Kyc Detail data:", error);
			} finally {
			}
		};
		if (proposalNumber) {
			fetchData();
		}
	}, [params.proposalNumber]);
	return <ProposalForm data={proposalData} />;
}
