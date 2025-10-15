"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import FormInput from "@/components/formElements/FormInput";
import FormTextarea from "@/components/formElements/FormTextarea";
import FormSelect from "@/components/formElements/FormSelect";

import type { AddemailSmsDTO } from "../schemas/emailSmsSchemas";
import { Button } from "@/components/ui/button";

type TemplateSetupProps = {
	form: UseFormReturn<AddemailSmsDTO>;
};

const templateTypes = [
	{ text: "SMS", value: "sms" },
	{ text: "Email", value: "email" },
];

export default function TemplateSetup({ form }: TemplateSetupProps) {
	const templateType = form.watch("templateType");

	useEffect(() => {}, [templateType]);

	return (
		<section className="border border-gray-200 rounded-lg p-6 mb-8 bg-white mt-3">
			<h2 className="text-xl font-bold text-gray-800 mb-6">Template Setup</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormSelect
							form={form}
							name="templateType"
							label="Template Type"
							text="Type"
							placeholder="Select Template Type"
							options={templateTypes}
							required
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="uniqueId"
							label="Unique Id"
							type="text"
							placeholder="Please Enter Unique Id"
							required
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="subject"
							label="Subject"
							type="text"
							placeholder="Enter Subject"
						/>
					</div>
					<div className="space-y-2 ">
						<FormInput
							form={form}
							name="recipient"
							label="Recipient"
							type="text"
							placeholder="Please Enter Recipient"
							required
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="timeToSend"
							label="Time To Send"
							type="text"
							placeholder="Enter Time to Send (optional)"
						/>
					</div>
					<div className="space-y-2">
						<FormTextarea
							form={form}
							name="message"
							label="Message"
							placeholder="Write your message here..."
						/>
					</div>
				</div>
			</div>
			<div className="mt-3">
				<Button
					type="submit"
					className="cursor-pointer bg-blue-600 hover:bg-blue-700
                                text-white text-sm py-2 px-6 rounded-md flex
                                items-center"
				>
					Submit
				</Button>
			</div>
		</section>
	);
}
