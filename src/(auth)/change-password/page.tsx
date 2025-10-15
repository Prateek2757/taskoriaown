"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Eye, EyeOff, Loader2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import {
	type ChangePasswordPayload,
	changePassword,
} from "@/helper/apiService";
import { useLanguage } from "@/hooks/use-changeLanguage";
import { type ChangePasswordDTO, ChangePasswordFormSchema } from "../authSchema";



function ChangePasswordPage() {
	const { locale } = useLanguage();

	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { showToast } = useToast();

	const form = useForm<ChangePasswordDTO>({
		resolver: zodResolver(ChangePasswordFormSchema),
		defaultValues: {
			password: "",
			mobileNumber: "",
			otp: "",
		},
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<ChangePasswordDTO> = async (data) => {
		setIsSubmitting(true);

		try {
			const payload: ChangePasswordPayload = {
				...data,
				mobileNumber: window.sessionStorage.getItem("mobile-phone") || "",
				otp: window.sessionStorage.getItem("otp") || "",
			};
			const response = await changePassword(payload);
			console.log(response);
			if (response && response.status === API_CONSTANTS.success) {
				if (response.data.code === SYSTEM_CONSTANTS.success_code) {
					showToast(response.data.code, response.data.message, "Success");
					sessionStorage.removeItem("mobile-phone");
					sessionStorage.removeItem("otp");
					router.push(`/${locale}/login`);
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
					Change Password
				</h2>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-6">
							<div className="relative">
								<FormInput
									form={form}
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder={`${locale === "ne" ? "पासवर्ड" : "Password"}`}
									label={`${locale === "ne" ? "नयाँ पासवर्ड प्रविष्ट गर्नुहोस्" : "Enter New Password"}`}
								/>
								<Button
									type="button"
									variant="ghost"
									className="absolute right-0 top-7 flex items-center cursor-pointer hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff size={18} className="text-gray-400" />
									) : (
										<Eye size={18} className="text-gray-400" />
									)}
								</Button>
							</div>
							<div className="relative">
								<FormInput
									form={form}
									name="confirmPassword"
									type={showPassword ? "text" : "password"}
									placeholder={`${locale === "ne" ? "पासवर्ड पुष्टि गर्नुहोस्" : "Confirm Password"}`}
									label={`${locale === "ne" ? "पासवर्ड पुष्टि गर्नुहोस्" : "Confirm Password"}`}
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
								{locale === "ne" ? "जारी राख्नुहोस्" : "CONTINUE"}
								{isSubmitting ? (
									<Loader2Icon className="h-4 w-4 animate-spin" />
								) : (
									<ChevronRight className="h-4 w-4" />
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}

export default ChangePasswordPage;
