import FormInput from "@/components/formElements/FormInput";
import { UseFormReturn } from "react-hook-form";
import { AddEditProductDTO } from "../ProductSchema";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";

type ProductConstraintsProps = {
	form: UseFormReturn<AddEditProductDTO>;
	productRequirements?: KycRequiredFields; // will need to add   productRequirements  interface here after creating in the typing.d.ts right nowhave used kycrequiredfields
	isEditMode: boolean;
};

export default function ProductConstraints({
	form,
	productRequirements,
	isEditMode = false,
}: ProductConstraintsProps) {
	return (
		<>
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Product Constraints
					</h2>
					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="space-y-2">
								<FormInput
									form={form}
									name="minSumAssured"
									type="text"
									placeholder="Enter Min Sum Assured"
									label="Min Sum Assured"
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="maxSumAssured"
									type="text"
									placeholder="Enter Max Sum Assured"
									label="Max Sum Assured"
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormInputNepali
									form={form}
									name="minAgeAtEntry"
									type="text"
									placeholder="Enter Min Age At Entry"
									label="Min Age At Entry"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="maxAgeAtEntry"
									type="text"
									placeholder="Enter Max Age at Entry"
									label="Max Age at Entry"
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="minTerm"
									type="text"
									placeholder="Enter Min Term"
									label="Min Term"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="maxTerm"
									type="text"
									placeholder="Enter Max Term"
									label="Max Term"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="minPayingTerm"
									type="text"
									placeholder="Enter Min Paying Term"
									label="Min Paying Term"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="maxPayingTerm"
									type="text"
									placeholder="Enter Max Paying Term"
									label="Max Paying Term"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="fixedTerm"
									type="text"
									placeholder="Enter Fixed Term"
									label="Fixed Term"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="maxAgeAtMaturity"
									type="text"
									placeholder="Enter Max Age At Maturity"
									label="Max Age At Maturity"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormSelect
									options={productRequirements?.ageCalculationMethod}
									form={form}
									name="ageCalculationMethod"
									label="Age Calculation Method"
									caption="Select Age Calculation Method"
									required={true}
								/>
							</div>

							<div className="flex items-start justify-between gap-4">
								<FormSwitch form={form} label="Is Active?" name="isActive" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
