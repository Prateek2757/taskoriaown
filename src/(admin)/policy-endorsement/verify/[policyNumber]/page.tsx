"use client";
import { Printer } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";

export default function Page() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [proposalData, setProposalData] = useState<AddEditKycWithFileDTO>();
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const proposalNumber = params.proposalNumber;
	const { showToast } = useToast();
	const router = useRouter();

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

				<>
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
										Endorsement UNDERWRITING SHEET
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
													<th style={thStyle}>EndorsementID</th>
													<th style={thStyle}>Agent Name / Code</th>
													<th style={thStyle}>Superior Agent Name / Code</th>
													<th style={thStyle}>Submitted on</th>
													<th style={thStyle}>Branch</th>
													<th style={thStyle}>Sub Branch</th>
													<th style={thStyle}>Proposal Status</th>
												</tr>
												<tr>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
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
													<th style={thStyle}></th>
													<th style={thStyle}>Name (Gender)</th>
													<th style={thStyle}>Date of Birth(Age)</th>
													<th style={thStyle}>Address</th>
													<th style={thStyle}>Relationship</th>
													<th style={thStyle}></th>
												</tr>
												<tr>
													<td style={cellStyle}>Assured</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
												<tr>
													<td style={cellStyle}>Nominee</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}>Mother</td>
													<td style={cellStyle}>Nominee Father Name:</td>
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
													<th style={thStyle} rowSpan={2}></th>
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
													<td style={cellStyle}>Assured</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
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
													<th style={thStyle}></th>
													<th style={thStyle}>Qualification</th>
													<th style={thStyle}>Occupation</th>
													<th style={thStyle}>Occupation Category</th>
													<th style={thStyle}>Income Amount</th>
													<th style={thStyle}>Income Mode</th>
												</tr>
												<tr>
													<td style={cellStyle}>Assured</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
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
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
											</tbody>
										</table>

										<div style={sectionTitle}>Policy Details</div>
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
													<th style={thStyle}>Rate</th>
													<th style={thStyle}>Premium Frequency</th>
													<th style={thStyle}>Premium</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
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
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
												<tr>
													<td style={cellStyle}>Large sum Rebate</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
												<tr>
													<td style={cellStyle}>Rebate on PayMode</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
												<tr>
													<td style={cellStyle}>Total (BP)</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
												<tr>
													<td style={cellStyle}>Discount Rate</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
												<tr>
													<td style={cellStyle}>
														Extra Amount (ExtraAmount + Health + Occupation+NonstdAge)
													</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
												
												<tr>
													<td style={cellStyle}>Total Rider Premium</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
												<tr>
													<td style={cellStyle}>Total Applicable Premium</td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
											</tbody>
										</table>

										<div style={sectionTitle}>Underwriter Decision</div>
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
													<th style={thStyle}>Death Benefit Option</th>
													<th style={thStyle}>Decision</th>
													<th style={thStyle}>Comments</th>
													<th style={thStyle}>Approved Date</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
													<td style={cellStyle}></td>
												</tr>
											</tbody>
										</table>

										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
												marginBottom: 8,
											}}
										>
											<tr>
												<td>
													<b>Gross Premium :</b> &nbsp;&nbsp;
												</td>
												<td>
													<b>Less Medical :</b> &nbsp;&nbsp;
												</td>
												<td>
													<b>Net First Premium :</b>
												</td>
											</tr>
											<tr>
												<td>
													<b>Created By :</b>
												</td>
												<td>
													<b>Forwarded By :</b>
												</td>
												<td>
													<b>Approved By : </b>
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
				</>
			</div>
		</div>
	);
}
