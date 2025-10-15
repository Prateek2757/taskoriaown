"use client";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { type RiskDTO, emptyRisk, RiskSchema } from "../RiskSchema";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/formElements/FormInput";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormSelect from "@/components/formElements/FormSelect";
import FormCombo from "@/components/formElements/FormCombo";
import FormInputFile from "@/components/formElements/FormInputFile";
import FormInputDate from "@/components/formElements/FormInputDate";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormTextarea from "@/components/formElements/FormTextarea";

interface riskRequiredFields {
	department: SelectOption[];
	riskType: SelectOption[];
	policyNo: SelectOption[];
	policyRiskEvent: SelectOption[];
	otherRiskEvent: SelectOption[];
}

type Props = {
	data?: RiskDTO;
	riskRequiredFields?: riskRequiredFields;
};

export const RiskForm = ({ data, riskRequiredFields }: Props) => {
	const form = useForm<RiskDTO>({
		defaultValues: data ?? emptyRisk,
		resolver: zodResolver(RiskSchema),
	});

	useEffect(() => {
		if (data) {
			form.reset(data);
		}
	}, [data, form]);

	const isEditMode = !!data;
	const isViewMode = !!data;

	return (
		<>
			<Form {...form}>
				<form>
					<div className="bg-white rounded-lg border-1 mb-6 mt-4">
						<div className="p-6">
							<h2 className="text-xl font-bold text-gray-800 mb-6">
								Risk Event
							</h2>
							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									<div className="space-y-2">
										<FormSelect
											options={riskRequiredFields?.department}
											form={form}
											name="department"
											label="Department"
											caption="Select Department"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormSelect
											options={riskRequiredFields?.riskType}
											form={form}
											name="riskType"
											label="Risk Type"
											caption="Select Risk Type"
											required={true}
										/>
									</div>

									<div className="space-y-2">
										<FormCombo
											options={riskRequiredFields?.policyNo}
											form={form}
											name="policyNo"
											label="Policy No"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormSelect
											options={riskRequiredFields?.policyRiskEvent}
											form={form}
											name="policyRiskEvent"
											label="Policy Risk Event"
											required={true}
										/>
									</div>
									<div className="space-y-2">
										<FormSelect
											options={riskRequiredFields?.otherRiskEvent}
											form={form}
											name="otherRiskEvent"
											label="Other Risk Event"
											required={true}
										/>
									</div>

									<DateConverter
										form={form}
										name="eventDate"
										labelNep="Event Date (BS)"
										labelEng="Event Date (AD)"
									/>
									<div className=" col-span-2">
										<h2 className="text-lg fo   nt-semibold">
											Details of Event
										</h2>
										<FormTextarea
											form={form}
											name="details"
											placeholder="Enter Description"
											label=""
										/>
									</div>
								</div>
								<div className="w-1/3 h-1/3 mb-6">
									<FormInputFile
										name="riskFile"
										label="Document"
										form={form}
										fileNameField="Document"
										accept=".png,.jpg,.jpeg,.pdf"
										maxSize={5}
										validTypes={["image/png", "image/jpeg", "application/pdf"]}
										{...(data?.riskDocument && {
											editMode: true,
											initialImageUrl: `${data.riskDocument[0]?.riskFile}`,
											initialFileName: `${data.riskDocument[0]?.riskFileName}`,
										})}
										required={true}
									/>
								</div>
							</div>
						</div>
					</div>

					<Button
						type="submit"
						className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
					>
						{data?.riderId ? "Update Risk" : "Add Risk"}
					</Button>
				</form>
			</Form>
		</>
	);
};
