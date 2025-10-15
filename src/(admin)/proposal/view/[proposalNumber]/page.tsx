"use client";
import { Printer } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { Button } from "@/components/ui/button";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";

export default function Page() {
	const [proposalData, setProposalData] = useState<AddEditKycWithFileDTO>();
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const proposalNumber = params.proposalNumber;
	console.log("proposalNumbe this is propooser data", proposalData);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = {
					ProposalNumberEncrypted: proposalNumber || null,
					endpoint: "proposal_view",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log(
					"this is form respons from the proposal ....................e",
					response,
				);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setProposalData(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching proposal Detail data:", error);
			} finally {
				setLoading(false);
			}
		};
		if (proposalNumber) {
			fetchData();
		}
	}, [proposalNumber]);

	const handlePrint = () => {
		const printStyles = `
            <style>
                @media print {
                    @page {
                        margin: 0.5in;
                    }
                    
                    body * {
                        visibility: hidden;
                    }
                    
                    .print-content, .print-content * {
                        visibility: visible;
                    }
                    
                    .print-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .p-6{
                        padding:0;
                    }
                         .text-sidebar-foreground{
                        display:none;
                        }
                }
            </style>
        `;

		const styleElement = document.createElement("div");
		styleElement.innerHTML = printStyles;
		document.head.appendChild(styleElement);

		window.print();

		setTimeout(() => {
			document.head.removeChild(styleElement);
		}, 1000);
	};

	const cellStyle = {
		border: "1px solid #222",
		padding: "6px 8px",
		fontSize: "12px",
		verticalAlign: "top",
	};

	const thStyle = {
		...cellStyle,
		background: "#f5f5f5",
		fontWeight: "bold",
	};

	const sectionTitle = {
		fontWeight: "bold",
		marginTop: 24,
		marginBottom: 4,
		fontSize: 14,
		display: "block",
		clear: "both",
	};

	return (
		<div className="min-h-screen">
			<div className="">
				<div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
					<Button
						onClick={handlePrint}
						className="cursor-pointer flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
					>
						<Printer color="#fff" size={18} />
						<span>Print</span>
					</Button>
				</div>

				{loading ? (
					<div className="bg-white rounded-lg border-1 p-6 text-center">
						<p>Loading Proposal details...</p>
					</div>
				) : proposalData ? (
					<div className="bg-white rounded-lg border-1 mb-6 mt-4">
						<div className="print-content">
							<div className="p-6">
								<div
									className="print-content"
									style={{
										fontFamily: "Arial, sans-serif",
										background: "#fff",
										padding: 24,
									}}
								>
									<div
										style={{
											margin: "0 auto",
											background: "#fff",
										}}
									>
										<h2 style={{ textAlign: "center", marginBottom: 0 }}>
											Sun Life Insurance Limited
										</h2>
										<div
											style={{
												textAlign: "center",
												fontWeight: "bold",
												marginBottom: 24,
											}}
										>
											UNDERWRITING SHEET
										</div>

										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 16,
											}}
										>
											<tbody>
												<tr>
													<th style={thStyle}>KYC No</th>
													<th style={thStyle}>Proposal</th>
													<th style={thStyle}>Agent Name / Code</th>
													<th style={thStyle}>Submitted on</th>
													<th style={thStyle}>Branch</th>
													<th style={thStyle}>Proposal Status</th>
												</tr>
												<tr>
													<td style={cellStyle}>{proposalData.kycNumber}</td>

													<td style={cellStyle}>
														{proposalData.proposalNumber}
													</td>

													<td style={cellStyle}>
														{proposalData.agentName} /{proposalData.agentCode}
													</td>

													<td style={cellStyle}>{proposalData.registerDate}</td>

													<td style={cellStyle}>{proposalData.branchCode}</td>

													<td style={cellStyle}>{proposalData.status}</td>
												</tr>
											</tbody>
										</table>

										<div style={sectionTitle}>Personal Details</div>
										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<tbody>
												<tr>
													<th style={thStyle}>Name (Gender)</th>
													<th style={thStyle}>Date of Birth(Age)</th>
													<th style={thStyle}>Address</th>
													<th style={thStyle}>Maritial Status</th>
												</tr>
												<tr>
													<td style={cellStyle}>
														{proposalData.insuredDetails.name} / (
														{proposalData.insuredDetails.gender})
													</td>

													<td style={cellStyle}>
														{proposalData.insuredDetails.dateOfBirth} /
														{proposalData.insuredDetails.dateOfBirthLocal} (Age
														:{proposalData.insuredDetails.age} Yrs.)
													</td>

													<td style={cellStyle}>
														{proposalData.insuredDetails.permanentProvince} /
														{proposalData.insuredDetails.permanentDistrict} /
														{proposalData.insuredDetails.permanentMunicipality}{" "}
														/{proposalData.insuredDetails.permanentStreetName} ,
														{proposalData.insuredDetails.permanentWardNumber} /
													</td>
													<td style={cellStyle}>{proposalData?.proposerRelationship}</td>
												</tr>
											</tbody>
										</table>

										<div style={sectionTitle}>Health Details</div>
										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<tbody>
												<tr>
													<th style={thStyle} rowSpan={2}>
														Height(Cms/Weight (kg))
													</th>
													<th style={thStyle} colSpan={3}>
														BP Reading
													</th>
													<th style={thStyle} rowSpan={2}>
														Chest (Ins/Exp) Inches
													</th>
													<th style={thStyle} rowSpan={2}>
														Girth Of Abdomen (Inches)
													</th>
													<th style={thStyle} rowSpan={2}>
														Alcohol
													</th>
													<th style={thStyle} rowSpan={2}>
														Tobacco
													</th>
													<th style={thStyle} rowSpan={2}>
														Medical Requirement
													</th>
												</tr>
												<tr>
													<th style={thStyle}>1st (Sys / Dia)</th>
													<th style={thStyle}>2nd (Sys / Dia)</th>
													<th style={thStyle}>3rd (Sys / Dia)</th>
												</tr>
												<tr>
													<td style={cellStyle}>
														{proposalData.insuredMedical.heightInCM}(
														{proposalData.insuredMedical.height} cm) / &nbsp;
														{proposalData.insuredMedical.weight} (kg)
													</td>

													<td style={cellStyle}>
														{proposalData.insuredMedical.systolicReading1}/
														{proposalData.insuredMedical.diastolicReading1}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.systolicReading2}/
														{proposalData.insuredMedical.diastolicReading2}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.systolicReading3}/
														{proposalData.insuredMedical.diastolicReading3}
													</td>

													<td style={cellStyle}>
														{proposalData.insuredMedical.chestAtInspiration}/
														{proposalData.insuredMedical.chestAtExpiration}
													</td>

													<td style={cellStyle}>
														{proposalData.insuredMedical.abdominalGirth}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.doDrinkAlcohol?.toString()}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.doSmoke?.toString()}
													</td>
													<td style={cellStyle}>
														{
															proposalData.insuredMedical
																.extraMedicalTestReports
														}
													</td>
												</tr>
											</tbody>
										</table>

										<div style={sectionTitle}>Occupation Detail</div>
										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<tbody>
												<tr>
													<th style={thStyle}>Qualification</th>
													<th style={thStyle}>Occupation</th>
													<th style={thStyle}>Occupation Category</th>
													<th style={thStyle}>Income Amount</th>
													<th style={thStyle}>Income Mode</th>
												</tr>
												<tr>
													<td style={cellStyle}>
														{proposalData.insuredDetails.qualification}
													</td>

													<td style={cellStyle}>
														{proposalData.occupation}
													</td>

													<td style={cellStyle}>
														{proposalData.insuredDetails.profession}
													</td>

													<td style={cellStyle}>
														{proposalData.insuredDetails.incomeAmount}
													</td>

													<td style={cellStyle}>
														{proposalData.insuredDetails.incomeMode}
													</td>
												</tr>
											</tbody>
										</table>

										<div style={sectionTitle}>Previous Proposal / Policies</div>
										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<thead>
												<tr>
													<th style={thStyle}>Proposal Type</th>
													<th style={thStyle}>Proposal Id / Policy No</th>
													<th style={thStyle}>Policy Plan/Terms (Yrs)</th>
													<th style={thStyle}>Sum Assured</th>
													<th style={thStyle}>Date Of Birth</th>
													<th style={thStyle}>Name (as Assured/Proposer)</th>
													<th style={thStyle}>Status</th>
													<th style={thStyle}>Underwriter Decision</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td style={cellStyle}>
														{proposalData.insuredMedical.incomeMode}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.incomeMode}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.incomeMode}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.incomeMode}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.incomeMode}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.incomeMode}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.incomeMode}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.incomeMode}
													</td>
												</tr>
											</tbody>
										</table>

										<div style={sectionTitle}>Proposal Details</div>
										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<thead>
												<tr>
													<th style={thStyle}>Product</th>
													<th style={thStyle}>Sum Assured</th>
													<th style={thStyle}>Term</th>
													<th style={thStyle}>Paying Term (Yrs.)</th>
													<th style={thStyle}>Basic Premium Rate</th>
													<th style={thStyle}>Premium Frequency</th>
													<th style={thStyle}>Basic Premium</th>
													
												</tr>
											</thead>
											<tbody>
												<tr>
													<td style={cellStyle}>{proposalData?.productCode}</td>
													<td style={cellStyle}>{proposalData?.sumAssured}</td>
													<td style={cellStyle}>{proposalData?.term}</td>
													<td style={cellStyle}>{proposalData?.payTerm}</td>
													<td style={cellStyle}>{proposalData?.tableRate}</td>
													<td style={cellStyle}>{proposalData?.modeOfPayment}</td>
													<td style={cellStyle}>{proposalData?.tablePremium}</td>
													
												</tr>
											</tbody>
										</table>

										<div style={sectionTitle}>Nominee Details</div>
										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<thead>
												<tr>
													<th style={thStyle}>Name</th>
													<th style={thStyle}>Address</th>
													<th style={thStyle}>Father Name</th>
													<th style={thStyle}>Relation</th>
												</tr>
											</thead>
											<tbody>
												{proposalData.nomineeList.map((nominee, index) => (
													<tr key={nominee.index}>
														<td style={cellStyle}>{nominee.name}</td>
														<td style={cellStyle}>{nominee.address}</td>
														<td style={cellStyle}>{nominee.fatherName}</td>
														<td style={cellStyle}>{nominee.relation}</td>
													</tr>
												))}
												{/* <tr>
													<td style={cellStyle}>
														{proposalData.insuredMedical.nomineeList.name}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.nomineeList.address}
													</td>
													<td style={cellStyle}>
														{displayData(
															"insuredMedical.nomineeList.fatherName",
														)}
													</td>
													<td style={cellStyle}>
														{proposalData.insuredMedical.nomineeList.relation}
													</td>
												</tr> */}
											</tbody>
										</table>

										<div style={sectionTitle}>Premium Details</div>
										<table
											style={{
												width: "calc(50% - 5px)",
												borderCollapse: "collapse",
												marginBottom: 8,
												float: "left",
												marginRight: 10,
											}}
										>
											<thead>
												<tr>
													<th style={thStyle} colSpan={2}>
														Basic
													</th>
													<th style={thStyle}>Total</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td style={cellStyle}>Basic Premium Rate</td>
													<td style={cellStyle}>{proposalData.tableRate}</td>
													<td style={cellStyle}>{proposalData.tablePremium}</td>
												</tr>
												<tr>
													<td style={cellStyle}>Discount Rate</td>
													<td style={cellStyle}>{proposalData.discountRate}</td>
													<td style={cellStyle}>
														{proposalData.discountAmount}
													</td>
												</tr>
												<tr>
													<td style={cellStyle}>Large Sum Assured Rebate</td>
													<td style={cellStyle}>{proposalData.rebateRate}</td>
													<td style={cellStyle}>{proposalData.rebateAmount}</td>
												</tr>
												<tr>
													<td style={cellStyle}>Rebate on PayMode</td>
													<td style={cellStyle}>
														{proposalData.modeOfPaymentRebateRate}%
													</td>
													<td style={cellStyle}>
														{proposalData.modeOfPaymentRebateAmount}
													</td>
												</tr>
												<tr>
													<td style={cellStyle}>OverLoad on PayMode</td>
													<td style={cellStyle}>
														{proposalData.modeOfPaymentOverLoadRate}
													</td>
													<td style={cellStyle}>
														{proposalData.modeOfPaymentOverLoadAmount}
													</td>
												</tr>
												<tr>
													<td style={cellStyle}>Total (Basic Premium)</td>
													<td style={cellStyle}> </td>
													<td style={cellStyle}>{proposalData.basicPremium}</td>
												</tr>
												<tr>
													<td style={cellStyle}>
														Extra Amount (ExtraAmount + Health + Occupation+)
													</td>
													<td style={cellStyle}>
														{proposalData.extraRate} +{" "}
														{proposalData.healthExtraRate} +{" "}
														{proposalData.occupationExtraRate} +{" "}
														{proposalData.nonStandardAgeExtraRate}{" "}
													</td>
													<td style={cellStyle}>
														{proposalData.totalExtraPremium}
													</td>
												</tr>
												<tr>
													<td style={cellStyle}>Total Rider Premium</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}>
														{proposalData.totalRiderPremium}
													</td>
												</tr>
												<tr>
													<td style={cellStyle}>Total Applicable Premium</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}>{proposalData.premium}</td>
												</tr>
											</tbody>
										</table>

										<table
											style={{
												width: "calc(50% - 5px)",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<thead>
												<tr>
													<th style={thStyle}>Riders</th>
													<th style={thStyle}>Premium</th>
													{/* <th style={thStyle}>Extra</th>
													<th style={thStyle}>Total</th> */}
												</tr>
											</thead>
											<tbody>
												{proposalData.ridersList
													.filter(
														(item: { isSelected: boolean }) =>
															item.isSelected === true,
													)
													.map((rider, index) => (
														<tr key={rider.rowId}>
															<td style={cellStyle}>{rider.rider}</td>
															<td style={cellStyle}>{rider.riderPremium}</td>
															{/* <td style={cellStyle}>{rider.fatherName}</td>
															<td style={cellStyle}>{rider.relation}</td> */}
														</tr>
													))}
											</tbody>
										</table>
										{/* <div style={sectionTitle}>Underwriter Decision</div>
										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<thead>
												<tr>
													<th style={thStyle}>Underwriting</th>
													<th style={thStyle}>Decision</th>
													<th style={thStyle}>Comments</th>
													<th style={thStyle}>Approved Date</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td style={cellStyle}>
														{proposalData.agentCode}
													</td>
													<td style={cellStyle}>
														{proposalData.agentCode}
													</td>
													<td style={cellStyle}>
													{proposalData.agentCode}
													</td>
													<td style={cellStyle}>
														{proposalData.approvedDate}
													</td>
												</tr>
											</tbody>
										</table> */}

										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<tr>
												<td>
													<b>Gross Premium :</b> {proposalData.premium}
												</td>
												<td>
													<b>Less Medical :</b> {proposalData.premium}
												</td>
												<td>
													<b>Net First Premium :</b> 50,028.00
												</td>
											</tr>
											<tr>
												<td>
													<b>Created By :</b> {proposalData.createdBy}{" "}
													&nbsp;&nbsp;
												</td>
												<td>
													<b>Forwarded By :</b> {proposalData.forwardedBy}{" "}
													&nbsp;&nbsp;
												</td>
												<td>
													<b>Approved By : {proposalData.approvedBy}</b>
												</td>
											</tr>
										</table>
										<small style={{ display: "block", textAlign: "right" }}>
											Printed By ADMIN_USER on 7/16/2025 12:23:35PM
										</small>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="bg-white rounded-lg border-1 p-6 text-center">
						<p>No Proposal details found for number: {proposalNumber}</p>
					</div>
				)}
			</div>
		</div>
	);
}
