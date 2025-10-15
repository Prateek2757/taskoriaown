'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import type { AddEditKycWithFileDTO } from "../../app/(admin)/kyc/schemas/kycSchema";

type ImagePreviewProps = {
	label: string;
	displayData: (field: keyof AddEditKycWithFileDTO) => string;
	imageUrl: keyof AddEditKycWithFileDTO;
};

function ImagePreview({ label, displayData, imageUrl }: ImagePreviewProps) {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [isPdf, setIsPdf] = useState<boolean | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const imgSrc = displayData(imageUrl);

	useEffect(() => {
		const checkFileType = async () => {
			if (!imgSrc || imgSrc === "N/A") {
				setIsPdf(false);
				return;
			}

			try {
				const response = await fetch(imgSrc);
				const blob = await response.blob();

				const filename = imgSrc.split("/").pop()?.split("?")[0] || "file";
				const fileExt = blob.type.split("/").pop();
				const fileObj = new File([blob], `${filename}.${fileExt}`, {
					type: blob.type,
				});

				setFile(fileObj);
				setIsPdf(blob.type === "application/pdf");
			} catch (err) {
				console.error("Error fetching file:", err);
				setIsPdf(false);
			}
		};

		checkFileType();
	}, [imgSrc]);

	const PreviewImage = () => {
		if (isPdf) {
			return (
				<iframe
					src={imgSrc}
					className="w-full h-100 rounded-lg"
					title="PDF Preview"
				/>
			);
		}
		return (
			<img
				alt={imgSrc !== "N/A" ? "Document" : "No Document Uploaded"}
				className="border border-stone-200 rounded-lg p-2"
				src={imgSrc}
			/>
		);
	};

	return (
		<>
			<div className="flex items-center text-gray-700 text-sm">{label}</div>
			<PreviewImage />
			<Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
				<DialogTrigger asChild>
					{imgSrc !== "N/A" && (
						<Button
							variant="outline"
							size="sm"
							className="h-7 px-2 text-xs"
							type="button"
						>
							Preview
						</Button>
					)}
				</DialogTrigger>
				<DialogContent className="min-w-[90vw] max-h-[90vh] overflow-auto">
					<div className="flex justify-center items-center">
						<PreviewImage />
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default ImagePreview;
