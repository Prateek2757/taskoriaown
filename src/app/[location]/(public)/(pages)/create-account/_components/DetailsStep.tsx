"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Gift,
  Globe,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { lookupAbn } from "@/services/signup";
import type {
  AbnLookupResult,
  OnboardingFormData,
  ReferralStatus,
} from "@/features/onboarding/schema";
import { isValidABN } from "@/features/onboarding/schema";
import { RequiredMark } from "./RequiredMark";
import {
  buttonSelected,
  buttonUnselected,
  inputClasses,
  inputWrapperClasses,
} from "./formStyles";

const companySizeOptions = [
  ["1-10", "1-10 employees"],
  ["11-50", "11-50 employees"],
  ["51-200", "51-200 employees"],
  ["201-500", "201-500 employees"],
  ["500+", "500+ employees"],
];

const referralStatusIcon = {
  idle: <Gift className="w-5 h-5 text-gray-400 dark:text-gray-500" />,
  validating: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
  valid: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  invalid: <XCircle className="w-5 h-5 text-red-400" />,
};

const referralWrapperBorder = {
  idle: "border-gray-300 dark:border-gray-600",
  validating: "border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800",
  valid: "border-emerald-400 ring-2 ring-emerald-100 dark:ring-emerald-900",
  invalid: "border-red-400 ring-2 ring-red-100 dark:ring-red-900",
};

type AbnStatus = "idle" | "validating" | "valid" | "invalid";

type DetailsStepProps = {
  form: UseFormReturn<OnboardingFormData>;
  hasWebsite?: "yes" | "no";
  isSubmitting: boolean;
  referralMessage: string;
  referralStatus: ReferralStatus;
  showPassword: boolean;
  onReferralApply: (code: string) => void;
  onReferralReset: () => void;
  onShowPasswordChange: (value: boolean) => void;
};

