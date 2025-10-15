"use client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useState } from "react";
import Image from 'next/image';

export default function LoanStatementView() {
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
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center">
                                            <Image
                                                src={"/images/logo-sun.png"}
                                                width={200}
                                                height={100}
                                                alt="Sun Logo"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="text-right">
                                            <h1 className="text-xl font-bold text-gray-800">SunLife Insurance Limited</h1>
                                            <p className="text-sm text-gray-600">📍 New Plaza PutaliSadak Nepal</p>
                                            <p className="text-sm text-gray-600">📞 Ph No. 01-4536126/27/28</p>
                                        </div>
                                    </div>

                                    <div className="text-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-800">Policy Holder&apos;s Loan Statement</h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <p className="text-sm"><strong>Policy No :</strong> 111000366</p>
                                            <p className="text-sm"><strong>Policy Holder :</strong> Ankita Chaudhary</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm"><strong>Loan Branch :</strong> 141</p>
                                            <p className="text-sm"><strong>Loan Date :</strong> 2024-12-03</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm"><strong>Loan Id :</strong> LNID141818266</p>
                                            <p className="text-sm"><strong>Loan Amount :</strong> 80000.00</p>
                                        </div>
                                    </div>

                                    <table className="w-full border border-gray-400 mb-6">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Transaction Date</th>
                                                <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Paid Date</th>
                                                <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Voucher No</th>
                                                <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Paid Amount</th>
                                                <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Interest</th>
                                                <th className="border border-gray-400 p-2 text-center" colSpan={3} >Transaction</th>
                                                <th className="border border-gray-400 p-2 text-center" colSpan={2}>Remaining</th>
                                                <th className="border border-gray-400 p-2 text-center" rowSpan={2}>Remarks</th>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                
                                                <th className="border border-gray-400 p-1 text-xs">Principal</th>
                                                <th className="border border-gray-400 p-1 text-xs">Interest</th>
                                                <th className="border border-gray-400 p-1 text-xs">Remaining Interest</th>
                                                <th className="border border-gray-400 p-1 text-xs">Principal</th>
                                                <th className="border border-gray-400 p-1 text-xs">Interest</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-400 p-2 text-center">2024-12-03</td>
                                                <td className="border border-gray-400 p-2 text-center text-yellow-600">PL141818200027</td>
                                                <td className="border border-gray-400 p-2 text-center">80000.00</td>
                                                <td className="border border-gray-400 p-2 text-center">900.00</td>
                                                <td className="border border-gray-400 p-2 text-center">2%</td>
                                                <td className="border border-gray-400 p-2 text-center">2%</td>
                                                <td className="border border-gray-400 p-2 text-center">2%</td>
                                                <td className="border border-gray-400 p-2 text-center">2%</td>
                                                <td className="border border-gray-400 p-2 text-center">2%</td>
                                                <td className="border border-gray-400 p-2 text-center">2%</td>
                                                <td className="border border-gray-400 p-2 text-center flex-grow-1">hello</td>
                                        
                                            </tr>
                                        </tbody>
                                    </table>

                                        <div className="mb-6">
                                        <h3 className="text-lg font-bold mb-3 underline">Loan Outstanding Details</h3>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Elapsed Days till 2025-09-07</span>
                                                    <span className="text-sm">: 278</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Due Principal</span>
                                                    <span className="text-sm">: 80000.00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Current Interest</span>
                                                    <span className="text-sm">: 6702.00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm">Remaining Interest</span>
                                                    <span className="text-sm">: 0.00</span>
                                                </div>
                                                <hr />
                                                <div className="text-right">
                                                    <div className="text-lg font-bold">
                                                        <span>Total : 86702.00</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-8">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-600">Generated by ADMIN_USER on 2025-09-07 11:49:38</p>
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