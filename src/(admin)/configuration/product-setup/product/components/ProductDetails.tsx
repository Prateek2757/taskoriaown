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
	isEditMode: boolean;
};

export default function ProductDetails({
	form,
	data,
	productRequirements,
	isEditMode = false,
}: ProductDetailsProps) {
	return (
		<>
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Product Details
					</h2>
					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="space-y-2">
								<FormInput
									form={form}
									name="productId"
									type="text"
									placeholder="Enter product ID"
									label="Product ID"
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="productName"
									type="text"
									placeholder="Enter product Name"
									label="Product Name"
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormInputNepali
									form={form}
									name="productNameLocal"
									type="text"
									placeholder="Enter product name in Nepali"
									label="Product Name (Nepali)"
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormSelect
									options={productRequirements?.productType}
									form={form}
									name="productType"
									label="Product Type"
									caption="Select Product Type"
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormSelect
									options={productRequirements?.productGroup}
									form={form}
									name="productGroup"
									label="Product Group"
									caption="Select Product Group"
									required={true}
								/>
							</div>
							<DateConverter
								form={form}
								name="productApprovedDate"
								labelNep="Product Approved Date in BS"
								labelEng="Product Approved Date in AD"
							/>
							<DateConverter
								form={form}
								name="productStartDate"
								labelNep="Product Start Date in BS"
								labelEng="Product Start Date in AD"
							/>
							<DateConverter
								form={form}
								name="productClosedDate"
								labelNep="Product Closed Date in BS"
								labelEng="Product Closed Date in AD"
							/>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="gracePeriod"
									type="text"
									placeholder="Enter Grace Period"
									label="Grace Period"
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="lapsePeriod"
									type="text"
									placeholder="Enter Lapse Period"
									label="Lapse Period"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="shortLateFee"
									type="text"
									placeholder="Enter Short Late Fee"
									label="Short Late Fee"
									required={true}
								/>
							</div>

							<div className="flex items-start justify-between gap-4">
								<FormSwitch
									form={form}
									label="Is Proposer Needed?"
									name="isProposerNeeded"
								/>
							</div>
							<div className="flex items-start justify-between gap-4">
								<FormSwitch
									form={form}
									label="Is Spouse Needed?"
									name="isSpouseNeeded"
								/>
							</div>

							<div className="flex items-start justify-between gap-4">
								<FormSwitch
									form={form}
									label="Is Loan Available?"
									name="isLoanAvailable"
								/>
							</div>
							<div className="flex items-start justify-between gap-4">
								<FormSwitch
									form={form}
									label="Is Participatory?"
									name="isParticipatory"
								/>
							</div>
							<div className="flex items-start justify-between gap-4">
								<FormSwitch
									form={form}
									label="Is Survival?"
									name="isSurvival"
								/>
							</div>

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
