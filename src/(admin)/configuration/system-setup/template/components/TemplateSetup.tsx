"use client";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormTextarea from "@/components/formElements/FormTextarea";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import type { AddEditTemplateDTO } from "../schemas/templateSchemas";
import { Button } from "@/components/ui/button";

type TemplateSetupProps = {
	form: UseFormReturn<AddEditTemplateDTO>;
};

const templateTypes = [
	{ label: "SMS", value: "sms" },
	{ label: "Email", value: "email" },
];

const templateForOptions = [
	{ label: "Policy Reminder", value: "policy_reminder" },
	{ label: "Payment Confirmation", value: "payment_confirmation" },
];

export default function TemplateSetup({ form }: TemplateSetupProps) {
	const templateType = form.watch("templateType");
	const templateFor = form.watch("templateFor");

	useEffect(() => {}, [templateType, templateFor]);

	return (
		<section className="border border-gray-200 rounded-lg p-6 mb-8 bg-white mt-3">
			<h2 className="text-xl font-bold text-gray-800 mb-6 ">Template SetUp</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg   p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormSelect
							form={form}
							name="templateType"
							label="Template Type"
							options={templateTypes}
							placeholder="Please Select Template Type"
							required
						/>
					</div>

					<div className="space-y-2">
						<FormSelect
							form={form}
							name="templateFor"
							label="Template For"
							options={templateForOptions}
							placeholder="Please Select Template For"
							required
						/>
					</div>

					<div className="space-y-2 flex items-end">
						<FormSwitch form={form} name="isActive" label="Is Active" />
					</div>
				</div>

				<div className="mt-4 space-y-2">
					<FormTextarea
						form={form}
						name="templateDescription"
						label="Template Description"
						placeholder="Please Enter Template Description Here"
						required
					/>
				</div>

				<div className="m-3 text-green-700 text-sm">
					<p className="font-bold text-center underline mb-2">VARIABLES</p>
					<p className="break-words space-y-2">
						#POLICYNO, #FIRSTNAME, #MIDDLENAME, #LASTNAME, #FULLNAME, #PREMIUM,
						#BASICPASSWORD, #DOC, #NEXTDUEDATE, #DOB, #CURRENTSTATUS,
						#INSTALMENT, #LATEFEE, #REBATE, #REBATEPERCENTAGE, #SCHEMESTARTDATE,
						#SCHEMEENDDATE, #TOTALAMOUNT, #PREMIUM_LATEFEE,
						#PREMIUM_LATEFEE_REBATE, #PAIDDATE, #LASTPAYDATEPLUS180,
						#PAIDPRINCIPAL, #PAIDINTEREST, #PAIDPRINCIPAL_INTEREST, #AGENTCODE,
						#AGENTNAME, #USERNAME
					</p>
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
