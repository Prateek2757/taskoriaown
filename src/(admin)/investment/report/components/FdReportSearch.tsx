"use client";
import { Button } from "@/components/ui/button";
import { Printer, Calendar, ArrowRight, FileDown, FileText } from "lucide-react";
import { useState } from "react";
import Image from 'next/image';

export default function FixedDepositReportSearch() {
    const [loading, setLoading] = useState(false);

    const handlePrint = () => {
        const printStyles = `
            <style>
                @media print {
                    @page { margin: 0.5in; }
                    body * { visibility: hidden; }
                    .print-content, .print-content * { visibility: visible; }
                    .print-content { position: absolute; left: 0; top: 0; width: 100%; }
                    .p-6 { padding:0; }
                    .text-sidebar-foreground { display:none; }
                }
            </style>
        `;
        const styleElement = document.createElement("div");
        styleElement.innerHTML = printStyles;
        document.head.appendChild(styleElement);
        window.print();
        setTimeout(() => { document.head.removeChild(styleElement); }, 1000);
    };

    return (
        <div>
            <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
                <Button className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export
          </Button>

          <Button className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2">
            <FileText className="w-4 h-4" />
            PDF
          </Button>
                <Button onClick={handlePrint} className=" bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2">
                    <Printer size={18} />
                    Print
                </Button>
            </div>
            <div className="print-content p-6">
                <div className="flex justify-between items-start mb-0">
                    <Image src={"/images/logo-sun.png"} width={200} height={100} alt="Sun Logo" className="object-cover" />
                    <div className="text-right">
                        <h1 className="text-xl font-bold text-gray-800">SunLife Insurance Limited</h1>
                        <p className="text-sm text-gray-600">📍 New Plaza PutaliSadak Nepal</p>
                        <p className="text-sm text-gray-600">📞 Ph No. 01-4536126/27/28</p>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <hr className="border-t border-gray-300 mb-3" />
                    <h2 className="text-xl font-bold text-gray-800">Fixed Deposit Report</h2>
                    <div className="flex items-center justify-center gap-2 text-gray-700 text-sm">
                        <Calendar size={16} />
                        <span><strong>From: 2025-09-08</strong></span>
                        <ArrowRight size={16} />
                        <Calendar size={16} />
                        <span><strong>To: 2025-09-30</strong></span>
                    </div>
                </div>

                <table className="w-full border border-gray-400 mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>SN</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>FDNo</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Bank name</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Bank branch</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>FD Amount</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>MOP</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Start Date</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Maturity Date</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Term</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Receipt No</th>
                            <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Interest Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-400 p-2 text-center"></td>
                            <td className="border border-gray-400 p-2 text-center text-yellow-600"></td>
                            <td className="border border-gray-400 p-2 text-center"></td>
                            <td className="border border-gray-400 p-2 text-center"></td>
                            <td className="border border-gray-400 p-2 text-center"></td>
                            <td className="border border-gray-400 p-2 text-center"></td>
                            <td className="border border-gray-400 p-2 text-center"></td>
                            <td className="border border-gray-400 p-2 text-center"></td>
                            <td className="border border-gray-400 p-2 text-center"></td>
                            <td className="border border-gray-400 p-2 text-center"></td>
                            <td className="border border-gray-400 p-2 text-center"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
