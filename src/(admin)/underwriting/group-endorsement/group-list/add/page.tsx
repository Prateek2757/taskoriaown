"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/formElements/FormInput";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormSelect from "@/components/formElements/FormSelect";
import {
	GroupEndorsementSchema,
	GroupEndorsementDTO,
} from "./schemas/groupEndorsementSchema";

// Mock data for ledger options
const ledgerOptions: SelectOption[] = [
	{
		value: "ledger1",
		text: "Ledger 1",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "ledger2",
		text: "Ledger 2",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "ledger3",
		text: "Ledger 3",
		disabled: false,
		group: "",
		selected: false,
	},
];

const page = () => {
	const form = useForm<GroupEndorsementDTO>({
		resolver: zodResolver(GroupEndorsementSchema),
		defaultValues: {
			groupName: "",
			isCI: false,
			isLSB: false,
			isADB: false,
			isFE: false,
			isPWB: false,
			isADBPTDPWB: false,
			isIB: false,
			ledger: "",
		},
	});

	const onSubmit = (data: GroupEndorsementDTO) => {
		console.log("Submitted Data:", data);
	};

	return (
		<FormProvider {...form}>
			<div className="container mx-auto p-6">
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Group Endorsement
					</h2>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Group Name Field */}
						<div className="mb-6"></div>

						{/* Toggle Switches Section */}
						<div className="mb-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<FormInput
									name="groupName"
									label="Group Name"
									form={form}
									placeholder="Please Enter Group Name"
									type="text"
									required
								/>
								<FormSwitch name="isCI" label="IS CI?" form={form} />
								<FormSwitch name="isLSB" label="IS LSB?" form={form} />

								<FormSwitch name="isADB" label="IS ADB?" form={form} />
								<FormSwitch name="isFE" label="IS FE?" form={form} />
								<FormSwitch name="isPWB" label="IS PWB?" form={form} />

								<FormSwitch
									name="isADBPTDPWB"
									label="IS ADBPTDPWB?"
									form={form}
								/>
								<FormSwitch name="isIB" label="IS IB?" form={form} />
								<div className="mb-6">
									<FormSelect
										name="ledger"
										label="Ledger"
										form={form}
										options={ledgerOptions}
										caption="Select Ledger"
										required
									/>
								</div>
							</div>
						</div>

						{/* Ledger Dropdown */}

						{/* Submit Button */}
						<div className="flex justify-start">
							<Button
								type="submit"
								className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md"
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
