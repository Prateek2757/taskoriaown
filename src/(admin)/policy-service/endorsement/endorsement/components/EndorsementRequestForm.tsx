"use client";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type EndorsementRequestDTO, emptyEndorsementRequest, EndorsementRequestSchema } from "../EndorsementSchema";
import { Button } from "@/components/ui/button";
import SearchPolicy from "./searchPolicy";
import Details from "./Details";
import Documents from "./Documents";

type Props = {
    data?: EndorsementRequestDTO;
};

// Fix: Change component name and add both exports
export const EndorsementRequestForm = ({ data }: Props) => {
    const form = useForm<EndorsementRequestDTO>({
        defaultValues: data ?? emptyEndorsementRequest,
        resolver: zodResolver(EndorsementRequestSchema),
    });

    useEffect(() => {
        if (data) {
            form.reset(data);
        }
    }, [data, form]);

    const isEditMode = !!data;

    const [productRequirements, setProductRequirements] = useState<any | undefined>();
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    return (
        <>
            {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <title>title</title>
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Please fix the following errors:
                            </h3>
                            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                                {validationErrors.map((error, index) => (
                                    <li key={`${index * 1}-errors`}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <Form {...form}>
                <form>
                    <SearchPolicy form={form}
                        data={data} />
                    <Details form={form}

                        isEditMode={isEditMode} />
                    <Documents form={form} />

                    <Button
                        type="submit"
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
                    >
                        Submit
                    </Button>
                </form>
            </Form>
        </>
    );
};

// Add default export
export default EndorsementRequestForm;