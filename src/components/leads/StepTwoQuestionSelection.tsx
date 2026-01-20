"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Calendar as CalendarIconLucide,
  MessageCircleQuestion,
  ShieldQuestion,
  MessageCircleQuestionIcon,
  FileQuestion,
  ShieldQuestionIcon,
} from "lucide-react";
import QuestionRenderer from "./QuestionRenderer";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import DateRangePicker from "../RangeCalenderInput";

export default function StepTwoQuestionsForm({
  onBack,
  onClose,
  selectedCategoryId,
  selectedLocationId,
  selectedTitle,
}: {
  onBack: () => void;
  onClose: () => void;
  selectedCategoryId: string;
  selectedLocationId: string;
  selectedTitle: string;
}) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"questions" | "budget">(
    "questions"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      has_budget: "",
      estimated_budget: "",
      preferred_date_range: undefined as DateRange | undefined,
      preferred_date_start: "",
      preferred_date_end: "",
      queries: "",
    },
  });

  useEffect(() => {
    if (!selectedCategoryId) return;
    setLoading(true);
    axios
      .get(`/api/category-questions/${selectedCategoryId}`)
      .then((res) => setQuestions(res.data))
      .catch(() => toast.error("Failed to load questions"))
      .finally(() => setLoading(false));
  }, [selectedCategoryId]);

  const currentQuestion = questions[currentIndex];

  const handleNextQuestion = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const value = getValues(`q_${currentQuestion.category_question_id}`);
    const otherValue = getValues(
      `q_${currentQuestion.category_question_id}_other`
    );

    if (currentQuestion?.is_required) {
      if (
        !value ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        toast.error("Please answer the question");
        return;
      }
    }

    if (value === "other") {
      if (!otherValue || otherValue.trim() === "") {
        toast.error("Please specify your answer in the text field");
        return;
      }
    }

    if (Array.isArray(value) && value.includes("other")) {
      if (!otherValue || otherValue.trim() === "") {
        toast.error("Please specify your answer in the text field");
        return;
      }
    }

    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
    else setCurrentStep("budget");
  };

  const handlePrevQuestion = () => {
    if (currentStep === "budget") {
      setCurrentStep("questions");
    } else if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      onBack();
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    if (!data.has_budget) {
      toast.error("Please select if you have a budget in mind");
      setLoading(false);
      return;
    }

    if (data.has_budget === "yes") {
      const budgetValue = Number(data.estimated_budget);
      if (!data.estimated_budget || budgetValue <= 0) {
        toast.error("Please enter a valid estimated budget");
        setLoading(false);
        return;
      }
      if (budgetValue < 0) {
        toast.error("Budget cannot be negative");
        setLoading(false);
        return;
      }
    }

    if (!data.preferred_date_start || !data.preferred_date_end) {
      toast.error("Please select both start and end dates");
      setLoading(false);
      return;
    }

    const startDate = new Date(data.preferred_date_start);
    const endDate = new Date(data.preferred_date_end);
    if (endDate < startDate) {
      toast.error("End date cannot be before start date");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        category_id: Number(selectedCategoryId),
        city_id: Number(selectedLocationId),
        title: selectedTitle,
        category_answers: questions.reduce((acc, q) => {
          const mainAnswer = data[`q_${q.category_question_id}`];
          const otherAnswer = data[`q_${q.category_question_id}_other`];

          if (mainAnswer === "other" && otherAnswer) {
            acc[q.category_question_id] = otherAnswer.trim();
          } else if (
            Array.isArray(mainAnswer) &&
            mainAnswer.includes("other")
          ) {
            const filtered = mainAnswer.filter((v: string) => v !== "other");
            if (otherAnswer && otherAnswer.trim()) {
              acc[q.category_question_id] = [...filtered, otherAnswer.trim()];
            } else {
              acc[q.category_question_id] =
                filtered.length > 0 ? filtered : null;
            }
          } else {
            acc[q.category_question_id] = mainAnswer ?? null;
          }
          return acc;
        }, {} as any),
        estimated_budget:
          data.has_budget === "yes" ? Number(data.estimated_budget) : 0,
        preferred_date_start: data.preferred_date_start,
        preferred_date_end: data.preferred_date_end,
        queries: data.queries || "",
      };

      const res = await axios.post("/api/leads", payload);

      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success("Request submitted successfully!");
        reset();
        onClose();
        setTimeout(() => {
          router.push("/customer/dashboard");
        }, 800);
      }
    } catch (err: any) {
      console.warn("User not logged in. Saving task locally...", err);

      const payload = {
        category_id: Number(selectedCategoryId),
        city_id: Number(selectedLocationId),
        title: selectedTitle,
        category_answers: questions.reduce((acc, q) => {
          const mainAnswer = data[`q_${q.category_question_id}`];
          const otherAnswer = data[`q_${q.category_question_id}_other`];

          if (mainAnswer === "other" && otherAnswer) {
            acc[q.category_question_id] = otherAnswer.trim();
          } else if (
            Array.isArray(mainAnswer) &&
            mainAnswer.includes("other")
          ) {
            const filtered = mainAnswer.filter((v: string) => v !== "other");
            if (otherAnswer && otherAnswer.trim()) {
              acc[q.category_question_id] = [...filtered, otherAnswer.trim()];
            } else {
              acc[q.category_question_id] =
                filtered.length > 0 ? filtered : null;
            }
          } else {
            acc[q.category_question_id] = mainAnswer ?? null;
          }
          return acc;
        }, {} as any),
        estimated_budget:
          data.has_budget === "yes" ? Number(data.estimated_budget) : 0,
        preferred_date_start: data.preferred_date_start,
        preferred_date_end: data.preferred_date_end,
        queries: data.queries || "",
      };

      localStorage.setItem("pendingpayload", JSON.stringify(payload));

      toast.warning("Please Sign In or Sign Up to continue.");
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  if (loading && questions.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        <p className="text-base font-medium">Loading questions...</p>
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p className="text-base">No questions found for this category.</p>
      </div>
    );

  if (currentStep === "questions") {
    return (
      <div className="flex flex-col h-full max-h-[calc(90vh-8rem)]">
        <div className="flex-1 overflow-y-auto px-1">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-fit">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion?.category_question_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <QuestionRenderer
                  q={currentQuestion}
                  control={control}
                  register={register}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t mt-6 border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            type="button"
            onClick={handlePrevQuestion}
            className="rounded-lg px-6 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 border-gray-300 dark:border-gray-600 transition-all"
          >
            Back
          </Button>

          <Button
            type="button"
            onClick={(e) => handleNextQuestion(e)}
            className="rounded-lg px-6 bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold shadow-md hover:shadow-xl transition-all hover:scale-105"
          >
            {currentIndex === questions.length - 1
              ? "Next: Budget & Dates"
              : "Next Question"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(90vh-8rem)]">
      <div className="flex-1 overflow-y-auto px-1">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarIconLucide className="w-6 h-6 text-blue-500" />
              Budget & Preferred Dates
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Help us understand your budget and timeline
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 border border-blue-100 dark:border-gray-600 shadow-sm">
            <label className="text-gray-900 flex dark:text-white text-base font-semibold mb-3 gap-1">
              <ShieldQuestionIcon className="w-5" /> Do you have a budget in
              mind? <span className="text-red-500">*</span>
            </label>
            <Controller
              name="has_budget"
              control={control}
              rules={{ required: "Please select an option" }}
              render={({ field }) => (
                <RadioGroup
                  className="flex flex-col sm:flex-row gap-4"
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value === "no") {
                      setValue("estimated_budget", "");
                    }
                  }}
                >
                  <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label
                      htmlFor="yes"
                      className="cursor-pointer font-medium text-gray-700 dark:text-gray-200"
                    >
                      Yes, I have a budget
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer">
                    <RadioGroupItem value="no" id="no" />
                    <Label
                      htmlFor="no"
                      className="cursor-pointer font-medium text-gray-700 dark:text-gray-200"
                    >
                      No, I'd like to discuss with a professional
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />

            {errors.has_budget && (
              <span className="text-red-500 text-sm mt-2 block">
                {errors.has_budget.message}
              </span>
            )}

            {watch("has_budget") === "yes" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5"
              >
                <Label className="mb-2 block text-gray-700 dark:text-gray-200 font-medium">
                  Estimated Budget <span className="text-red-500">*</span>
                </Label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    A$
                  </span>
                  <Input
                    type="text"
                    placeholder="Enter amount"
                    className="pl-10 h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                    }}
                    {...register("estimated_budget", {
                      required:
                        watch("has_budget") === "yes"
                          ? "Estimated budget is required"
                          : false,
                      validate: (value) => {
                        if (watch("has_budget") === "yes") {
                          const num = Number(value);
                          if (num <= 0) return "Budget must be greater than 0";
                          if (num < 0) return "Budget cannot be negative";
                        }
                        return true;
                      },
                    })}
                  />
                </div>

                {errors.estimated_budget && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.estimated_budget.message as string}
                  </span>
                )}
              </motion.div>
            )}

            {watch("has_budget") === "no" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
              >
                💡 No worries! Our professional will help you plan the right
                budget for your needs.
              </motion.p>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 border border-purple-100 dark:border-gray-600 shadow-sm">
            <h3 className="text-gray-900 dark:text-white text-base font-semibold mb-4">
              Preferred Timeline <span className="text-red-500">*</span>
            </h3>

            <Controller
              name="preferred_date_range"
              control={control}
              rules={{ required: "Please select your preferred dates" }}
              render={({ field }) => (
                <DateRangePicker
                  label="Select Start and End Dates"
                  placeholder="Choose date range"
                  value={field.value}
                  onChange={(range) => {
                    field.onChange(range);
                    if (range?.from) {
                      setValue(
                        "preferred_date_start",
                        format(range.from, "yyyy-MM-dd")
                      );
                    }
                    if (range?.to) {
                      setValue(
                        "preferred_date_end",
                        format(range.to, "yyyy-MM-dd")
                      );
                    }
                  }}
                  minDate={new Date()}
                />
              )}
            />

            {(errors.preferred_date_start || errors.preferred_date_end) && (
              <span className="text-red-500 text-sm mt-2 block">
                Please select both start and end dates
              </span>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Select your preferred start and end dates for this service
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
            <label className="text-gray-900 dark:text-white font-semibold mb-2 block">
              Any Other Queries?
            </label>
            <Textarea
              {...register("queries")}
              placeholder="Share any additional details, questions, or specific requirements..."
              className="border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg text-gray-800 dark:text-gray-200 dark:bg-slate-700 min-h-[120px] focus:border-blue-500 dark:focus:border-blue-400 transition-all"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Optional: Add any special requests or questions you have
            </p>
          </div>
        </form>
      </div>

      <div className="flex justify-between pt-6 border-t mt-6 border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          type="button"
          onClick={handlePrevQuestion}
          className="rounded-lg px-6 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 border-gray-300 dark:border-gray-600 transition-all"
        >
          Back
        </Button>

        <Button
          type="submit"
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
          className={`rounded-lg px-8 bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold shadow-md hover:shadow-xl transition-all hover:scale-105 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" /> Submitting...
            </span>
          ) : (
            "Submit Request"
          )}
        </Button>
      </div>
    </div>
  );
}
