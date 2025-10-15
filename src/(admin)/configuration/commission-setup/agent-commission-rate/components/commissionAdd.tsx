"use client";

import type { UseFormReturn } from "react-hook-form";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";

import FormSelect from "@/components/formElements/FormSelect";
import FormInputFile from "@/components/formElements/FormInputFile";
import { Button } from "@/components/ui/button";
import { FormSwitch } from "@/components/formElements/FormSwitch";

interface SelectOption {
	text: string;
	value: string | number;
}

interface AddressDetailsProps {
	form: UseFormReturn<AddEditKycDTO>;
	data?: Partial<AddEditKycDTO>;
	productList?: SelectOption[];
}

export default function CommissionDetails({
	form,
	data,
	productList,
}: AddressDetailsProps) {
	// Default products if prop not provided
	const defaultProductList: SelectOption[] = [
		{ text: "Product A", value: "A" },
		{ text: "Product B", value: "B" },
		{ text: "Product C", value: "C" },
	];
	const onSubmit = (data: AddEditKycDTO) => {
		console.log("Form submitted:", data);
		// Add API call here
	};

	const finalProductList =
		productList && productList.length > 0 ? productList : defaultProductList;
	return (
		<div>
			<div className="bg-white rounded-lg border mb-6 mt-4 justify-start">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Upload Agent Commission Rate
					</h2>
					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Product Select */}
							<div className="space-y-2">
								<FormSelect
									form={form}
									name="productName"
									options={finalProductList}
									label="Product Name"
									placeholder="Select Product Name"
									required
								/>
							</div>

							{/* Photo Upload */}
							<div className="space-y-2 mb-6">
								<FormInputFile
									form={form}
									name="photoFile"
									label="Agent Commission Rate"
									fileNameField="photoFileName"
									accept=".png,.jpg,.jpeg,.pdf"
									maxSize={5}
									validTypes={["image/png", "image/jpeg", "application/pdf"]}
									editMode={!!data?.photoFileUrl}
									initialImageUrl={data?.photoFileUrl || ""}
									initialFileName={data?.photoFileName || ""}
									required
								/>
							</div>
							<div className="flex items-start justify-between gap-4">
								<FormSwitch form={form} label="Is Active" name="isActive" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex items-end justify-start mt-6">
				<Button
					type="button"
					className="bg-gray-800 hover:bg-gray-800"
					onClick={form.handleSubmit(onSubmit)}
				>
					Submit
				</Button>
			</div>
		</div>
	);
}
