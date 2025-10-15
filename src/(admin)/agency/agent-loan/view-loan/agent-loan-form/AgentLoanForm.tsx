"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { CreateloanScheduleColumns } from "./Column";

type AgentLoanFormFields = {
    loanType: string;
    agentCode: string;
    calculationDate: string;
    loanPeriod: string;
    loanAmount: string;
};

export default function AgentLoanForm() {
    const form = useForm<AgentLoanFormFields>({
        defaultValues: {
            loanType: "",
            agentCode: "",
            calculationDate: "",
            loanPeriod: "",
            loanAmount: "",
        },
    });

    const [step, setStep] = useState(1);
    const [showSchedule, setShowSchedule] = useState(false);
    const [agentDetails, setAgentDetails] = useState<any>(null);
    const [loanSchedule, setLoanSchedule] = useState<any[]>([]);

    const loanOptions = [
        { text: "Car", value: "LN2" },
        { text: "Motorcycle/Scooter", value: "LN3" },
        { text: "Mobile", value: "LN4" },
        { text: "Laptop/Computer", value: "LN5" },
        { text: "Home", value: "LN6" },
    ];

    const handleEligibilityCheck = () => {
        const agentCode = form.getValues("agentCode");

        if (agentCode === "AGT001") {
            setAgentDetails({
                agentCode: "10300123",
                fullName: "Kalpana Khanal",
                branch: "103-llam.",
                createdDate: "2020-08-13",
                licenseIssuedDate: "2026-04-13",
                licenseIssuedDateAD: "2020-08-13",
                licenseExpiryDate: "2026-04-13",
                licenseNo: "28/11117",
                mobile: "9842645799",
                bankName: "2301",
            });

            setStep(2);
        } else {
            alert("Invalid Agent Code. Try AGT001 for demo.");
        }
    };

    const handleLoanCalculation = () => {
        const values = form.getValues();
        const loanAmount = Number(values.loanAmount || 0);
        const loanPeriod = Number(values.loanPeriod || 0);
        const interest = "0.05";
        const principal = (loanAmount / loanPeriod).toFixed(2);
        const payment = (Number(principal) + Number(interest)).toFixed(2);

        const mockSchedule = Array.from({ length: loanPeriod }, (_, index) => ({
            period: index + 1,
            dueDate: `27/${(index + 8) % 12 + 1}/2025`,
            interest,
            principal,
            payment,
            currentBalance: (loanAmount - (index * loanAmount) / loanPeriod).toFixed(2),
        }));


        setLoanSchedule(mockSchedule);
        setShowSchedule(true);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setShowSchedule(false);
        }
    };

    return (
        <FormProvider {...form}>
            <div className="">
                {step === 1 && (
                    <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Check Eligibility</h2>
                        <div className="border-1 border-dashed border-blue-300 rounded-lg p-6 bg-gray-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <FormSelect
                                    form={form}
                                    name="loanType"
                                    label="Loan Type"
                                    options={loanOptions}
                                    caption="Select Loan Type"
                                    required
                                />
                                <FormInput
                                    form={form}
                                    name="agentCode"
                                    type="text"
                                    label="Agent Code"
                                    placeholder="Enter Agent Code"
                                    required
                                />
                            </div>
                            <Button
                                type="button"
                                className="w-full md:w-auto  focus:ring-4 focus:ring-blue-300 text-white font-semibold rounded-md px-6 py-2 transition"
                                onClick={handleEligibilityCheck}
                            >
                                Check Eligibility
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && agentDetails && (
                    <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 tracking-wide">Basic Details</h2>

                        <div className="border border-dashed border-blue-300 rounded-lg p-6 mb-8 bg-gray-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 text-gray-700 text-sm leading-relaxed">
                                {[
                                    { label: "Agent Code", value: agentDetails.agentCode },
                                    { label: "Full Name", value: agentDetails.fullName },
                                    { label: "Agent Branch", value: agentDetails.branch },
                                    { label: "Agent Code Created Date", value: agentDetails.createdDate },
                                    { label: "License Issued Date", value: agentDetails.licenseIssuedDate },
                                    { label: "License Expiry Date", value: agentDetails.licenseExpiryDate },
                                    { label: "License Issued Date (AD)", value: agentDetails.licenseIssuedDateAD },
                                    { label: "License No", value: agentDetails.licenseNo },
                                    { label: "Mobile Number", value: agentDetails.mobile },
                                    { label: "Bank Name", value: agentDetails.bankName },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-[180px_10px_1fr] gap-2 pr-6 items-center"
                                    >
                                        <span className="font-semibold text-gray-800">{item.label}</span>
                                        <span className="text-gray-500">:</span>
                                        <span className="truncate">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border border-dashed border-blue-300 rounded-lg p-6 mb-8 bg-gray-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DateConverter
                                    form={form}
                                    name="calculationDate"
                                    labelNep="Calculation Date (BS)"
                                    labelEng="Calculation Date (AD)"
                                />
                                <FormInput
                                    form={form}
                                    name="loanPeriod"
                                    type="number"
                                    label="Loan Period (Months)"
                                    placeholder="e.g., 12"
                                    required
                                />
                                <FormInput
                                    form={form}
                                    name="loanAmount"
                                    type="number"
                                    label="Loan Requested"
                                    placeholder="e.g., 50000"
                                    required
                                />
                            </div>
                        </div>

                        {showSchedule && (
                            <div className="">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-wide">
                                    Loan Schedule
                                </h3>

                                <p className="text-sm text-gray-700 mb-6">
                                    Agent loan of Rs.{Number(form.getValues("loanAmount")).toFixed(2)} for a tenure of{" "}
                                    {form.getValues("loanPeriod")} months with interest rate of {loanSchedule[0]?.interest}.
                                    For the repayment tenure, Agent must pay an amount of {loanSchedule[0]?.payment} with Interest of{" "}
                                    {loanSchedule[0]?.interest}.
                                    <br />
                                    <br />
                                    The loan repayment schedule is given as follows:
                                </p>

                                <div>
                                    <DataTable
                                        columns={CreateloanScheduleColumns(0, 10)}
                                        data={loanSchedule}
                                        searchOptions={[]}
                                        fulltable={false}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-10">
                            <Button
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-300 text-white font-semibold rounded-md px-6 py-2 transition"
                                type="button"
                                onClick={handleBack}
                            >
                                ← Back
                            </Button>
                            <Button
                                className=" focus:ring-green-300 text-white font-semibold rounded-md px-6 py-2 transition"
                                type="button"
                                onClick={handleLoanCalculation}
                            >
                                Calculate Loan
                            </Button>

                            {showSchedule ? (
                                <Button
                                    className=" focus:ring-indigo-300 text-white font-semibold rounded-md px-6 py-2 transition"
                                    type="button"
                                    onClick={() => alert("Loan applied successfully!")}
                                >
                                    Apply Agent Loan
                                </Button>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                )}
            </div>
        </FormProvider>
    );
}
