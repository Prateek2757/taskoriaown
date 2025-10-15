"use client";

import { useEffect, useState } from "react";
import GenerateOtpPage from "@/components/auth/generate_otp";
import RegisterPage from "@/components/auth/register";
import VerifyOtpPage from "@/components/auth/verify_otp";

const PAGE_STEP_KEY = "auth_step";

const Page = () => {
	const [step, setStep] = useState<"register" | "otp" | "verified">("otp");

	useEffect(() => {
		const savedStep = sessionStorage.getItem(PAGE_STEP_KEY);
		if (
			savedStep === "register" ||
			savedStep === "otp" ||
			savedStep === "verified"
		) {
			setStep(savedStep);
		}
	}, []);

	useEffect(() => {
		sessionStorage.setItem(PAGE_STEP_KEY, step);
	}, [step]);

	return (
		<>
			{step === "register" && <RegisterPage />}
			{step === "otp" && <GenerateOtpPage steps={step} setSteps={setStep} />}
			{step === "verified" && <VerifyOtpPage steps={step} setSteps={setStep} />}
		</>
	);
};

export default Page;
