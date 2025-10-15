"use client";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { useForm, type UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput"; // changed from FormInputFile
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Button } from "@/components/ui/button";
import FormSelect from "@/components/formElements/FormSelect";
interface SelectOption {
	text: string;
	value: string | number;
}
interface CommissionEditProps {
	form: UseFormReturn<AddEditKycDTO>;
	data?: Partial<AddEditKycDTO>; // for edit mode
	productList?: SelectOption[]; // optional product list
}

export default function CommissionEdit({
	form,
	data,
	productList,
}: CommissionEditProps) {
	// Default products if not provided
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
		<>
			<div className="bg-white rounded-lg border mb-6 mt-4 justify-start">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Agent Commission Rate Details
					</h2>

					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="space-y-2">
								<FormSelect
									form={form}
									name="productid"
									options={finalProductList}
									label="Product ID"
									required
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="minPayingTerm"
									type="text"
									placeholder="Enter min paying term"
									label="Min Paying Term"
									required
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="max paying term"
									type="text"
									placeholder="Enter max paying term"
									label="Max Paying Term"
									required
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="minterm"
									type="text"
									placeholder="Enter min term"
									label="Min Term"
									required
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="max term"
									type="text"
									placeholder="Enter max term"
									label="Max Term"
									required
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="year"
									type="text"
									placeholder="Enter year"
									label="Year"
									required
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="rate"
									type="text"
									placeholder="Enter rate"
									label="Rate"
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
			<div className="flex items-end justify-start mt-6 ">
				<Button
					type="button"
					className="bg-gray-800 hover:bg-gray-800"
					onClick={form.handleSubmit(onSubmit)}
				>
					Update
				</Button>
			</div>
		</>
	);
}
