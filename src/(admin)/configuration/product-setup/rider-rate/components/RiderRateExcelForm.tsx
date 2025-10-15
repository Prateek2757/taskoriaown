"use client";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	type RiderRateDTO,
	emptyRiderRate,
	RiderRateSchema,
} from "../RiderRateSchema";
import { Button } from "@/components/ui/button";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormSelect from "@/components/formElements/FormSelect";
import FormInputFile from "@/components/formElements/FormInputFile";

interface riderRateRequiredFields {
	productType: SelectOption[];
	riderType: SelectOption[];
}

type Props = {
	data?: RiderRateDTO;
	productRateRequirements?: riderRateRequiredFields;
};

export const RiderRateExcelForm = ({
	data,
	productRateRequirements,
}: Props) => {
	const form = useForm<RiderRateDTO>({
		defaultValues: data ?? emptyRiderRate,
		resolver: zodResolver(RiderRateSchema),
	});
	//will call the requiredfiled here for the form sleect and stuff like that form the api like kycrequiredlist and use setProductionRequirement function and load the required list maybe will use tanstack or whatever.

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
								Rider Rate Details
							</h2>
							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									<div className="space-y-2">
										<FormSelect
											options={productRateRequirements?.productType}
											form={form}
											name="productType"
											label="Product Name"
											caption="Select Product"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormSelect
											options={productRateRequirements?.riderType}
											form={form}
											name="riderId"
											label="Rider "
											caption="Select Rider"
											required={true}
										/>
									</div>

									<div className="flex items-start justify-between gap-4">
										<FormSwitch
											form={form}
											label="Is Active?"
											name="isActive"
										/>
									</div>

									<FormInputFile
										name="RiderRateFile"
										label="Rider Rate"
										form={form}
										fileNameField="RiderRate"
										accept=".png,.jpg,.jpeg,.pdf"
										maxSize={5}
										validTypes={["image/png", "image/jpeg", "application/pdf"]}
										{...(data?.RiderRate && {
											editMode: true,
											initialImageUrl: `${data.RiderRate[0]?.RiderRateFile}`,
											initialFileName: `${data.RiderRate[0]?.RiderRateFileName}`,
										})}
										required={true}
									/>
								</div>
							</div>
						</div>
					</div>

					<Button
						type="submit"
						className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
					>
						{data?.riderName ? "Update Product Rate" : "Add Product Rate"}
					</Button>
				</form>
			</Form>
		</>
	);
};
