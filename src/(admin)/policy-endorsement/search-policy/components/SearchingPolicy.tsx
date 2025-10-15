import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormSelect from "@/components/formElements/FormSelect";
type SelectOption = { text: string; value: string };

interface EndorsementFormProps {
	form: UseFormReturn<any>;
}

export default function SearchingPolicy({ form }: EndorsementFormProps) {
	const [documents, setDocuments] = useState<
		{ id: number; documentUrl?: string; documentFileName?: string }[]
	>([{ id: Date.now() }]);

	// Static values instead of API
	const policyList: SelectOption[] = [
		{ text: "Policy-1001", value: "1001" },
		{ text: "Policy-1002", value: "1002" },
		{ text: "Policy-1003", value: "1003" },
	];

	const endorsementTypeList: SelectOption[] = [
		{ text: "Type A", value: "A" },
		{ text: "Type B", value: "B" },
		{ text: "Type C", value: "C" },
	];

	const availableDocumentTypes: SelectOption[] = [
		{ text: "ID Proof", value: "id" },
		{ text: "Address Proof", value: "address" },
		{ text: "Other", value: "other" },
	];

	return (
		<div className="p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Search Policy For Endorsement
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormSelect
							name="policyNo"
							options={policyList}
							label="Policy No"
							form={form}
							required
							placeholder="Select Policy No"
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="endorsementType"
							options={endorsementTypeList}
							label="Endorsement Type"
							form={form}
							required
							placeholder="Select Endorsement Type"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
