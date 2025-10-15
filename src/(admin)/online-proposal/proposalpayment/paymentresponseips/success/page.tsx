"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";

const IPSproposalSuccess = () => {
	const router = useRouter();
	const params = useSearchParams();
	const datas = params.get("TXNID");
	const { showToast } = useToast();
	const [loading, setLoading] = useState(false);
	const generatePolicy = async (proposalNumber: string) => {
		try {
			console.log("proposal number", proposalNumber);
			const data = {
				proposalNumber,
				// referenceId,
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
	};
	const checkout = async () => {
		try {
			setLoading(true);
			const data = {
				params: { TXNID: datas },
				endpoint: "connectips_payment_success",
			};
			const response = await apiPostCall(data as PostCallData);
			console.log("this is checkout response", response.data);
			if (
				response?.data &&
				response.data.code === SYSTEM_CONSTANTS.success_code
			) {
				console.log("you are here");
				showToast(
					SYSTEM_CONSTANTS.success_code,
					response.data.message,
					"Success",
				);
				await generatePolicy(response.data.extras);
			} else {
				showToast(SYSTEM_CONSTANTS.error_code, response.data.message, "Failed");
			}
		} catch (error) {
			console.error("Error fetching Payment Detail data:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (datas) {
			checkout();
		}
	}, [datas]);
	return <div>this is payment success page for the bakend of the app</div>;
};
const page = () => {
	return (
		<Suspense fallback={"loading ........"}>
			<IPSproposalSuccess />
		</Suspense>
	);
};

export default page;
