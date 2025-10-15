"use client";
import type { UseFormReturn } from "react-hook-form";
import type { PolicyLoanDTO } from "../PolicyLoanSchema";
import FormInput from "@/components/formElements/FormInput";
import { Button } from "@/components/ui/button";
import FormInputFile from "@/components/formElements/FormInputFile";
import Link from "next/link";

interface PolicyLoanProps {
    form: UseFormReturn<PolicyLoanDTO>;
}
export default function LoanDetails({ form }: PolicyLoanProps) {
    return (
        <div>
            <div className="bg-white rounded-lg border-1 mb-6 mt-4">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Loan Details</h2>
                    <div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="space-y-2">
                                <FormInput
                                    name="loanDetails"
                                    label="Loan Amount"
                                    placeholder="Enter Loan Amount"
                                    form={form}
                                    required={true}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
             
            <Link href="123/memo">
                <Button>
                    <span>Generate Memo</span>
                </Button>
            </Link>


            <div className="bg-white p-6 rounded-lg border-1 mb-6 mt-4">
                 <h2 className="text-xl font-bold text-gray-800 mb-6">Verification Details</h2>
                 <div className="border-0 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="space-y-2">
                                <FormInputFile
                                        name="loanRateFile"
                                        label="Loan Rate"
                                        form={form}
                                        fileNameField="loanRateFileName"
                                        accept=".png,.jpg,.jpeg,.pdf"
                                        maxSize={5}
                                        validTypes={["image/png", "image/jpeg", "application/pdf","text/csv","application/vnd.ms-excel"]}
                                        required={true}
                                    />
                            </div>
                        </div>
                    </div>
            </div>

        </div>
    );
}
