"use client";
import { useState, useEffect } from "react";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";

export default function ProposalPage() {
	interface Proposal {
		rowNum: string;
		fullName: string;
		dob: string;
		age: string;
		address: string;
		productName: string;
		sumAssured: string;
		premium: string;
		status: string;
	}

	const [proposalData, setProposalData] = useState<Proposal[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = {
					email: "test@test.com",
					password: "test",
					endpoint: "online_proposal_list",
				};
				const response = await apiPostCall(data as PostCallData);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setProposalData(response.data.proposalData);
				}
			} catch (error) {
				console.error("Error fetching proposal data:", error);
			}
		};

		fetchData(); // Call the async function
	}, []); // Empty dependency array ensures this runs only once on mount

	return (
		<div>
			<h1>Proposal List</h1>

			{/* Render the table */}
			<table style={{ borderCollapse: "collapse", width: "100%" }}>
				<thead>
					<tr>
						<th>Row Number</th>
						<th>Full Name</th>
						<th>Date of Birth</th>
						<th>Age</th>
						<th>Address</th>
						<th>Product Name</th>
						<th>Sum Assured</th>
						<th>Premium</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{proposalData && proposalData.length > 0 ? (
						proposalData.map((item: Proposal) => (
							<tr key={item.rowNum}>
								<td>{item.rowNum}</td>
								<td>{item.fullName || "N/A"}</td>
								<td>{item.dob || "N/A"}</td>
								<td>{item.age || "N/A"}</td>
								<td>{item.address || "N/A"}</td>
								<td>{item.productName || "N/A"}</td>
								<td>{item.sumAssured || "N/A"}</td>
								<td>{item.premium || "N/A"}</td>
								<td>{item.status || "N/A"}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={9}>No data available</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
