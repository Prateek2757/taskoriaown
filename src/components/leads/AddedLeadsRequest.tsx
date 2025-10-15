"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

type Category = {
  category_id: number;
  name: string;
};

type QuestionRow = {
  category_question_id: number;
  question: string;
  field_type: string; // "text" | "textarea" | "select" | "date" | "number" | "checkbox"
  options?: string[] | null;
  is_required: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NewRequestModal({ open, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    defaultValues: {
      title: "",
      location: "",
      city_id: "",
      is_remote_allowed: false,
      budget_min: "",
      budget_max: "",
      preferred_date_start: "",
      preferred_date_end: "",
    },
  });

  const isRemoteAllowed = watch("is_remote_allowed");
  const selectedCity = watch("city_id");

  useEffect(() => {
    // fetch categories
    let mounted = true;
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await axios.get("/api/signup/category-selection");
        if (!mounted) return;
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
        toast.error("Failed to load service categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // Clear questions if category cleared
    if (!selectedCategoryId) {
      setQuestions([]);
    }
  }, [selectedCategoryId]);

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setValue("category_id", categoryId);
    if (!categoryId) {
      setQuestions([]);
      return;
    }
    setLoadingQuestions(true);
    try {
      const res = await axios.get(`/api/category-questions/${categoryId}`);
      // normalize options (ensure [] or null)
      const mapped: QuestionRow[] = res.data.map((q: any) => ({
        category_question_id: q.category_question_id,
        question: q.question,
        field_type: q.field_type,
        options: q.options ?? null,
        is_required: q.is_required,
      }));
      setQuestions(mapped);

      // pre-register keys so RHF knows about them (optional)
      mapped.forEach((q) => {
        const key = `q_${q.category_question_id}`;
        setValue(key, "");
      });
    } catch (err) {
      console.error("Failed to load questions", err);
      toast.error("Failed to load category questions.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const validateStep1 = () => {
    const values = getValues();
    if (!values.title || !values.title.trim()) {
      toast.error("Please enter a title for your request.");
      return false;
    }
    if (!values.category_id) {
      toast.error("Please choose a service category.");
      return false;
    }
    // require either location or remote
    if (!values.is_remote_allowed && !values.city_id && !values.location) {
      toast.error("Please provide a location or enable remote work.");
      return false;
    }
    return true;
  };

  const onNext = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const onBack = () => {
    setStep(1);
  };

  const onSubmit = async (data: any) => {
    // Validate dynamic required questions
    for (const q of questions) {
      if (q.is_required) {
        const val = data[`q_${q.category_question_id}`];
        if (q.field_type === "checkbox") {
          // checkbox may be boolean
          if (!val) {
            toast.error(`Please answer: ${q.question}`);
            return;
          }
        } else {
          if (val === undefined || val === null || String(val).trim() === "") {
            toast.error(`Please answer: ${q.question}`);
            return;
          }
        }
      }
    }

    // Prepare payload for your /api/leads
    const payload: any = {
      title: data.title,
      description: data.description ?? null,
      category_id: Number(data.category_id),
      budget_min: data.budget_min ? Number(data.budget_min) : null,
      budget_max: data.budget_max ? Number(data.budget_max) : null,
      city_id: data.city_id ? Number(data.city_id) : null, // if you store city ids
      address_line: data.location ?? null,
      preferred_date_start: data.preferred_date_start || null,
      preferred_date_end: data.preferred_date_end || null,
      is_remote_allowed: !!data.is_remote_allowed,
      // attach dynamic answers as JSON
      category_answers: questions.reduce((acc: any, q) => {
        acc[String(q.category_question_id)] = data[`q_${q.category_question_id}`] ?? null;
        return acc;
      }, {}),
    };

    try {
      await axios.post("/api/leads", payload);
      toast.success("Request placed — professionals will reach out soon.");
      reset();
      setQuestions([]);
      setSelectedCategoryId("");
      setStep(1);
      onClose();
    } catch (err: any) {
      console.error("Submit lead error", err);
      toast.error(err?.response?.data?.message || "Failed to submit request");
    }
  };

  // Render a dynamic input for question row
  const renderQuestion = (q: QuestionRow) => {
    const name = `q_${q.category_question_id}`;
    const required = q.is_required ? { required: `${q.question} is required` } : {};
    switch (q.field_type) {
      case "textarea":
        return (
          <div key={name} className="space-y-1">
            <Label className="font-medium">{q.question}{q.is_required ? " *" : ""}</Label>
            <Textarea {...register(name, required)} />
            {errors[name] && <p className="text-red-500 text-sm">{String(errors[name].message)}</p>}
          </div>
        );
      case "select":
        return (
          <div key={name} className="space-y-1">
            <Label className="font-medium">{q.question}{q.is_required ? " *" : ""}</Label>
            <Controller
              control={control}
              name={name}
              rules={q.is_required ? { required: true } : {}}
              render={({ field }) => (
                <Select onValueChange={(v) => field.onChange(v)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {(q.options ?? []).map((opt: any, idx: number) => (
                      <SelectItem key={idx} value={String(opt)}>
                        {String(opt)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors[name] && <p className="text-red-500 text-sm">{String(errors[name].message || "Required")}</p>}
          </div>
        );
      case "date":
        return (
          <div key={name} className="space-y-1">
            <Label className="font-medium">{q.question}{q.is_required ? " *" : ""}</Label>
            <Input type="date" {...register(name, required)} />
            {errors[name] && <p className="text-red-500 text-sm">{String(errors[name].message)}</p>}
          </div>
        );
      case "number":
        return (
          <div key={name} className="space-y-1">
            <Label className="font-medium">{q.question}{q.is_required ? " *" : ""}</Label>
            <Input type="number" {...register(name, required)} />
            {errors[name] && <p className="text-red-500 text-sm">{String(errors[name].message || "Required")}</p>}
          </div>
        );
      case "checkbox":
        return (
          <div key={name} className="flex items-start gap-2">
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(v)} />
              )}
            />
            <Label className="mt-1">{q.question}</Label>
          </div>
        );
      default:
        return (
          <div key={name} className="space-y-1">
            <Label className="font-medium">{q.question}{q.is_required ? " *" : ""}</Label>
            <Input {...register(name, required)} />
            {errors[name] && <p className="text-red-500 text-sm">{String(errors[name].message)}</p>}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95%] rounded-xl bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {step === 1 ? "Place a new request" : "A few quick questions"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>What service do you need? *</Label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Loading services...</span>
                  </div>
                ) : (
                  <Controller
                    control={control}
                    name="category_id"
                    rules={{ required: "Please select service" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={(v) => {
                          field.onChange(v);
                          handleCategoryChange(v);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service (e.g. House Cleaning)" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.category_id} value={String(c.category_id)}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.category_id && <p className="text-red-500 text-sm">{String(errors.category_id.message)}</p>}
              </div>

              <div className="space-y-1">
                <Label>What service exactly? (title) *</Label>
                <Input {...register("title", { required: "Title is required", minLength: { value: 3, message: "Min 3 characters" } })} placeholder="e.g., Deep clean 3 bedroom flat" />
                {errors.title && <p className="text-red-500 text-sm">{String(errors.title.message)}</p>}
              </div>

              <div className="space-y-1">
                <Label>Where do you need it? (postcode / town)</Label>
                <Input {...register("location")} placeholder="Enter postcode or town (optional if remote)" />
              </div>

              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="is_remote_allowed"
                  render={({ field }) => <Checkbox checked={!!field.value} onCheckedChange={(val) => field.onChange(val)} />}
                />
                <Label>Remote work allowed</Label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { reset(); onClose(); }}>
                  Cancel
                </Button>
                <Button onClick={onNext} className="ml-auto">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Dynamic questions */}
              <div className="space-y-4">
                {loadingQuestions ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Loading questions…</span>
                  </div>
                ) : questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No category-specific questions.</p>
                ) : (
                  questions.map((q) => renderQuestion(q))
                )}
              </div>

              {/* Budget & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Min budget</Label>
                  <Input type="number" {...register("budget_min")} placeholder="e.g. 100" />
                </div>
                <div className="space-y-1">
                  <Label>Max budget</Label>
                  <Input type="number" {...register("budget_max")} placeholder="e.g. 500" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Preferred start</Label>
                  <Input type="date" {...register("preferred_date_start")} />
                </div>
                <div className="space-y-1">
                  <Label>Preferred end</Label>
                  <Input type="date" {...register("preferred_date_end")} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={onBack}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="ml-auto">
                  {isSubmitting ? "Placing request…" : "Place your request"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}