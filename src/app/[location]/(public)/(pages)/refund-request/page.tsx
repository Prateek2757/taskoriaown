"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const QuillEditor = dynamic(
  () => import("@/components/EditorQuill/Reactquilleditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 bg-zinc-50 dark:bg-zinc-800/60 animate-pulse rounded-b-xl" />
    ),
  }
);

const REFUND_REASONS = [
  { value: "invalid_phone", label: "Phone number is invalid", icon: "📵" },
  {
    value: "wrong_person_phone",
    label: "Phone number goes to the wrong person",
    icon: "📞",
  },
  { value: "no_response", label: "Customer does not respond", icon: "🔕" },
  {
    value: "unwanted_service",
    label: "Customer does not want the service",
    icon: "🚫",
  },
  {
    value: "duplicate_purchase",
    label: "I have purchased this lead more than once",
    icon: "📋",
  },
] as const;

const SUPPORT_TOPICS = [
  { value: "getting_started", label: "Getting started & initial setup" },
  { value: "account_management", label: "Managing my account & profile" },
  { value: "cancel_subscription", label: "Pausing or cancelling my plan" },
  { value: "email_preferences", label: "Updating my notification preferences" },
  {
    value: "technical_issue",
    label: "Technical issue with the app or website",
  },
  { value: "guarantee_claim", label: "Enquiring about my Success Guarantee" },
  { value: "billing", label: "Billing & payment queries" },
  { value: "other", label: "Something not listed here" },
] as const;

const stripHtml = (v: string) => v.replace(/<[^>]*>/g, "").trim();

const creditReturnSchema = z.object({
  issueType: z.literal("credit_return"),
  email: z.string().email("Enter a valid email"),
  leadName: z.string().min(1, "Please enter the lead name"),
  selectedReason: z.string().min(1, "Please select a reason"),
  description: z
    .string()
    .refine(
      (v) => stripHtml(v).length >= 20,
      "Please add at least 20 characters of detail"
    ),
  leadEmail: z.string().optional(),
});

const somethingElseSchema = z.object({
  issueType: z.literal("something_else"),
  email: z.string().email("Enter a valid email"),
  supportTopic: z.string().min(1, "Please select a topic"),
  subject: z.string().min(1, "Subject is required"),
  description: z
    .string()
    .refine((v) => stripHtml(v).length > 0, "Description is required"),
});

const formSchema = z.discriminatedUnion("issueType", [
  creditReturnSchema,
  somethingElseSchema,
]);

type FormValues = z.infer<typeof formSchema>;

function SectionLabel({ num, label }: { num: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
        {num}
      </span>
      <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 flex items-center gap-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {msg}
    </p>
  );
}

function SelectArrow() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg
        className="w-4 h-4 text-zinc-400 dark:text-zinc-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}

