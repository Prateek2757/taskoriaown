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
import CalendarInput from "../CalenderInput";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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

  const handleNextQuestion = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const value = getValues(`q_${currentQuestion.category_question_id}`);
    const otherValue = getValues(`q_${currentQuestion.category_question_id}_other`);

 

    if (currentQuestion?.is_required) {
      if (!value || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0)) {
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
    if(data.has_budget ==="yes")
    {
      if (data.estimated_budget === null || data.estimated_budget === undefined || data.estimated_budget === "" || data.estimated_budget <= 0 ) {
        toast.error("Please enter estimated budget");
        setLoading(false);
        return;
      }
    }

    if (data.estimated_budget < 0) {
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
          const mainAnswer = data[`q_${q.category_question_id}`];
          const otherAnswer = data[`q_${q.category_question_id}_other`];
          
          // Handle single-select "other" option
          if (mainAnswer === "other" && otherAnswer) {
            acc[q.category_question_id] = otherAnswer.trim();
          } 
          else if (Array.isArray(mainAnswer) && mainAnswer.includes("other")) {
            const filtered = mainAnswer.filter((v: string) => v !== "other");
            if (otherAnswer && otherAnswer.trim()) {
              acc[q.category_question_id] = [...filtered, otherAnswer.trim()];
            } else {
              acc[q.category_question_id] = filtered.length > 0 ? filtered : null;
            }
          } 
          else {
            acc[q.category_question_id] = mainAnswer ?? null;
          }
          return acc;
        }, {} as any),
        estimated_budget: data.has_budget === "yes" ? Number(data.estimated_budget) : 0,
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
          } 
          else if (Array.isArray(mainAnswer) && mainAnswer.includes("other")) {
            const filtered = mainAnswer.filter((v: string) => v !== "other");
            if (otherAnswer && otherAnswer.trim()) {
              acc[q.category_question_id] = [...filtered, otherAnswer.trim()];
            } else {
              acc[q.category_question_id] = filtered.length > 0 ? filtered : null;
            }
          } 
          else {
            acc[q.category_question_id] = mainAnswer ?? null;
          }
          return acc;
        }, {} as any),
        estimated_budget: data.has_budget === "yes" ? Number(data.estimated_budget) : 0,
        preferred_date_start: data.preferred_date_start,
        preferred_date_end: data.preferred_date_end,
        queries: data.queries || "",
      };
      
      sessionStorage.setItem("pendingpayload", JSON.stringify(payload));

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
      <div className="flex flex-col h-full max-h-[calc(90vh-8rem)]">
        <div className="flex-1 overflow-y-auto px-1">
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentIndex + 1} of {questions.length}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion?.category_question_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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

        <div className="flex justify-between pt-4 border-t mt-4">
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
            onClick={(e) => handleNextQuestion(e)}
            className="rounded-lg bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold shadow hover:shadow-lg"
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Budget & Preferred Dates
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <label className="text-gray-700 text-l dark:text-gray-300 font-medium mb-2">
                Do you have a budget in mind? *
              </label>

              <RadioGroup
                className="flex gap-6"
                onValueChange={(value) => {
                  setValue("has_budget", value, { shouldValidate: true });
                  if (value === "no") {
                    setValue("estimated_budget", "");
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">
                    No, I'd like to discuss with a professional
                  </Label>
                </div>
              </RadioGroup>

              {errors.has_budget && (
                <span className="text-red-500 text-sm mt-1">
                  Please select an option
                </span>
              )}

              {watch("has_budget") === "yes" && (
                <div className="mt-4">
                  <Label className="mb-1 block">Estimated Budget *</Label>

                  <Input
                    type="text"
                    placeholder="A$ Estimated Budget"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                    }}
                    {...register("estimated_budget", {
                      required: "Estimated budget is required",
                    })}
                  />

                  {errors.estimated_budget && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.estimated_budget.message as any}
                    </span>
                  )}
                </div>
              )}

              {watch("has_budget") === "no" && (
                <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
                  No worries! Our professional will help you plan the right
                  budget.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <Controller
                name="preferred_date_start"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CalendarInput
                    label="Preferred Start Date *"
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(d) => field.onChange(d)}
                    minDate={new Date()}
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
              <Controller
                name="preferred_date_end"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  const start = getValues("preferred_date_start");

                  return (
                    <CalendarInput
                      label="Preferred End Date *"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(d) => field.onChange(d)}
                      minDate={start ? new Date(start) : new Date()}
                    />
                  );
                }}
              />

              {errors.preferred_date_end && (
                <span className="text-red-500 text-sm mt-1">
                  End date is required
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Any Other Queries ?
            </label>
            <Textarea
              {...register("queries")}
              placeholder="Type your Queries"
              className="border px-3 py-6 rounded-lg text-gray-800 dark:text-gray-200 dark:bg-slate-700"
            />
          </div>
        </form>
      </div>

      <div className="flex justify-between pt-4 border-t mt-4">
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
          onClick={handleSubmit(onSubmit)}
          className={`rounded-lg bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white font-semibold shadow hover:shadow-lg ${
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