"use client";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo";
import FormInputFile from "@/components/formElements/FormInputFile";
import { Button } from "@/components/ui/button";
import type { AddProposalDTO } from "../proposalSchema";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface DocumentsProps {
	form: UseFormReturn<AddProposalDTO>;
	proposalRequiredFields: ProposalRequiredFields;
	data?: any;
	fileuploadervisible: boolean;
}

export default function Documents({
	form,
	proposalRequiredFields,
	data,
	fileuploadervisible,
}: DocumentsProps) {
	const [documents, setDocuments] = useState(() => {
		const formDocuments = form.getValues("documentList") || [];
		if (formDocuments.length === 0) {
			// If fileuploadervisible is true, add MDR document first
			if (fileuploadervisible) {
				return [
					{
						id: 1,
						documentFile: "",
						documentFileName: "",
						documentName: "MDR",
					},
					{
						id: 2,
						documentFile: "",
						documentFileName: "",
						documentName: "",
					},
				];
			} else {
				return [
					{
						id: 1,
						documentFile: "",
						documentFileName: "",
						documentName: "",
					},
				];
			}
		}
		return formDocuments.map((document, index) => ({
			...document,
			id: index + 1,
		}));
	});

	useEffect(() => {
		if (data?.documentList && Array.isArray(data.documentList)) {
			const mappedDocuments = data.documentList.map(
				(
					doc: {
						documentName: string;
						documentPath: string;
						documentUrl: string;
						documentFile: string;
						documentFileName: string;
					},
					index: number,
				) => ({
					id: index + 1,
					documentName: doc.documentName || "",
					documentPath: doc.documentPath || "",
					documentFile: doc.documentFile || "",
					documentUrl: doc.documentUrl || "",
					documentFileName: doc.documentFileName || "",
				}),
			);
			form.setValue("documentList", mappedDocuments);
			setDocuments(mappedDocuments);
		} else {
			// Initialize form with current documents state
			const initialDocuments = documents.map(({ id, ...doc }) => doc);
			form.setValue("documentList", initialDocuments);
		}
	}, [data, form]);

	// Update form when fileuploadervisible changes
	useEffect(() => {
		const currentDocuments = form.getValues("documentList") || [];

		if (fileuploadervisible) {
			// Add MDR document if it doesn't exist
			const hasMDR = currentDocuments.some((doc) => doc.documentName === "MDR");

			if (!hasMDR) {
				const mdrDocument = {
					documentFile: "",
					documentFileName: "",
					documentName: "MDR",
				};

				const updatedDocuments = [mdrDocument, ...currentDocuments];
				form.setValue("documentList", updatedDocuments);

				setDocuments((prev) => [
					{
						id: Math.max(...prev.map((n) => n.id), 0) + 1,
						...mdrDocument,
					},
					...prev,
				]);
			}
		} else {
			// Remove MDR document if it exists
			const mdrIndex = currentDocuments.findIndex(
				(doc) => doc.documentName === "MDR",
			);

			if (mdrIndex !== -1) {
				const updatedDocuments = currentDocuments.filter(
					(_, index) => index !== mdrIndex,
				);
				form.setValue("documentList", updatedDocuments);

				setDocuments((prev) =>
					prev.filter((doc) => doc.documentName !== "MDR"),
				);
			}
		}
	}, [fileuploadervisible, form]);

	const addDocument = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const currentDocuments = form.getValues("documentList") || [];

		const newDocument = {
			documentFile: "",
			documentFileName: "",
			documentName: "",
		};
		const updatedDocuments = [...currentDocuments, newDocument];

		form.setValue("documentList", updatedDocuments);
		setDocuments((prev) => [
			...prev,
			{
				id: Math.max(...prev.map((n) => n.id), 0) + 1,
				...newDocument,
			},
		]);
	};

	const removeDocument = (id: number) => {
		if (documents.length > 1) {
			// Find the actual index of the document with this id
			const documentIndex = documents.findIndex((doc) => doc.id === id);

			if (documentIndex !== -1) {
				// Remove from form data using the correct index
				const currentDocuments = form.getValues("documentList") || [];
				const updatedDocuments = currentDocuments.filter(
					(_, index) => index !== documentIndex,
				);

				form.setValue("documentList", updatedDocuments);

				// Remove from local state using id
				setDocuments((prev) => prev.filter((document) => document.id !== id));
			}
		}
	};

	const getAvailableDocumentTypes = (index: number, documentName: string) => {
		const currentDocuments = form.getValues("documentList") || [];
		const usedDocumentTypes = currentDocuments
			.filter((doc, i) => i !== index && doc.documentName)
			.map((doc) => String(doc.documentName));
		return (
			proposalRequiredFields?.identityDocumentTypeList?.filter(
				(option) =>
					!usedDocumentTypes.includes(String(option.value)) ||
					String(option.value) === String(documentName),
			) || []
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Documents</CardTitle>
				<CardAction>
					<Button
						type="button"
						onClick={addDocument}
						className="cursor-pointer"
					>
						<Plus />
						Add Document
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 ">
					<div className="grid grid-cols-3 gap-4">
						{documents.map((document, index) => {
							const documentTypes = form.watch(
								`documentList.${index}.documentName`,
							);
							const availableDocumentTypes = getAvailableDocumentTypes(
								index,
								document.documentName,
							);
							const isMDR = documentTypes === "MDR";

							return (
								<div
									key={`document-${document.id}`}
									className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-w-[300px] shadow-sm"
								>
									<div className="flex flex-col space-y-4">
										<div className="w-full">
											<FormCombo
												form={form}
												name={`documentList.${index}.documentName`}
												options={availableDocumentTypes}
												label="Document Type"
												required={true}
												disabled={isMDR}
											/>
										</div>

										<div>
											<FormInputFile
												name={`documentList.${index}.documentFile`}
												label="Photo"
												form={form}
												fileNameField={`documentList.${index}.documentFileName`}
												accept=".png,.jpg,.jpeg,.pdf"
												maxSize={5}
												validTypes={[
													"image/png",
													"image/jpeg",
													"application/pdf",
												]}
												{...(document?.documentUrl && {
													editMode: true,
													initialImageUrl: `${document.documentUrl}`,
													initialFileName: `${document.documentFileName}`,
												})}
												required={true}
											/>
										</div>

										<div className="w-full flex justify-end">
											{documents.length > 1 && !isMDR && (
												<Button
													type="button"
													onClick={() => removeDocument(document.id)}
													variant={"destructive"}
													className="w-auto"
												>
													<Trash />
													Remove
												</Button>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
