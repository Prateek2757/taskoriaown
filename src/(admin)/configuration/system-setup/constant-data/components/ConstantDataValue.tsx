import React from "react";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { AddEditConstantDataValueDTO } from "../schemas/constantDataValueSchemas";

type ConstantDataValueProps = {
	form: UseFormReturn<AddEditConstantDataValueDTO>;
};

export default function ConstantDataValue({ form }: ConstantDataValueProps) {
	return (
		<>
			<section className="border border-gray-200 rounded-lg p-6 mb-8 bg-white mt-8">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					Constant Data Values Details
				</h2>

				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<FormInput
							form={form}
							type="text"
							name="staticCode"
							label="Static Code"
							required
						/>
						<FormInput
							form={form}
							type="text"
							name="description"
							label="Description"
							required
						/>
						<FormInput
							form={form}
							type="text"
							name="descriptionInNepali"
							label="Description In Local"
						/>
						<FormInput
							form={form}
							type="text"
							name="value"
							label="Value"
							required
						/>
						<FormInput
							form={form}
							type="text"
							name="reference"
							label="Reference"
							required
						/>
						<FormSwitch label="Is Active" name="isActive" form={form} />
					</div>
				</div>
			</section>
		</>
	);
}
