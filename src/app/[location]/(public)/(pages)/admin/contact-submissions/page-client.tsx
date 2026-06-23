"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Clock, Inbox, Mail, Search } from "lucide-react";
import { Spinner } from "@/components/refund/spinner";
import axios from "axios";

type ContactStatus = "new" | "in_progress" | "resolved" | "archived";

type ContactSubmission = {
  contact_submission_id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

type ContactResponse = {
  success: boolean;
  data: ContactSubmission[];
  counts: Record<ContactStatus | "total", number>;
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

const statusOptions: { value: "" | ContactStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "archived", label: "Archived" },
];

const subjectLabels: Record<string, string> = {
  general: "General Inquiry",
  technical: "Technical Support",
  billing: "Billing & Payments",
  account: "Account Issues",
  services: "Service Questions",
  feedback: "Feedback & Suggestions",
  other: "Other",
};

function statusClass(status: ContactStatus) {
  if (status === "new") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (status === "in_progress") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  if (status === "resolved") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  return "bg-slate-500/10 text-slate-500 border-slate-500/20";
}

function fmtDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminContactSubmissionsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [counts, setCounts] = useState<ContactResponse["counts"]>({
    new: 0,
    in_progress: 0,
    resolved: 0,
    archived: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ContactStatus>("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "unauthenticated") {
      router.replace("/signin");
      return;
    }
    if (session?.user.adminrole !== "admin") {
      router.replace("/provider/dashboard");
    }
  }, [authStatus, session, router]);

  const query = useMemo(() => {
    const params = new URLSearchParams({ limit: "50" });
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter) params.set("status", statusFilter);
    return params.toString();
  }, [search, statusFilter]);

  useEffect(() => {
    if (authStatus !== "authenticated" || session?.user.adminrole !== "admin") return;

    const controller = new AbortController();
    setLoading(true);
    setError("");

    axios.get(`/api/admin/contact-submissions?${query}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = (await res.data) as ContactResponse;
        if (!data.success) {
          throw new Error("Unable to load contact messages.");
        }
        setSubmissions(data.data);
        setCounts(data.counts);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [authStatus, query, session]);

  const updateStatus = async (submission: ContactSubmission, status: ContactStatus) => {
    setUpdatingId(submission.contact_submission_id);

    try {
      const res = await axios.put("/api/admin/contact-submissions", {
          contact_submission_id: submission.contact_submission_id,
          status,
          admin_note: submission.admin_note,
      });
      const data = await res.data;

      if (!data.success) throw new Error("Unable to update status.");

      setSubmissions((current) =>
        current.map((item) =>
          item.contact_submission_id === submission.contact_submission_id
            ? data.data
            : item
        )
      );
      setCounts((current) => ({
        ...current,
        [submission.status]: Math.max(0, current[submission.status] - 1),
        [status]: current[status] + 1,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const isReady = authStatus === "authenticated" && session?.user.adminrole === "admin";

  if (!isReady) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
          <Spinner />
          <span className="text-sm">Checking permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 sm:p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage support requests submitted from the contact page.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-600">
          <Inbox className="h-4 w-4" />
          {counts.new} new
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statusOptions.slice(1).map((item) => (
          <div key={item.value} className="rounded-xl border border-white/10 bg-white/3 p-4">
            <p className="text-xl font-bold">{counts[item.value as ContactStatus]}</p>
            <p className="text-xs text-slate-500">{item.label}</p>
          </div>
        ))}
        <div className="rounded-xl border border-white/10 bg-white/3 p-4">
          <p className="text-xl font-bold">{counts.total}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, subject, or message"
            className="w-full rounded-xl border border-slate-200 bg-white px-9 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-zinc-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "" | ContactStatus)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-zinc-900"
        >
          {statusOptions.map((item) => (
            <option key={item.value || "all"} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-zinc-950">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            No contact messages found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {submissions.map((submission) => (
              <div key={submission.contact_submission_id} className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(submission.status)}`}>
                        {submission.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-400">
                        #{submission.contact_submission_id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        {fmtDate(submission.created_at)}
                      </span>
                    </div>
                    <h2 className="mt-3 text-base font-semibold">
                      {subjectLabels[submission.subject] ?? submission.subject}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>{submission.name}</span>
                      <span>&middot;</span>
                      <a
                        href={`mailto:${submission.email}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {submission.email}
                      </a>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {submission.message}
                    </p>
                  </div>

                  <div className="flex min-w-44 flex-col gap-2">
                    <select
                      value={submission.status}
                      disabled={updatingId === submission.contact_submission_id}
                      onChange={(e) =>
                        updateStatus(submission, e.target.value as ContactStatus)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-60 dark:border-slate-800 dark:bg-zinc-900"
                    >
                      {statusOptions.slice(1).map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <a
                      href={`mailto:${submission.email}?subject=Re: ${encodeURIComponent(subjectLabels[submission.subject] ?? submission.subject)}`}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Reply by email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