export function DetailsStep({
  form,
  hasWebsite,
  isSubmitting,
  referralMessage,
  referralStatus,
  showPassword,
  onReferralApply,
  onReferralReset,
  onShowPasswordChange,
}: DetailsStepProps) {
  const { control, getValues, setValue } = form;
  const [abnStatus, setAbnStatus] = useState<AbnStatus>("idle");
  const [abnMessage, setAbnMessage] = useState("");
  const [abnDetails, setAbnDetails] = useState<AbnLookupResult | null>(null);
  const abnValue = form.watch("abn");

  useEffect(() => {
    const abn = abnValue?.trim();

    setAbnDetails(null);

    if (!abn) {
      setAbnStatus("idle");
      setAbnMessage("");
      return;
    }

    if (!isValidABN(abn)) {
      setAbnStatus("invalid");
      setAbnMessage("Enter a valid 11-digit ABN.");
      return;
    }

    setAbnStatus("validating");
    setAbnMessage("Checking ABN registration...");

    const timeoutId = window.setTimeout(async () => {
      try {
        const { result } = await lookupAbn(abn);

        setAbnDetails(result);

        if (!result.isActive) {
          setAbnStatus("invalid");
          setAbnMessage("ABN exists but is not active.");
          return;
        }

        setAbnStatus("valid");
        setAbnMessage("ABN verified on the Australian Business Register.");

        if (!getValues("companyName")?.trim() && result.entityName) {
          setValue("companyName", result.entityName, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      } catch (error) {
        setAbnStatus("invalid");
        setAbnMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify ABN right now."
        );
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [abnValue, getValues, setValue]);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid items-start gap-6 sm:grid-cols-2">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">
                Full Name
                <RequiredMark />
              </FormLabel>
              <FormControl>
                <div className={inputWrapperClasses}>
                  <User className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                  <input {...field} placeholder="Full Name" className={inputClasses} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">
                Email Address
                <RequiredMark />
              </FormLabel>
              <FormControl>
                <div className={inputWrapperClasses}>
                  <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                  <input
                    {...field}
                    type="email"
                    placeholder="youremail@gmail.com"
                    className={inputClasses}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid items-start gap-6 sm:grid-cols-2">
        <FormField
          control={control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Business Name</FormLabel>
              <FormControl>
                <div className={inputWrapperClasses}>
                  <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                  <input
                    {...field}
                    placeholder="Your Business Name"
                    className={inputClasses}
                  />
                </div>
              </FormControl>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                If you aren't a business, leave blank.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="abn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Business ABN</FormLabel>
              <FormControl>
                <div className={inputWrapperClasses}>
                  <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                  <input
                    {...field}
                    placeholder="Your Business ABN Number"
                    className={inputClasses}
                  />
                  {abnStatus === "validating" && (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin ml-2 shrink-0" />
                  )}
                  {abnStatus === "valid" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-2 shrink-0" />
                  )}
                  {/* {abnStatus === "invalid" && (
                    <XCircle className="w-5 h-5 text-red-400 ml-2 shrink-0" />
                  )} */}
                </div>
              </FormControl>
              {abnDetails && (
                <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100">
                  <p className="font-semibold">
                    {abnDetails.entityName || abnDetails.businessNames[0]}
                  </p>
                  <p>
                    Location: {abnDetails.addressState}{" "}
                    {abnDetails.addressPostcode}
                  </p>
                  <p>
                    Status: {abnDetails.abnStatus}
                    {abnDetails.abnStatusEffectiveFrom
                      ? ` from ${abnDetails.abnStatusEffectiveFrom}`
                      : ""}
                  </p>
                </div>
              )}
              {abnMessage && (
                <p
                  className={`text-xs mt-1.5 ${
                    abnStatus === "valid"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : abnStatus === "invalid"
                        ? "text-red-500"
                        : "text-blue-500"
                  }`}
                >
                  {abnMessage}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Don&apos;t know your ABN?{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://abr.business.gov.au/"
                  className="text-[#2563EB] underline"
                >
                  Search it here
                </a>
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">
                Phone Number
                <RequiredMark />
              </FormLabel>
              <FormControl>
                <div className={inputWrapperClasses}>
                  <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                  <input
                    {...field}
                    type="tel"
                    placeholder="0412 345 678"
                    maxLength={12}
                    onInput={(event) => {
                      const target = event.target as HTMLInputElement;
                      let value = target.value.replace(/\D/g, "");
                      if (value.length > 4 && value.length <= 7) {
                        value = `${value.slice(0, 4)} ${value.slice(4)}`;
                      } else if (value.length > 7) {
                        value = `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7, 10)}`;
                      }
                      target.value = value;
                      field.onChange(value);
                    }}
                    className={inputClasses}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">
                Password
                <RequiredMark />
              </FormLabel>
              <FormControl>
                <div className={`${inputWrapperClasses} relative`}>
                  <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className={`${inputClasses} pr-10`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onShowPasswordChange(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 border-0 hover:text-gray-600 dark:hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="hasWebsite"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Does your company have a website?
            </FormLabel>
            <FormControl>
              <div className="flex gap-4 mt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setValue("hasWebsite", "yes")}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all shadow-sm ${
                    field.value === "yes" ? buttonSelected : buttonUnselected
                  }`}
                >
                  Yes
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setValue("hasWebsite", "no");
                    setValue("websiteUrl", "");
                  }}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all shadow-sm ${
                    field.value === "no"
                      ? "bg-gray-600 text-white shadow-lg ring-2 ring-gray-400"
                      : buttonUnselected
                  }`}
                >
                  No
                </motion.button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AnimatePresence>
        {hasWebsite === "yes" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormField
              control={control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel className="dark:text-gray-200">
                    Website URL
                    <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <div className={inputWrapperClasses}>
                      <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                      <input
                        {...field}
                        placeholder="https://example.com"
                        className={inputClasses}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <FormField
        control={control}
        name="companySize"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dark:text-gray-200">Company Size</FormLabel>
            <FormControl>
              <select
                {...field}
                className="focus-within:ring-2 focus-within:ring-blue-500 transition shadow-sm rounded-xl px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select size</option>
                {companySizeOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="referralCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dark:text-gray-200 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-blue-500" />
              Referral Code
              <span className="ml-1 text-xs font-normal text-gray-400 dark:text-gray-500">
                (optional)
              </span>
            </FormLabel>
            <FormControl>
              <div
                className={`flex items-center border shadow-sm rounded-xl px-3 py-2 transition-all duration-200 bg-white dark:bg-gray-800/50 ${referralWrapperBorder[referralStatus]}`}
              >
                <div className="mr-2 shrink-0 transition-all duration-300">
                  {referralStatusIcon[referralStatus]}
                </div>
                <input
                  {...field}
                  placeholder="Enter referral code"
                  className={inputClasses}
                  autoComplete="off"
                  onChange={(event) => {
                    const value = event.target.value.toUpperCase();
                    field.onChange(value);
                    if (referralStatus !== "idle") {
                      onReferralReset();
                    }
                  }}
                />
                <AnimatePresence>
                  {field.value && field.value.length > 0 && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => onReferralApply(field.value || "")}
                      disabled={referralStatus === "validating"}
                      className="ml-2 shrink-0 text-xs font-semibold px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {referralStatus === "validating" ? "Checking..." : "Apply"}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </FormControl>

            <AnimatePresence>
              {referralMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className={`text-xs mt-1.5 flex items-center gap-1 font-medium ${
                    referralStatus === "valid"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : referralStatus === "invalid"
                        ? "text-red-500 dark:text-red-400"
                        : "text-gray-500"
                  }`}
                >
                  {referralStatus === "valid" && (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {referralStatus === "invalid" && (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {referralMessage}
                </motion.p>
              )}
            </AnimatePresence>

            {referralStatus === "idle" && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Got a referral code? Enter it above and click <strong>Apply</strong>.
              </p>
            )}

            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#2563EB] text-white hover:opacity-90 py-5 rounded-xl shadow-md mt-4"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
          </span>
        ) : (
          "Finish Onboarding"
        )}
      </Button>
    </motion.div>
  );
}
