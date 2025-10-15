import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormTextarea from "@/components/formElements/FormTextarea";

interface EndorsementFormProps {
	form: UseFormReturn<any>;
}

export default function EndorsementRequesting({ form }: EndorsementFormProps) {
	const [documents, setDocuments] = useState<
		{ id: number; documentUrl?: string; documentFileName?: string }[]
	>([{ id: Date.now() }]);

	// Static values instead of API

	return (
		<div className="pl-6 pr-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Endorsement Requesting Personnel Details
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormInput
							form={form}
							name="requesterName"
							type="text"
							placeholder="Enter Full Name"
							label="Name"
							required={true}
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="requesterMobileNo"
							type="tel"
							placeholder="Enter Mobile No"
							label="Mobile No"
							required={true}
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="requesterEmail"
							type="email"
							placeholder="Enter Email"
							label="Email"
						/>
					</div>

					<div className="space-y-2 mb-6">
						<FormTextarea
							form={form}
							name="remarks"
							placeholder="Please Enter Remarks"
							label="Remarks"
							required={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
