"use client";
import {
	emptyLoanSurrendar,
	LoanSurrendarDTO,
	LoanSurrendarSchema,
} from "../LoanSurrendarSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useCallback, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import FormSelect from "@/components/formElements/FormSelect";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormCombo from "@/components/formElements/FormCombo";

type props = {
	form: UseFormReturn<LoanSurrendarDTO>;
	data?: LoanSurrendarDTO;
	policyList?: SelectOption[];
};
interface policyDetail {
	policyId?: string;
}

export const LoanSurrendarForm = ({ form, policyList }: props) => {
	const policyId = form.watch("policyId");
	const date = form.watch("date");
	const [policyDetail, setPolicyDetail] = useState<policyDetail>({});

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
				setPolicyDetail(response.data.policyDetail);
			} else {
				console.log("Invalid response format or failed API call");
				setPolicyDetail({});
			}
		} catch (error) {
			console.error("Error getting policy detail", error);
			setPolicyDetail({});
		}
	}, []);

	return (
		<>
			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0 relative">
				<div className="grid grid-cols-1 gap-4 mb-6">
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
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-2 max-[1369px]:lg:grid-cols-2 gap-4">
						<DateConverter
							form={form}
							name="date"
							labelNep="DOB in BS"
							labelEng="DOB in AD"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
