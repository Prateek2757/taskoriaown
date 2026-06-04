"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MessageSquare,
  Briefcase,
  HelpCircle,
  Users,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskStatusSelector } from "./TaskStatusSelector";
import { TaskResponseCard } from "./TaskResponseCard";
import Image from "next/image";

type LeadAnswer = {
  answers_id?: string | number;
  question: string;
  answer: string;
};

type Response = {
  id: number;
  response_id: string | number;
  message_id?: string | number;
  public_id: string;
  company_slug?: string;
  display_name: string;
  profile_title: string;
  title: string;
  profile_image_url?: string;
  rating?: number;
  review_count?: number;
  completed_jobs?: number;
  response_time?: string;
  is_verified?: boolean;
  is_featured?: boolean;
  proposal?: string;
  bid_amount?: number;
};

type Task = {
  task_id: number;
  title: string;
  description: string;
  service_image?: string;
  status: string;
  created_at: string;
  estimated_budget: number;
  answers?: LeadAnswer[];
  budget_min?: number | null;
  budget_max?: number | null;
  queries?: string;
  response_count?: number;
};

interface TaskCardProps {
  task: Task;
  responses: Response[];
  isExpanded: boolean;
  isLoading: boolean;
  currentStatus: string;
  onToggle: () => void;
  onStatusChange: (status: string) => void;
  onMessageClick: (responseId: string | number) => void;
  onViewProfile?: (responseId: string) => void;
}

export function TaskCard({
  task,
  responses,
  isExpanded,
  isLoading,
  currentStatus,
  onToggle,
  onStatusChange,
  onMessageClick,
  onViewProfile,
}: TaskCardProps) {
  const [answersExpanded, setAnswersExpanded] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Open":
        return {
          color:
            "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900",
          dot: "bg-emerald-500",
          label: "Open Quoting",
        };
      case "In Progress":
        return {
          color:
            "bg-amber-500/10 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900",
          dot: "bg-amber-500",
          label: "In Progress",
        };
      case "Closed":
        return {
          color:
            "bg-red-500/10 text-red-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-700",
          dot: "bg-red-500",
          label: "Closed",
        };
      case "Urgent":
        return {
          color:
            "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-900",
          dot: "bg-red-600",
          label: "Urgent",
        };
      default:
        return {
          color: "bg-gray-500/10 text-gray-700 border-gray-200",
          dot: "bg-gray-400",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(currentStatus);
  const responseCount = task.response_count ?? responses.length ?? 0;

  const imageSrc =
    task.service_image ||
    `/images/services/${task.title
      .toLowerCase()
      .replace(/&/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}.svg`;

  const formatAnswerValue = (value?: string) => {
    if (!value) return "Not answered yet";
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
    if (isoDateRegex.test(value)) return value.split("T")[0];
    return value;
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <div className="grid gap-6 p-4 lg:grid-cols-[156px_minmax(0,1fr)_260px]">
        <div className="relative mx-auto h-32 w-32 self-center justify-self-center overflow-hidden rounded-2xl bg-slate-100 sm:h-66 sm:w-42">
          <Image
            src={imageSrc}
            alt={task.title}
            fill
            sizes="144px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                  statusConfig.color
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", statusConfig.dot)}
                />
                {statusConfig.label}
              </span>
            </div>

            <h3 className="text-xl font-bold leading-snug text-slate-950 dark:text-slate-50">
              {task.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {task.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            {task.estimated_budget > 0 && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-slate-950 dark:text-slate-100">
                  ${task.estimated_budget.toLocaleString()}
                </span>
                <span>Budget</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>
                {new Date(task.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span>
                <strong className="font-semibold text-slate-950 dark:text-slate-100">
                  {responseCount}
                </strong>{" "}
                {responseCount === 1 ? "Response" : "Responses"}
              </span>
            </div>
          </div>

          {task.answers && task.answers.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                <HelpCircle className="h-3.5 w-3.5" />
                Task Requirements
                {!answersExpanded && (
                  <span className="font-semibold normal-case text-slate-400">
                    Preview
                  </span>
                )}
              </div>

              <ul className="space-y-3">
                {task.answers
                  .slice(0, answersExpanded ? undefined : 2)
                  .map((qa, idx) => {
                    const key =
                      qa.answers_id != null
                        ? String(qa.answers_id)
                        : `qa-${idx}`;
                    return (
                      <li
                        key={key}
                        className="grid gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm dark:border-slate-800 dark:bg-slate-950"
                      >
                        <p className="font-semibold leading-5 text-slate-700 dark:text-slate-300">
                          {qa.question}
                        </p>
                        <p className="leading-5 italic text-slate-900 dark:text-slate-100">
                          {formatAnswerValue(qa.answer)}
                        </p>
                      </li>
                    );
                  })}

                {task.answers.length > 2 && (
                  <li>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAnswersExpanded(!answersExpanded);
                      }}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {answersExpanded
                        ? "Show less"
                        : `+ ${task.answers.length - 2} more`}
                    </button>
                  </li>
                )}
              </ul>

              {answersExpanded && task.queries && (
                <p className="mt-3 border-t border-slate-200 pt-3 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  {task.queries}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-slate-200 lg:border-l lg:pl-7 dark:border-slate-800">
          <Button
            onClick={onToggle}
            className="h-11 rounded-xl bg-blue-600 font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700"
          >
            <MessageSquare className="h-4 w-4" />
            {isExpanded ? "Hide Responses" : "View Responses"}
            <span className="ml-auto rounded-md bg-white/15 px-2 py-0.5 text-xs">
              {responseCount}
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={onToggle}
            className="h-11 rounded-xl border-slate-200 font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200"
          >
            View Details
            <ExternalLink className="ml-auto h-4 w-4" />
          </Button>

          <div className="pt-1 rounde">
            <TaskStatusSelector
              value={currentStatus}
              onChange={(value) => onStatusChange(value)}
            />
          </div>
        </div>
      </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Professional Responses
                  </h4>
                  {responses.length > 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {responses.length}{" "}
                      {responses.length === 1 ? "reply" : "replies"}
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">Loading responses…</span>
                  </div>
                ) : responses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      No Responses Yet
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
                      Professionals will respond to your task here once they
                      submit their proposals.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {responses.map((response, idx) => (
                      <TaskResponseCard
                        key={`${response.response_id}`}
                        response={response}
                        index={idx}
                        onMessageClick={onMessageClick}
                        onViewProfile={onViewProfile}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </article>
  );
}
