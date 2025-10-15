// "use client";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import type { UseFormReturn } from "react-hook-form";
// import FormInput from "@/components/formElements/FormInput";
// import FormSelect from "@/components/formElements/FormSelect";
// import { Separator } from "@/components/ui/separator";
// import { API_CONSTANTS } from "@/constants/staticConstant";
// import { apiPostCall, type PostCallData } from "@/helper/apiService";
// import type { ProductProposalDTO, RiderDTO } from "../productProposalSchema";

// interface ProductDetailsProps {
// 	productList: SelectOption[];
// 	form: UseFormReturn<ProductProposalDTO>;
// 	age: string;
// 	onRiderListChange?: (riderList: RiderDTO[]) => void;
// }
// export default function ProductDetails({
// 	productList,
// 	age,
// 	form,
// 	onRiderListChange,
// }: ProductDetailsProps) {
// 	useMemo(() => age, [age]);
// 	const [riderList, setRiderList] = useState<RiderDTO[]>([]);
// 	const productCode = form.watch("productCode");

// 	const [modeOfPaymentList, setModeOfPaymentList] = useState<SelectOption[]>(
// 		[],
// 	);
// 	const [termList, setTermList] = useState<SelectOption[]>([]);
// 	const [payTermList, setPayTermList] = useState<SelectOption[]>([]);

// 	const getProposalRequiredList = useCallback(
// 		async (productId: string, age: string) => {
// 			try {
// 				const data: PostCallData & {
// 					ProductCode: string;
// 					InsuredDetails: {
// 						Age: string;
// 					};
// 				} = {
// 					ProductCode: productId,
// 					InsuredDetails: {
// 						Age: age,
// 					},

// 					endpoint: "proposal_required_list",
// 				};
// 				const response = await apiPostCall(data as PostCallData);
// 				console.log("term list response", response);

// 				if (response?.data && response.status === API_CONSTANTS.success) {
// 					setTermList(response.data.termList);
// 					setModeOfPaymentList(response.data.modeOfPaymentList);
// 					console.log("mode of payment list", response.data.modeOfPaymentList);
// 				} else {
// 					console.error("Invalid response format or failed API call");
// 				}
// 			} catch (error) {
// 				console.error("Error fetching Kyc Detail data:", error);
// 			} finally {
// 			}
// 		},
// 		[],
// 	);

// 	useEffect(() => {
// 		if (!productCode || !age) {
// 			return;
// 		}
// 		getProposalRequiredList(productCode, age);
// 	}, [productCode, getProposalRequiredList, age]);

// 	const termValue = form.watch("term");

// 	console.log("this is term", termValue);

// 	const getPayTerm = useCallback(
// 		async (productCode: string, age: string, TermValue: string) => {
// 			try {
// 				const data: PostCallData & {
// 					ProductCode: string;
// 					InsuredDetails: {
// 						Age: string;
// 					};
// 					Term: string;
// 				} = {
// 					ProductCode: productCode,
// 					InsuredDetails: {
// 						Age: age,
// 					},
// 					Term: TermValue,
// 					endpoint: "proposal_required_list",
// 				};
// 				const response = await apiPostCall(data as PostCallData);
// 				if (response?.data && response.status === API_CONSTANTS.success) {
// 					setPayTermList(response.data.payTermList);
// 				} else {
// 					console.error("Invalid response format or failed API call");
// 				}
// 			} catch (error) {
// 				console.error("Error fetching Kyc Detail data:", error);
// 			} finally {
// 			}
// 		},
// 		[],
// 	);

// 	useEffect(() => {
// 		if (!productCode || !age || !termValue) {
// 			return;
// 		}
// 		console.log("-----------", termValue);
// 		getPayTerm(productCode, age, termValue);
// 	}, [productCode, getPayTerm, age, termValue]);

// 	const modeOfPaymentValue = form.watch("modeOfPayment");
// 	const sumAssuredValue = form.watch("sumAssured");
// 	const payTermValue = form.watch("payTerm");

// 	console.log("Term Value", termValue);

// 	const getPremium = useCallback(
// 		async (
// 			productCode: string,
// 			age: string,
// 			termValue: string,
// 			payTermValue: string,
// 			sumAssuredValue: string,
// 			modeOfPaymentValue: string,
// 		) => {
// 			try {
// 				const data: PostCallData & {
// 					ProductCode: string;
// 					Age: string;
// 					Term: string;
// 					SumAssured: string;
// 					ModeOfPayment: string;
// 					PayTerm: string;
// 					IsCalculator: string;
// 				} = {
// 					ProductCode: productCode,
// 					Age: age,
// 					Term: termValue,
// 					SumAssured: sumAssuredValue,
// 					ModeOfPayment: modeOfPaymentValue,
// 					PayTerm: payTermValue,
// 					IsCalculator: "1",
// 					endpoint: "premium_calculation",
// 				};
// 				console.log("premium calculation data", data);
// 				const response = await apiPostCall(data as PostCallData);
// 				console.log("premium calculation response", response);
// 				if (response?.data && response.status === API_CONSTANTS.success) {
// 				} else {
// 					console.error("Invalid response format or failed API call");
// 				}
// 			} catch (error) {
// 				console.error("Error fetching Kyc Detail data:", error);
// 			} finally {
// 			}
// 		},
// 		[],
// 	);

