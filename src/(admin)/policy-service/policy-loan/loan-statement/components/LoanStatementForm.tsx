"use client";
import { useCallback } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	type RepaymentReceiptFormDTO,
	emptyRepaymentReceipt,
	RepaymentReceiptSchema,
} from "../LoanStatementSchema";
import { Button } from "@/components/ui/button";
import FormCombo from "@/components/formElements/FormCombo";
import { useState } from "react";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
type Props = {
	loanId?: SelectOption[];
};

export const LoanStatementForm = ({ loanId }: Props) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const [receiptList, setReceiptList] = useState<{ loanId?: string }>({});
	const form = useForm<RepaymentReceiptFormDTO>({
		defaultValues: emptyRepaymentReceipt,
		resolver: zodResolver(RepaymentReceiptSchema),
	});

	const getReceiptDetail = useCallback(async (loanId: string) => {
		try {
			const submitData: PostCallData & {
				receiptNo: string;
			} = {
				receiptNo: loanId,
				endpoint: "proposal_required_list",
			};

			const response = await apiPostCall(submitData);

			console.log("policy detail response", response);

			if (response && response.status === API_CONSTANTS.success) {
				setReceiptList(response.data.receiptDetail);
			} else {
				console.log("Invalid response format or failed API call");
				setReceiptList({});
			}
		} catch (error) {
			console.error("Error getting policy detail", error);
			setReceiptList({});
		}
	}, []);
	const handleSubmit = () => {
		router.push(`loan-statement/view/1213`);
	};

	return (
		<>
			<Form {...form}>
				<form>
					<div className="bg-white rounded-lg border-1 mb-6 mt-4">
						<div className="p-6">
							<h2 className="text-xl font-bold text-gray-800 mb-6">
								Statement Search
							</h2>
							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									<div className="space-y-2">
										<FormCombo
											name="loanId"
											options={loanId}
											label="Loan Id"
											form={form}
											required={true}
											onSearch={getReceiptDetail}
										/>
									</div>
								</div>
								<Button
									type="button"
									onClick={handleSubmit}
									className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center mb-3"
								>
									{isSubmitting && (
										<Loader2Icon className="h-4 w-4 animate-spin" />
									)}
									Search
								</Button>
							</div>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};
