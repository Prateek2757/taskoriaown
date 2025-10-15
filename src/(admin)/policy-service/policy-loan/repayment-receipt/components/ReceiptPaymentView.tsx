"use client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useState, useEffect } from "react";
import Image from 'next/image';

export default function ReceiptPaymentView() {
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
                                                height={150}
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
                                        <h2 className="text-xl font-bold text-gray-800">Policy Loan Repayment Receipt</h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <p className="text-sm"><strong>Receipt No :</strong> JV300818200002</p>
                                            <p className="text-sm"><strong>Policy No :</strong> 101000164</p>
                                            <p className="text-sm"><strong>Loan Id :</strong> LNIDM5526</p>
                                        </div>
                                        <div>
                                            <p className="text-sm"><strong>Name :</strong> Samyog Budachhetri</p>
                                            <p className="text-sm"><strong>Repayment Instalment :</strong> -2</p>
                                        </div>
                                        <div>
                                            <p className="text-sm"><strong>Loan Date :</strong> 2022-12-21</p>
                                            <p className="text-sm"><strong>Last Paid On :</strong> 2023-07-16</p>
                                            <p className="text-sm"><strong>Paid Date :</strong> 2024-07-16</p>
                                        </div>
                                    </div>

                                    <table className="w-full border border-gray-400 mb-4">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-400 p-2 text-center">Due Principal</th>
                                                <th className="border border-gray-400 p-2 text-center">Paid Principal</th>
                                                <th className="border border-gray-400 p-2 text-center">Remaining Principal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-400 p-2 text-center">0.00</td>
                                                <td className="border border-gray-400 p-2 text-center">0.00</td>
                                                <td className="border border-gray-400 p-2 text-center">0.00</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className="w-full border border-gray-400 mb-4">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-400 p-2 text-center">Due Interest</th>
                                                <th className="border border-gray-400 p-2 text-center">Paid Interest</th>
                                                <th className="border border-gray-400 p-2 text-center">Remaining Interest</th>
                                                <th className="border border-gray-400 p-2 text-center">Previous Interest</th>
                                                <th className="border border-gray-400 p-2 text-center">Total Paid Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-400 p-2 text-center">6362.00</td>
                                                <td className="border border-gray-400 p-2 text-center">0.00</td>
                                                <td className="border border-gray-400 p-2 text-center">6362.00</td>
                                                <td className="border border-gray-400 p-2 text-center">0.00</td>
                                                <td className="border border-gray-400 p-2 text-center">0.00</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className="w-full border border-gray-400 mb-6">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-400 p-2 text-center">Collection Type</th>
                                                <th className="border border-gray-400 p-2 text-center">Bank Details</th>
                                                <th className="border border-gray-400 p-2 text-center">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-400 p-2 text-center"></td>
                                                <td className="border border-gray-400 p-2 text-center"></td>
                                                <td className="border border-gray-400 p-2 text-center"></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <p className="text-xs mb-8">
                                        <strong>Note:</strong> Payment by cheque is subjected to realization.
                                    </p>

                                    <div className="flex flex-col items-end">
                                        <div className="border-b border-gray-400 w-32 text-center pb-1">

                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm"><strong>Issued By (ADMIN_USER)</strong></p>
                                            <p className="text-xs text-gray-600">Printed By ADMIN_USER on 2025-09-07 10:56:46</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 border-b border-dotted border-gray-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}