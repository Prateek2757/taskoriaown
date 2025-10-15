"use client";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";


export type PolicyDetails = {
    policyId?: number;
    date?: number;

};


export const CalculationDetails = () => {
    const [kycData, setKycData] = useState<AddEditKycWithFileDTO>();
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const kycNumber = params.kycNumber;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = {
                    KYCNumberEncrypted: kycNumber || null, 
                    endpoint: "kyc_view",
                };
                const response = await apiPostCall(data as PostCallData);
                console.log("this is form response", response);
                if (response?.data && response.status === API_CONSTANTS.success) {
                    setKycData(response.data);
                } else {
                    console.error("Invalid response format or failed API call");
                }
            } catch (error) {
                console.error("Error fetching Kyc Detail data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (kycNumber) {
            fetchData();
        }
    }, [kycNumber]);

    const displayData = (field: keyof AddEditKycWithFileDTO): string => {
        if (!kycData) return "N/A";
        const value = kycData[field];
        return value?.toString() || "N/A";
    };

    return (
        <div className="bg-white rounded-lg border-1 p-6 ">
            <h2 className="text-xl font-bold mb-6 ">Calculation Details</h2>
            <div className="p-0 md:p-6 md:pb-0 border border-dashed border-gray-300 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm ">
                            Remaining Period(Year):
                            <span className="ml-1">
                                <b>{displayData("kycNumber")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Completed Months:
                            <span className="ml-1">
                                <b>{displayData("branchCode")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Yearly Factor:
                            <span className="ml-1">
                                <b>{displayData("residenceStatus")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Monthly Adjustment Factor:{" "}
                            <span className="ml-1">
                                <b>{displayData("nationality")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            PaidUp Sum Assured:
                            <span className="ml-1">
                                <b>{displayData("religion")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Vested Bonus:
                            <span className="ml-1">
                                <b>{displayData("salutation")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            PSA After Adjustment:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Bonus After Adjustment:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            PaidUp Value:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Anticipation Paid:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Taxable Amount:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Tax:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Due Loan Amount:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Due Interest:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Due Remaining Interest:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Excess Short:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Surrender Value:
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Available Loan Amount (90%):
                            <span className="ml-1">
                                <b>{displayData("firstName")}</b>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};