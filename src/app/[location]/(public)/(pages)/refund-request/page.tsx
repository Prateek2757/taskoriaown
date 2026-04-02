"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const CKEditorWrapper = dynamic<any>(
  () => import("@/components/refund/CkEditor5/Client-side-sk-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 bg-blue-50 dark:bg-zinc-800 animate-pulse rounded-lg" />
    ),
  }
);

interface TaskResponse {
  task_id: string;
  task_title: string;
  task_budget: number;
  task_description: string;
  response_id: string;
  response_message: string;
  credits_spent: number;
  responded_at: string;
  has_refund: boolean;
  within_window: boolean;
}

const REFUND_REASONS = [
  { value: "invalid_phone", label: "Phone number is invalid", icon: "📵" },
  { value: "wrong_person_phone", label: "Phone number goes to the wrong person", icon: "📞" },
  { value: "no_response", label: "Customer does not respond", icon: "🔕" },
  { value: "unwanted_service", label: "Customer does not want the service", icon: "🚫" },
  { value: "duplicate_purchase", label: "I have purchased this lead more than once", icon: "📋" },
] as const;

const SUPPORT_TOPICS = [
  { value: "getting_started", label: "Getting started & initial setup" },
  { value: "account_management", label: "Managing my account & profile" },
  { value: "cancel_subscription", label: "Pausing or cancelling my plan" },
  { value: "email_preferences", label: "Updating my notification preferences" },
  { value: "technical_issue", label: "Technical issue with the app or website" },
  { value: "guarantee_claim", label: "Enquiring about my Success Guarantee" },
  { value: "billing", label: "Billing & payment queries" },
  { value: "other", label: "Something not listed here" },
] as const;

const creditReturnSchema = z.object({
  issueType: z.literal("credit_return"),
  email: z.string().email("Enter a valid email"),
  selectedResponseId: z.string().min(1, "Please select a lead"),
  selectedReason: z.string().min(1, "Please select a reason"),
  description: z
    .string()
    .refine(
      (v) => v.replace(/<[^>]*>/g, "").trim().length >= 20,
      "Please add at least 20 characters of detail"
    ),
});

const somethingElseSchema = z.object({
  issueType: z.literal("something_else"),
  email: z.string().email("Enter a valid email"),
  supportTopic: z.string().min(1, "Please select a topic"),
  subject: z.string().min(1, "Subject is required"),
  description: z
    .string()
    .refine(
      (v) => v.replace(/<[^>]*>/g, "").trim().length > 0,
      "Description is required"
    ),
});

const formSchema = z.discriminatedUnion("issueType", [
  creditReturnSchema,
  somethingElseSchema,
]);

type FormValues = z.infer<typeof formSchema>;

function daysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

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

const inputCls =
  "w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent transition-all";

const selectCls =
  "w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#3B82F6] focus:border-transparent transition-all appearance-none cursor-pointer";

