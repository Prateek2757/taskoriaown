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

export default function TargetSetupEdit({
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
			<div className="bg-white rounded-lg  border border-gray-200 mb-8 mt-6">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Branch Wise Target Details
					</h2>

					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="space-y-2">
								<FormInput
									form={form}
									name="fiscalyear"
									type="text"
									placeholder="Enter fiscal year"
									label="Fiscal Year"
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="branchName"
									type="text"
									placeholder="Enter branch name"
									label="Branch Name"
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="fpiConvTarget"
									type="text"
									placeholder="Enter FPI Conv Target"
									label="FPI Conv Target"
									required
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="nop conv target"
									type="text"
									placeholder="Enter nop conv target"
									label="Nop Conv Target"
									required
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="FPIInd term target"
									type="text"
									placeholder="Enter FPIInd term target"
									label="FPIInd term target"
									required
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="NOPIND term target"
									type="text"
									placeholder="Enter NOPIND term target"
									label="NOP IND term target"
									required
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="FPI Micro target"
									type="text"
									placeholder="Enter FPI Micro target"
									label="FPI Micro target"
									required
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="NOP micro target"
									type="text"
									placeholder="Enter NOP micro target"
									label="NOP Micro target"
									required
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="NOA target"
									type="text"
									placeholder="Enter NOA target"
									label="NOA target"
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
					className="bg-gray-800 text-white rounded-md px-4 py-2"
					type="button"
					onClick={form.handleSubmit(onSubmit)}
				>
					Update
				</Button>
			</div>
		</>
	);
}
