"use client";
import { Printer } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import FPReceipt from "../../Component/receiptComponent";

const Page = () => {
	const [fpiReceipt, setFpiReceipt] = useState();
	const params = useParams();
	useEffect(() => {
		const policyNumberEncrypted = params.policyNumber;
		const fetchData = async () => {
			try {
				const data = {
					policyNumberEncrypted: policyNumberEncrypted || null,
					endpoint: "FPIReceipt_getdetail",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is FPIReceipt_getdetail response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setFpiReceipt(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching FPIReceipt_getdetail data:", error);
			} finally {
			}
		};
		if (policyNumberEncrypted) {
			fetchData();
		}
	}, [params.policyNumber]);

	const handlePrint = () => {
		window.print();
	};

	return (
		<>
			{/* Print Button - Hidden during print */}
			<div className="flex justify-end m-6 print:hidden">
				<Button
					onClick={handlePrint}
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
				>
					<Printer size={16} />
					Print Receipts
				</Button>
			</div>

			{/* Printable Content */}
			<div className="print-content first-part bg-white rounded-lg border-1  p-6">
				<FPReceipt fpiReceipt={fpiReceipt} />
				<div className="mt-2 border-t border-gray-800 my-4 border-dashed "></div>
				<FPReceipt fpiReceipt={fpiReceipt} />

				<div className="mt-2 border-t border-gray-800 my-4 border-dashed "></div>
				<FPReceipt fpiReceipt={fpiReceipt} />
			</div>

			{/* Print Styles */}
			<style jsx global>{`
        @media print {
          @page {
            margin: 0.3in;
            size: A4;
          }

          body * {
            visibility: hidden;
          }
          .first-part {
            zoom: 55%; /* Scale down content */
            margin: 0;
          }

          .print-content,
          .print-content * {
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


          .page-break {
            page-break-after: always;
          }

          .compact-table {
            font-size: 9px;
          }

          .compact-table td,
          .compact-table th {
            padding: 2px 4px;
          }

          h1,
          h2,
          h3,
          h4 {
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
      `}</style>
		</>
	);
};

export default Page;
