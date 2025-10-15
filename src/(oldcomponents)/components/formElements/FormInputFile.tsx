"use client";
import { useEffect, useRef, useState } from "react";
import type { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type FileFormData = {
	[key: string]: string;
};

type UploadedFileData = {
	file?: File;
	url: string;
	name: string;
	size: string;
	base64?: string;
	isExisting?: boolean;
	type?: string;
};

type FormInputFileProps<T extends FieldValues> = {
	name: Path<T>;
	label?: string;
	form: UseFormReturn<T>;
	accept?: string;
	maxSize?: number;
	validTypes?: string[];
	fileNameField: Path<T>;
	editMode?: boolean;
	initialImageUrl?: string;
	initialFileName?: string;
	required?: boolean;
	locale?: "en" | "ne";
};

function FormInputFile<T extends FieldValues>({
	name,
	label,
	form,
	accept = ".png,.jpg,.jpeg,.pdf",
	maxSize = 5,
	validTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
	fileNameField,
	editMode = false,
	initialImageUrl,
	initialFileName,
	required = false,
	locale = "en", // Default to English if not provided
}: FormInputFileProps<T>) {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [isRemoved, setIsRemoved] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<UploadedFileData | null>(
		null,
	);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const fieldValue = form.watch ? form.watch(name) : form.getValues(name);

	const isPDF = (file: UploadedFileData | null): boolean => {
		if (!file) return false;
		return (
			file.type === "application/pdf" ||
			file.name.toLowerCase().endsWith(".pdf")
		);
	};

	const getFileType = (file: File | string): string => {
		if (typeof file === "string") {
			if (file.toLowerCase().includes(".pdf")) {
				return "application/pdf";
			}
			return "image/jpeg";
		}
		return file.type;
	};

	useEffect(() => {
		if (isRemoved) return;
		const currentBase64 = form.getValues(name);
		const currentFileName = fileNameField ? form.getValues(fileNameField as Path<T>) : "";

		if (currentBase64 && !uploadedFile && currentFileName) {
			const fileData = {
				url: `data:image/jpeg;base64,${currentBase64}`,
				name: currentFileName,
				size: "N/A",
				base64: currentBase64,
				isExisting: false,
				type: (typeof currentFileName === "string" ? currentFileName : "")
					.toLowerCase()
					.endsWith(".pdf")
					? "application/pdf"
					: "image/jpeg",
			};

			if (fileData.type === "application/pdf") {
				fileData.url = `data:application/pdf;base64,${currentBase64}`;
			}

			setUploadedFile(fileData);
			return;
		}

		if (editMode && initialImageUrl && !fieldValue) {
			const file = fetch(initialImageUrl)
				.then((res) => res.blob())
				.then((res) => {
					const reader = new FileReader();
					reader.onload = function () {
						const initFile = initialFileName || "Existing File";
						if (!this.result) {
							return;
						}
						const base64String = this.result.toString().split(",")[1];

						const fileData = {
							url: this.result as string,
							name: initFile,
							size: (res.size / 1024 / 1024).toFixed(2),
							base64: base64String,
							isExisting: true,
							type: getFileType(initFile),
						};

						setUploadedFile(fileData);

						setIsRemoved(false);

						if (fileNameField) {
							form.setValue(name, base64String as PathValue<T, typeof name>);
							form.setValue(fileNameField, initFile as PathValue<T, typeof fileNameField>);
						}
					};
					reader.readAsDataURL(res);
				});
		}
	}, [
		editMode,
		initialImageUrl,
		initialFileName,
		fieldValue,
		fileNameField,
		form,
		isRemoved,
		name,
		uploadedFile,
	]);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (
		e: React.DragEvent,
		onChange: (value: string) => void,
	) => {
		e.preventDefault();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			processFile(files[0], onChange);
		}
	};

	const handleBrowseClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
		if (e && (e as React.KeyboardEvent).key === "Enter") {
			return;
		}
		fileInputRef.current?.click();
	};

	const processFile = (file: File, onChange: (value: string) => void) => {
		const maxSizeBytes = maxSize * 1024 * 1024;

		if (!validTypes.includes(file.type)) {
			console.log(validTypes);
			console.log(file.type);
			alert(`Please upload ${validTypes.join(", ")} files only.`);
			return;
		}

		if (file.size > maxSizeBytes) {
			alert(`File size must be less than ${maxSize}MB.`);
			return;
		}

		const fileURL = URL.createObjectURL(file);

		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result as string;
			if (!result) return;

			const base64String = result.split(",")[1];

			const fileData = {
				file: file,
				url: fileURL,
				name: file.name,
				size: (file.size / 1024 / 1024).toFixed(2),
				base64: base64String,
				isExisting: false,
				type: file.type,
			};

			setUploadedFile(fileData);

			setIsRemoved(false);

			onChange(base64String);

			if (fileNameField) {
				form.setValue(fileNameField, file.name as PathValue<T, typeof fileNameField>);
			}
		};

		reader.readAsDataURL(file);
	};

	const removeFile = (onChange: (value: string) => void) => {
		setUploadedFile(null);
		setIsRemoved(true);

		if (uploadedFile?.url) {
			URL.revokeObjectURL(uploadedFile.url);
		}

		onChange("");

		if (fileNameField) {
			form.setValue(fileNameField, "" as PathValue<T, typeof fileNameField>);
		}
		form.setValue(name, "" as PathValue<T, typeof name>);
		form.setValue(fileNameField, "" as PathValue<T, typeof fileNameField>);
	};

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: string) => void,
	) => {
		if (e.target.files && e.target.files.length > 0) {
			processFile(e.target.files[0], onChange);
		}
	};

	const getDisplayUrl = (): string | undefined => {
		if (!uploadedFile) return undefined;

		if (uploadedFile.isExisting) {
			return uploadedFile.url;
		}

		if (uploadedFile.base64) {
			if (isPDF(uploadedFile)) {
				return `data:application/pdf;base64,${uploadedFile.base64}`;
			}
			return `data:image/jpeg;base64,${uploadedFile.base64}`;
		}

		return uploadedFile.url;
	};

	const PDFThumbnail = () => (
		<div className="h-full w-full flex flex-col items-center justify-center bg-red-50 border-2 border-red-200 rounded">
			<svg
				className="w-12 h-12 text-red-600 mb-2"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>{locale == "ne" ? "पूर्वावलोकन" : "Preview"}</title>
				<path
					fillRule="evenodd"
					d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
					clipRule="evenodd"
				/>
			</svg>
			<span className="text-xs text-red-600 font-medium">PDF</span>
		</div>
	);

	const PreviewContent = () => {
		const [imgError, setImgError] = useState(false);
		if (!uploadedFile) return null;

		if (isPDF(uploadedFile)) {
			return (
				<div className="w-full h-[80vh]">
					<iframe
						src={getDisplayUrl()}
						className="w-full h-full rounded-lg"
						title="PDF Preview"
					/>
				</div>
			);
		}

		return (
			<div className="flex justify-center items-center">
				{!imgError ? (
					<img
						src={getDisplayUrl()}
						alt="File Preview"
						className="max-w-full max-h-[70vh] object-contain rounded-lg"
						onError={() => {
							setImgError(true);
						}}
					/>
				) : null}
			</div>
		);
	};

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && (
						<FormLabel className="flex items-center text-gray-700 dark:text-white text-sm">
							{label}
							{required && <span className="text-red-500">*</span>}
						</FormLabel>
					)}
					<FormControl>
						<div className="w-full">
							{!uploadedFile ? (
								// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
								<div
									className={`border-2 border-dashed rounded-lg p-6 text-center ${
										isDragging
											? "border-blue-500 bg-blue-50"
											: "border-gray-300"
									}`}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={(e) => handleDrop(e, field.onChange)}
								>
									<Button
										type="button"
										tabIndex={0}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											handleBrowseClick(e);
										}}
										onKeyDown={(e) => {
											if (
												e.key === "Enter" ||
												e.key === " " ||
												e.keyCode === 13
											) {
												e.preventDefault();
												e.stopPropagation();
											}
										}}
										variant={"ghost"}
										className="w-full cursor-pointer flex-wrap whitespace-normal h-32 hover:bg-transparent"
									>
										<div className="flex items-center gap-3">
											<div className="flex justify-center">
												<div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
													<svg
														className="w-6 h-6 text-gray-600"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<title>{locale == "ne" ? "शीर्षक" : "Title"}</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
														/>
													</svg>
												</div>
											</div>
											<div className="text-left">
												<p className=" text-sm text-gray-700 mb-1">
													{locale === "ne"
														? "फाइल छान्नुहोस् वा ड्र्याग र ड्रप गर्नुहोस्"
														: "Select a file or drag and drop here"}
												</p>
												<p className="text-xs text-gray-500">
													{validTypes
														.map((type) => type.split("/")[1].toUpperCase())
														.join(", ")}{" "}
													up to {maxSize}MB
												</p>
											</div>
										</div>
									</Button>

									<Input
										type="file"
										className="hidden"
										ref={fileInputRef}
										onChange={(e) => handleFileChange(e, field.onChange)}
										accept={accept}
									/>
								</div>
							) : (
								<div className="border rounded-lg p-4 bg-white">
									<div className="flex justify-between items-center mb-3">
										<h3 className="text-sm font-medium text-gray-700">
											{locale === "ne" ? "अपलोड गरिएको फाइल" : "Uploaded File"}
										</h3>
										<Dialog
											open={isPreviewOpen}
											onOpenChange={setIsPreviewOpen}
										>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													className="h-7 px-2 text-xs"
													type="button"
												>
													{locale === "ne" ? "पूर्वावलोकन" : "Preview"}
												</Button>
											</DialogTrigger>
											<DialogContent className="min-w-[90vw] max-h-[90vh] overflow-auto">
												<PreviewContent />
											</DialogContent>
										</Dialog>
										<button
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												removeFile(field.onChange);
											}}
											className="text-red-500 hover:text-red-700 text-sm focus:outline-none"
											type="button"
										>
											{locale === "ne" ? "हटाउनुहोस्" : "Remove"}
										</button>
									</div>

									<div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 mb-3">
										{isPDF(uploadedFile) ? (
											<PDFThumbnail />
										) : (
											<img
												src={getDisplayUrl()}
												alt="Preview"
												className="h-full w-full object-contain"
												onError={(e) => {
													console.error("Image failed to load:", e);
												}}
											/>
										)}
									</div>

									<div className="flex justify-between text-xs text-gray-500">
										<span>{uploadedFile.name}</span>
										<span>{uploadedFile.size} MB</span>
									</div>
								</div>
							)}
						</div>
					</FormControl>
					<FormMessage className="text-xs" />
				</FormItem>
			)}
		/>
	);
}

export default FormInputFile;