function CheckBadge() {
  return (
    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center shadow-sm shadow-blue-500/30">
      <svg
        className="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
}

const inputCls =
  "w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent transition-all";

const selectCls =
  "w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent transition-all appearance-none cursor-pointer";

function QuillField({
  value,
  onChange,
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hasError?: boolean;
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden border transition-all
        bg-zinc-50 dark:bg-zinc-800/60
        focus-within:ring-2 focus-within:ring-[#2563EB] dark:focus-within:ring-[#3B82F6] focus-within:border-transparent
        ${
          hasError
            ? "border-red-400 dark:border-red-500"
            : "border-zinc-200 dark:border-zinc-700"
        }
      `}
    >
      <QuillEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function RefundRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedLeadName, setSubmittedLeadName] = useState("");
  const [issueType, setIssueType] = useState<
    "" | "credit_return" | "something_else"
  >("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<any>({
    resolver: issueType ? zodResolver(formSchema) : undefined,
    defaultValues: {
      issueType: "",
      email: "",
      leadName: "",
      selectedReason: "",
      supportTopic: "",
      subject: "",
      description: "",
    },
  });

  const description = (watch("description") as string) ?? "";
  const err = errors as Record<string, { message?: string }>;

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setValue("email", session.user.email);
    }
  }, [status, session, setValue]);

  useEffect(() => {
    if (!issueType) return;
    reset({
      issueType,
      email: session?.user?.email ?? "",
      leadName: "",
      selectedReason: "",
      supportTopic: "",
      subject: "",
      description: "",
    });
    clearErrors();
  }, [issueType, reset, clearErrors, session]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    clearErrors("root" as never);
    try {
      if (data.issueType === "credit_return") {
        setSubmittedLeadName(data.leadName);
        const res = await axios.post("/api/refund", {
          issue_type: "credit_return",
          email: data.email,
          lead_name: data.leadName,
          reason: data.selectedReason,
          description: stripHtml(data.description),
          lead_email: data.leadEmail || null,
        });
        if (!res.data.success) {
          setError("root" as never, {
            message: res.data.message || "Failed to submit.",
          } as never);
          return;
        }
      } else {
        const res = await axios.post("/api/refund", {
          issue_type: "something_else",
          email: data.email,
          support_topic: data.supportTopic,
          subject: data.subject,
          description: stripHtml(data.description),
        });
        if (!res.data.success) {
          setError("root" as never, {
            message: res.data.message || "Failed to submit.",
          } as never);
          return;
        }
      }
      setSuccess(true);
    } catch {
      setError("root" as never, {
        message: "Network error. Please try again.",
      } as never);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-[#2563EB]/15 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-blue-50 dark:bg-blue-900/20 border-2 border-[#93C5FD] dark:border-[#2563EB]/50 rounded-full flex items-center justify-center">
              <svg
                className="w-9 h-9 text-[#2563EB] dark:text-[#3B82F6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Request submitted
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
            {issueType === "credit_return"
              ? `Your refund request for "${submittedLeadName}" is under review.`
              : "Your support ticket has been submitted."}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-8">
            We&apos;ll get back to you within 2–3 business days.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-blue-600/25"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setIssueType("");
              }}
              className="px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              New request
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rootError = err.root?.message;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-5 py-10 pb-14">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 leading-tight">
            Submit a request
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            We&apos;ll review your request and get back to you promptly.
          </p>
        </div>

        {rootError && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
            <svg
              className="w-4 h-4 mt-0.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {rootError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section>
            <SectionLabel num={1} label="What do you need help with?" />
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "credit_return" as const,
                  icon: "💳",
                  title: "Credit Return",
                  sub: "Request a refund for a lead",
                },
                {
                  value: "something_else" as const,
                  icon: "💬",
                  title: "Something Else",
                  sub: "Get help with another issue",
                },
              ].map((opt) => {
                const active = issueType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIssueType(opt.value)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden
                      ${
                        active
                          ? "border-[#2563EB] dark:border-[#3B82F6] bg-white dark:bg-zinc-900 shadow-md shadow-blue-500/10"
                          : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm"
                      }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-lg ${active ? "bg-blue-50 dark:bg-blue-900/20" : "bg-zinc-100 dark:bg-zinc-800"}`}
                    >
                      {opt.icon}
                    </div>
                    <p className="font-semibold text-sm mb-0.5 text-zinc-900 dark:text-zinc-100">
                      {opt.title}
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {opt.sub}
                    </p>
                    {active && <CheckBadge />}
                  </button>
                );
              })}
            </div>
          </section>

          {issueType === "credit_return" && (
            <div className="space-y-8">
              <section>
                <SectionLabel num={2} label="Your email address" />
                <input
                  type="email"
                  {...register("email")}
                  className={inputCls}
                  placeholder="you@example.com"
                />
                <FieldError msg={err.email?.message} />
              </section>

              <section>
                <SectionLabel num={3} label="Which lead are you disputing?" />
                <div className="relative">
                  <input
                    type="text"
                    {...register("leadName")}
                    className={`${inputCls} pr-10`}
                    placeholder="Enter the name of the lead"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
                    <svg
                      className="w-4 h-4 text-zinc-300 dark:text-zinc-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
                  Please provide the name of the lead
                </p>
                <FieldError msg={err.leadName?.message} />
              </section>

              <section>
                <SectionLabel num={4} label="Reason for return" />
                <Controller
                  name="selectedReason"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className={selectCls}
                      >
                        <option value="">— Select a reason —</option>
                        {REFUND_REASONS.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.icon} {r.label}
                          </option>
                        ))}
                      </select>
                      <SelectArrow />
                    </div>
                  )}
                />
                <FieldError msg={err.selectedReason?.message} />
              </section>

              <section>
                <SectionLabel
                  num={5}
                  label="What is the email address of the lead? (optional)"
                />
                <div className="relative">
                  <input
                    type="email"
                    {...register("leadEmail")}
                    className={`${inputCls} pr-10`}
                    placeholder="Enter the email of the lead"
                  />
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
                  Providing the email address of the lead here helps us
                  instantly match your request to your purchase, allowing for a
                  much faster decision.
                </p>
                <FieldError msg={err.leadEmail?.message} />
              </section>

              <section>
                <SectionLabel num={6} label="Tell us more" />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <QuillField
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Describe why you're requesting a return. The more detail you provide, the faster we can process it…"
                      hasError={!!err.description}
                    />
                  )}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {stripHtml(description).length} chars · min. 20 required
                  </p>
                  <FieldError msg={err.description?.message} />
                </div>
              </section>
            </div>
          )}

          {issueType === "something_else" && (
            <div className="space-y-8">
              <section>
                <SectionLabel num={2} label="Your email address" />
                <input
                  type="email"
                  {...register("email")}
                  className={inputCls}
                  placeholder="you@example.com"
                />
                <FieldError msg={err.email?.message} />
              </section>

              <section>
                <SectionLabel
                  num={3}
                  label="What is your issue or question regarding?"
                />
                <Controller
                  name="supportTopic"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className={selectCls}
                      >
                        <option value="">— Select a topic —</option>
                        {SUPPORT_TOPICS.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <SelectArrow />
                    </div>
                  )}
                />
                <FieldError msg={err.supportTopic?.message} />
              </section>

              <section>
                <SectionLabel num={4} label="Subject" />
                <input
                  type="text"
                  {...register("subject")}
                  className={inputCls}
                  placeholder="Brief summary of your issue"
                />
                <FieldError msg={err.subject?.message} />
              </section>

              <section>
                <SectionLabel num={5} label="Description" />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <QuillField
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Please describe your issue in as much detail as possible…"
                      hasError={!!err.description}
                    />
                  )}
                />
                <FieldError msg={err.description?.message} />
              </section>
            </div>
          )}

          {issueType && (
            <div className="pt-2">
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-6" />
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs leading-relaxed">
                  By submitting you confirm this information is accurate. False
                  claims may result in account action.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="shrink-0 px-7 py-3 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2.5 shadow-lg shadow-blue-600/25"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit request
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}