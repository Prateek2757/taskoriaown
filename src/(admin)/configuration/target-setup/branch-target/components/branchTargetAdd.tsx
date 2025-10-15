"use client";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { useForm, type UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput"; // changed from FormInputFile
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Button } from "@/components/ui/button";

interface SelectOption {
	text: string;
	value: string | number;
}
interface CommissionEditProps {
	form: UseFormReturn<AddEditKycDTO>;
	data?: Partial<AddEditKycDTO>; // for edit mode
	productList?: SelectOption[]; // optional product list
}

export default function BranchTargetAdd({
	form,
	data,
	productList,
}: CommissionEditProps) {
	// Default products if not provided

	const onSubmit = (data: AddEditKycDTO) => {
		console.log("Form submitted:", data);
		// Add API call here
	};

	return (
		<>
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Branch Wise Daily Target Details
					</h2>

					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="space-y-2">
								<FormInput
									form={form}
									name="Targetdate"
									type="text"
									placeholder="Enter target date"
									label="Target Date"
									required
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="targetAmount"
									type="text"
									placeholder="Enter target amount"
									label="Target Amount"
									required
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
