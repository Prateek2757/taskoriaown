"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Mail, User, Info, Lock, Building2, Globe } from "lucide-react";
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

const onboardingSchema = z.object({
  is_nationwide: z.boolean(),
  distance: z.string().optional(),
  city_id: z.string().optional(),
  companyName: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine(
      (val) => {
        if (!val || val === "") return true; 
       
        const cleaned = val.replace(/\s/g, "");
        return /^(04\d{8}|0[2378]\d{8})$/.test(cleaned);
      },
      {
        message: "Please enter a valid Australian phone number (e.g., 0412345678 or 0298765432)",
      }
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
  hasWebsite: z.enum(["yes", "no"]).optional(),
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
  companySize: z.string().optional(),
});

const conditionalSchema = onboardingSchema
  .refine((data) => data.is_nationwide || (data.distance && data.city_id), {
    message: "Distance and City are required if you are not nationwide",
    path: ["distance"],
  })
  .refine(
    (data) => {
      if (data.hasWebsite === "yes") {
        return !!data.websiteUrl && data.websiteUrl.length > 0;
      }
      return true;
    },
    {
      message: "Website URL is required when you select 'Yes'",
      path: ["websiteUrl"],
    }
  );

type OnboardingFormData = z.infer<typeof conditionalSchema>;

type City = {
  city_id: number;
  name: string;
};

function OnboardingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("user_id");
  const categoryId = params.get("cn");
  const { setUser } = useUser();
  const [step, setStep] = useState<"location" | "details">("location");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
  });

  const { control, handleSubmit, watch, setValue, formState } = form;
  const { errors } = formState;
  const isNationwide = watch("is_nationwide");
  const hasWebsite = watch("hasWebsite");


  const onSubmit = async (data: OnboardingFormData) => {
    if (!userId || !categoryId) return alert("Missing user info");

    setIsSubmitting(true);
    try {
      const payload: any = {
        user_id: Number(userId),
        category_id: Number(categoryId),
        ...data,
        phone: data.phone || null,
      };

      if (!data.is_nationwide) {
        payload.location_id = data.city_id ? Number(data.city_id) : null;
      }

      await axios.post("/api/signup/final-submit", payload);
      localStorage.removeItem("draftProviderId");

      const res = await axios.get("/api/profiles", {
        headers: { "x-user-id": userId },
      });

      const fullUserData = res.data.user;
      setUser(fullUserData);
      // sessionStorage.setItem("user_data", JSON.stringify(fullUserData));

      router.push("/signin");
    } catch (err: any) {
      console.error("Onboarding error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Failed to complete onboarding. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-3xl w-full max-w-3xl p-8 sm:p-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-gray-900">
          {step === "location"
            ? "Where do you offer your services?"
            : "Tell us about yourself"}
        </h1>
        <p className="text-center text-gray-500 mb-8 max-w-xl mx-auto">
          {step === "location"
            ? "Select your service area to help us match you with the right customers."
            : "We'll use this info to complete your provider profile."}
        </p>

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
                              ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setValue("is_nationwide", true)}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="bg-blue-100 p-3 rounded-full">
                              <MapPin className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              I serve customers nationwide
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Your services are available anywhere in the
                              country.
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
                              ? "border-cyan-600 bg-gradient-to-br from-cyan-50 to-cyan-100"
                              : "border-gray-200 hover:border-cyan-300"
                          }`}
                          onClick={() => setValue("is_nationwide", false)}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="bg-cyan-100 p-3 rounded-full">
                              <MapPin className="w-6 h-6 text-cyan-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              I serve customers locally
                            </h3>
                            <p className="text-gray-500 text-sm">
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
                                        className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-cyan-500"
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
                                    <FormLabel>Select your city</FormLabel>
                                    <FormControl>
                                      <LocationSearch
                                        onSelect={(data) => {
                                          setValue(
                                            "city_id",
                                            String(data.city_id)
                                          );
                                        }}
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

                  <div className="flex items-center text-gray-400 text-sm mt-4">
                    <Info className="w-4 h-4 mr-2" />
                    You can update your service area later.
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2] text-white hover:opacity-90 py-3 rounded-xl shadow-md"
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
                        <FormItem className="w-full">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                              <User className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                              <input
                                {...field}
                                placeholder="Full Name"
                                className="w-full outline-none text-gray-900"
                              />
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
                        <FormItem className="w-full">
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                              <Mail className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                              <input
                                {...field}
                                type="email"
                                placeholder="youremail@gmail.com"
                                className="w-full outline-none text-gray-900"
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
                      <FormItem className="w-full">
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                            <Building2 className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                            <input
                              {...field}
                              type="text"
                              placeholder="Your Company Name"
                              className="w-full outline-none text-gray-900"
                            />
                          </div>
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1.5">
                          If you aren't a business or don't have this
                          information, you can leave this blank
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
                        <FormItem className="w-full">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                              <span className="text-gray-400 mr-2 flex-shrink-0">📞</span>
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
                                    value = value.slice(0, 4) + " " + value.slice(4, 7) + " " + value.slice(7, 10);
                                  }
                                  
                                  target.value = value;
                                  field.onChange(value);
                                }}
                                className="w-full outline-none text-gray-900"
                              />
                            </div>
                          </FormControl>
                          {/* <p className="text-xs text-gray-500 mt-1.5">optional</p> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                              <Lock className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                              <input
                                {...field}
                                type="password"
                                placeholder="Enter password"
                                className="w-full outline-none text-gray-900"
                              />
                            </div>
                          </FormControl>
                          {/* <p className="text-xs text-gray-500 mt-1.5">optional</p> */}

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name="hasWebsite"
                    render={({ field }) => (
                      <FormItem className="pt-4">
                        <FormLabel className="text-base font-semibold text-gray-800">
                          Does your company have a website?
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-4 mt-3">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setValue("hasWebsite", "yes");
                              }}
                              className={`px-8  rounded-full font-semibold transition-all shadow-sm ${
                                field.value === "yes"
                                  ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-300"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
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
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
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
                            <FormItem>
                              <FormLabel>Website Address (optional)</FormLabel>
                              <FormControl>
                                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                                  <Globe className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                                  <input
                                    {...field}
                                    type="url"
                                    placeholder="https://www.yourwebsite.com"
                                    className="w-full outline-none text-gray-900"
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
                      <FormItem className="pt-4">
                        <FormLabel className="text-base font-semibold text-gray-800">
                          Company size, employees
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {[
                              "Self-employed, Sole trader",
                              "2-10",
                              "11-50",
                              "51-200",
                              "200+",
                            ].map((size) => (
                              <motion.button
                                key={size}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setValue("companySize", size)}
                                className={`px-6 py-2.5 rounded-full font-medium transition-all shadow-sm ${
                                  field.value === size
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg ring-2 ring-blue-300"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                                }`}
                              >
                                {size}
                              </motion.button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("location")}
                      className="px-8 py-6.5 rounded-full"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-[#00E5FF] via-[#6C63FF] to-[#8A2BE2] text-white hover:opacity-90 px-8 py-6.5 rounded-full shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Complete Onboarding"}
                    </Button>
                  </div>
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}