import FormInput from "@/components/formElements/FormInput";
import { UseFormReturn } from "react-hook-form";
import { EndorsementRequestDTO } from "../../policyschema";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormTextarea from "@/components/formElements/FormTextarea";

type ProductConstraintsProps = {
	form: UseFormReturn<EndorsementRequestDTO>;
	productRequirements?: KycRequiredFields; // will need to add   productRequirements  interface here after creating in the typing.d.ts right nowhave used kycrequiredfields
	isEditMode: boolean;
};

export default function Details({
	form,
	productRequirements,
	isEditMode = false,
}: ProductConstraintsProps) {
	return (
		<>
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">Details</h2>
					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="space-y-2">
								<FormInput
									form={form}
									name="name"
									type="text"
									placeholder="Enter name"
									label="Name"
									required={true}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="mobileNumber"
									type="text"
									placeholder="Enter Mobile Number"
									label="Mobile Number"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="email"
									type="email"
									placeholder="Enter email"
									label="email"
									required={true}
								/>
							</div>

							<div className="space-y-2">
								<FormTextarea
									form={form}
									name="remarks"
									placeholder="Enter remarks"
									label="Remarks"
									required={true}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
