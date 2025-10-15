"use client";
import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { type VerifyOtpPayload, verifyOtp } from "@/helper/apiService";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ChevronRight, Loader2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import {
	Controller,
	FormProvider,
	type SubmitHandler,
	useForm,
} from "react-hook-form";
import { z } from "zod";
import { useLanguage } from "@/hooks/use-changeLanguage";

const FormSchema = z.object({
	mobileNumber: z.string().optional(),
	otp: z
		.string()
		.length(6, { message: "OTP must be 6 digits" })
		.regex(/^\d+$/, { message: "OTP must be numeric only" }),
});

type VerifyOtpFormDTO = z.infer<typeof FormSchema>;

function VerifyOtpPage({
	steps,
	setSteps,
}: {
	steps: string;
	setSteps: Dispatch<SetStateAction<"register" | "otp" | "verified">>;
}) {
	const { locale } = useLanguage();

	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { showToast } = useToast();
	const form = useForm<VerifyOtpFormDTO>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			mobileNumber: "",
			otp: "",
		},
	});

	const onSubmit: SubmitHandler<VerifyOtpFormDTO> = async (data) => {
		setIsSubmitting(true);

		try {
			const payload: VerifyOtpPayload = {
				mobileNumber: window.sessionStorage.getItem("mobile-phone") || "",
				otp: data.otp,
				otpFor: "REGISTRATION",
			};

			const response = await verifyOtp(payload);
			console.log("verify otp response:", response);
			if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
				showToast(response.data.code, response.data.message, "Success");
				sessionStorage.setItem("otp", data.otp);
				setSteps("register");
			} else {
				alert(
					`Failed to send Mobile nunmber: ${
						response?.data.message || "Unknown error"
					}`,
				);
			}
		} catch (error) {
			console.error("Error submitting KYC form:", error);
			alert(`Error: ${error || "Failed to send Mobile nunmber"}`);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<div className="z-2 w-full md:w-1/2 p-8 md:p-12 md:border-l-1 border-gray-200">
			<div className="flex flex-col justify-center h-full max-w-md mx-auto">
				<h2 className="text-2xl font-bold text-gray-600 dark:text-white mb-0 leading-[60px]">
					{locale === "ne" ? "ओटीपी प्रमाणीकरण" : "OTP Verification"}
				</h2>
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-6">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									{locale === "ne"
										? "जारी राख्न ओटीपी प्रविष्ट गर्नुहोस्"
										: "Enter OTP to Continue"}
								</label>
								<Controller
									name="otp"
									control={form.control}
									render={({ field, fieldState }) => (
										<InputOTP
											{...field}
											maxLength={6}
											pattern={REGEXP_ONLY_DIGITS}
										>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									)}
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
								CONTINUE
								{isSubmitting ? (
									<Loader2Icon className="h-4 w-4 animate-spin" />
								) : (
									<ChevronRight className="h-4 w-4" />
								)}
							</Button>
						</div>
					</form>
				</FormProvider>
			</div>
		</div>
	);
}

export default VerifyOtpPage;
