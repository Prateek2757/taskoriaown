// components/tasks/TaskCard.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  ChevronDown,
  MessageSquare,
  User,
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
          label: "Open For Quoting",
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
      <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200/60 bg-gradient-to-br from-white to-slate-50/30">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {task.title}
              </h3>
              <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            </div>
           
               
               <TaskStatusSelector value={currentStatus} onChange={(value)=> onStatusChange(value)} />
            
          </div>

          {task.answers && task.answers.length > 0 && (
            <div className="mb-4 p-4 rounded-lg bg-blue-50/50 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-semibold text-blue-900">
                    Task Requirements
                  </h4>
                </div>
                {/* {task.answers.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-auto left-0 py-1 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setanswerssExpanded(!answerssExpanded);
                    }}
                  >
                    {answerssExpanded ? "Show less" : `+${task.answers.length - 2} more`}
                  </Button>
                )} */}
              </div>
              <div className="space-y-2">
                {task.answers.slice(0, answerssExpanded ? undefined : 2).map((qa, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="text-slate-700 font-medium mb-1">
                      Q: {qa.question}
                    </p>
                    <p className="text-slate-600 pl-4 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>{qa.answer}</span>
                    </p>
                  
                  </div>
                  
                ))}
                  {task.answers.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-auto left-0 py-1 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setanswerssExpanded(!answerssExpanded);
                    }}
                  >
                    {answerssExpanded ? "Show less" : `+${task.answers.length - 2} more`}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            {task.estimated_budget > 0 && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold text-emerald-700">
                  ${task.estimated_budget.toLocaleString()}
                </span>
                {task.budget_min && task.budget_max && (
                  <span className="text-xs text-slate-500">
                    (${task.budget_min.toLocaleString()} - $
                    {task.budget_max.toLocaleString()})
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(task.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">
                {responses.length} {responses.length === 1 ? "Response" : "Responses"}
              </span>
            </div>
          </div>

          {/* Responses Toggle */}
          <Button
            variant="outline"
            className="w-full justify-between hover:bg-blue-50 transition-colors border-slate-200"
            onClick={onToggle}
          >
            <span className="font-medium">
              {isExpanded ? "Hide" : "View"} Professional Responses
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-300",
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
                <div className="mt-4 space-y-3">
                  {isLoading ? (
                    <div className="text-center py-8 text-slate-500">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
                      Loading responses...
                    </div>
                  ) : responses.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="font-medium">No responses yet</p>
                      <p className="text-sm">
                        Check back soon for professional quotes
                      </p>
                    </div>
                  ) : (
                    responses.map((response, idx) => (
                      <motion.div
                        key={response.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 shrink-0">
                                {response.profile_image ? (
                                  <Image
                                    src={response.profile_image}
                                    alt={response.display_name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                                    {response.display_name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 mb-1">
                                  {response.display_name}
                                </h4>
                                <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                                  <Briefcase className="w-3.5 h-3.5" />
                                  {response.profile_title}
                                </p>
                                <p className="text-sm text-slate-700 mb-3 line-clamp-2">
                                  {response.title}
                                </p>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={() => onMessageClick(response.id)}
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Send Message
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}