"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import PaymentFailure from "../paymentfailure/page";
import PaymentSuccess from "../paymentsuccess/page";

export const dynamic = "force-dynamic";

type DecodedPaymentData = {
	product_code: string;
	signature: string;
	signed_field_names: string;
	status: string;
	total_amount: string;
	transaction_code: string;
	transaction_uuid: string;
};

function PaymentPageContent() {
	const router = useRouter();
	const { showToast } = useToast();
	const searchParams = useSearchParams();
	const encodedData = searchParams.get("data");
	const [decodedData, setDecodedData] = useState<DecodedPaymentData | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		if (!encodedData) {
			setIsLoading(false);
			return;
		}
		try {
			if (encodedData) {
				setIsLoading(false);
				
				setDecodedData(JSON.parse(atob(encodedData)));
			}
		} catch (error) {
			console.log("Failed to decode Data", error);
		}
	}, [encodedData]);

	const referenceId = decodedData?.transaction_uuid;
	const generatePolicy = useCallback(
		async (proposalNumber: string) => {
			try {
				console.log("proposal number", proposalNumber);
				const data = {
					proposalNumber,
					referenceId,
					endpoint: "generate_policy",
				};
				console.log("generate Policy payload", data);
				const response = await apiPostCall(data as PostCallData);
				console.log("generate Policy response", response);
				if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
					showToast(
						response?.data.code,
						response?.data.message,
						"Policy Generated Successfully",
					);
					router.push(`/online-policy/policypaper/${response.data.extras}`);
				} else {
					showToast(
						response?.data.code,
						response?.data.message,
						"Policy Generated failed",
					);
				}
			} catch (error) {
				console.error("Error generating policy:", error);
			} finally {
				console.error("Error generating policy:");
			}
		},
		[referenceId, router, showToast],
	);

	const postPaymentResult = useCallback(
		async (endpoint: "payment_success" | "payment_failure") => {
			if (!decodedData) return;
			try {
				const submitData: PostCallData & {
					product_code: string;
					signature: string;
					signed_field_names: string;
					status: string;
					total_amount: string;
					transaction_code: string;
					transaction_uuid: string;
				} = {
					product_code: decodedData.product_code,
					signature: decodedData.signature,
					signed_field_names: decodedData.signed_field_names,
					status: decodedData.status,
					total_amount: decodedData.total_amount,
					transaction_code: decodedData.transaction_code,
					transaction_uuid: decodedData.transaction_uuid,
					endpoint,
				};

				console.log("post payment success / failure data", submitData);

				const response = await apiPostCall(submitData);

				console.log("post payment success / failure response", response);

				if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
					showToast(
						response?.data.code,
						response?.data.message,
						`Posted ${endpoint.replace("_", " ")}`,
					);
					const proposalNumber = response.data.extras;
					generatePolicy(proposalNumber);
				} else {
					showToast(
						response?.data.code,
						response?.data.message,
						`Failed to post ${endpoint.replace("_", " ")}`,
					);
				}
			} catch (error) {
				console.error("Error getting Data", error);
			} finally {
				console.log(`${endpoint} post attempt complete`);
			}
		},
		[decodedData, showToast, generatePolicy],
	);

	useEffect(() => {
		if (!decodedData) {
			return;
		}
		
		if (decodedData.status === "COMPLETE") {
			postPaymentResult("payment_success");
		} else {
			postPaymentResult("payment_failure");
		}
	}, [postPaymentResult, decodedData]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center mt-8">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
			</div>
		);
	}

	return (
		<>
			{decodedData?.status === "COMPLETE" ? (
				<>
					{/* <h1>Payment Success</h1> */}
					<PaymentSuccess decodedData={decodedData} />
					{/* <pre className="text-sm bg-gray-100 p-4 rounded">
                        {JSON.stringify(decodedData, null, 2)}
                    </pre> */}
				</>
			) : (
				<>
					{/* <h1>Payment Failure</h1> */}

					<PaymentFailure />
					{/* <pre className="text-sm bg-gray-100 p-4 rounded">
                        {JSON.stringify(decodedData, null, 2)}
                    </pre> */}
				</>
			)}
		</>
	);
}

export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center mt-8">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
				</div>
			}
		>
			<PaymentPageContent />
		</Suspense>
	);
}
