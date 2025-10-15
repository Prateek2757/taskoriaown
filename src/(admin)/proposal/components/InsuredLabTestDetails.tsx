"use client";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import type { AddProposalDTO } from "../proposalSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsuredLabTestDetailsProps {
	form: UseFormReturn<AddProposalDTO>;
}
export default function InsuredLabTestDetails({
	form,
}: InsuredLabTestDetailsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle> Proposal Lab Test Detail</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.sugarTestReport"
								type="text"
								placeholder="Sugar test report"
								label="Sugar Test Report"
								required={true}
							/>
						</div>
						<DateConverter
							form={form}
							name="insuredMedical.sugarTestDate"
							labelNep="Sugar Test Date in BS"
							labelEng="Sugar Test Date in AD"
						/>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.xRayTestReport"
								type="text"
								placeholder="X-rat test report"
								label="X-ray Test Report"
								required={true}
							/>
						</div>
						<DateConverter
							form={form}
							name="insuredMedical.xRayTestDate"
							labelNep="X-ray Test Date in BS"
							labelEng="X-ray Test Date in AD"
						/>

						<div className="space-y-2">
							<FormInput
								form={form}
								name="insuredMedical.ecgReport"
								type="text"
								placeholder="ECG report"
								label="ECG Report"
								required={true}
							/>
						</div>
						<DateConverter
							form={form}
							name="insuredMedical.ecgDate"
							labelNep="ECG Date in BS"
							labelEng="ECG Date in AD"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
