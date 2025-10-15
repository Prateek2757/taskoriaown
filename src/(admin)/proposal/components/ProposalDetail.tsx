"use client";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import type { AddProposalDTO } from "../proposalSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	data: AddProposalDTO;
}
export default function ProposalDetail({ form, data }: ProposalDetailProps) {
	const [agentList, setAgentList] = useState<SelectOption[]>([]);

	const getAgentList = useCallback(async (value: string) => {
		try {
			const submitData: PostCallData & {
				flag: string;
				search: string;
			} = {
				flag: "AgentCodeAutoComplete",
				search: value,
				endpoint: "get_utility_dropdown",
			};

			const response = await apiPostCall(submitData);
			console.log("Agent List Response:", response);

			if (response && response.status === API_CONSTANTS.success) {
				setAgentList(response.data || []);
			} else {
				alert(
					`Failed to convert Date: ${response?.data.message || "Unknown error"}`,
				);
			}
		} catch (error) {
			console.error("Error getting age", error);
			alert(`Error: ${error || "Failed to convert Date"}`);
		} finally {
		}
	}, []);

	const agentCode = form.getValues("agentCode") ?? "";
	useEffect(() => {
		if (!agentCode) return;
		getAgentList(agentCode);
	}, [agentCode, getAgentList]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Proposal Detail</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						{data && (
							<>
								<div className="space-y-2">
									<FormInput
										form={form}
										name="proposalNumber"
										type="text"
										placeholder="Enter proposal ID"
										label="Proposal ID"
										required={true}
										disabled
									/>
									<FormInput
										form={form}
										name="proposalNumberEncrypted"
										type="hidden"
										disabled
									/>
								</div>
								<div className="space-y-2">
									<FormInput
										form={form}
										name="clientId"
										type="text"
										placeholder="Enter Client ID"
										label="Client ID"
										disabled
									/>
								</div>
							</>
						)}

						<div className="space-y-2">
							<FormInput
								form={form}
								name="kycNumber"
								type="text"
								disabled
								placeholder="Enter KYC Number"
								label="KYC Number"
								required={true}
							/>
						</div>

						{/* <div className="space-y-2">
							<FormSelect
								options={[]}
								form={form}
								name="KYCtype"
								label="KYC Type"
								required={true}
							/>
						</div> */}
						<div className="space-y-2">
							<FormCombo
								name="agentCode"
								options={agentList}
								label="Agent"
								form={form}
								required={true}
								onSearch={getAgentList}
							/>
						</div>
						{/* <div className="space-y-2">
							<FormSelect
								name="MarkettingStaff"
								options={[]}
								label="Marketting Staff"
								caption="Select Marketting Staff"
								form={form}
								required={true}
							/>
						</div>

						<div className="space-y-2">
							<FormSelect
								name="GroupCode"
								options={[]}
								label="Group Code"
								caption="Select Group code"
								form={form}
								required={true}
							/>
						</div> */}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
