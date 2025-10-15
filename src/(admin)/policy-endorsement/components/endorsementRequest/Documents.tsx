import FormInput from "@/components/formElements/FormInput";
import { UseFormReturn } from "react-hook-form";
import { AddEditProductDTO } from "../ProductSchema";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormSelect from "@/components/formElements/FormSelect";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormInputFile from "@/components/formElements/FormInputFile";
import { FormSwitch } from "@/components/formElements/FormSwitch";

type ProductDetailsProps = {
	form: UseFormReturn<AddEditProductDTO>;
	productRequirements?: KycRequiredFields; // will need to add   productRequirements  interface here after creating in the typing.d.ts right nowhave used kycrequiredfields
	data?: {
		productFile?: string;
		productFileName?: string;
	};
};

export default function Documents({ form, data }: ProductDetailsProps) {
	return (
		<>
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">Documents</h2>
					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<FormInputFile
								name="productFile"
								label="Product File"
								form={form}
								fileNameField="productFileName"
								accept=".png,.jpg,.jpeg,.pdf"
								maxSize={5}
								validTypes={["image/png", "image/jpeg", "application/pdf"]}
								{...(data?.productFile && {
									editMode: true,
									initialImageUrl: `${data.productFile}`,
									initialFileName: `${data.productFileName}`,
								})}
								required={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
