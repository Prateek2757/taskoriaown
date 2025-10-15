"use client";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import type { AddProposalDTO } from "../../../policy/policySchema";
import { useCallback, useEffect, useState } from "react";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import FormCombo from "@/components/formElements/FormCombo";

interface ProposerConstultantDoctorDetailsProps {
	form: UseFormReturn<AddProposalDTO>;
}
export default function ProposerConstultantDoctorDetails({
	form,
}: ProposerConstultantDoctorDetailsProps) {
	const [doctorList, setDoctorList] = useState<SelectOption[]>([]);

	const getDoctorList = useCallback(async (value: string) => {
		try {
			const submitData: PostCallData & {
				flag: string;
				search: string;
			} = {
				flag: "DoctorAutoComplete",
				search: value,
				endpoint: "get_utility_dropdown",
			};

			const response = await apiPostCall(submitData);
			console.log("Agent List Response:", response);

			if (response && response.status === API_CONSTANTS.success) {
				setDoctorList(response.data || []);
			} else {
				alert(
					`Failed to convert Date: ${response?.data.message || "Unknown error"}`,
				);
			}
		} catch (error) {
			console.error("Error getting age", error);
			alert(`Error: ${error || "Failed to convert Date"}`);
		} finally {
		}
	}, []);

	const doctorName = form.watch("insuredMedical.consultantDoctorName") ?? "";

	useEffect(() => {
		if (!doctorName) return;

		const nmcNumber = doctorName.split(" | ")[0].trim();
		form.setValue("insuredMedical.consultantNMCNumber", nmcNumber);

		getDoctorList(doctorName);
	}, [doctorName, form, getDoctorList]);
	return (
		<div className="bg-white rounded-lg border-1 mb-6 mt-4">
			<div className="p-6">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					Proposer Consultant Doctor's Detail
				</h2>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2 relative">
							{form.getValues("insuredMedical.consultantNMCNumber") && (
								<small className="absolute right-0 bg-blue-50 rounded-lg px-2 border-1 border-blue-100">
									NMC No. :
									<b> {form.getValues("insuredMedical.consultantNMCNumber")}</b>
								</small>
							)}

							<FormCombo
								name="insuredMedical.consultantDoctorName"
								options={doctorList}
								label="Doctor Name"
								form={form}
								required={true}
								onSearch={getDoctorList}
							/>
						</div>
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.consultantRemarks"
								type="text"
								placeholder="Enter Consultant Doctor Remarks"
								label="Consultant Doctor Remarks"
								required={true}
							/>
						</div>
						<FormInput
							form={form}
							name="insuredMedical.consultantNMCNumber"
							type="hidden"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
