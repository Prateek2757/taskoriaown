"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronDown,
  MessageSquare,
  Briefcase,
  HelpCircle,
  CheckCircle2,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskStatusSelector } from "./TaskStatusSelector";
import { TaskResponseCard } from "./TaskResponseCard";

type LeadAnswer = {
  answers_id?: string | number;
  question: string;
  answer: string;
};

type Response = {
  id:number;
  response_id:string;
  message_id:string;
  public_id:string;
  display_name: string;
  profile_title: string;
  title: string;
  profile_image_url?: string;
  rating?: number;
  review_count?: number;
  completed_jobs?: number;
  response_time?: string;
  is_verified?: boolean;
  proposal?: string;
  bid_amount?: number;
};

type Task = {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  estimated_budget: number;
  answers?: LeadAnswer[];
  budget_min?: number | null;
  budget_max?: number | null;
  queries?:string;
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
  onMessageClick: (responseId: string) => void;
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
          color: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900",
          dot: "bg-emerald-500",
          label: "Open Quoting",
        };
      case "In Progress":
        return {
          color: "bg-amber-500/10 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900",
          dot: "bg-amber-500",
          label: "In Progress",
        };
      case "Closed":
        return {
          color: "bg-slate-500/10 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-700",
          dot: "bg-slate-400",
          label: "Closed",
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

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <CardContent className="p-0">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    statusConfig.color
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", statusConfig.dot)} />
                  {statusConfig.label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {task.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="shrink-0">
              <TaskStatusSelector
                value={currentStatus}
                onChange={(value) => onStatusChange(value)}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            {task.estimated_budget > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  ${task.estimated_budget.toLocaleString()}
                </span>
                {task.budget_min && task.budget_max && (
                  <span className="text-slate-400">
                    (${task.budget_min.toLocaleString()} – ${task.budget_max.toLocaleString()})
                  </span>
                )}
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <Briefcase className="h-3.5 w-3.5" />
                <span>Budget</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(task.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>
                <strong className="text-slate-700 dark:text-slate-300">
                  {task.response_count ?? 0}
                </strong>{" "}
                {(task.response_count ?? 0) === 1 ? "Response" : "Responses"}
              </span>
            </div>
          </div>

          {task.answers && task.answers.length > 0 && (
            <div className="mt-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                <HelpCircle className="h-3.5 w-3.5" />
                Task Requirements
              </div>
              <div className="space-y-3">
                {task.answers
                  .slice(0, answersExpanded ? undefined : 2)
                  .map((qa, idx) => {
                    const key = qa.answers_id != null ? String(qa.answers_id) : `qa-${idx}`;
                    return (
                      <div key={key} className="space-y-0.5">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Q: {qa.question}
                        </p>
                        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                          {qa.answer}
                        </p>
                      </div>
                    );
                  })}

{task.queries && (
  <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-2">
    
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
      <HelpCircle className="h-3.5 w-3.5" />
      Additional Details
    </div>

    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      {task.queries}
    </p>

  </div>
)}
              </div>
              {task.answers.length > 2 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnswersExpanded(!answersExpanded);
                  }}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {answersExpanded
                    ? "Show less"
                    : `+${task.answers.length - 2} more`}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full justify-between rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 h-9"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              {isExpanded ? "Hide" : "View"} Professional Responses
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </Button>
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
              <div className="border-t border-slate-100 dark:border-slate-800  px-5 sm:px-6 py-5 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Professional Responses
                  </h4>
                  {responses.length > 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {responses.length} {responses.length === 1 ? "reply" : "replies"}
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
                      Professionals will respond to your task here once they submit their proposals.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-3">
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
      </CardContent>
    </Card>
  );
}