"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import {
  lookupAbn,
  submitProviderOnboarding,
  validateReferralCode,
} from "@/services/signup";
import {
  conditionalSchema,
  isValidABN,
  type OnboardingFormData,
  type ReferralStatus,
} from "@/features/onboarding/schema";
import { DetailsStep } from "./DetailsStep";
import { LocationStep } from "./LocationStep";
import { StepIndicator } from "./StepIndicator";

export function OnboardingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("user_id");
  const categoryId = params.get("cn");
  const refFromUrl = params.get("ref");
  const [step, setStep] = useState<"location" | "details">("location");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referralStatus, setReferralStatus] = useState<ReferralStatus>("idle");
  const [referralMessage, setReferralMessage] = useState("");

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(conditionalSchema),
    defaultValues: {
      is_nationwide: true,
      name: "",
      email: "",
      companyName: "",
      abn: "",
      phone: "",
      password: "",
      distance: "10",
      city_id: "",
      hasWebsite: undefined,
      websiteUrl: "",
      companySize: "",
      referralCode: refFromUrl ?? undefined,
    },
  });

  const hasWebsite = form.watch("hasWebsite");

  const resetReferralState = () => {
    setReferralStatus("idle");
    setReferralMessage("");
  };

  const handleReferralValidation = async (code: string) => {
    if (!code || code.trim() === "") {
      resetReferralState();
      return;
    }

    setReferralStatus("validating");

    try {
      const response = await validateReferralCode(code);
      if (response.valid) {
        setReferralStatus("valid");
        setReferralMessage(response.message || "Referral code applied!");
      } else {
        setReferralStatus("invalid");
        setReferralMessage(response.message || "Invalid referral code.");
      }
    } catch {
      setReferralStatus("invalid");
      setReferralMessage("Could not verify code. You can still continue.");
    }
  };

  useEffect(() => {
    if (refFromUrl) {
      void handleReferralValidation(refFromUrl);
    }
  }, [refFromUrl]);

  const onSubmit = async (data: OnboardingFormData) => {
    if (!userId || !categoryId) {
      toast.error("Missing user info. Please restart signup.");
      return;
    }

    setIsSubmitting(true);

    try {
      const abn = data.abn?.trim();

      if (abn) {
        if (!isValidABN(abn)) {
          form.setError("abn", { message: "Please enter a valid ABN" });
          setIsSubmitting(false);
          return;
        }

        const { result } = await lookupAbn(abn);

        if (!result.isActive) {
          form.setError("abn", {
            message: "ABN must be active on the Australian Business Register.",
          });
          toast.error("ABN must be active on the Australian Business Register.");
          setIsSubmitting(false);
          return;
        }
      }

      await submitProviderOnboarding({
        data,
        userId,
        categoryId,
        referralIsValid: referralStatus === "valid",
      });
      localStorage.removeItem("draftProviderId");
      localStorage.removeItem("draftProviderPublicId");
      router.push("/signin");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to complete onboarding. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-200/40 dark:bg-cyan-900/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white dark:bg-gray-900 shadow-2xl rounded-3xl w-full max-w-3xl p-8 sm:p-12"
      >
        <StepIndicator step={step} />

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-gray-900 dark:text-gray-100">
          {step === "location"
            ? "Where do you offer your services?"
            : "Tell us about yourself"}
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
          {step === "location"
            ? "Select your service area to help us match you with the right customers."
            : "We'll use this info to complete your provider profile."}
        </p>

        {step === "details" && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-right -mt-5 mb-4">
            <span className="text-red-500 font-semibold">*</span> Required fields
          </p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === "location" ? (
                <LocationStep form={form} onContinue={() => setStep("details")} />
              ) : (
                <DetailsStep
                  form={form}
                  hasWebsite={hasWebsite}
                  isSubmitting={isSubmitting}
                  referralMessage={referralMessage}
                  referralStatus={referralStatus}
                  showPassword={showPassword}
                  onReferralApply={handleReferralValidation}
                  onReferralReset={resetReferralState}
                  onShowPasswordChange={setShowPassword}
                />
              )}
            </AnimatePresence>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
