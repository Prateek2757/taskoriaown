"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import FormTextarea from "@/components/formElements/FormTextarea";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormInputFile from "@/components/formElements/FormInputFile";
import {
	AddPolicyAssigneeSchema,
	AddPolicyAssigneeDTO,
	emptyPolicyAssignee,
} from "./schemas/policyAssigneeSchema";
import type { FieldValues } from "react-hook-form";

// Type for FormInputFile compatibility
type FileFormData = {
	[key: string]: string;
};

// Mock data for dropdowns - replace with actual API calls
const policyOptions = [
	{
		value: "POL001",
		text: "POL001 - Life Insurance Policy",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "POL002",
		text: "POL002 - Health Insurance Policy",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "POL003",
		text: "POL003 - Term Insurance Policy",
		disabled: false,
		group: "",
		selected: false,
	},
];

const typeOptions = [
	{
		value: "Assign",
		text: "Assign",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "Transfer",
		text: "Transfer",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "Reassign",
		text: "Reassign",
		disabled: false,
		group: "",
		selected: false,
	},
];

const page = () => {
	const form = useForm<AddPolicyAssigneeDTO>({
		resolver: zodResolver(AddPolicyAssigneeSchema),
		defaultValues: emptyPolicyAssignee,
	});

	const fileForm = useForm<FileFormData>({
		defaultValues: {
			assigneeDocument: "",
			assigneeDocumentName: "",
		},
	});

	const onSubmit = (data: FieldValues) => {
		const fileData = fileForm.getValues();
		const combinedData = {
			...data,
			assigneeDocument: fileData.assigneeDocument,
			assigneeDocumentName: fileData.assigneeDocumentName,
		};
		console.log("Form submitted:", combinedData);
		// Handle form submission here
	};

	// Set current date for assigned date
	React.useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		form.setValue("assignedDate", today);
	}, [form]);

	return (
		<div className="min-h-screen">
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Policy Assignee
					</h2>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
									{/* Left Column */}
									<div className="space-y-2">
										<FormSelect
											name="policyNo"
											label="Policy No"
											options={policyOptions}
											form={form}
											required={true}
											caption="Please Select Policy No"
										/>
									</div>

									<div className="space-y-2">
										<FormInput
											name="companyNameNepali"
											label="Company Name (Nepali)"
											type="text"
											placeholder="Please Enter Company Name (Nepali)"
											form={form}
											required={true}
										/>
									</div>

									<div className="space-y-2">
										<FormSelect
											name="type"
											label="Type"
											options={typeOptions}
											form={form}
											required={true}
											caption="Please Select Type"
										/>
									</div>

									<div className="space-y-2">
										<FormTextarea
											name="remarks"
											label="Remarks"
											placeholder="Please Enter Remarks"
											form={form}
										/>
									</div>

									{/* Right Column */}
									<div className="space-y-2">
										<FormInput
											name="assigneeId"
											label="Assignee Id"
											type="text"
											placeholder="Enter Assignee Id"
											form={form}
											required={true}
										/>
									</div>

									<div className="space-y-2">
										<FormInput
											name="companyName"
											label="Company Name"
											type="text"
											placeholder="Please Enter Company Name"
											form={form}
											required={true}
										/>
									</div>

									<div className="space-y-2">
										<FormInput
											name="companyAddressNepali"
											label="Company Address (Nepali)"
											type="text"
											placeholder="Please Enter Company Address (Nepali)"
											form={form}
											required={true}
										/>
									</div>

									<div className="space-y-2">
										<FormInput
											name="assignedDate"
											label="Assigned Date"
											type="date"
											placeholder=""
											form={form}
											disabled={true}
										/>
									</div>

									<div className="space-y-2">
										<FormSwitch name="isActive" label="Is Active" form={form} />
									</div>

									<div className="space-y-2">
										<FormInputFile
											name="assigneeDocument"
											label="Assignee Document"
											form={fileForm}
											fileNameField="assigneeDocumentName"
											required={false}
										/>
									</div>
								</div>
							</div>

							<hr className="border-gray-200 my-5" />

							<div className="flex justify-start">
								<Button
									type="submit"
									className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
								>
									Submit
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default page;
