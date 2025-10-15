"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import PremiumImage from "../../../../public/images/premium.jpg";
import PremiumForm from "./components/PremiumForm";
import PremiumSummary from "./components/PremiumSummary";
import {
	emptyPremium,
	type PremiumDTO,
	PremiumSchema,
	type RiderDTO,
} from "./premiumSchema";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchProductList = async () => {
	const data: PostCallData = { endpoint: "proposal_required_list" };
	const response = await apiPostCall(data as PostCallData);
	if (response?.data && response.status === API_CONSTANTS.success) {
		const activeProducts = response.data.productList.filter(
			(item: { disabled: boolean }) => item.disabled === false,
		);
		return activeProducts;
	}
	throw new Error("Failed to fetch Proposal required fields");
};

export default function Page() {
	const [riderList, setRiderList] = useState<RiderDTO[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [premiumDetails, setPremiumDetails] = useState(true);

	const {
		data: productList,
		isLoading: isLoadingRequiredFields,
		error: requiredFieldsError,
	} = useQuery({
		queryKey: ["productList"],
		queryFn: fetchProductList,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: 2,
	});

	console.log("this is product list", productList);

	const { showToast } = useToast();
	const form = useForm({
		resolver: zodResolver(PremiumSchema),
		defaultValues: {
			...emptyPremium,
			ridersList: riderList.map((rider) => ({
				...rider,
				isSelected: false,
				sumAssured: "",
				term: "",
				payTerm: "",
			})),
		},
		mode: "onChange",
	});
	const productCode = form.watch("productCode");

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			const data = {
	// 				endpoint: "proposal_required_list",
	// 			};
	// 			const response = await apiPostCall(data as PostCallData);
	// 			if (response?.data && response.status === API_CONSTANTS.success) {
	// 				const activeProducts = response.data.productList.filter(
	// 					(item: { disabled: boolean }) => item.disabled === false,
	// 				);
	// 				setProductList(activeProducts);
	// 			} else {
	// 				console.error("Invalid response format or failed API call");
	// 			}
	// 		} catch (error) {
	// 			console.error("Error fetching Kyc Detail data:", error);
	// 		} finally {
	// 		}
	// 	};
	// 	fetchData();
	// }, []);

	useEffect(() => {
		setPremiumDetails(false);
	}, [productCode]);

	const getPremium = async (riderData: string) => {
		if (!riderData) {
			return;
		}

		try {
			const formValues = form.getValues();
			const data: PostCallData & {
				ProductCode: string;
				Age: string;
				Term: string;
				SumAssured: string;
				ModeOfPayment: string;
				PayTerm: string;
				IsCalculator: string;
				RidersJson: string;
			} = {
				ProductCode: formValues.productCode,
				Age: formValues.age,
				Term: formValues.term,
				SumAssured: formValues.sumAssured,
				ModeOfPayment: formValues.modeOfPayment,
				PayTerm: formValues.payTerm,
				IsCalculator: "1",
				RidersJson: riderData,
				endpoint: "premium_calculation",
			};
			console.log("premium calculation data", data);
			const response = await apiPostCall(data as PostCallData);
			console.log("premium calculation response", response);
			if (response?.data && response.status === API_CONSTANTS.success) {
				setPremiumDetails(response.data);
				showToast(
					response?.data.code,
					response?.data.message,
					"Premium Calculation",
				);
			} else {
				showToast(
					response?.data.code,
					response?.data.message,
					"Premium Calculation",
				);
				console.error("Invalid response format or failed API call");
			}
		} catch (error) {
			console.error("Error calculating premium:", error);
		}
	};

	const generateRidersJson = useCallback((riderData: RiderDTO[]) => {
		const selectedRiders = riderData
			.filter((item) => !!item.isSelected)
			.map((rider) => {
				return {
					Rider: rider.rider,
					RiderSumAssured: rider.sumAssured || "",
					RiderTerm: rider.term || "",
					RiderPayTerm: rider.payTerm || "",
					RiderHealthExtraRate: rider.healthExtra || "",
					RiderOccupationExtraRate: rider.occupationExtra || "",
					RiderExtraRate: rider.extraRiderRate || "",
				};
			});

		return JSON.stringify(selectedRiders);
	}, []);

	const onSubmit: SubmitHandler<PremiumDTO> = async (formData) => {
		if (isSubmitting) {
			return;
		}

		try {
			setIsSubmitting(true);

			const requiredFields = [
				"productCode",
				"age",
				"sumAssured",
				"term",
				"payTerm",
				"modeOfPayment",
			];
			const missingFields = requiredFields.filter(
				(field) => !formData[field as keyof PremiumDTO],
			);

			if (missingFields.length > 0) {
				console.error("Missing required fields:", missingFields);
				showToast(
					"100",
					`Missing required fields: ${missingFields.join(", ")}`,
					"Validation Error",
				);
				return;
			}

			const riderData = formData.ridersList ?? [];
			await getPremium(generateRidersJson(riderData));
		} catch (error) {
			showToast(
				"100",
				"An error occurred during submission",
				"Submission Error",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex gap-4">
			<Card className="w-[65%]">
				<CardHeader>
						<CardTitle>Premium Calculator</CardTitle>
				</CardHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							
							<PremiumForm
								form={form}
								productList={productList}
								setRiderList={setRiderList}
								riderList={riderList}
								/>

							<Button
								type="submit"
								disabled={isSubmitting || !!form.formState.errors.age}
								className="ml-5 mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
								>
								{isSubmitting && (
									<Loader2Icon className="h-4 w-4 animate-spin" />
								)}
								Calculate Premium
							</Button>
						</form>
					</Form>
			</Card>
			<div className="mt-4 w-[35%]">
				{!premiumDetails && <Image src={PremiumImage} alt="" />}
				{premiumDetails && <PremiumSummary premiumDetails={premiumDetails} />}
			</div>
		</div>
	);
}
