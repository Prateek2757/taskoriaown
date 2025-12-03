"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import QuestionRenderer from "./QuestionRenderer";
import { AnimatePresence, motion } from "motion/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    getValues,
    reset,
    formState: { errors },
  } = useForm();

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

  const handleNextQuestion = () => {
    if (currentQuestion?.is_required) {
      const value = getValues(`q_${currentQuestion.category_question_id}`);
      if (!value || (typeof value === "string" && value.trim() === "")) {
        toast.error("Please answer the question");
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
    if (!data.budget_min || !data.budget_max) {
      toast.error("Please enter both minimum and maximum budget");
      setLoading(false);
      return;
    }
    if (data.budget_min < 0 || data.budget_max < 0) {
      toast.error("Invalid! Budget cannot be negative");
      setLoading(false);
      return;
    }
    if (!data.preferred_date_start || !data.preferred_date_end) {
      toast.error("Please select both start and end dates");
      setLoading(false);
      return;
    }
    if (data.preferred_date_end < data.preferred_date_start) {
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
          acc[q.category_question_id] =
            data[`q_${q.category_question_id}`] ?? null;
          return acc;
        }, {} as any),
        budget_min: Number(data.budget_min),
        budget_max: Number(data.budget_max),
        preferred_date_start: data.preferred_date_start,
        preferred_date_end: data.preferred_date_end,
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
          acc[q.category_question_id] =
            data[`q_${q.category_question_id}`] ?? null;
          return acc;
        }, {} as any),
        budget_min: Number(data.budget_min),
        budget_max: Number(data.budget_max),
        preferred_date_start: data.preferred_date_start,
        preferred_date_end: data.preferred_date_end,
      };
      localStorage.setItem("pendingpayload", JSON.stringify(payload));

      toast.warning(" Please Sign In or Sign Up to continue.");
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  if (loading && questions.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin w-6 h-6" />
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
      <form className=" flex flex-col gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentIndex + 1} of {questions.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?.category_question_id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionRenderer
              q={currentQuestion}
              control={control}
              register={register}
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-">
          <Button
            variant="outline"
            type="button"
            onClick={handlePrevQuestion}
            className="rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            Back
          </Button>

          <Button
            type="button"
            onClick={handleNextQuestion}
            className="rounded-lg bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] text-white font-semibold shadow hover:shadow-lg"
          >
            {currentIndex === questions.length - 1
              ? "Next: Budget & Dates"
              : "Next Question"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Budget & Preferred Dates
      </h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            Budget Min *
          </label>
          <input
            type="number"
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "Minus") {
                e.preventDefault();
              }
            }}
            {...register("budget_min", { required: true })}
            placeholder="Minimum"
            className="border px-3 py-2 rounded-lg text-gray-800 dark:text-gray-200 dark:bg-slate-700"
          />
          {errors.budget_min && (
            <span className="text-red-500 text-sm mt-1">
              Minimum budget is required
            </span>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            Budget Max *
          </label>
          <input
            type="number"
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "Minus") e.preventDefault();
            }}
            {...register("budget_max", { required: true })}
            placeholder="Maximum"
            className="border px-3 py-2 rounded-lg text-gray-800 dark:text-gray-200 dark:bg-slate-700"
          />
          {errors.budget_max && (
            <span className="text-red-500 text-sm mt-1">
              Maximum budget is required
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            Preferred Start Date *
          </label>
          <Controller
            control={control}
            name="preferred_date_start"
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date)}
                minDate={new Date()}
                placeholderText="Select start date"
                dateFormat="MMMM d, yyyy"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                calendarClassName="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
              />
            )}
          />
          {errors.preferred_date_start && (
            <span className="text-red-500 text-sm mt-1">
              Start date is required
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            Preferred End Date *
          </label>
          <Controller
            control={control}
            name="preferred_date_end"
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date)}
                minDate={getValues("preferred_date_start") || new Date()}
                placeholderText="Select end date"
                dateFormat="MMMM d, yyyy"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                calendarClassName="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
              />
            )}
          />
          {errors.preferred_date_end && (
            <span className="text-red-500 text-sm mt-1">
              End date is required
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          type="button"
          onClick={handlePrevQuestion}
          className="rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          Back
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className={`rounded-lg bg-gradient-to-r from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] text-white font-semibold shadow hover:shadow-lg ${
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
    </form>
  );
}
