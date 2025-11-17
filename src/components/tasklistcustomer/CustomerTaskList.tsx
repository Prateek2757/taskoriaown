"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Calendar, DollarSign, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Task {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  budget_min?: number | null;
  budget_max?: number | null;
}

export default function TasksList({ tasks }: { tasks?: Task[] }) {
  const router = useRouter();

  const [openTaskId, setOpenTaskId] = useState<number | null>(null);

  const [responseCache, setResponseCache] = useState<Record<number, any[]>>({});
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);

  if (!tasks?.length)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium">No tasks found</p>
        <p className="text-gray-400 text-sm mt-1">
          Create your first task to get started
        </p>
      </div>
    );

  const updateStatus = async (taskId: number, status: string) => {
    try {
      const res = await axios.put("/api/tasks/updateTaskStatus", {
        taskId,
        status,
      });
      const data = await res.data;

      if (data.success) {
        toast.success("Status Updated Successfully");
      } else {
        console.error(data.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error(error.message || "Something went wrong");
    }
  };

  const loadResponses = async (taskId: number) => {
    if (responseCache[taskId]) return;

    setLoadingTaskId(taskId);

    const res = await fetch(`/api/tasks/taskResponses/${taskId}`);
    const json = await res.json();

    setResponseCache((prev) => ({
      ...prev,
      [taskId]: json.responses || [],
    }));

    setLoadingTaskId(null);
  };

  const toggleTask = (taskId: number) => {
    const isOpen = openTaskId === taskId;

    if (!isOpen) loadResponses(taskId);

    setOpenTaskId(isOpen ? null : taskId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "In Progress":
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "Closed":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <motion.h2
          className="text-4xl font-bold bg-gradient-to-r text-center from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Posted Tasks
        </motion.h2>
        <p className="text-gray-500 text-center mt-2">
          Manage and track all your project postings
        </p>
      </div>

      <div className="space-y-5">
        {tasks.map((task, idx) => {
          const isOpen = openTaskId === task.task_id;
          const [localStatus, setLocalStatus] = useState(task.status);
          return (
            <motion.div
              key={task.task_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <Card className="group rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900">
                <CardContent className="p-0">
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {task.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Status:
                            </span>
                            <Select
                              defaultValue={localStatus}
                              onValueChange={(value) =>{
                                updateStatus(task.task_id, value);
                                setLocalStatus(value);
                              }}
                            >
                              <SelectTrigger
                                className={`h-9 px-3 rounded-lg border ${getStatusColor(
                                  localStatus
                                )} font-medium text-sm transition-all hover:scale-105`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Open">
                                  <span className="flex items-center gap-2">
                                    <span className="text-emerald-600">●</span>{" "}
                                    Open For Quoting
                                  </span>
                                </SelectItem>
                                <SelectItem value="In Progress">
                                  <span className="flex items-center gap-2">
                                    <span className="text-amber-600">◐</span> In
                                    Progress
                                  </span>
                                </SelectItem>
                                <SelectItem value="Closed">
                                  <span className="flex items-center gap-2">
                                    <span className="text-red-600">○</span>{" "}
                                    Closed
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {task.budget_min && task.budget_max && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                ${task.budget_min.toLocaleString()} - $
                                {task.budget_max.toLocaleString()}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(task.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Button
                          variant="outline"
                          className="rounded-xl px-6 py-5 flex items-center gap-2 font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400"
                          onClick={() => toggleTask(task.task_id)}
                        >
                          <MessageSquare className="w-4 h-4" />
                          View Responses
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50"
                      >
                        <div className="p-6 lg:p-8">
                          {loadingTaskId === task.task_id ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              <span className="ml-3 text-gray-600">
                                Loading responses...
                              </span>
                            </div>
                          ) : !responseCache[task.task_id]?.length ? (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-gray-400" />
                              </div>
                              <p className="text-gray-500">No responses yet</p>
                            </div>
                          ) : (
                            <div className="flex gap-5 overflow-x-auto pb-3">
                              {responseCache[task.task_id].map((r: any) => (
                                <Card
                                  key={r.response_id}
                                  className="min-w-[320px] p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                >
                                  <div className="flex items-center gap-3 mb-4">
                                    <img
                                      src={
                                        r.avatar_url ||
                                        "/images/default-avatar.png"
                                      }
                                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                                      alt=""
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {r.display_name}
                                      </h4>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {r.profile_title}
                                      </p>
                                    </div>
                                  </div>

                                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-5">
                                    {r.title}
                                  </p>

                                  <div className="flex gap-2">
                                    <Button
                                      className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700"
                                      onClick={() =>
                                        router.push(`/messages/${r.id}`)
                                      }
                                    >
                                      <MessageSquare
                                        size={16}
                                        className="mr-1.5"
                                      />{" "}
                                      Message
                                    </Button>

                                    <Button
                                      variant="outline"
                                      className="rounded-lg px-3"
                                      onClick={() =>
                                        router.push(`/message/${r.id}`)
                                      }
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                      </svg>
                                    </Button>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
