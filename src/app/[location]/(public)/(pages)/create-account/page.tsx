"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Mail,
  User,
  Info,
  Lock,
  Building2,
  Globe,
  EyeOff,
  Eye,
  Gift,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import LocationSearch from "@/components/Location/locationsearch";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const onboardingSchema = z.object({
  is_nationwide: z.boolean(),
  distance: z.string().optional(),
  city_id: z.string().optional(),
  companyName: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(
    (val) => {
      if (!val || val === "") return true;
      const cleaned = val.replace(/\s/g, "");
      return /^(04\d{8}|0[2378]\d{8})$/.test(cleaned);
    },
    { message: "Please enter a valid Australian phone number" }
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
  hasWebsite: z.enum(["yes", "no"]).optional(),
  websiteUrl: z
    .string()
    .url("Invalid website URL")
    .optional()
    .or(z.literal("")),
  companySize: z.string().optional(),
  referralCode: z.string().optional(),
});

const conditionalSchema = onboardingSchema
  .refine((data) => data.is_nationwide || (data.distance && data.city_id), {
    message: "Distance and City are required if you are not nationwide",
    path: ["distance"],
  })
  .refine((data) => (data.hasWebsite === "yes" ? !!data.websiteUrl : true), {
    message: "Website URL is required when you select 'Yes'",
    path: ["websiteUrl"],
  });

type OnboardingFormData = z.infer<typeof conditionalSchema>;
type ReferralStatus = "idle" | "validating" | "valid" | "invalid";

/** Red asterisk for required fields */
const Req = () => <span className="text-red-500 ml-0.5">*</span>;

function OnboardingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("user_id");
  const categoryId = params.get("cn");
  const { setUser } = useUser();
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
      phone: "",
      password: "",
      distance: "10",
      city_id: "",
      hasWebsite: undefined,
      websiteUrl: "",
      companySize: "",
      referralCode: "",
    },
  });

  const { control, handleSubmit, watch, setValue, formState, getValues } = form;
  const { errors } = formState;
  const isNationwide = watch("is_nationwide");
  const hasWebsite = watch("hasWebsite");
  const referralCode = watch("referralCode");

  const validateReferralCode = async (code: string) => {
    if (!code || code.trim() === "") {
      setReferralStatus("idle");
      setReferralMessage("");
      return;
    }
    setReferralStatus("validating");
    try {
      const res = await axios.post("/api/signup/referral-validate", { code: code.trim() });
      if (res.data.valid) {
        setReferralStatus("valid");
        setReferralMessage(res.data.message || "Referral code applied! 🎉");
      } else {
        setReferralStatus("invalid");
        setReferralMessage(res.data.message || "Invalid referral code.");
      }
    } catch {
      setReferralStatus("invalid");
      setReferralMessage("Could not verify code. You can still continue.");
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    if (!userId || !categoryId) return alert("Missing user info");

    setIsSubmitting(true);
    try {
      const payload: any = {
        public_id: userId || null,
        categoryPublic_id: categoryId || null,
        ...data,
        phone: data.phone || null,
        referralCode: referralStatus === "valid" ? data.referralCode : null,
      };
      if (!data.is_nationwide)
        payload.location_id = data.city_id ? Number(data.city_id) : null;

      await axios.post("/api/signup/final-submit", payload);
      localStorage.removeItem("draftProviderId");
      localStorage.removeItem("draftProviderPublicId");
      router.push("/signin");
    } catch (err: any) {
      console.error("Onboarding error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message ||
          "Failed to complete onboarding. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent";

  const inputWrapperClasses =
    "flex items-center border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition bg-white dark:bg-gray-800/50";

  const buttonSelected =
    "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg ring-2 ring-blue-300";

  const buttonUnselected =
    "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600";

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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-200/40 dark:bg-cyan-900/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white dark:bg-gray-900 shadow-2xl rounded-3xl w-full max-w-3xl p-8 sm:p-12"
      >
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["location", "details"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step === s
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900"
                    : i < (step === "details" ? 1 : 0)
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }`}
              >
                {i < (step === "details" ? 1 : 0) ? "✓" : i + 1}
              </div>
              {i < 1 && (
                <div
                  className={`w-12 h-0.5 rounded-full transition-all duration-500 ${
                    step === "details" ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

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

        {/* Required fields legend — only show on details step */}
        {step === "details" && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-right -mt-5 mb-4">
            <span className="text-red-500 font-semibold">*</span> Required fields
          </p>
        )}

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === "location" && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <FormField
                    control={control}
                    name="is_nationwide"
                    render={({ field }) => (
                      <div className="grid gap-6 sm:grid-cols-2">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative border-2 rounded-2xl p-6 cursor-pointer shadow-sm transition-all duration-300 ${
                            field.value
                              ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700"
                              : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                          }`}
                          onClick={() => setValue("is_nationwide", true)}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              I serve customers nationwide
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              Your services are available anywhere in the country.
                            </p>
                            <input
                              type="radio"
                              checked={field.value === true}
                              onChange={() => setValue("is_nationwide", true)}
                              className="absolute top-4 right-4 accent-blue-600 w-4 h-4"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative border-2 rounded-2xl p-6 cursor-pointer shadow-sm transition-all duration-300 ${
                            !field.value
                              ? "border-cyan-600 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-800 dark:to-gray-700"
                              : "border-gray-200 dark:border-gray-600 hover:border-cyan-300 dark:hover:border-cyan-500"
                          }`}
                          onClick={() => setValue("is_nationwide", false)}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="bg-cyan-100 dark:bg-cyan-800 p-3 rounded-full">
                              <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              I serve customers locally
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              Choose your city and how far you can travel.
                            </p>
                            <input
                              type="radio"
                              checked={field.value === false}
                              onChange={() => setValue("is_nationwide", false)}
                              className="absolute top-4 right-4 accent-cyan-600 w-4 h-4"
                            />
                          </div>

                          {!field.value && (
                            <div className="mt-6 space-y-3">
                              <FormField
                                control={control}
                                name="distance"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <select
                                        {...field}
                                        className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500"
                                      >
                                        <option value="10">10 miles</option>
                                        <option value="20">20 miles</option>
                                        <option value="30">30 miles</option>
                                        <option value="50">50 miles</option>
                                      </select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={control}
                                name="city_id"
                                render={() => (
                                  <FormItem>
                                    <FormLabel className="dark:text-gray-200">
                                      Select your city<Req />
                                    </FormLabel>
                                    <FormControl>
                                      <LocationSearch
                                        onSelect={(data) =>
                                          setValue("city_id", String(data?.city_id || ""))
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )}
                  />

                  <div className="flex items-center text-gray-400 dark:text-gray-500 text-sm mt-4">
                    <Info className="w-4 h-4 mr-2" />
                    You can update your service area later.
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-[#3C7DED] text-white hover:opacity-90 py-3 rounded-xl shadow-md"
                    onClick={() => setStep("details")}
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {step === "details" && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Full Name<Req /></FormLabel>
                          <FormControl>
                            <div className={inputWrapperClasses}>
                              <User className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
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
                          <FormLabel className="dark:text-gray-200">Email Address<Req /></FormLabel>
                          <FormControl>
                            <div className={inputWrapperClasses}>
                              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
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

                  <FormField
                    control={control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-200">Company Name</FormLabel>
                        <FormControl>
                          <div className={inputWrapperClasses}>
                            <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                            <input
                              {...field}
                              placeholder="Your Company Name"
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

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">Phone Number</FormLabel>
                          <FormControl>
                            <div className={inputWrapperClasses}>
                              <span className="text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0">
                                📞
                              </span>
                              <input
                                {...field}
                                type="tel"
                                placeholder="0412 345 678"
                                maxLength={12}
                                onInput={(e) => {
                                  const target = e.target as HTMLInputElement;
                                  let value = target.value.replace(/\D/g, "");
                                  if (value.length > 4 && value.length <= 7) {
                                    value = value.slice(0, 4) + " " + value.slice(4);
                                  } else if (value.length > 7) {
                                    value =
                                      value.slice(0, 4) +
                                      " " +
                                      value.slice(4, 7) +
                                      " " +
                                      value.slice(7, 10);
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
                          <FormLabel className="dark:text-gray-200">Password<Req /></FormLabel>
                          <FormControl>
                            <div className={`${inputWrapperClasses} relative`}>
                              <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                              <input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                className={`${inputClasses} pr-10`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPassword((prev) => !prev)}
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
                      <FormItem className="">
                        <FormLabel className="text-base font-semibold text-gray-800 dark:text-gray-200">
                          Does your company have a website?
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-4 mt-3">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setValue("hasWebsite", "yes")}
                              className={`px-8 py-2 rounded-full font-semibold transition-all shadow-sm ${
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
                              className={`px-8 py-2 rounded-full font-semibold transition-all shadow-sm ${
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
                              <FormLabel className="dark:text-gray-200">Website URL<Req /></FormLabel>
                              <FormControl>
                                <div className={inputWrapperClasses}>
                                  <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
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
                            className="border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 "
                          >
                            <option value="">Select size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="500+">500+ employees</option>
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
                            className={`flex items-center  border-1 shadow-sm rounded-xl px-3 py-2.5  transition-all duration-200 bg-white dark:bg-gray-800/50 ${referralWrapperBorder[referralStatus]}`}
                          >
                            <div className="mr-2 flex-shrink-0 transition-all duration-300">
                              {referralStatusIcon[referralStatus]}
                            </div>
                            <input
                              {...field}
                              placeholder="Enter referral code"
                              className={inputClasses}
                              autoComplete="off"
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase();
                                field.onChange(val);
                                // Reset status when user types
                                if (referralStatus !== "idle") {
                                  setReferralStatus("idle");
                                  setReferralMessage("");
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
                                  onClick={() => validateReferralCode(field.value || "")}
                                  disabled={referralStatus === "validating"}
                                  className="ml-2 flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                              {referralStatus === "valid" && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {referralStatus === "invalid" && <XCircle className="w-3.5 h-3.5" />}
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
                    className="w-full bg-[#3C7DED] text-white hover:opacity-90 py-5 rounded-xl shadow-md mt-4"
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
              )}
            </AnimatePresence>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}