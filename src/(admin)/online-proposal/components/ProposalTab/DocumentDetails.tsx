import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import type {
	AddEditOnlineProposalDTO,
	AddEditOnlineProposalWithFileDTO,
} from "@/app/(admin)/online-proposal/onlineProposalSchema";
import FormCheckbox from "../../../../../components/formElements/FormCheckbox";
import FormInputFile from "../../../../../components/formElements/FormInputFile";

type DocumentDetailsProps = {
	form: UseFormReturn<AddEditOnlineProposalDTO>;
	data?: AddEditOnlineProposalWithFileDTO;
	locale?: "en" | "ne"; // Optional locale prop, if needed
};

export default function DocumentDetails({
	form,
	data,
	locale,
}: DocumentDetailsProps) {
	console.log("this is form", data);
	const checkHealth = (checked: boolean) => {
		if (checked) {
			console.log("true");
		} else {
			console.log("false");
		}
	};

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				{locale === "ne" ? "कागजातहरू" : "Documents"}
			</h2>
			<div className=" border-blue-200 rounded-lg pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<FormInputFile
						locale={locale}
						name="insuredImageInBase64"
						label={locale === "ne" ? "बीमितको फोटो" : "Insured Image"}
						form={form}
						fileNameField="insuredImageName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={[
							"image/png",
							"image/jpg",
							"image/jpeg",
							"application/pdf",
						]}
						{...(data?.insuredImageUrl && {
							editMode: true,
							initialImageUrl: `${data.insuredImageUrl}`,
							initialFileName: `${data.insuredImageName}`,
						})}
						required={true}
					/>

					<FormInputFile
						locale={locale}
						name="citizenshipFrontInBase64"
						label={`${locale === "ne" ? "नागरिकता अगाडि" : "Citizenship Front"}`}
						form={form}
						fileNameField="citizenshipFrontName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={[
							"image/png",
							"image/jpg",
							"image/jpeg",
							"application/pdf",
						]}
						{...(data?.citizenshipFrontUrl && {
							editMode: true,
							initialImageUrl: `${data.citizenshipFrontUrl}`,
							initialFileName: `${data.citizenshipFrontName}`,
						})}
						required={true}
					/>

					<FormInputFile
						locale={locale}
						name="citizenshipBackInBase64"
						label={`${locale == "ne" ? "नागरिकता पछाडि" : "Citizenship Back"}`}
						form={form}
						fileNameField="citizenshipBackName"
						accept=".png,.jpg,.jpeg,.pdf"
						maxSize={5}
						validTypes={[
							"image/png",
							"image/jpg",
							"image/jpeg",
							"application/pdf",
						]}
						{...(data?.citizenshipBackUrl && {
							editMode: true,
							initialImageUrl: `${data.citizenshipBackUrl}`,
							initialFileName: `${data.citizenshipBackName}`,
						})}
						required={true}
					/>
				</div>
			</div>
			<div className="p-6 mt-3 border border-dashed border-blue-200 rounded-lg">
				{/* {data && ( */}

				<div className="flex items-start space-x-2">
					<FormCheckbox
						form={form}
						name="declaration"
						onCheckedChange={checkHealth}
						label={
							locale === "ne"
								? "म नीति जारी गर्नका लागि प्रदान गरिएका सबै जानकारी, तस्बिरहरू र कागजातहरू सही, पूर्ण र सान्दर्भिक छन् भनी घोषणा गर्दछु, र तिनीहरूले सम्झौताको आधार बनाउँछन् भनी म बुझ्छु।"
								: "I hereby declare that all the information, photos, and documents provided for the issuance of the policy are accurate, complete, and relevant, and I understand that they form the basis of the contract."
						}
					/>
				</div>
				<div className="flex items-start space-x-2 mt-3">
					<FormCheckbox
						form={form}
						name="agreeTerms"
						onCheckedChange={checkHealth}
						label={
							locale === "ne"
								? "म जीवन बीमा सम्झौतासँग सम्बन्धित सबै "
								: "I accept all the"
						}
					/>
					<Link href="#" target="_blank" className="text-sm text-blue-800">
						{locale === "ne"
							? "नियम र शर्तहरू स्वीकार गर्दछु।"
							: "Terms and Conditions"}
					</Link>
				</div>
				<h2 className="text-sm font-bold text-gray-800 mb-2 mt-4">
					{locale == "ne" ? "स्वास्थ्य घोषणा" : "Health Declaration"}
				</h2>

				<div className="flex items-start space-x-2 mt-3">
					<FormCheckbox
						form={form}
						name="healthDeclaration"
						onCheckedChange={checkHealth}
						label={
							locale === "ne"
								? "म कुनै शारीरिक दोष वा असक्षमता बिना राम्रो स्वास्थ्यमा छु भनी पुष्टि गर्छु। म मेरो दैनिक गतिविधिहरू स्वतन्त्र रूपमा ह्यान्डल गर्छु र कुनै पनि रोगको लागि कुनै पनि चिकित्सा उपचार वा अस्पतालमा भर्ना भएको कुनै इतिहास, हालको पीडा वा अपेक्षा छैन। यसबाहेक, मेरो जीवनमा जीवन, दुर्घटना, स्वास्थ्य, वा गम्भीर रोग बीमाको लागि कुनै आवेदन अस्वीकार, ढिलाइ, वा गैर-मानक सर्तहरू अन्तर्गत स्वीकार गरिएको छैन।"
								: "I affirm that I am in good health with no physical defects or disabilities. I handle my daily activities independently and have no history of, current suffering from, or expectation of receiving any medical treatment or hospitalization for any ailment.Furthermore, no application for life, accident, health, or critical illness insurance on my life has ever been rejected, delayed, or accepted under non-standard terms."
						}
					/>
				</div>

				{/* )} */}
			</div>
		</>
	);
}
