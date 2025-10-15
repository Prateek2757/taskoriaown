"use client";
import FormInput from "@/components/formElements/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { type GenerateOtpPayload, generateOtp } from "@/helper/apiService";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { GenerateOtpFormSchema, type GenerateOtpDTO } from "../authSchema";
import { useLanguage } from "@/hooks/use-changeLanguage";

export default function Page() {
	const { locale } = useLanguage();

	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { showToast } = useToast();

	const form = useForm<GenerateOtpDTO>({
		resolver: zodResolver(GenerateOtpFormSchema),
		defaultValues: {
			mobileNumber: "",
		},
	});

	const onSubmit: SubmitHandler<GenerateOtpDTO> = async (data) => {
		setIsSubmitting(true);

		try {
			const payload: GenerateOtpPayload = {
				...data,
				otpFor: "REGISTRATION",
				otpDescription: "Registration",
			};

			const response = await generateOtp(payload);

			console.log(response);

			if (response && response.status === API_CONSTANTS.success) {
				if (response.data.code === SYSTEM_CONSTANTS.success_code) {
					showToast(response.data.code, response.data.message, "Success");
					sessionStorage.setItem("mobile-phone", data.mobileNumber);
					router.push(`/en/verify-otp`);
				} else {
					showToast(response.data.code, response.data.message, "Failed");
				}
			} else {
				alert(
					`Failed to send OTP: ${response?.data.message || "Unknown error"}`,
				);
			}
		} catch (error) {
			console.error("Error submitting OTP:", error);
			alert(`Error: ${error || "Failed to send OTP"}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="z-2 w-full md:w-1/2 p-8 md:p-12 md:border-l-1 border-gray-200">
			<div className="flex flex-col justify-center h-full max-w-md mx-auto">
				<h2 className="text-2xl font-bold text-gray-600 dark:text-white mb-0 leading-[60px]">
					{locale === "ne" ? "दर्ता गर्नुहोस्" : "Register"}
				</h2>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-6">
							<div>
								<FormInput
									form={form}
									name="mobileNumber"
									type="number"
									placeholder={`${locale === "ne" ? "मोबाइल नम्बर" : "Mobile Number"}`}
									label={`${locale === "ne" ? "जारी राख्नको लागि मोबाइल नम्बर प्रविष्ट गर्नुहोस्" : "Enter Mobile Number to Continue"}`}
								/>
							</div>

							<Button
								disabled={isSubmitting}
								className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium ${
									isSubmitting
										? "cursor-not-allowed opacity-50"
										: "cursor-pointer"
								}`}
								type="submit"
							>
								{locale === "ne" ? "जारी राख्नुहोस्" : "Continue "}
								{isSubmitting ? (
									<Loader2Icon className="h-4 w-4 animate-spin" />
								) : (
									<ChevronRight className="h-4 w-4" />
								)}
							</Button>
							<div className="flex justify-between text-sm mt-4">
								<Link
									// href="/login"
									href={`/en/login`}
									className="text-gray-600 hover:text-blue-500 dark:text-white"
								>
									{locale === "ne" ? "लगइन " : "Login"}
								</Link>
								<Link
									// href="/forgot-password"
									href={`/en/forgot-password`}
									className="text-gray-600 hover:text-blue-500 dark:text-white"
								>
									{locale === "ne" ? "पासवर्ड बिर्सनुभयो?" : "Forgot Password?"}
								</Link>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
