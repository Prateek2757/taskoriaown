"use client";
import { useCallback, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	type PolicyLoanDTO,
	emptyPolicyLoan,
	PolicyLoanSchema,
} from "../PolicyLoanSchema";
import { Button } from "@/components/ui/button";
import FormCombo from "@/components/formElements/FormCombo";
import { useState } from "react";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { Loader2Icon } from "lucide-react";
import { PolicyDetails } from "./PolicyDetails";
import { ProductDetails } from "./ProductDetails";

type Props = {
	data?: PolicyLoanDTO;
	policyList?: SelectOption[];
};

export const PolicyLoanForm = ({ data, policyList }: Props) => {
	const [submitting, setSubmitting] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [policylist, setPolicylsit] = useState<{ policyId?: string }>({});
	const form = useForm<PolicyLoanDTO>({
		defaultValues: data ?? emptyPolicyLoan,
		resolver: zodResolver(PolicyLoanSchema),
	});
	//will call the requiredfiled here for the form sleect and stuff like that form the api like kycrequiredlist and use setProductionRequirement function and load the required list maybe will use tanstack or whatever.

	useEffect(() => {
		if (data) {
			form.reset(data);
		}
	}, [data, form]);

	const isEditMode = !!data;

	const getPolicyDetail = useCallback(async (policyId: string) => {
		try {
			const submitData: PostCallData & {
				policyId: string;
			} = {
				policyId: policyId,
				endpoint: "proposal_required_list",
			};

			const response = await apiPostCall(submitData);

			console.log("policy detail response", response);

			if (response && response.status === API_CONSTANTS.success) {
				setPolicylsit(response.data.policyDetail);
			} else {
				console.log("Invalid response format or failed API call");
				setPolicylsit({});
			}
		} catch (error) {
			console.error("Error getting policy detail", error);
			setPolicylsit({});
		}
	}, []);

	const handleSetSubmitting = () => {
		setSubmitting(true);
	};

	return (
		<>
			<Form {...form}>
				<form>
					<div className="bg-white rounded-lg border-1 mb-6 mt-4">
						<div className="p-6">
							<h2 className="text-xl font-bold text-gray-800 mb-6">
								Product Loan Registration
							</h2>
							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									<div className="space-y-2">
										<FormCombo
											name="policyId"
											options={policyList}
											label="Policy No"
											form={form}
											required={true}
											onSearch={getPolicyDetail}
										/>
									</div>
								</div>
								<Button
									type="button"
									onClick={handleSetSubmitting}
									className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center mb-3"
								>
									{isSubmitting && (
										<Loader2Icon className="h-4 w-4 animate-spin" />
									)}
									Search
								</Button>

								{submitting && (
									<div className="mb-6">
										<div>
											<h2 className="text-xl font-bold text-gray-800 mb-6">
												Policy Details
											</h2>
											<PolicyDetails />
										</div>
										<div>
											<h2 className="text-xl font-bold text-gray-800 mt-4 mb-6">
												Product Details
											</h2>
											<ProductDetails />
										</div>
									</div>
								)}
							</div>
							<hr className="my-5" />

							{submitting && (
								<Button
									type="submit"
									disabled={isSubmitting}
									className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
								>
									{isSubmitting && (
										<Loader2Icon className="h-4 w-4 animate-spin" />
									)}
									Submit
								</Button>
							)}
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};
