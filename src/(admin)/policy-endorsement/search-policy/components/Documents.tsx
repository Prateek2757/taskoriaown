import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormSelect from "@/components/formElements/FormSelect";
import FormInputFile from "@/components/formElements/FormInputFile";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type SelectOption = { text: string; value: string };

interface EndorsementFormProps {
	form: UseFormReturn<any>;
}

export default function SearchDocuments({ form }: EndorsementFormProps) {
	const [documents, setDocuments] = useState<
		{ id: number; documentUrl?: string; documentFileName?: string }[]
	>([{ id: Date.now() }]);

	const availableDocumentTypes: SelectOption[] = [
		{ text: "ID Proof", value: "id" },
		{ text: "Address Proof", value: "address" },
		{ text: "Other", value: "other" },
	];

	// 🔹 Remove a document row
	const removeDocument = (id: number) => {
		setDocuments((prev) => prev.filter((doc) => doc.id !== id));
	};

	return (
		<div className="p-6">
			<h2 className="text-xl font-bold text-gray-800 mb-6">Documents</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				{documents.map((document, index) => (
					<div
						key={document.id}
						className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
					>
						<div className="y-2">
							<FormInputFile
								name={`documentList.${index}.documentFile`}
								label="Upload Document"
								form={form}
								fileNameField={`documentList.${index}.documentFileName`}
								accept=".png,.jpg,.jpeg,.pdf"
								maxSize={4}
								validTypes={["image/png", "image/jpeg", "application/pdf"]}
								{...(document?.documentUrl && {
									editMode: true,
									initialImageUrl: document.documentUrl,
									initialFileName: document.documentFileName,
								})}
								required
							/>
						</div>

						<div className="w-full">
							{documents.length > 1 && (
								<Button
									type="button"
									onClick={() => removeDocument(document.id)}
									variant="destructive"
									className="w-auto"
								>
									<Trash className="mr-2" />
									Remove
								</Button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
