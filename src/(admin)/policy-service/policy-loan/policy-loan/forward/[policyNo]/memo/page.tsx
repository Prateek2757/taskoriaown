"use client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useState } from "react";
import Image from 'next/image';

export default function page() {
    const [loading, setLoading] = useState(false);

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
            <div>
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
                    <div>
                        <div>
                            <div className="print-content">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-center">
                                        <Image
                                            src={"/images/logo-sun.png"}
                                            width={200}
                                            height={100}
                                            alt="Sun Logo"
                                            className="object-cover"
                                        />
                                    </div>


                                    {/* Title */}
                                    <div className="text-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-80 pb-2">
                                            Loan Calculation Preview Sheet
                                        </h2>
                                        <hr />
                                        <div className="text-sm font-medium">Policy Details.</div>
                                        <hr />
                                    </div>

                                    {/* Policy Details Grid */}
                                    <div className="grid grid-cols-2 gap-8 mb-6">
                                        {/* Left Column */}
                                        <div className="space-y-1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Policy No.</div>
                                                <div className="text-sm">1000000006</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Policy Holder</div>
                                                <div className="text-sm">Rash Shrestha</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Proposer Name</div>
                                                <div className="text-sm">Muna Shrestha</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Sum Assured</div>
                                                <div className="text-sm">Rs.</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">DOI</div>
                                                <div className="text-sm">2018-08-06</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">DOC</div>
                                                <div className="text-sm">2018-08-14</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Product</div>
                                                <div className="text-sm">31 | IMI Child Endowment Plan</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Term Branch</div>
                                                <div className="text-sm">102 | Phulon</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Requested By</div>
                                                <div className="text-sm">102 | Phulon</div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Policy Status</div>
                                                <div className="text-sm">IF</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Mode of Payment</div>
                                                <div className="text-sm">Y</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Premium</div>
                                                <div className="text-sm">15968.00</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Basic Premium</div>
                                                <div className="text-sm">15132.60</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Next Due Date</div>
                                                <div className="text-sm">2025-08-06</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Mode of Maturity</div>
                                                <div className="text-sm">2025-08-06</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Class Date</div>
                                                <div className="text-sm">2025-08-06</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">DOL</div>
                                                <div className="text-sm">2025-08-11</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Anniversary Date</div>
                                                <div className="text-sm">2025-08-06</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Total Premium Paid</div>
                                                <div className="text-sm">2024-08-04</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Loan Date</div>
                                                <div className="text-sm">2020-09-06</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-sm font-medium">Vesting Date</div>
                                                <div className="text-sm">2026-09-11</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Calculation Part Header */}
                                    <div className="text-center mb-4">
                                        <hr />
                                        <div className="text-sm font-medium">Calculation Part</div>
                                        <hr />
                                    </div>

                                    {/* Combined Calculation Table */}
                                    <div className="mb-6">
                                        <div className="flex gap-8">
                                            {/* Left Side - Calculation Details */}
                                            <div className="w-1/2">
                                                <table className="w-full text-sm border-collapse">
                                                    <tbody>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">No of Premium Paid (In Years)</td>
                                                            <td className="py-1 text-right border-b">7.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">Paid Up Sum Assured</td>
                                                            <td className="py-1 text-right border-b">87,500.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">Adjusted PSA</td>
                                                            <td className="py-1 text-right border-b">51,791.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">Bonus</td>
                                                            <td className="py-1 text-right border-b">51,800.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">Adjusted Bonus</td>
                                                            <td className="py-1 text-right border-b">30,660.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">Paid Up Value</td>
                                                            <td className="py-1 text-right border-b">139,300.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">Period</td>
                                                            <td className="py-1 text-right border-b">8.9167</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">Surrender Value Factor</td>
                                                            <td className="py-1 text-right border-b">591.9000</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">No. of Completed Months</td>
                                                            <td className="py-1 text-right border-b">0.0000</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">Monthly Adjustment Factor</td>
                                                            <td className="py-1 text-right border-b">1.0000</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-medium border-b">Surrender Value</td>
                                                            <td className="py-1 text-right border-b">82,451.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-1 font-bold border-b">Loan Amount (90%)</td>
                                                            <td className="py-1 text-right font-bold border-b">74000</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Right Side - Bonus Table */}
                                            <div className="w-1/2">
                                                <table className="w-full border border-gray-400 text-xs">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="border border-gray-400 p-2 text-center">SN</th>
                                                            <th className="border border-gray-400 p-2 text-center">Start</th>
                                                            <th className="border border-gray-400 p-2 text-center">End</th>
                                                            <th className="border border-gray-400 p-2 text-center">Rate</th>
                                                            <th className="border border-gray-400 p-2 text-center">Inst</th>
                                                            <th className="border border-gray-400 p-2 text-center">Bonus</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="border border-gray-400 p-1 text-center">1</td>
                                                            <td className="border border-gray-400 p-1 text-center">2018-07-17</td>
                                                            <td className="border border-gray-400 p-1 text-center">2019-07-16</td>
                                                            <td className="border border-gray-400 p-1 text-center">31</td>
                                                            <td className="border border-gray-400 p-1 text-center">1</td>
                                                            <td className="border border-gray-400 p-1 text-center">6200.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-gray-400 p-1 text-center">2</td>
                                                            <td className="border border-gray-400 p-1 text-center">2019-07-17</td>
                                                            <td className="border border-gray-400 p-1 text-center">2020-07-15</td>
                                                            <td className="border border-gray-400 p-1 text-center">35</td>
                                                            <td className="border border-gray-400 p-1 text-center">1</td>
                                                            <td className="border border-gray-400 p-1 text-center">7000.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-gray-400 p-1 text-center">3</td>
                                                            <td className="border border-gray-400 p-1 text-center">2020-07-16</td>
                                                            <td className="border border-gray-400 p-1 text-center">2021-07-15</td>
                                                            <td className="border border-gray-400 p-1 text-center">35</td>
                                                            <td className="border border-gray-400 p-1 text-center">1</td>
                                                            <td className="border border-gray-400 p-1 text-center">7000.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-gray-400 p-1 text-center">4</td>
                                                            <td className="border border-gray-400 p-1 text-center">2021-07-16</td>
                                                            <td className="border border-gray-400 p-1 text-center">2022-07-16</td>
                                                            <td className="border border-gray-400 p-1 text-center">38</td>
                                                            <td className="border border-gray-400 p-1 text-center">1</td>
                                                            <td className="border border-gray-400 p-1 text-center">7600.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-gray-400 p-1 text-center">5</td>
                                                            <td className="border border-gray-400 p-1 text-center">2022-07-17</td>
                                                            <td className="border border-gray-400 p-1 text-center">2023-07-16</td>
                                                            <td className="border border-gray-400 p-1 text-center">40</td>
                                                            <td className="border border-gray-400 p-1 text-center">1</td>
                                                            <td className="border border-gray-400 p-1 text-center">8000.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-gray-400 p-1 text-center">6</td>
                                                            <td className="border border-gray-400 p-1 text-center">2023-07-17</td>
                                                            <td className="border border-gray-400 p-1 text-center">2024-07-15</td>
                                                            <td className="border border-gray-400 p-1 text-center">40</td>
                                                            <td className="border border-gray-400 p-1 text-center">1</td>
                                                            <td className="border border-gray-400 p-1 text-center">8000.00</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-gray-400 p-1 text-center">7</td>
                                                            <td className="border border-gray-400 p-1 text-center">2024-07-16</td>
                                                            <td className="border border-gray-400 p-1 text-center">2025-07-15</td>
                                                            <td className="border border-gray-400 p-1 text-center">40</td>
                                                            <td className="border border-gray-400 p-1 text-center">1</td>
                                                            <td className="border border-gray-400 p-1 text-center">8000.00</td>
                                                        </tr>
                                                        <tr className="bg-gray-100 font-bold">
                                                            <td className="border border-gray-400 p-1 text-center" colSpan={4}>Total</td>
                                                            <td className="border border-gray-400 p-1 text-center">:</td>
                                                            <td className="border border-gray-400 p-1 text-center">51800.00</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Final Calculation Section */}
                                    <div className="text-center mb-4">
                                        <hr />
                                        <div className="text-sm font-medium">Accounting Part</div>
                                        <hr />
                                    </div>
                                    <div className="mb-6">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-sm font-medium">Applied Loan Amount</div>
                                                    <div className="text-sm">11,000.00</div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-sm font-medium">Net Payable</div>
                                                    <div className="text-sm">11,000.00</div>
                                                </div>
                                                <div className="text-sm italic mt-4">
                                                    Net Payable in Words: Eleven Thousand Rupees Only.
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signature Section */}
                                    <div className="grid grid-cols-3 gap-8 mt-12">
                                        <div className="text-center">
                                            <div className="border-b border-gray-400 mb-2 h-12"></div>
                                            <div className="text-sm font-medium">Prepared By</div>
                                            <div className="text-xs">ADMIN_USER</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="border-b border-gray-400 mb-2 h-12"></div>
                                            <div className="text-sm font-medium">Checked By</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="border-b border-gray-400 mb-2 h-12"></div>
                                            <div className="text-sm font-medium">Approved By</div>
                                        </div>
                                        <div className="text-xs">Generated on 2025-09-08 03:02:30 by ADMIN_USER</div>
                                    </div>

                                    {/* Second Page - Nepali Content */}
                                    <div className="mt-16 page-break-before">
                                        <div className="flex justify-center">
                                            <Image
                                                src={"/images/logo-sun.png"}
                                                width={200}
                                                height={100}
                                                alt="Sun Logo"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="text-center mb-8">
                                            <h2 className="text-lg font-bold">सन लाइफ इन्स्योरेन्स लिमिटेड</h2>
                                            <p className="text-sm">कर्पोरेट अफिस : हाथवे कम्प्लेक्स, ४ तल्ला, लैंचौर-२६, काठमाडौं ।</p>
                                        </div>
                                        <div className="flex flex-col items-end mb-4 mr-3">
                                            <p>	बीमालेख नं	:	१०००००००६</p>
                                            <p>बीमांक रकम	:	रु २०००००</p>
                                            <p>	नाम	:	Muna Shrestha</p>
                                            <p>ऋण (अङ्क)	:	रु १००००.००</p>
                                            <p>	ऋण (अक्षरमा)	:	दस हजार रूपैया</p>

                                        </div>
                                        <p className="text-center mb-2">तमसुक</p>
                                        <div>
                                            <p>
                                                लिखितम् माथि उल्लेख गरीए बमोजिम म ऋणीले आजका मितिमा आई.एम.ई लाइफ इन्स्योरेन्स कम्पनी लिमिटेड (यसपछि कम्पनी भनी उल्लेख भएको) बाट उल्लेखित बीमालेख कम्पनीमा मैले धितो राखी माथि उल्लेखित रकम ऋण स्वरुप प्राप्त गरेकोले यसै तमसुकको कागजात द्वारा म स्वयं तथा मेरो उत्तराधिकारीको हकमा समेत कम्पनी तथा कम्पनीमा उत्तराधिकारीसंग देहाय बमोजिमको शर्त कबुलियत गरीदिएको छु ।
                                            </p>
                                            <p className="mt-3">
                                                १. बीमालेख अन्तर्गत मैले लिएको ऋणको सुरक्षणको लागि मेरो जीवनबीमालेख कम्पनी र कम्पनीका उत्तराधिकारीसँग धितो राख्न मञ्जुर गर्दछु।
                                                <br />
                                                २. ऋण रकम बुझिसकेपछि समयमा पनि कम्पनीमा बुझाउने बिषयमा मेरो पुर्ण मञ्जुरी छ।
                                                <br />
                                                ३. यस सम्बन्धको ब्याजको विवरणमा उल्लेख भए बमोजिमको वा समयमा कम्पनीले तोकेको बमोजिमको ब्याज भुक्तानी गर्न मञ्जुर गर्दछु। प्रत्येक असार महिनामा पछि बुझाउन हुने गरी ब्याज रकम को साखा रकममा गणना गरिने बिषयमा मेरो पुर्ण मञ्जुरी छ। उल्लिखित ब्याजदर समय समयमा परिवर्तन गर्न सकिने र परिवर्तित ब्याजदर यसै अनुसार भुक्तानी गर्न पर्ने देखिन्छ भने लागु हुने बिषयमा मेरो पुर्ण मञ्जुरी छ।
                                                <br />
                                                ४. कम्पनीले ऋण रकम भुक्तानी गर्नु भनी सूचना दिने सकेको सो सूचना पाएको ३० दिनभित्र बाँकी ब्याज समेत बुझाउनु पर्ने एक मुख्य रकम कम्पनीको उल्लिखित कार्यालयमा बुझाउन मञ्जुर गर्दछु।
                                                <br />
                                                ५. ऋण रकमको आर्थिक भुक्तानी स्वीकार गरि कम्पनीमा कम्पनीको उत्तराधिकारीका बाध्य हुनेछैन।
                                                <br />
                                                ६. ऋण भुक्तानीका लागि बीमालेखको ऋणको साँवा ब्याज तथा ब्याजको ब्याजको सम्पूर्ण रकम बराबर वा सो भन्दा बढी भएमा बीमालेख समाप्त भएमा सो भुक्तानीको लागि बीमालेखलाई सूचना पठाइने छ। सो समयमा पनि सोको भुक्तानी नगरिएमा बीमालेख समाप्त गरी सोको सम्पूर्ण भुक्तानीको साँवा ब्याज असुल गरि बाँकी रकमको बीमालेख भित्रका भुक्तानी रकममा मेरो पुर्ण मञ्जुरी छ।
                                                <br />
                                                ७. बीमालेखमा ऋण लिएको रकमको साँवा तथा ब्याजको भुक्तानी गर्ने बीमालेखको म्याद अनुसार मृत्यु भए वा बीमालेख अवधि समाप्त भए बाँकी भुक्तानी गर्ने अवस्थामा बाँकी रहेको ऋण रकमको साँवा र ब्याज असुल गरि बाँकी रकम मात्र बीमालेख अन्तर्गत भुक्तानी गर्ने बिषयमा मेरो पुर्ण सहमति छ।
                                                <br />
                                                ८. ब्याजको विवरणहरू:<br />

                                                (क) हालको १३% प्रतिवर्ष प्रति छ महिनामा दर्शाउने छ। <br />
                                                (ख) नतिरेको ब्याज रकममा १५% प्रतिवर्ष प्रतिआधार भुक्तानी गरि बुझाउनुपर्ने छ।<br />
                                                (ग) ब्याज रकमको भुक्तानी गर्ने मिति नाघेपछि अझै अगाडि भुक्तानी गर्नुपर्ने छ।<br />
                                            </p>
                                            <p className="mt-3">
                                                माथि उल्लेखित शर्तहरु आफ्नो मनोमानी राजीखुशीले स्वीकार गरी उल्लेखित ऋण त्यसको व्याज र सम्बन्धीत खर्च समेतको धितोमा रहेको उल्लेखित बीमालेख आजका मितिमा तपाई साहु कम्पनी श्री आई.एमं.ई लाइफ इन्स्योरेन्स कम्पनी लिमिटेड र कम्पनीका उत्तराधिकारीलाई कम्पनीको कर्पोरेट तथा रजिष्टर्ड कार्यालय का.जि.का.म.न.पा. वडा नं.२६, लैनचौंर, काठमाण्डौंमा बुझाइदिएँ ।
                                            </p>
                                        </div>
                                        <div className="border border-black p-2 mt-3">
                                            <p className="font-bold">जीवन बीमालेखको शर्त बमोजिम यदी कुनै अवस्थामा तपाईले लिनुभएको ऋण रकम र तिर्न बाँकी व्याज समर्पण मूल्यभन्दा बढी भएमा बीमालेख जफत गरी ऋण र तिर्न बाँकी व्याज असुल उपर गरीने छ ।</p>
                                        </div>
                                        <div className="mt-6">
                                            तल उल्लेखित साक्षीको रोवहरमा छापिएका तथा लेखिएको यो तमसुक म स्वीकार गर्दछु ।
                                        </div>

                                        <div className="flex justify-between mt-6">
                                            {/* Left Section: Witness */}
                                            <div>
                                                <p className="font-bold">साक्षी</p>
                                                <p>सही : </p>
                                                <p>पुरा नाम : </p>
                                                <p>पेशा : </p>
                                                <p>ठेगाना : </p>
                                            </div>

                                            {/* Middle Section: Borrower's Signature */}
                                            <div className="text-center">
                                                <p className="font-bold">ऋणीको लेखात्मक सही</p>
                                                <div className="flex justify-between gap-4 mt-2">
                                                    <div className="border border-black w-28 h-28 flex items-center justify-center">
                                                        <span>दायाँ</span>
                                                    </div>
                                                    <div className="border border-black w-28 h-28 flex items-center justify-center">
                                                        <span>बायाँ</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Section: Authorized Signature */}
                                            <div>
                                                <p>ऋणीको लेखात्मक सही : .................................</p>
                                                <p className="mt-6">कम्पनीको तर्फबाट अधिकृतको हस्ताक्षर</p>
                                                <p className="mt-4">....................................................</p>
                                                <p>व्यवस्थापक/अधिकृत</p>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="mt-6">
                                            <p>
                                                इति सबल ........................................ साल ..........................
                                                महिनाको ........................... गते रोज ।
                                            </p>
                                        </div>

                                        {/* Footer Section */}
                                        <div className="mt-6">
                                            <p>श्रीमान प्रमुख ज्यू</p>
                                            <p>आई.एम.ई लाइफ इन्स्योरेन्स कम्पनी लिमिटेड</p>
                                            <p>काठमाडौं ।</p>
                                            <p>
                                                मार्फत शाखा कार्यालय: ....................................................
                                            </p>
                                            <p className="mt-4 text-lg font-semibold text-end">मिति: ........../............/..........</p>
                                        </div>
                                        <div className="p-4">
                                            {/* Header */}

                                            <p>श्रीमान प्रमुख ज्यू,</p>
                                            <p>आई.एम.ई लाइफ इन्स्योरेन्स कम्पनी लिमिटेड</p>
                                            <p>काठमाडौं ।</p>
                                            <p>मार्फत शाखा कार्यालय: ...............................................</p>

                                            {/* Subject */}
                                            <div className="mt-4">
                                                <p className="font-bold ml-9 ">
                                                    विषय: जीवन बीमालेख नं. .......................... धितो राखी ऋण दिने सम्बन्धमा ।
                                                </p>
                                            </div>

                                            {/* Body */}
                                            <div className="mt-3">
                                                <p>
                                                    उपर्युक्त सम्बन्धमा मेरो ........................................ कारण रकमको आवश्यकता परेको हुनाले
                                                    मैले उल्लेखित बीमालेख धितो राखी कम्पनीको नियमानुसार प्राप्त हुने कर्जा रकम रु
                                                    ............................ उपलब्ध गराइदिनु हुन अनुरोध गर्दछु ।
                                                </p>
                                            </div>

                                            {/* Conditions */}
                                            <div className="mt-4">
                                                <p className="font-bold">सलग्न:</p>
                                                <p>
                                                    १. सक्कल बीमालेख, नागरिकताको फोटोकपी र तमसुक (हुलाक टिकेट सहित) ........... थान ।
                                                </p>
                                            </div>

                                            {/* Bank Details */}
                                            <div className="mt-4 grid grid-cols-2">
                                                <div className="flex flex-col items-center justify-center">निवेदक,</div>
                                                <div>
                                                    <p className="font-bold">बीमित/प्रस्तावकको बैंक सम्बन्धी विवरण:</p>
                                                    <p>१. बैंकको नाम: .......................................................</p>
                                                    <p>२. बैंकको शाखाको ठेगाना: ..........................................</p>
                                                    <p>३. खातावालाको नाम: ................................................</p>
                                                    <p>४. बैंकको खाता नं.: ................................................</p>
                                                    <p className="text-sm mt-2">
                                                        नोट: कृपया बैंक खाता नं. मा स्पष्ट अंकमा लेखिदिनुहोस र सोहि खाता नं. अनुसार
                                                        Cheque Copy वा Cheque Book को पानामा भएको नाम र खाता नं. अनुसार मिलाउन आवश्यक
                                                        छ। यदि कुनै त्रुटी भएमा सोही खाता नं. मा रकम भुक्तानी गर्न नसकिने हुनाले
                                                        जिम्मेवारी प्रस्तावककै हुने छ।
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Signature */}
                                            <div className="mt-6">
                                                <p>.......................................................</p>
                                                <p>(बीमित/प्रस्तावकको हस्ताक्षर)</p>
                                                <p>नाम: ..................................................</p>
                                                <p>मोबाइल नं.: ........................... ईमेल ठेगाना: .....................</p>
                                            </div>

                                            <hr className="my-6 border-t border-black" />

                                            {/* Office Use Only */}
                                            <div className="mt-6">
                                                <p className="font-bold text-center">
                                                    कार्यालय प्रयोजनको लागि मात्र (क्षेत्रीय/शाखा प्रमुख वा कर्मचारीले भर्ने)
                                                </p>
                                                <p className="mt-2">
                                                    माथि उल्लेखित प्रस्तावक बीमाको हस्ताक्षर हाम्रो समक्षामा रहेको छ।
                                                    हस्ताक्षरसँग ऐन अनुसार सक्कल जीवन बीमालेख र तमसुक बुझी यस शाखा कार्यालयबाट
                                                    प्रमाणित गरिएको छ। यसमा उल्लेखित बीमा रकमको किस्ता रकमको भुक्तानी रहेका छैन
                                                    भन्ने प्रमाणको आधारमा कर्जा उपलब्ध गराइ दिनु हुन लागि सिफारिस गर्दछु।
                                                </p>

                                                <div className="mt-4">
                                                    <p>क्षेत्रीय/शाखा प्रमुख वा कर्मचारीको नाम: ....................................</p>
                                                    <p>हस्ताक्षर: ...................................................</p>
                                                </div>

                                                <div className="mt-6 text-end">
                                                    <p>कार्यालयको छाप</p>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}