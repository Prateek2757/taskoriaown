"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Mail, User, Info, Lock } from "lucide-react";
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

// -------------------- Zod Schema --------------------
const onboardingSchema = z.object({
  is_nationwide: z.boolean(),
  distance: z.string().optional(),
  city_id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Conditional validation for local service
const conditionalSchema = onboardingSchema.refine(
  (data) => data.is_nationwide || (data.distance && data.city_id),
  {
    message: "Distance and City are required if you are not nationwide",
    path: ["distance"],
  }
);

type OnboardingFormData = z.infer<typeof conditionalSchema>;

type City = {
  city_id: number;
  name: string;
};

// -------------------- Inner Component --------------------
function OnboardingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("user_id");
  const categoryId = params.get("cn");
  const { setUser } = useUser();

  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [step, setStep] = useState<"location" | "details">("location");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------- React Hook Form --------------------
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(conditionalSchema),
    defaultValues: {
      is_nationwide: true,
      name: "",
      email: "",
      phone: "",
      password: "",
      distance: "10",
      city_id: "",
    },
  });

  const { control, handleSubmit, watch, setValue, formState } = form;
  const { errors } = formState;
  const isNationwide = watch("is_nationwide");

  // -------------------- Fetch Cities --------------------
  useEffect(() => {
    axios
      .get("/api/signup/location")
      .then((res) => setCities(res.data))
      .catch(console.error)
      .finally(() => setLoadingCities(false));
  }, []);

  // -------------------- Submit Handler --------------------
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
      sessionStorage.setItem("user_data", JSON.stringify(fullUserData));

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
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
            : "We’ll use this info to complete your provider profile."}
        </p>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* -------------------- Step 1: Location -------------------- */}
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
                        {/* ---------- Nationwide Card ---------- */}
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

                        {/* ---------- Local Service Card ---------- */}
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative border-2 rounded-2xl p-6 cursor-pointer shadow-sm transition-all duration-300 ${
                            !field.value
                              ? "border-green-600 bg-gradient-to-br from-green-50 to-green-100"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                          onClick={() => setValue("is_nationwide", false)}
                        >
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="bg-green-100 p-3 rounded-full">
                              <MapPin className="w-6 h-6 text-green-600" />
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
                              className="absolute top-4 right-4 accent-green-600 w-4 h-4"
                            />
                          </div>

                          {/* Conditional Local Fields */}
                          {!field.value && (
                            <div className="mt-6 space-y-3">
                              {/* Distance */}
                              <FormField
                                control={control}
                                name="distance"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <select
                                        {...field}
                                        className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-green-500"
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

                              {/* City */}
                              <FormField
                                control={control}
                                name="city_id"
                                render={() => (
                                  <FormItem>
                                    <FormLabel>Select your city</FormLabel>
                                    <FormControl>
                                      <LocationSearch
                                        onSelect={(data) => {
                                          setValue("city_id", String(data.city_id));
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
                    className="w-full bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] text-white hover:opacity-90 py-3 rounded-xl shadow-md"
                    onClick={() => setStep("details")}
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {/* -------------------- Step 2: Details -------------------- */}
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
                    {/* Name */}
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm">
                              <User className="w-5 h-5 text-gray-400 mr-2" />
                              <input
                                {...field}
                                placeholder="Full Name"
                                className="w-full outline-none"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm">
                              <Mail className="w-5 h-5 text-gray-400 mr-2" />
                              <input
                                {...field}
                                type="email"
                                placeholder="Email Address"
                                className="w-full outline-none"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Phone </FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm">
                              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                              <input
                                {...field}
                                type="tel"
                                placeholder="Phone"
                                maxLength={10}
                                onInput={(e) => {
                                  const target = e.target as HTMLInputElement;
                                  target.value = target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  field.onChange(target.value);
                                }}
                                className="w-full outline-none"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm">
                              <Lock className="w-5 h-5 text-gray-400 mr-2" />
                              <input
                                {...field}
                                type="password"
                                placeholder="Enter password"
                                className="w-full outline-none"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep("location")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] text-white hover:opacity-90 px-8 py-3 rounded-xl shadow-md disabled:opacity-50"
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

// -------------------- Export Page Wrapped in Suspense --------------------
export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
