import type { UseFormReturn } from "react-hook-form";
import type {
	AddEditKycDTO,
	AddEditKycWithFileDTO,
} from "@/app/(admin)/kyc/schemas/kycSchema";
import FormInputFile from "../../../../../components/formElements/FormInputFile";

type DocumentDetailsProps = {
	form: UseFormReturn<AddEditKycDTO>;
	data?: AddEditKycWithFileDTO;
};

export default function DocumentDetails({ form, data }: DocumentDetailsProps) {
	console.log("this is form", data);

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">Documents</h2>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<FormInputFile
						name="photoFile"
						label="Photo"
						form={form}
						fileNameField="photoFileName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						{...(data?.photoFileUrl && {
							editMode: true,
							initialImageUrl: `${data.photoFileUrl}`,
							initialFileName: `${data.photoFileName}`,
						})}
						required={true}
					/>

					<FormInputFile
						name="citizenshipFrontFile"
						label="Citizenship Front"
						form={form}
						fileNameField="citizenshipFrontFileName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						{...(data?.citizenshipFrontFileUrl && {
							editMode: true,
							initialImageUrl: `${data.citizenshipFrontFileUrl}`,
							initialFileName: `${data.citizenshipFrontFileName}`,
						})}
						required={true}
					/>

					<FormInputFile
						name="citizenshipBackFile"
						label="Citizenship Back"
						form={form}
						fileNameField="citizenshipBackFileName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						{...(data?.citizenshipBackFileUrl && {
							editMode: true,
							initialImageUrl: `${data.citizenshipBackFileUrl}`,
							initialFileName: `${data.citizenshipBackFileName}`,
						})}
						required={true}
					/>
					<FormInputFile
						name="passportFile"
						label="Passport"
						form={form}
						fileNameField="passportFileName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						{...(data?.passportFileUrl && {
							editMode: true,
							initialImageUrl: `${data.passportFileUrl}`,
							initialFileName: `${data.passportFileName}`,
						})}
					/>

					<FormInputFile
						name="providentFundFile"
						label="Provident Fund"
						form={form}
						fileNameField="providentFundFileName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={["image/png", "image/jpeg", "application/pdf"]}
						{...(data?.providentFundFileUrl && {
							editMode: true,
							initialImageUrl: `${data.providentFundFileUrl}`,
							initialFileName: `${data.providentFundFileName}`,
						})}
					/>
				</div>
			</div>
		</>
	);
}
