"use client";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import type { AddProposalDTO } from "../proposalSchema";

interface ProposerDetailProps {
	form: UseFormReturn<AddProposalDTO>;
}
export default function ProposerMedicalDetails({ form }: ProposerDetailProps) {
	return (
		<div className="bg-white rounded-lg border-1 mb-6 mt-4">
			<div className="p-6">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					Proposer Medical Detail
				</h2>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<DateConverter
							form={form}
							name="ClientId"
							labelNep="DOB in BS"
							labelEng="DOB in AD"
						/>
						<br />
						<div className="space-y-2">
							<FormInput
								form={form}
								name="ClientId"
								type="text"
								placeholder="Enter Symbolic Reading 1"
								label="Symbolic Reading 1"
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Enter Symbolic Reading 2 "
								label="Symbolic Reading 2 "
								required={true}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Enter Symbolic Reading 3 "
								label="Symbolic Reading 3 "
								required={true}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Enter Diasolic Reading 1 "
								label="Diasolic Reading 1"
								required={true}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Enter Diasolic Reading 2 "
								label="Diasolic Reading 2"
								required={true}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Enter Diasolic Reading 3 "
								label="Diasolic Reading 3"
								required={true}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Enter Chest at inspiration"
								label="Chest at inspiration(in cm)"
								required={true}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Enter Chest at Expiration"
								label="Chest at Expiration(in cm)"
								required={true}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Enter Abdominal Girth"
								label="Abdominal Girth (in cm)"
								required={true}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Pulse Rate"
								label="Pulse Rate"
								required={true}
							/>
						</div>
						<FormSwitch
							form={form}
							label="Is pulse regular?"
							name="pulseswitch"
							required
						/>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="KYCNumber"
								type="text"
								placeholder="Medical Examinization feee"
								label="Medical Examization Fee"
								required={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
