"use client";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	type ProductRateDTO,
	emptyProductRate,
	ProductRateSchema,
} from "../ProductRateSchema";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/formElements/FormInput";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormSelect from "@/components/formElements/FormSelect";

interface productRateRequiredFields {
	productType: Selectoption[];
}

type Props = {
	data?: ProductRateDTO;
	productRateRequirements?: productRateRequiredFields;
};

export const ProductRateForm = ({ data, productRateRequirements }: Props) => {
	const form = useForm<ProductRateDTO>({
		defaultValues: data ?? emptyProductRate,
		resolver: zodResolver(ProductRateSchema),
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
								Product Details
							</h2>
							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									<div className="space-y-2">
										<FormSelect
											options={productRateRequirements?.productType}
											form={form}
											name="productType"
											label="Product ID"
											caption="Select Product ID"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormInput
											form={form}
											name="age"
											type="text"
											placeholder="Enter Age"
											label="Age"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormInput
											form={form}
											name="term"
											type="text"
											placeholder="Enter Term"
											label="Term"
											required={true}
										/>
									</div>

									<div className="space-y-2">
										<FormInput
											form={form}
											name="payingTerm"
											type="text"
											placeholder="Enter Paying Term"
											label="Paying Term"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormInput
											form={form}
											name="rate"
											type="number"
											placeholder="Enter rate"
											label="Rate"
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
