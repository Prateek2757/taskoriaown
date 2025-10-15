"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	type RegisterDTO,
	RegisterSchema,
} from "@/app/[lang]/(auth)/authSchema";
import FormInput from "@/components/formElements/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { register } from "@/helper/apiService";
import { useLanguage } from "@/hooks/use-changeLanguage";

export default function RegisterPage() {
	const { locale } = useLanguage();

	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [mobileNumber, setMobileNumber] = useState<string>("");
	const [otp, setOtp] = useState<string>("");

	const form = useForm<RegisterDTO>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			FirstName: "",
			MiddleName: "",
			LastName: "",
			Password: "",
			Gender: "Male",
			OTP: `${otp}`,
			MobileNumber: `${mobileNumber}`,
		},
		mode: "onChange",
	});

	const { showToast } = useToast();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedMobile = sessionStorage.getItem("mobile-phone");
			const storedOtp = sessionStorage.getItem("otp");
			setMobileNumber(storedMobile || "");
			setOtp(storedOtp || "");
			if (storedMobile) {
				form.setValue("MobileNumber", storedMobile);
			}
			if (storedOtp) {
				form.setValue("OTP", storedOtp);
			}
		} else {
			console.log("no session found");
		}
	}, [form]);
	console.log(mobileNumber, otp);

	const onSubmit: SubmitHandler<RegisterDTO> = async (data) => {
		console.log("this is register data", data);
		setIsSubmitting(true);
		try {
			const response = await register(data);
			console.log("this is register response", response);
			if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
				showToast(
					response.data.code,
					response.data.message,
					"User Registered Successfully",
				);
				sessionStorage.removeItem("auth_step");
				sessionStorage.removeItem("mobile-phone");
				sessionStorage.removeItem("otp");
				router.push(`${locale}/login`);
			} else {
				showToast(
					response?.data.code,
					response?.data.message,
					"User Registration Failed",
				);
			}
		} catch {
			showToast(
				SYSTEM_CONSTANTS.error_code,
				"An unexpected error occurred. Please try again.",
				"An unexpected error occurred. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const router = useRouter();

	return (
		<div className="z-2 w-full md:w-1/2 p-8 md:p-12 md:border-l-1 border-gray-200">
			<div className="flex flex-col justify-center h-full max-w-md mx-auto">
				<h2 className="text-2xl font-bold text-gray-600 dark:text-white mb-0 leading-[60px]">
					Register
				</h2>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-6">
							<div>
								<FormInput
									form={form}
									name="FirstName"
									type="text"
									placeholder="First Name"
									label="First Name"
								/>
							</div>
							<div className="relative">
								<FormInput
									form={form}
									name="MiddleName"
									type="text"
									placeholder="Middle Name"
									label="Middle Name"
								/>
							</div>
							<div className="relative">
								<FormInput
									form={form}
									name="LastName"
									type="text"
									placeholder="Last Name"
									label="Last Name"
								/>
							</div>
							<div className="relative">
								<FormInput
									form={form}
									name="Password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter Password"
									label="Password"
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
									placeholder="Confirm Password"
									label="Confirm Password"
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
								{isSubmitting && (
									<Loader2Icon className="h-4 w-4 animate-spin" />
								)}
								REGISTER
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
