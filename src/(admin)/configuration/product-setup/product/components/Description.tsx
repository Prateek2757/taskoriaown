import { UseFormReturn } from "react-hook-form";
import { AddEditProductDTO } from "../ProductSchema";
import FormTextarea from "@/components/formElements/FormTextarea";


type DescriptionProps = {
    form: UseFormReturn<AddEditProductDTO>;
    isEditMode: boolean;
};


export default function Description({ form, isEditMode = false }: DescriptionProps) {
    return (
        <>
            <div className="bg-white rounded-lg border-1 mb-6 mt-4">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Description
                    </h2>
                        <div className="w-full mb-6">
                            <div className="space-y-2">
                                <FormTextarea
                                    form={form}
                                    name="productDescription"
                                    placeholder="Enter Description"
                                    label="Description"
                                    required={true}
                                />

                            </div>
                        </div>
                </div>
            </div>
        </>
    );
}
