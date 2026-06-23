"use client";

import { motion } from "motion/react";
import { Info, MapPin, Milestone } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LocationSearch from "@/components/Location/locationsearch";
import type { OnboardingFormData } from "@/features/onboarding/schema";
import { RequiredMark } from "./RequiredMark";
import { inputClasses, inputWrapperClasses } from "./formStyles";

const distanceOptions = [
  "1",
  "2",
  "5",
  "10",
  "20",
  "30",
  "40",
  "50",
  "75",
  "100",
  "125",
  "150",
];

type LocationStepProps = {
  form: UseFormReturn<OnboardingFormData>;
  onContinue: () => void;
};

export function LocationStep({ form, onContinue }: LocationStepProps) {
  const { control, setValue } = form;

  const handleContinue = async () => {
    const isNationwide = form.getValues("is_nationwide");

    if (!isNationwide) {
      const valid = await form.trigger(["distance", "city_id"]);
      if (!valid) return;
    }

    onContinue();
  };

  return (
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
                  ? "border-blue-600 bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700"
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
                  ? "border-cyan-600 bg-linear-to-br from-cyan-50 to-cyan-100 dark:from-gray-800 dark:to-gray-700"
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
                    render={({ field: distanceField }) => (
                      <FormItem>
                        <FormControl>
                          <div className={inputWrapperClasses}>
                            <Milestone className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                            <select {...distanceField} className={inputClasses}>
                              <option value="">Select size</option>
                              {distanceOptions.map((distance) => (
                                <option key={distance} value={distance}>
                                  {distance} km
                                </option>
                              ))}
                            </select>
                          </div>
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
                          Select your city
                          <RequiredMark />
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
        className="w-full bg-[#2563EB] text-white hover:opacity-90 py-5 rounded-xl shadow-md"
        onClick={handleContinue}
      >
        Continue
      </Button>
    </motion.div>
  );
}
