"use client";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type PolicyLoanDTO, emptyPolicyLoan, PolicyLoanSchema } from "../PolicyLoanSchema";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/formElements/FormInput";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { CalculationDetails } from "./CalcualtionDetails";
import LoanDetails from "./LoanDetails";


type Props = {
    data?: PolicyLoanDTO;


};


export const PolicyForwardForm = ({ data }: Props) => {
    const form = useForm<PolicyLoanDTO>({
        defaultValues: data ?? emptyPolicyLoan,
        resolver: zodResolver(PolicyLoanSchema),
    });
    //will call the requiredfiled here for the form sleect and stuff like that form the api like kycrequiredlist and use setProductionRequirement function and load the required list maybe will use tanstack or whatever.

    const [submit, setSubmit] = useState(false);


    const handleSetSubmitting = () => {
        setSubmit(true);
        if (submit) {
            setSubmit(false);
        }
    };
    useEffect(() => {
        if (data) {
            form.reset(data);
        }
    }, [data, form]);

    const isEditMode = !!data;

    return (
        <>
            <Form {...form}>
                <form>
                    <div className="bg-white rounded-lg border-1 mb-6 mt-4">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                Calculation Details
                            </h2>
                            <div className="border-0 md:border border-dashed border-gray-300 rounded-lg  p-0 md:p-6 md:pb-0">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <DateConverter
                                        form={form}
                                        name="calculateDate"
                                        labelNep="Calculation Date in BS"
                                        labelEng="Calculation Date in AD"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <Button
                            type="button"
                            onClick={handleSetSubmitting}
                        >
                            Calculate
                        </Button>
                    </div>

                {submit &&
                    (<div className="mt-6">

                        <CalculationDetails />
                        <LoanDetails
                            form={form}
                        />
                    </div>)}
                    <Button>
                        Submit
                    </Button>
                </form>

            </Form >
        </>
    );
}