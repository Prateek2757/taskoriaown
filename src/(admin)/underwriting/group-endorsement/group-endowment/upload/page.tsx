"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormSelect from "@/components/formElements/FormSelect";
import FormInputFile from "@/components/formElements/FormInputFile";
import FormTextarea from "@/components/formElements/FormTextarea";
import {
	GroupEndowmentUploadSchema,
	GroupEndowmentUploadDTO,
} from "./schemas/groupEndowmentUploadSchema";
import Link from "next/link";

// Mock data for group options
const groupOptions: SelectOption[] = [
	{
		value: "group1",
		text: "Group 1",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "group2",
		text: "Group 2",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "group3",
		text: "Group 3",
		disabled: false,
		group: "",
		selected: false,
	},
];

const page = () => {
	const form = useForm<GroupEndowmentUploadDTO>({
		resolver: zodResolver(GroupEndowmentUploadSchema),
		defaultValues: {
			group: "",
			uploadFile: null,
			uploadFileName: "",
			remarks: "",
		},
	});

	const onSubmit = (data: GroupEndowmentUploadDTO) => {
		console.log("Submitted Data:", data);
	};

	return (
		<FormProvider {...form}>
			<div className="w-full p-6">
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Group Endowment Upload
					</h2>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Group Selection */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="mt-6">
								<FormSelect
									name="group"
									label="Group"
									form={form}
									options={groupOptions}
									caption="Select Group"
									required
								/>
							</div>

							{/* File Upload Section */}
							<div className="mb-6">
								<div className="mb-2">
									<label className="flex items-center text-gray-700 text-sm font-medium">
										Upload File
										<span className="text-red-500 ml-1">*</span>
									</label>
									<div className="mt-1">
										<Link
											href="#"
											className="text-yellow-600 hover:text-yellow-700 text-sm underline"
										>
											(Download Sample File)
										</Link>
									</div>
								</div>
								<FormInputFile
									name="uploadFile"
									label=""
									form={form as any}
									accept=".xlsx,.xls,.csv"
									maxSize={10}
									fileNameField="uploadFileName"
									validTypes={[
										"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
										"application/vnd.ms-excel",
										"text/csv",
									]}
									required
								/>
							</div>

							{/* Remarks Section */}
							<div className="mt-6">
								<FormTextarea
									name="remarks"
									label="Remarks"
									form={form}
									placeholder="Enter Narration"
									required
								/>
							</div>
						</div>
						{/* Submit Button */}
						<div className="flex justify-start">
							<Button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
							>
								Submit
							</Button>
						</div>
					</form>
				</div>
			</div>
		</FormProvider>
	);
};

export default page;
