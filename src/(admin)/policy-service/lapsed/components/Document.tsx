import { UseFormReturn } from "react-hook-form";
import { LapsedDTO } from "../LapsedSchema";
import FormTextarea from "@/components/formElements/FormTextarea";


type DescriptionProps = {
    form: UseFormReturn<LapsedDTO>;
    isEditMode: boolean;
};


export default function Document({ form, isEditMode = false }: DescriptionProps) {
    return (
        <>
            <div className="bg-white rounded-lg border-1 mb-6 mt-4">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                        Documents
                    </h2>
                    <div>
                        <span>Basic Documents</span>
                        <div className="border grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded-lg mt-3">
                            <span>Document For</span>
                            <span>Documents</span>
                        </div>
                    </div>
                    <div className="w-full mb-6">
                        <div className="space-y-2">
                            <FormTextarea
                                form={form}
                                name="remarks"
                                placeholder="Enter remarks"
                                label="Remarks"
                                required={true}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
