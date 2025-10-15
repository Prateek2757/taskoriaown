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
import FormInput from "@/components/formElements/FormInput";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormSelect from "@/components/formElements/FormSelect";

interface riderRateRequiredFields {
	productType: SelectOption[];
	riderType: SelectOption[];
}

type Props = {
	data?: RiderRateDTO;
	riderRateRequirements?: riderRateRequiredFields;
};

export const RiderRateForm = ({ data, riderRateRequirements }: Props) => {
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
											options={riderRateRequirements?.productType}
											form={form}
											name="productType"
											label="Product ID"
											caption="Select Product"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormSelect
											options={riderRateRequirements?.riderType}
											form={form}
											name="riderId"
											label="Rider ID"
											caption="Select Rider"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormInput
											form={form}
											name="minAge"
											type="number"
											placeholder="Enter Min Age"
											label="Min Age"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormInput
											form={form}
											name="maxAge"
											type="number"
											placeholder="Enter Max Age"
											label="Max Age"
											required={true}
										/>
									</div>

									<div className="space-y-2">
										<FormInput
											form={form}
											name="riderMinTerm"
											type="text"
											placeholder="Enter Min Rider Term"
											label="Min Rider Term"
											required={true}
										/>
									</div>

									<div className="space-y-2">
										<FormInput
											form={form}
											name="riderMaxTerm"
											type="text"
											placeholder="Enter Rider Max Term"
											label="Max Rider Term"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormInput
											form={form}
											name="minPremiumTerm"
											type="text"
											placeholder="Enter Min. Premium Term"
											label=" Min. Premium Term"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormInput
											form={form}
											name="maxPremiumTerm"
											type="text"
											placeholder="Enter Max. Premium Term"
											label=" Max. Premium Term"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormInput
											form={form}
											name="premiumRate"
											type="text"
											placeholder="Enter Premium Rate"
											label="Premium Rate"
											required={true}
										/>
									</div>

									<div className="space-y-2">
										<FormInput
											form={form}
											name="minSa"
											type="text"
											placeholder="Enter Min Sum Assured"
											label="Min Sum Assured"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormInput
											form={form}
											name="maxSa"
											type="text"
											placeholder="Enter Max Sum Assured"
											label="Max Sum Assured"
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
						{data?.riderId ? "Update Rider Rate" : "Add Rider Rate"}
					</Button>
				</form>
			</Form>
		</>
	);
};
