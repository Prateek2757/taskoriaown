'use client';
import { Button } from '@/components/ui/button';
import convertToWords from '@/components/utils/convertToWords';
import { API_CONSTANTS } from '@/constants/staticConstant';
import { type PostCallData, apiPostCall } from '@/helper/apiService';
import { Printer } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { PolicyReceiptSchemaType } from '../../schemas/policySchema';

export default function Page() {
    const [receiptData, setReceiptData] = useState<PolicyReceiptSchemaType>();
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const policyNumber = params.policyNumber;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = {
					PolicyNumberEncrypted: policyNumber || null,
					Instalment: "1",
					endpoint: "policy_receipt",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is form response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setReceiptData(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Policy receipt data:", error);
			} finally {
				setLoading(false);
			}
		};
		if (policyNumber) {
			fetchData();
		}
	}, [policyNumber]);

	const displayData = (field: keyof PolicyReceiptSchemaType): string => {
		if (!receiptData) return "Loading...";
		const value = receiptData[field];
		return value?.toString() || "N/A";
	};
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
	return (
		<>
			<div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
				<Button
					onClick={handlePrint}
					className="cursor-pointer flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
				>
					<Printer color="#fff" size={18} />
					<span>Print</span>
				</Button>
			</div>
			{receiptData && (
				<section className="print-content policy-paper">
					<div className="policy-paper-wrapper" style={{ color: "#00008f" }}>
						<div>
							<div className="grid grid-cols-4 items-center">
								<div className="text-end">
									<img
										className="ml-auto me-2"
										src="/images/logo-sun.png"
										alt="Reliable Life Insurance"
										style={{ height: "100px" }}
									/>
								</div>
								<div className="col-span-2">
									<div className="font-bold text-xl">सन नेपाल</div>
									<div className="font-bold text-xl">लाइफ इन्स्योरेन्स कं. लि.</div>
									<div className="policy-paper--small">
										कर्पोरेट कार्यालय : पुतलिसडक, न्यू प्लाजा, काठमाण्डौ
									</div>
									<div className="policy-paper--small">
										फोन नं. ०१-४४३६१२६, ४४३६१२७४४३६१२८
									</div>
									<div className="policy-paper--small">
										इमेल : info@snlic.com वेभसाइट: www.sunlife.com.np
									</div>
								</div>
								<img
									className="mr-2"
									src={displayData("qrCodeImage")}
									style={{ height: "140px", width: "140px" }}
									alt="QR Code"
								/>
							</div>
							<div className="policy-paper--small text-end mb-3">
								रसिद नं. : {displayData("receiptNumber")}
							</div>
							<div className="flex justify-between">
								<div>
									शाखा :
									<span className="underline decoration-dotted underline-offset-4 mx-2">
										कर्पोरेट कार्यालय
									</span>
								</div>
								<div>
									मिति :
									<span className="underline decoration-dotted underline-offset-4 mx-2">
										{displayData("createdDate")}
									</span>
								</div>
							</div>
							<div className="font-bold text-lg underline underline-offset-8 text-center mb-5">
								प्रथम बीमा शुल्क रसिद
							</div>

                            <p
                                style={{
                                    lineHeight: '28px',
                                    textAlign: 'justify',
                                }}
                            >
                                श्री
                                <span className="underline decoration-dotted underline-offset-4 mx-2">
                                    {displayData('fullName')}
                                </span>
                                बाट आजका मितिमा प्रथम बीमा शुल्क किस्ता बापत रू.
                                <span className="underline decoration-dotted underline-offset-4 mx-2">
                                    {displayData('premium')}
                                </span>
                                अक्षरेपी
                                <span className="underline decoration-dotted underline-offset-4 mx-2">
                                    {convertToWords(displayData('premium'))}{' '}
                                    only
                                </span>
                                सधन्यवाद प्राप्त भएको हुँदा नीजको नाममा बीमालेख नं.
                                <span className="underline decoration-dotted underline-offset-4 mx-2">
                                    {displayData('policyNumber')}
                                </span>
                                जारी गरिएको छ । बीमालेखको विवरण निम्न बमोजिम छ ।
                            </p>
                            <div className="font-bold text-lg underline underline-offset-8 text-center mt-5 mb-5">
                                बीमालेखको विवरण
                            </div>
                            <div className="flex justify-between mb-2">
                                <div>
                                    बीमा प्रारम्भ मिति :
                                    <span className="underline decoration-dotted underline-offset-4 mx-2">
                                        {displayData('dateOfCommencement')}
                                    </span>
                                </div>
                                <div>
                                    प्रथम बीमा शुल्क रू.
                                    <span className="underline decoration-dotted underline-offset-4 mx-2">
                                        {displayData('premium')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between mb-2">
                                <div>
                                    बीमाङ्क रकम :
                                    <span className="underline decoration-dotted underline-offset-4 mx-2">
                                        {displayData('sumAssured')}
                                    </span>
                                </div>
                                <div>
                                    अभिकर्ता कोड :
                                    <span className="underline decoration-dotted underline-offset-4 mx-2">
                                        {displayData('agentCode')}
                                    </span>
                                </div>
                                {/* <div>
                बीमा शुल्क भुक्तानी तरिका
                <span className="underline decoration-dotted underline-offset-4 mx-2">
                  esewa
                </span>
              </div> */}
							</div>
							<div className="flex justify-between mb-2">
								<div>
									बीमा योजना :
									<span className="underline decoration-dotted underline-offset-4 mx-2">
										{displayData("productName")}
									</span>
								</div>
								<div>
									बीमा शुल्क भुक्तानी तरिका :
									<span className="underline decoration-dotted underline-offset-4 mx-2">
										{displayData("modeOfPayment")}
									</span>
								</div>
							</div>
							<div className="flex justify-between mb-5">
								<div>
									अवधि :
									<span className="underline decoration-dotted underline-offset-4 mx-2">
										{displayData("term")} वर्ष
									</span>
								</div>
								<div>
									आगामी किस्ता तिर्नुपर्ने मिति :
									<span className="underline decoration-dotted underline-offset-4 mx-2">
										{displayData("nextDueDate")}
									</span>
								</div>
							</div>
							<div className="grid grid-cols-2 items-end">
								<div></div>
								<div className="relative">
									<img
										src="/images/sign.png"
										alt="sign"
										width={80}
										className="ml-auto mr-4"
									/>
									<div className="text-end overline ">आधिकारिक हस्ताक्षर</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	);
}
