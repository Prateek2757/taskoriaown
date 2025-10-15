"use client";
import { useCallback, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import type { AddProposalDTO } from "../proposalSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsuredDoctorDetailsProps {
	form: UseFormReturn<AddProposalDTO>;
}
export default function InsuredDoctorDetails({
	form,
}: InsuredDoctorDetailsProps) {
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
			console.log("Doecor List Response:", response);

			if (response && response.status === API_CONSTANTS.success) {
				setDoctorList(response.data || []);
			} else {
				alert(
					`Failed to get doctor: ${response?.data.message || "Unknown error"}`,
				);
			}
		} catch (error) {
			console.error("Error getting age", error);
			alert(`Error: ${error || "Failed to get doctor"}`);
		} finally {
		}
	}, []);

	const doctorName = form.watch("insuredMedical.doctorName") ?? "";
	useEffect(() => {
		if (!doctorName) return;

		const nmcNumber = doctorName.split(" | ")[0].trim();
		form.setValue("insuredMedical.doctorNMCNumber", nmcNumber);

		getDoctorList(doctorName);
	}, [doctorName, form, getDoctorList]);

	return (
		<Card>
			<CardHeader>
				<CardTitle> Proposal Doctor's Detail</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2 relative">
							{form.getValues("insuredMedical.doctorNMCNumber") && (
								<small className="absolute right-0 bg-blue-50 rounded-lg px-2 border-1 border-blue-100">
									NMC No. :
									<b> {form.getValues("insuredMedical.doctorNMCNumber")}</b>
								</small>
							)}

							<FormCombo
								name="insuredMedical.doctorName"
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
								name="insuredMedical.doctorRemarks"
								type="text"
								placeholder="Enter Doctor Remarks"
								label="Doctor Remarks"
								required={true}
							/>
							<FormInput
								form={form}
								name="insuredMedical.doctorNMCNumber"
								type="hidden"
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