function CheckBadge() {
  return (
    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center shadow-sm shadow-blue-500/30">
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function SelectArrow() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

function AttachmentUpload({
  files,
  onChange,
  onRemove,
}: {
  files: File[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-6 cursor-pointer hover:border-[#93C5FD] dark:hover:border-[#3B82F6]/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all group">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
          <svg className="w-5 h-5 text-[#2563EB] dark:text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Click to upload</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">PNG, JPG, PDF · max 3 files · 10 MB each</p>
        </div>
        <input type="file" multiple accept="image/*,.pdf" onChange={onChange} className="sr-only" />
      </label>
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-lg">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate flex-1">{file.name}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => onRemove(i)} className="text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RefundRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [issueType, setIssueType] = useState<"" | "credit_return" | "something_else">("");

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
    defaultValues:
      issueType === "credit_return"
        ? { issueType: "credit_return", email: "", selectedResponseId: "", selectedReason: "", description: "" }
        : { issueType: "something_else", email: "", supportTopic: "", subject: "", description: "" },
  });

  const selectedResponseId = issueType === "credit_return" ? (watch("selectedResponseId") as string) : "";
  const selectedReason = issueType === "credit_return" ? (watch("selectedReason") as string) : "";
  const description = (watch("description") as string) ?? "";

  const selectedTask = tasks.find((t) => t.response_id === selectedResponseId) ?? null;
  const eligibleTasks = tasks;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.email) {
      setValue("email" as never, session.user.email as never);
    }
  }, [status, router, session, setValue]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/refund/my", { method: "POST" });
      if (!res.ok) throw new Error();
      setTasks(await res.json());
    } catch {
      setError("root", { message: "Could not load your tasks. Please refresh." });
    } finally {
      setLoading(false);
    }
  }, [setError]);

  useEffect(() => {
    if (status === "authenticated") fetchTasks();
  }, [status, fetchTasks]);

  useEffect(() => {
    if (!issueType) return;
    const email = session?.user?.email ?? "";
    if (issueType === "credit_return") {
      reset({ issueType: "credit_return", email, selectedResponseId: "", selectedReason: "", description: "" });
    } else {
      reset({ issueType: "something_else", email, supportTopic: "", subject: "", description: "" });
    }
    setFiles([]);
    clearErrors();
  }, [issueType, reset, clearErrors, session]);

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    clearErrors("root");
    try {
      if (data.issueType === "credit_return") {
        const res = await fetch("/api/refund", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task_id: selectedTask?.task_id,
            response_id: data.selectedResponseId,
            reason: data.selectedReason,
            description: data.description.replace(/<[^>]*>/g, "").trim(),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError("root", { message: json.message || "Failed to submit." });
          return;
        }
      } else {
        const res = await fetch("/api/support/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            supportTopic: data.supportTopic,
            subject: data.subject,
            description: data.description.replace(/<[^>]*>/g, "").trim(),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError("root", { message: json.message || "Failed to submit." });
          return;
        }
      }
      setSuccess(true);
    } catch {
      setError("root", { message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex items-center justify-center p-6 font-body">
        <div className="pop-in max-w-sm w-full text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-[#2563EB]/15 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-blue-50 dark:bg-blue-900/20 border-2 border-[#93C5FD] dark:border-[#2563EB]/50 rounded-full flex items-center justify-center">
              <svg className="w-9 h-9 text-[#2563EB] dark:text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="font-display text-3xl text-zinc-900 dark:text-zinc-50 mb-2">Request submitted</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
            {issueType === "credit_return"
              ? `Your refund for "${selectedTask?.task_title}" is under review.`
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
                setFiles([]);
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

  const rootError = errors.root?.message;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 transition-colors duration-300 font-body">
      <header className="sticky top-0 z-20 bg-stone-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Help Centre</span>
          <svg className="w-3 h-3 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Submit a request</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-10 pb-24">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-zinc-900 dark:text-zinc-50 mb-2 leading-tight">
            Submit a request
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            We&apos;ll review your request and get back to you promptly.
          </p>
        </div>

        {rootError && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm fade-in">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {rootError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section>
            <SectionLabel num={1} label="What do you need help with?" />
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "credit_return" as const, icon: "💳", title: "Credit Return", sub: "Request a refund for a lead" },
                { value: "something_else" as const, icon: "💬", title: "Something Else", sub: "Get help with another issue" },
              ]).map((opt) => {
                const active = issueType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIssueType(opt.value)}
                    className={`relative p-3 rounded-2xl border-2 text-left transition-all duration-200 group overflow-hidden
                      ${active
                        ? "border-[#2563EB] dark:border-[#3B82F6] bg-white dark:bg-zinc-900 shadow-md shadow-blue-500/10"
                        : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50"
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-lg transition-colors ${active ? "bg-blue-50 dark:bg-blue-900/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                      {opt.icon}
                    </div>
                    <p className="font-semibold text-sm mb-1 text-zinc-900 dark:text-zinc-100">{opt.title}</p>
                    <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{opt.sub}</p>
                    {active && <CheckBadge />}
                  </button>
                );
              })}
            </div>
          </section>

          {issueType === "credit_return" && (
            <div className="space-y-8 fade-up">
              <section>
                <SectionLabel num={2} label="Your email address" />
                <input
                  type="email"
                  {...register("email")}
                  className={inputCls}
                  placeholder="you@example.com"
                />
                {errors.email?.message && <p className="text-xs text-red-500 mt-1">{errors.email.message as string}</p>}
              </section>

              <section>
                <SectionLabel num={3} label="Which lead are you disputing?" />
                {loading ? (
                  <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                ) : eligibleTasks.length === 0 ? (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
                    <span className="text-base">⏰</span>
                    <span>No eligible leads. Only leads responded to within the last 3 days qualify.</span>
                  </div>
                ) : (
                  <Controller
                    name="selectedResponseId"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <select
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={selectCls}
                        >
                          <option value="">— Select a lead —</option>
                          {eligibleTasks.map((task) => (
                            <option key={task.response_id} value={task.response_id}>
                              {task.task_title} · {task.credits_spent}cr · {daysAgo(task.responded_at)}
                            </option>
                          ))}
                        </select>
                        <SelectArrow />
                      </div>
                    )}
                  />
                )}

                {selectedTask && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 fade-in">
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-0.5">{selectedTask.task_title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{selectedTask.response_message}</p>
                    <div className="flex gap-3 mt-1.5">
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{daysAgo(selectedTask.responded_at)}</span>
                      {selectedTask.task_budget && (
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Budget £{selectedTask.task_budget}</span>
                      )}
                      <span className="text-[11px] font-semibold text-[#2563EB] dark:text-[#3B82F6]">{selectedTask.credits_spent} credits</span>
                    </div>
                  </div>
                )}

                {(errors as Record<string, { message?: string }>).selectedResponseId && (
                  <p className="text-xs text-red-500 mt-1">
                    {(errors as Record<string, { message?: string }>).selectedResponseId?.message}
                  </p>
                )}
              </section>

              {/* Reason — dropdown style */}
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
                            {r.icon}  {r.label}
                          </option>
                        ))}
                      </select>
                      <SelectArrow />
                    </div>
                  )}
                />
                {(errors as Record<string, { message?: string }>).selectedReason && (
                  <p className="text-xs text-red-500 mt-1">
                    {(errors as Record<string, { message?: string }>).selectedReason?.message}
                  </p>
                )}
              </section>

              <section>
                <SectionLabel num={5} label="Tell us more" />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-[#2563EB] dark:focus-within:ring-[#3B82F6] focus-within:border-transparent transition-all bg-zinc-50 dark:bg-zinc-800/60">
                      <CKEditorWrapper
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Describe why you're requesting a return. The more detail you provide, the faster we can process it..."
                      />
                    </div>
                  )}
                />
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
                  {(description ?? "").replace(/<[^>]*>/g, "").length} chars · min. 20 required
                </p>
                {errors.description?.message && <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>}
              </section>

              <section>
                <SectionLabel num={6} label="Supporting evidence (optional)" />
                <AttachmentUpload
                  files={files}
                  onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 3))}
                  onRemove={(i) => setFiles(files.filter((_, j) => j !== i))}
                />
              </section>
            </div>
          )}

          {issueType === "something_else" && (
            <div className="space-y-8 fade-up">
              {/* Email */}
              <section>
                <SectionLabel num={2} label="Your email address" />
                <input type="email" {...register("email")} className={inputCls} placeholder="you@example.com" />
                {errors.email?.message && <p className="text-xs text-red-500 mt-1">{errors.email.message as string}</p>}
              </section>

              {/* Topic — dropdown style matching the screenshot */}
              <section>
                <SectionLabel num={3} label="What is your issue or question regarding?" />
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
                {(errors as Record<string, { message?: string }>).supportTopic && (
                  <p className="text-xs text-red-500 mt-1">
                    {(errors as Record<string, { message?: string }>).supportTopic?.message}
                  </p>
                )}
              </section>

              {/* Subject */}
              <section>
                <SectionLabel num={4} label="Subject" />
                <input
                  type="text"
                  {...register("subject" as never)}
                  className={inputCls}
                  placeholder="Brief summary of your issue"
                />
                {(errors as Record<string, { message?: string }>).subject && (
                  <p className="text-xs text-red-500 mt-1">{(errors as Record<string, { message?: string }>).subject?.message}</p>
                )}
              </section>

              {/* Description */}
              <section>
                <SectionLabel num={5} label="Description" />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-[#2563EB] dark:focus-within:ring-[#3B82F6] focus-within:border-transparent transition-all bg-zinc-50 dark:bg-zinc-800/60">
                      <CKEditorWrapper
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Please describe your issue in as much detail as possible..."
                      />
                    </div>
                  )}
                />
                {errors.description?.message && <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>}
              </section>
            </div>
          )}

          {issueType && (
            <div className="fade-up pt-2">
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-6" />
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs leading-relaxed">
                  By submitting you confirm this information is accurate. False claims may result in account action.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="shrink-0 px-7 py-3 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2.5 shadow-lg shadow-blue-600/25"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit request
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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