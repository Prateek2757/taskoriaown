"use client";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";

export const ProductDetails = () => {
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
        <div>
            <div className="p-0 md:p-6 md:pb-0 border border-dashed border-gray-300 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm ">
                            Sum Assured:
                            <span className="ml-1">
                                <b>{displayData("kycNumber")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Premium:
                            <span className="ml-1">
                                <b>{displayData("branchCode")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Term:
                            <span className="ml-1">
                                <b>{displayData("residenceStatus")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Pay Term:
                            <span className="ml-1">
                                <b>{displayData("residenceStatus")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Mode Of Payment:
                            <span className="ml-1">
                                <b>{displayData("residenceStatus")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Date Of Commencement:
                            <span className="ml-1">
                                <b>{displayData("residenceStatus")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Maturity Date:
                            <span className="ml-1">
                                <b>{displayData("residenceStatus")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Installment:
                            <span className="ml-1">
                                <b>{displayData("residenceStatus")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Next Due Date:{" "}
                            <span className="ml-1">
                                <b>{displayData("nationality")}</b>
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Risk Start Date:{" "}
                            <span className="ml-1">
                                <b>{displayData("nationality")}</b>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-gray-700 text-sm">
                            Vesting Date:{" "}
                            <span className="ml-1">
                                <b>{displayData("religion")}</b>
                            </span>
                        </div>
                    </div>


                </div>
            </div>
        </div>

    )


}