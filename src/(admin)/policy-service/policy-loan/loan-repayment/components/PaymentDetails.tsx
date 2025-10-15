"use client";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type PaymentDetailsDTO, emptyPaymentDetails, PaymentDetailsSchema } from "../LoanRepaymentSchema";
import { Button } from "@/components/ui/button";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormSelect from "@/components/formElements/FormSelect";
import FormInputFile from "@/components/formElements/FormInputFile";
import FormInput from "@/components/formElements/FormInput";

interface paymentDetailsRequiredFields {
    collectionType: SelectOption[];
}

type Props = {
    data?: PaymentDetailsDTO;
    paymentDetailsRequirements?: paymentDetailsRequiredFields;

};


export const PaymentDetails = ({ data, paymentDetailsRequirements }: Props) => {
    const form = useForm<PaymentDetailsDTO>({
        defaultValues: data ?? emptyPaymentDetails,
        resolver: zodResolver(PaymentDetailsSchema),
    });
    //will call the requiredfiled here for the form sleect and stuff like that form the api like kycrequiredlist and use setProductionRequirement function and load the required list maybe will use tanstack or whatever.


    useEffect(() => {
        if (data) {
            form.reset(data);
        }
    }, [data, form]);

    const isEditMode = !!data;

    return (
        <div>
            <Form {...form}>
                <form>
                    <div className="bg-white rounded-lg border-1 mb-6 mt-4 p-6 ">
                        <h2 className="text-xl font-bold text-gray-800 mb-3 ">
                            Payment Details                    </h2>
                        <div className="bg-white rounded-lg border border-dashed border-gray-200  mt-4">
                            <div className="p-6">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <div className="space-y-2">
                                        <FormInput
                                            form={form}
                                            name="dueNetLoan"
                                            type="text"
                                            placeholder="Enter due net loan"
                                            label="Due Net Loan"
                                            required={true}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FormSelect
                                            options={paymentDetailsRequirements?.collectionType}
                                            form={form}
                                            name="productType"
                                            label="Product Name"
                                            caption="Select Product"
                                            required={true}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FormInput
                                            form={form}
                                            name="paidAmount"
                                            type="text"
                                            placeholder="Enter paid amount"
                                            label="Paid Amount"
                                            required={true}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FormInput
                                            form={form}
                                            disabled={true}
                                            name="totalPaidAmount"
                                            type="text"
                                            placeholder="Enter total paid amount"
                                            label="Total Paid Amount"
                                        />
                                    </div>


                                    <div className="flex items-start justify-between gap-4">
                                        <FormSwitch
                                            form={form}
                                            label="Is Partial Payment?"
                                            name="isPartialPayment"
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
                    >
                        Submit

                    </Button>
                </form>
            </Form >
        </div>
    );
}