"use client";
import { Printer } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import Policy1 from "../../components/policy1";
import Policy2 from "../../components/policy2";
import Policy3 from "../../components/policy3";
import Policy4 from "../../components/policy4";
import Policy5 from "../../components/policy5";
import Policy8 from "../../components/policy8";
import Policy13 from "../../components/policy13";
import Policy14 from "../../components/policy14";
import Policy18 from "../../components/policy18";
import Policy19 from "../../components/policy19";
import Policy20 from "../../components/policy20";

const Page = () => {
	const [policyBond, setPolicyBond] = useState();
	console.log("policyBond", policyBond);
	const params = useParams();
	useEffect(() => {
		const policyNumberEncrypted = params.policyNumber;
		const fetchData = async () => {
			try {
				const data = {
					policyNumberEncrypted: policyNumberEncrypted || null,
					endpoint: "PolicyBond_getdetail",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is PolicyBond_getdetail response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setPolicyBond(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching PolicyBond_getdetail data:", error);
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

	const PolicyPrint = () => {
		switch (policyBond?.productCode) {
			case "1":
				return <Policy1 policyBond={policyBond} />;

			case "2":
				return <Policy2 policyBond={policyBond} />;

			case "3":
				return <Policy3 policyBond={policyBond} />;

			case "4":
				return <Policy4 policyBond={policyBond} />;

			case "5":
				return <Policy5 policyBond={policyBond} />;

			case "8":
				return <Policy8 policyBond={policyBond} />;

			case "13":
				return <Policy13 policyBond={policyBond} />;

			case "14":
				return <Policy14 policyBond={policyBond} />;

			case "18":
				return <Policy18 policyBond={policyBond} />;

			case "19":
				return <Policy19 policyBond={policyBond} />;

			case "20":
				return <Policy20 policyBond={policyBond} />;

			default:
				return "No Policy Found";
		}
	};

	return (
		<>
			<div className="flex justify-end m-6 print:hidden">
				<Button
					onClick={handlePrint}
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
				>
					<Printer size={16} />
					Print Proposal
				</Button>
			</div>
			<div className="print-content first-part bg-white rounded-lg border-1  p-6">
				<PolicyPrint />
			</div>

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