// 	useEffect(() => {
// 		if (
// 			!productCode ||
// 			!age ||
// 			!termValue ||
// 			!payTermValue ||
// 			!sumAssuredValue ||
// 			!modeOfPaymentValue
// 		) {
// 			return;
// 		}
// 		getPremium(
// 			productCode,
// 			age,
// 			termValue,
// 			payTermValue,
// 			sumAssuredValue,
// 			modeOfPaymentValue,
// 		);
// 	}, [
// 		productCode,
// 		getPremium,
// 		age,
// 		termValue,
// 		payTermValue,
// 		sumAssuredValue,
// 		modeOfPaymentValue,
// 	]);

// 	const getRiderFieldName = (riderIndex: number, fieldName: string) => {
// 		return `riderList.${riderIndex}.${fieldName}` as const;
// 	};

// 	return (
// 		<div className="bg-white rounded-lg border-1 mb-6 mt-4">
// 			<div className="p-6">
// 				<h2 className="text-xl font-bold text-gray-800 mb-6">
// 					Product Details
// 				</h2>
// 				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
// 					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
// 						<div className="space-y-2">
// 							<FormSelect
// 								options={productList}
// 								form={form}
// 								name="Agent"
// 								label="Product"
// 							/>
// 						</div>
// 						<div className="space-y-2">
// 							<FormInput
// 								form={form}
// 								name="Age"
// 								type="text"
// 								placeholder="0"
// 								label="Age"
// 								disabled
// 								required
// 							/>
// 						</div>
// 						<div className="space-y-2">
// 							<FormInput
// 								form={form}
// 								name="sumAssured"
// 								type="text"
// 								placeholder="Sum Assured"
// 								label="Sum Assured"
// 								required={true}
// 							/>
// 						</div>
// 						<div className="space-y-2">
// 							<FormSelect
// 								options={modeOfPaymentList}
// 								form={form}
// 								name="modeOfPayment"
// 								label="Mode Of Payment"
// 								required
// 							/>
// 						</div>
// 						<div className="space-y-2">
// 							<FormSelect
// 								options={termList}
// 								form={form}
// 								name="term"
// 								label="Term"
// 								required
// 							/>
// 						</div>
// 						<div className="space-y-2">
// 							<FormSelect
// 								options={payTermList}
// 								form={form}
// 								name="payTerm"
// 								label="Pay Term"
// 							/>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			<div className="p-6">
// 				{riderList.length > 0 && (
// 					<div className="p-6 border border-dashed border-blue-200 rounded-lg">
// 						<h3 className="text-lg font-semibold mb-4">Rider Details</h3>
// 						<div className="grid grid-cols-8 gap-4">
// 							<div>
// 								<b>Rider</b>
// 							</div>
// 							<div>
// 								<b>Sum Assured</b>
// 							</div>
// 							<div>
// 								<b>Term</b>
// 							</div>
// 							<div>
// 								<b>PayTerm</b>
// 							</div>
// 							<div>
// 								<b>Occ Extra</b>
// 							</div>
// 							<div>
// 								<b>Health Extra</b>
// 							</div>
// 							<div>
// 								<b>Spouse Occ Extra</b>
// 							</div>
// 							<div>
// 								<b>Spouse Health Extra</b>
// 							</div>
// 						</div>
// 						<Separator className="my-2" />
// 						{riderList.map((rider, index) => (
// 							<div key={rider.rowId} className="mb-2">
// 								<div className="grid grid-cols-8 gap-4">
// 									<div>{rider.rider}</div>
// 									<div>
// 										<FormInput
// 											form={form}
// 											name={getRiderFieldName(index, "sumAssured")}
// 											type="number"
// 											placeholder=""
// 										/>
// 										<small className="text-xs">
// 											Sum Assured : {rider.minimumSumAssured} -{" "}
// 											{rider.maximumSumAssured}
// 										</small>
// 									</div>
// 									<div>
// 										<FormInput
// 											form={form}
// 											name={getRiderFieldName(index, "term")}
// 											type="number"
// 											placeholder=""
// 										/>
// 										<small className="text-xs">
// 											Term : {rider.minimumTerm} - {rider.maximumTerm}
// 										</small>
// 									</div>
// 									<div>
// 										<FormInput
// 											form={form}
// 											name={getRiderFieldName(index, "payTerm")}
// 											type="number"
// 											placeholder=""
// 										/>
// 										<small className="text-xs">
// 											PayTerm : {rider.minimumPayTerm} - {rider.maximumPayTerm}
// 										</small>
// 									</div>
// 									<div>
// 										<FormInput
// 											form={form}
// 											name={getRiderFieldName(index, "occupationExtra")}
// 											type="text"
// 											placeholder=""
// 										/>
// 									</div>
// 									<div>
// 										<FormInput
// 											form={form}
// 											name={getRiderFieldName(index, "healthExtra")}
// 											type="text"
// 											placeholder=""
// 										/>
// 									</div>
// 									<div>
// 										<FormInput
// 											form={form}
// 											name={getRiderFieldName(index, "spouseOccupationExtra")}
// 											type="text"
// 											placeholder=""
// 										/>
// 									</div>
// 									<div>
// 										<FormInput
// 											form={form}
// 											name={getRiderFieldName(index, "spouseHealthExtra")}
// 											type="text"
// 											placeholder=""
// 										/>
// 									</div>
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }
