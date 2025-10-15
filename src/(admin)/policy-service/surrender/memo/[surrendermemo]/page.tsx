"use client";
import { Printer } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import SurrenderMemoPage from "../../components/SurrenderMemoDetails";

export default function Page() {
	const [proposalData, setProposalData] = useState();
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const kycNumber = params.surrendermemo;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = {
					policyNumberEncrypted: kycNumber || null,
					endpoint: "surrender_memo",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is form response", response);
				if (response?.data && response.data.code === SYSTEM_CONSTANTS.success_code) {
					setProposalData(response.data);
				} else {
					console.log("Invalid response format or failed API call");
				}
			} catch (error) {
				console.log("Error fetching Proposal data:", error);
			} finally {
				setLoading(false);
			}
		};
		if (kycNumber) {
			fetchData();
		}
	}, [kycNumber]);

	

	const handlePrint = () => {
		const printStyles = `
      <style>
        @media print {
          @page {
            margin: 0.3in;
            size: A4;
          }
          
          body * {
            visibility: hidden;
          }
          .first-part {
        zoom: 70%; /* Scale down content */
        margin: 0;
      }

          .print-content, .print-content * {
            visibility: visible;
          }
          
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          th {
            font-weight: 500;
            padding-left: 5px;
            font-size: 11px;
          }
          
          td {
            padding-right: 5px;
            font-size: 11px;
          }
          
          #daabi th, #daabi td {
            padding-left: 3px;
            border: 1px solid black;
            border-collapse: collapse;
            border-spacing: 0;
            font-size: 10px;
          }
          
          #daabi p {
            text-align: justify;
            font-size: 10px;
            margin: 2px 0;
          }
          
          #noBorder td {
            border: none;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          .compact-table {
            font-size: 9px;
          }
          
          .compact-table td, .compact-table th {
            padding: 2px 4px;
          }
          
          h1, h2, h3, h4 {
            margin: 5px 0;
          }
          
          .section-title {
            font-size: 14px;
            margin: 8px 0;
          }
          
          .main-title {
            font-size: 18px;
            margin: 10px 0;
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
						<p>Loading KYC details...</p>
					</div>
				) : proposalData ? (
					<div className=" bg-white rounded-lg border-1 mb-6 mt-4">
						<div className="print-content">
							<SurrenderMemoPage proposalData={proposalData} />
						</div>
					</div>
				) : (
					<div className="bg-white rounded-lg border-1 p-6 text-center ">
						<p>Something Went Wrong.</p>
					</div>
				)}
			</div>
		</div>
	);
}
