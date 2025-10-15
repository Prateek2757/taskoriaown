"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { CreateloanScheduleColumns } from "../../agent-loan-form/Column";
import { LoanPaymentColumns, LoanPaymentDetail } from "../column";
import { names } from '../../../../../../../.next/server/edge/chunks/_381fde5e._';
export default function LoanStatementPage() {
    const { agentCode } = useParams();
    const [loanSchedule, setLoanSchedule] = useState<any[]>([]);

    const agentDetails = {
        agentCode: "35500005",
        fullName: "Bikash Shrestha",
        branch: "355.",
        createdDate: "13/09/2021",
        licenseIssuedDate: "13/09/2021",
        licenseExpiryDate: "13/04/2026",
        licenseNo: "28/16728",
        mobile: "9808317659",
        bankName: "1601",
    };

    const loanDetails = {
        loanId: "LN3",
        loanApplyDate: "2023-12-25",
        loanDate: "2022-12-26",
        interestRate: "9.5% per annum",
        maturityDate: "2024-12-26",
        loanAmount: "200000.00",
        approvedAmount: "200000.00",
        accruedInterest: "15,943.00",
        remainingPrincipal: "79,757.66",
        status: "Active",
    };

    // Mock Schedule
    useEffect(() => {
        const interest = "0.05";
        const principal = (200000 / 12).toFixed(2);
        const payment = (Number(principal) + Number(interest)).toFixed(2);

        const schedule = Array.from({ length: 12 }, (_, index) => ({
            period: index + 1,
            dueDate: `27/${(index + 1).toString().padStart(2, "0")}/2025`,
            interest,
            principal,
            payment,
            currentBalance: (200000 - (index * 200000) / 12).toFixed(2),
        }));

        setLoanSchedule(schedule);
    }, []);

    const loanPaymentDetails: LoanPaymentDetail[] = [
        {
            sn: 1,
            paidDate: "2024-01-15",
            paidPrincipal: "5000.00",
            paidInterest: "300.00",
            totalPaid: "5300.00",
            voucherNo: "V1234",
        },
        {
            sn: 2,
            paidDate: "2024-02-15",
            paidPrincipal: "5000.00",
            paidInterest: "290.00",
            totalPaid: "5290.00",
            voucherNo: "V1235",
        },

        {
            sn: "TOTAL",
            paidDate: "-",
            paidPrincipal: "10000.00",
            paidInterest: "590.00",
            totalPaid: "10590.00",
            voucherNo: "-",
        },
    ];

    return (
        <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
            <div className="text-gray-700 text-sm">
                <h2 className="text-2xl font-semibold mb-4">Agent Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-dashed border-blue-300 rounded-lg p-6 mb-8 bg-gray-10 p-4 bg-white  mb-8">
                    {Object.entries(agentDetails).map(([label, value]) => (
                        <div key={label} className="flex gap-2">
                            <span className="font-semibold capitalize">{label.replace(/([A-Z])/g, " $1")}</span>: <span>{value}</span>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-semibold mb-4">Loan Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-dashed border-blue-300 rounded-lg p-6 mb-8 bg-gray-10 p-4 bg-white  mb-8">
                    {Object.entries(loanDetails).map(([label, value]) => (
                        <div key={label} className="flex gap-2">
                            <span className="font-semibold capitalize">{label.replace(/([A-Z])/g, " $1")}</span>: <span>{value}</span>
                        </div>
                    ))}
                </div>

                <div className="">
                    <h3 className="text-lg font-semibold text-gray-900  tracking-wide">
                        Loan Payment Details
                    </h3>

                    <DataTable
                        columns={LoanPaymentColumns}
                        data={loanPaymentDetails}
                        searchOptions={[]}
                        fulltable={false}
                    />
                </div>
            </div>
        </div>
    );
}
