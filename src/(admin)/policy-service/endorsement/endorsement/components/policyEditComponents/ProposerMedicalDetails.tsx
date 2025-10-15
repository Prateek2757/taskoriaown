"use client";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import type { AddProposalDTO } from "../proposalSchema";
import { useOnlyNumbers } from "@/hooks/useInputValidation";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
}

export default function ProposerMedicalDetails({ form }: ProposalDetailProps) {
	const onlyNumberHandler = useOnlyNumbers();
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
							name="insuredMedical.medicalTestDate"
							labelNep="Medical Test Date in BS"
							labelEng="Medical Test Date in AD"
						/>
						<br />
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.systolicReading1"
								type="text"
								placeholder="Enter Symbolic Reading 1"
								label="Systolic Reading 1"
								onKeyDown={onlyNumberHandler}
								required={true}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.systolicReading2"
								type="text"
								placeholder="Enter Symbolic Reading 2 "
								label="Systolic Reading 2 "
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.systolicReading3"
								type="text"
								placeholder="Enter Symbolic Reading 3 "
								label="Systolic Reading 3 "
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.diastolicReading1"
								type="text"
								placeholder="Enter Diasolic Reading 1 "
								label="Diastolic Reading 1"
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.diastolicReading2"
								type="text"
								placeholder="Enter Diasolic Reading 2 "
								label="Diastolic Reading 2"
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.diastolicReading3"
								type="text"
								placeholder="Enter Diasolic Reading 3 "
								label="Diastolic Reading 3"
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.chestAtInspiration"
								type="text"
								placeholder="Enter Chest at inspiration"
								label="Chest at inspiration(in cm)"
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.chestAtExpiration"
								type="text"
								placeholder="Enter Chest at Expiration"
								label="Chest at Expiration(in cm)"
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.abdominalGirth"
								type="text"
								placeholder="Enter Abdominal Girth"
								label="Abdominal Girth (in cm)"
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.pulseRate"
								type="text"
								placeholder="Pulse Rate"
								label="Pulse Rate"
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>
						<FormSwitch
							form={form}
							label="Is pulse regular?"
							name="insuredMedical.isPulseRegular"
						/>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.medicalFee"
								type="text"
								placeholder="Medical Examinization feee"
								label="Medical Examization Fee"
								required={true}
								onKeyDown={onlyNumberHandler}
							/>
						</div>
						<FormInput
							form={form}
							name="insuredMedical.isMedicalRequired"
							type="hidden"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
