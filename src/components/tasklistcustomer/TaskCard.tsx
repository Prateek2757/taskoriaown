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
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { TaskStatusSelector } from "./TaskStatusSelector";

type LeadAnswer = {
  answers_id?: string | number;
  question: string;
  answer: string;
};

type Response = {
  id: number;
  display_name: string;
  profile_title: string;
  title: string;
  profile_image?: string;
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
  onMessageClick: (responseId: number) => void;
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
}: TaskCardProps) {
  const [answerssExpanded, setanswerssExpanded] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Open":
        return {
          color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
          icon: "●",
          label: "Open Quoting",
        };
      case "In Progress":
        return {
          color: "bg-amber-500/10 text-amber-700 border-amber-200",
          icon: "◐",
          label: "In Progress",
        };
      case "Closed":
        return {
          color: "bg-slate-500/10 text-slate-700 border-slate-200",
          icon: "○",
          label: "Closed",
        };
      default:
        return {
          color: "bg-gray-500/10 text-gray-700 border-gray-200",
          icon: "○",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(currentStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-5">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {task.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                {task.description}
              </p>
            </div>

            <TaskStatusSelector
              value={currentStatus}
              onChange={(value) => onStatusChange(value)}
            />
          </div>

          {task.answers && task.answers.length > 0 && (
            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/40">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    Task Requirements
                  </h4>
                </div>
              </div>

              <div className="space-y-3">
                {task.answers
                  .slice(0, answerssExpanded ? undefined : 2)
                  .map((qa, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        Q: {qa.question}
                      </p>
                      <p className="mt-1 flex items-start gap-2 pl-3 text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{qa.answer}</span>
                      </p>
                    </div>
                  ))}

                {task.answers.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40"
                    onClick={(e) => {
                      e.stopPropagation();
                      setanswerssExpanded(!answerssExpanded);
                    }}
                  >
                    {answerssExpanded
                      ? "Show less"
                      : `+${task.answers.length - 2} more`}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center gap-4 text-sm">
            {task.estimated_budget > 0 && (
              <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                ${task.estimated_budget.toLocaleString()}
                {task.budget_min && task.budget_max && (
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-500">
                    (${task.budget_min.toLocaleString()} – $
                    {task.budget_max.toLocaleString()})
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              {new Date(task.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">
                {task.response_count}{" "}
                {responses.length === 1 ? "Response" : "Responses"}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onToggle}
            className="w-full justify-between rounded-xl border-slate-200 hover:bg-blue-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <span className="font-medium">
              {isExpanded ? "Hide" : "View"} Professional Responses
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </Button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4">
                  {responses.length === 0
                    ? "No Responses Yet"
                    : responses.map((response, idx) => (
                        <motion.div
                          key={response.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.06 }}
                        >
                          <Card className="rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                                  {response.profile_image ? (
                                    <Image
                                      src={response.profile_image}
                                      alt={response.display_name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center font-semibold text-white">
                                      {response.display_name.charAt(0)}
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                    {response.display_name}
                                  </h4>
                                  <p className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    {response.profile_title}
                                  </p>
                                  <p className="mb-3 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                                    {response.title}
                                  </p>

                                  <Button
                                    size="sm"
                                    className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    onClick={() => onMessageClick(response.id)}
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Message
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
