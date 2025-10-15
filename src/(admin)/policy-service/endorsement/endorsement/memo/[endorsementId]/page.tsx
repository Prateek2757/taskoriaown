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
                    <div className="max-w-4xl mx-auto p-8 bg-gray-200">
                        <div className="grid grid-cols-3">
                            <div className=" mb-6">
                                <Image
                                    src="/images/logo-sun.png"
                                    alt="IME Life Logo"
                                    width={200}
                                    height={100}
                                />

                            </div>

                            <div className=" mb-8 col-span-2">
                                <h1 className="font-bold text-lg">सन लाइफ इन्स्योरेन्स लिमिटेड</h1>
                                <p className="text-sm mt-2">केन्द्रीय कार्यालय : का.म.न.पा २६ हातेसाँट कम्प्लेक्स, सैनबु,</p>
                                <p className="text-sm">पो.ब.नं.७४० काठमाडौं ।</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm">प.सं आ.ए.ल.ला.कं.कि.ने./न.नं.</p>
                                    <p className="text-sm mt-1">सेवाका निवेदन</p>
                                    <p className="text-sm">विरादगर महानगरपालिका - ११, मोरंग</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">मिति: २०८०-०८-१८</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="font-bold text-center">
                                विषय: भुक्तानी तरिकाको परिवर्तन गरिएको सम्बन्धमा ।
                            </p>
                            <p className="text-center text-sm mt-2">बीमालेख नं : ११२०००८/९२</p>
                        </div>

                        <div className="mb-8">
                            <p className="mb-4">महोदय,</p>
                            <p className="text-justify leading-relaxed mb-4">
                                उपरोक्त सम्बन्धमा तपाईं वाट प्राप्त पत्र अनुसार तपाईंको उल्लेखित बीमालेखमा भुक्तानी तरिकाको अद्यावधिक वार्षिक कायम
                                गरि तयार पारिएको सम्पूर्ति (Endorsement) पत्र साथ सहयोग गरी पठाइएको छ ।
                            </p>
                            <p>सञ्जय सम्पूर्ति बीमालेख साथ राख्नुहुन अनुरोध छ ।</p>
                        </div>

                        <div className="text-right mb-12">
                            <p>भवदीय,</p>
                            <div className="mt-8">
                                <p>...............................................</p>
                                <p>अधिकार प्राप्त अधिकारीको हस्ताक्षर</p>
                            </div>
                        </div>

                        <div className="mb-9">
                            <p className="font-bold">बोधार्थ</p>
                            <p>आइ.टी.विभाग , काठमाडौं ।</p>
                            <p>लेखा विभाग , काठमाडौं ।</p>
                            <p>शाखा कार्यालय, प्रदेश नं १ - भद्रपुर ,धनकुटा</p>
                        </div>

                        <div className="grid grid-cols-3">
                            <div className=" mb-6">
                                <Image
                                    src="/images/logo-sun.png"
                                    alt="IME Life Logo"
                                    width={200}
                                    height={100}
                                />

                            </div>

                            <div className=" mb-8 col-span-2">
                                <h1 className="font-bold text-lg">सन लाइफ इन्स्योरेन्स लिमिटेड</h1>
                                <p className="text-sm mt-2">केन्द्रीय कार्यालय : का.म.न.पा २६ हातेसाँट कम्प्लेक्स, सैनबु,</p>
                                <p className="text-sm">पो.ब.नं.७४० काठमाडौं ।</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm">प.सं आ.ए.ल.ला.कं.कि.ने./न.नं.</p>
                                    <p className="text-sm mt-1">सेवाका निवेदन</p>
                                    <p className="text-sm">विरादगर महानगरपालिका - ११, मोरंग</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">मिति: २०८०-०८-१८</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mb-6">
                            <h1 className="font-bold text-lg underline">Change in Mode of Payment</h1>
                        </div>

                        <div className="mb-6">
                            <table className="w-full border-collapse border border-black bg-gray-200">
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-2 font-medium ">बीमालेख नं: ११२०००८/९२</td>
                                        <td className="border border-black p-2">सम्पूर्ति नं: ENSEGA0081821B2</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black p-2 font-medium ">बीमितको नाम: सेवाका निवेदन</td>
                                        <td className="border border-black p-2">जारी भएको स्थान: भद्रपुर ,धनकुटा</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black p-2 font-medium ">अधिकर्ता कोड नं: १२४२२५५५</td>
                                        <td className="border border-black p-2">मिना शिरमा मिति: 2022-12-23</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mb-6">
                            <p className="text-justify leading-relaxed">
                                अनुयम बीमालेखमा जनुकै लेखिएको भन्दा पनि मिति 2024-12-23 देखि लागु हुने गरी बीमालेख अन्तर्गत सञ्चित कमीशन
                                कम्पोन सथा विनियोग गरिएका सर्बघटे उदाहरण मात समान रहने गरिएको छ।
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-center mb-4 underline">विवरण</h3>
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr>
                                        <th className="border border-black p-2 bg-gray-100">विवरण</th>
                                        <th className="border border-black p-2 bg-gray-100">बीमालेखमा भएको विवरण</th>
                                        <th className="border border-black p-2 bg-gray-100">सञ्शोधन</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-2">१. भुक्तानुको किस्सा</td>
                                        <td className="border border-black p-2">रु. १५,५८०.००</td>
                                        <td className="border border-black p-2">रु ३२,०५६.२०</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black p-2">२. भुक्तानुको भुक्तानी मिति</td>
                                        <td className="border border-black p-2">2024-12-23</td>
                                        <td className="border border-black p-2">-</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black p-2">३. भुक्तानुको भुक्तानी तरिका</td>
                                        <td className="border border-black p-2">अधार्वाषिक</td>
                                        <td className="border border-black p-2">वार्षिक</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black p-2">४. मिना आधि नथा सर्बिखन</td>
                                        <td className="border border-black p-2">२५औं</td>
                                        <td className="border border-black p-2">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mb-6">
                            <p>बीमालेखका अन्य सबै नियमहरू कायमै गरिएका छ ।</p>
                            <p className="mt-2">मिति: २०८१-०९-१८</p>
                            <p>कार्यकर्ता:</p>
                        </div>

                        {/* Closing */}
                        <div className="text-right mb-12">
                            <p>भवदीय,</p>
                            <div className="mt-8">
                                <p>...............................................</p>
                                <p>अधिकार प्राप्त अधिकारीको हस्ताक्षर</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="font-bold">बोधार्थ</p>
                            <p>आइ.टी.विभाग , काठमाडौं ।</p>
                            <p>लेखा विभाग , काठमाडौं ।</p>
                            <p>शाखा कार्यालय, प्रदेश नं १ - भद्रपुर ,धनकुटा</p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
