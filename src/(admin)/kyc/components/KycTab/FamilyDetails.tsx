import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "../../../../../components/formElements/FormInput";
import FormInputNepali from "../../../../../components/formElements/FormInputNepali";
import { useOnlyAlphabets } from "@/hooks/useInputValidation";

type FamilyDetailsProps = {
	form: UseFormReturn<AddEditKycDTO>;
};
export default function FamilyDetails({ form }: FamilyDetailsProps) {
	const [married, setMarried] = useState(false);
	const maritalStatus = form.watch("maritalStatus");
	useEffect(() => {
		if (maritalStatus === "UMRD") {
			setMarried(false);
			form.setValue("spouseName", "");
			form.setValue("spouseNameLocal", "");
		}
	}, [maritalStatus]);

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">Family Details</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormInput
							form={form}
							name="fatherName"
							type="text"
							placeholder="Enter father's name"
							label="Father Name"
							required={true}
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormInputNepali
							form={form}
							name="fatherNameLocal"
							type="text"
							placeholder="Enter father's name in Nepali"
							label="Father Name (Nepali)"
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="motherName"
							type="text"
							placeholder="Enter mother's name"
							label="Mother Name"
							required={true}
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormInputNepali
							form={form}
							name="motherNameLocal"
							type="text"
							placeholder="Enter mother's name in Nepali"
							label="Mother Name (Nepali)"
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="grandFatherName"
							type="text"
							placeholder="Enter grandfather's name"
							label="Grand Father Name"
							required={true}
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormInputNepali
							form={form}
							name="grandFatherNameLocal"
							type="text"
							placeholder="Enter grandfather's name in Nepali"
							label="Grand Father Name (Nepali)"
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							disabled={married}
							form={form}
							name="spouseName"
							type="text"
							placeholder="Enter spouse's name"
							label="Spouse Name"
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormInputNepali
							disabled={married}
							form={form}
							name="spouseNameLocal"
							type="text"
							placeholder="Enter spouse's name in Nepali"
							label="Spouse Name (Nepali)"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
