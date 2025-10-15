import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormInput from "@/components/formElements/FormInput";
import type { UseFormReturn } from "react-hook-form";
import { useOnlyNumbers } from "@/hooks/useInputValidation";
import { AddEditAgentTrainingDTO } from "../schemas/agentTrainingSchema";

type ExaminationInformationProps = {
	form: UseFormReturn<AddEditAgentTrainingDTO>;
};

export default function ExaminationInformation({
	form,
}: ExaminationInformationProps) {
	return (
		<>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					Examination Information
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<DateConverter
						form={form}
						name="examDate"
						labelNep="Exam Date BS"
						labelEng="Exam Date AD"
					/>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="examMarks"
							type="text"
							placeholder="Enter Exam Marks"
							label="Exam Marks"
							onKeyDown={useOnlyNumbers()}
							required={true}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
