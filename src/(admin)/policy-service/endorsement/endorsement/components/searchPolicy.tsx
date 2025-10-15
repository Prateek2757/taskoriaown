import FormInput from "@/components/formElements/FormInput";
import { UseFormReturn } from "react-hook-form";
import { EndorsementRequestDTO } from "../../policyschema";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormSelect from "@/components/formElements/FormSelect";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormInputFile from "@/components/formElements/FormInputFile";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormCombo from "@/components/formElements/FormCombo";

type requiredFields = {};

type ProductDetailsProps = {
	form: UseFormReturn<EndorsementRequestDTO>;
	data?: {
		productFile?: string;
		productFileName?: string;
	};
	isEditMode: boolean;
	endorsementRequestField: requiredFields;
	policyNo: SelectOption[];
	endorsementType: SelectOption[];
};

export default function SearchPolicy({
	form,
	data,
	policyNo,
	endorsementType,
	endorsementRequestField,
}: ProductDetailsProps) {
	return (
		<>
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Search Policy For Endorsement
					</h2>
					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="space-y-2">
								<FormCombo
									form={form}
									name="policyNo"
									label="Policy No"
									options={policyNo}
									required
								/>
							</div>
							<div className="space-y-2">
								<FormSelect
									form={form}
									name="endorsementType"
									label="Endorsement Type"
									options={endorsementType}
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
