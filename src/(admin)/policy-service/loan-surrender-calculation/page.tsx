"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";

import { LoanSurrendarDTO, emptyLoanSurrendar, LoanSurrendarSchema } from "./LoanSurrendarSchema";
import { LoanSurrendarForm } from "./components/LoanSurrendarForm";
import PolicyDetails from "./components/Policydetails";
import {CalculationDetails} from "./components/CalculationDetails";
import PsaTable from "./components/PsaTable";
import BonusTable from "./components/BonusTable";

export default function Page() {
    const [policyList, setPolicyList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [policyDetails, setPolicyDetails] = useState(null);

    const { showToast } = useToast();
    const form = useForm({
        resolver: zodResolver(LoanSurrendarSchema),
        defaultValues: {
            ...emptyLoanSurrendar,
        },
        mode: "onChange",
    });
    const policyId = form.watch("policyId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = {
                    endpoint: "proposal_required_list",
                };
                const response = await apiPostCall(data as PostCallData);
                console.log("this is policy list sudeep", response);
                if (response?.data && response.status === API_CONSTANTS.success) {
                    const activePolicies = response.data.policyList.filter(
                        (item: { disabled: boolean }) => item.disabled === false,
                    );
                    setPolicyList(activePolicies);
                } else {
                    console.error("Invalid response format or failed API call");
                }
            } catch (error) {
                console.error("Error fetching Kyc Detail data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setPolicyDetails(null);
    }, [policyId]);

    const calculateLoan = async () => {
        try {
            const formValues = form.getValues();
            const data: PostCallData & {
                policyId: string;
                date: string;
            } = {
                policyId: formValues.policyId,
                date: formValues.date,
                endpoint: "calculate_loan", 
            };
            const response = await apiPostCall(data as PostCallData);
            if (response?.data && response.status === API_CONSTANTS.success) {
                setPolicyDetails(response.data);
                showToast(
                    response?.data.code,
                    response?.data.message,
                    "loan Calculation",
                );
            } else {
                showToast(
                    response?.data.code,
                    response?.data.message,
                    "loan Calculation",
                );
                console.error("Invalid response format or failed API call");
            }
        } catch (error) {
            console.error("Error calculating premium:", error);
        }
    };

    const onSubmit: SubmitHandler<LoanSurrendarDTO> = async (formData) => {
        if (isSubmitting) {
            return;
        }

        try {
            setIsSubmitting(true);

            const requiredFields = ["policyId", "date"];
            const missingFields = requiredFields.filter(
                (field) => !formData[field as keyof LoanSurrendarDTO],
            );

            if (missingFields.length > 0) {
                console.error("Missing required fields:", missingFields);
                showToast(
                    "100",
                    `Missing required fields: ${missingFields.join(", ")}`,
                    "Validation Error",
                );
                return;
            }

            // Call the calculate function
            await calculateLoan();
        } catch (error) {
            showToast(
                "100",
                "An error occurred during submission",
                "Submission Error",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-3">
            <div className="bg-white rounded-lg border-1 mb-6 mt-4 w-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Loan Surrender Calculator
                    </h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <LoanSurrendarForm
                                form={form}
                                policyList={policyList}
                            />

                            <hr className="my-5" />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
                            >
                                {isSubmitting && (
                                    <Loader2Icon className="h-4 w-4 animate-spin" />
                                )}
                                Calculate
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4">
                        {!policyDetails && <PolicyDetails policyDetails={policyDetails} />}
                    </div>
                    <div className="mt-4">
                        {!policyDetails && <CalculationDetails policyDetails={policyDetails} />}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mt-6">
                        PSA Details
                    </h2>
                    <PsaTable/>
                    <h2 className="text-xl font-bold text-gray-800 mt-6">
                        Bonus Details
                    </h2>
                    <BonusTable/>
                </div>
            </div>

        </div>
    );
}