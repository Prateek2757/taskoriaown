import { UseFormReturn } from "react-hook-form";
import FormInputFile from "@/components/formElements/FormInputFile";
import { AddAgentTrainingDTO } from "../schemas/agentTrainingSchema";

type AgentTrainingDocumentsProps = {
	form: UseFormReturn<AddAgentTrainingDTO>;
	data?: Partial<Record<keyof AddAgentTrainingDTO, string>>;
};

export default function AgentTraningDocuments({
	form,
	data,
}: AgentTrainingDocumentsProps) {
	return (
		<>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					Agent Documents
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<FormInputFile
						form={form}
						name="examCertificate"
						label="Exam Certificate"
						fileNameField="examCertificateName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.equivalent && {
							editMode: true,
							initialImageUrl: data.equivalent,
							initialFileName: data.equivalentName,
						})}
					/>
					<FormInputFile
						form={form}
						name="equivalent"
						label="Equivalent"
						fileNameField="equivalentName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.equivalent && {
							editMode: true,
							initialImageUrl: data.equivalent,
							initialFileName: data.equivalentName,
						})}
					/>

					<FormInputFile
						form={form}
						name="panCard"
						label="Pan Card"
						fileNameField="panCardName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.panCard && {
							editMode: true,
							initialImageUrl: data.panCard,
							initialFileName: data.panCardName,
						})}
					/>

					<FormInputFile
						form={form}
						name="trainingCertificate"
						label="Training Certificate"
						fileNameField="trainingCertificateName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.trainingCertificate && {
							editMode: true,
							initialImageUrl: data.trainingCertificate,
							initialFileName: data.trainingCertificateName,
						})}
					/>

					<FormInputFile
						form={form}
						name="marksheet"
						label="Marksheet"
						fileNameField="marksheetName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.marksheet && {
							editMode: true,
							initialImageUrl: data.marksheet,
							initialFileName: data.marksheetName,
						})}
					/>

					<FormInputFile
						form={form}
						name="character"
						label="Character"
						fileNameField="characterName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.character && {
							editMode: true,
							initialImageUrl: data.character,
							initialFileName: data.characterName,
						})}
					/>
					<FormInputFile
						form={form}
						name="upLinerDocument"
						label="UpLinerDocument"
						fileNameField="UpLinerDocumentName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.character && {
							editMode: true,
							initialImageUrl: data.character,
							initialFileName: data.letterFormOrganizationName,
						})}
					/>

					<FormInputFile
						form={form}
						name="applicationForm"
						label="ApplicationForm"
						fileNameField="ApplicationFormName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.character && {
							editMode: true,
							initialImageUrl: data.character,
							initialFileName: data.characterName,
						})}
					/>

					<FormInputFile
						form={form}
						name="character"
						label="BankVouncher"
						fileNameField="characterName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.character && {
							editMode: true,
							initialImageUrl: data.character,
							initialFileName: data.characterName,
						})}
					/>

					<FormInputFile
						form={form}
						name="other"
						label="Other"
						fileNameField="otherName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required={false}
						{...(data?.other && {
							editMode: true,
							initialImageUrl: data.other,
							initialFileName: data.otherName,
						})}
					/>
				</div>
			</div>
		</>
	);
}
