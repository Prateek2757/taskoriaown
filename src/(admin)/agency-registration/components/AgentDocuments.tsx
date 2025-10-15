import { UseFormReturn } from "react-hook-form";
import FormInputFile from "@/components/formElements/FormInputFile";
import { AddAgentInfoDTO } from "../schemas/agenctSchema";

type AgentDocumentsProps = {
	form: UseFormReturn<AddAgentInfoDTO>;
	data?: Partial<Record<keyof AddAgentInfoDTO, string>>;
};

export default function AgentDocuments({ form, data }: AgentDocumentsProps) {
	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">Agent Documents</h2>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
						name="letterFormOrganization"
						label="Letter Form Organization (Photo,sign of CEO)"
						fileNameField="letterFormOrganizationName"
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
						name="organizationOfficeRegisteredCertificate"
						label="Organization / Office Registered Certificate"
						fileNameField="OrganizationOfficeRegisteredCertificateName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						required
						{...(data?.character && {
							editMode: true,
							initialImageUrl: data.character,
							initialFileName: data.OrganizationOfficeRegisteredCertificateName,
						})}
					/>
					<FormInputFile
						form={form}
						name="character"
						label="Schedule-7 Letter, Self Delaration Letter"
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
						name="character"
						label="CEO Post And Appointment Letter"
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
						name="character"
						label="ApplicationForm"
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
						name="character"
						label="Citzenship"
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
						name="character"
						label="Tax Clearance Certificate"
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
						name="character"
						label="Article of Association"
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
						name="character"
						label="Recommendation Letter"
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
						name="character"
						label="No objection Letter"
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
						name="character"
						label="CompanyRegisterCertificate"
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
						name="character"
						label="Upliner Document"
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
						label="Other (Optional)"
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
