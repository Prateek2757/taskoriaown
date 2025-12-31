"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Inbox, Filter, Search } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TaskStatusSelector } from "./TaskStatusSelector";
import { CloseTaskDialog } from "./CloseTaskDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LeadAnswer = {
  question_id?: string | number;
  question: string;
  answer: string;
};

type Task = {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  estimated_budget: number;
  question?: LeadAnswer[];
  budget_min?: number | null;
  budget_max?: number | null;
  response_count?: number;
};

type Response = {
  id: number;
  display_name: string;
  profile_title: string;
  title: string;
  profile_image?: string;
};

export default function TasksList({ tasks }: { tasks?: Task[] }) {
  const router = useRouter();
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const [responseCache, setResponseCache] = useState<
    Record<number, Response[]>
  >({});
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCloseTask, setPendingCloseTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [localStatuses, setLocalStatuses] = useState<Record<number, string>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (!tasks) return;
    const map: Record<number, string> = {};
    tasks.forEach((t) => {
      map[t.task_id] = t.status;
    });
    setLocalStatuses(map);
  }, [tasks]);

  const updateStatus = useCallback(
    async (
      taskId: number,
      status: string,
      closeReason?: string,
      questions?: any
    ) => {
      try {
        setSaving(true);
        const res = await axios.put("/api/tasks/updateTaskStatus", {
          taskId,
          status,
          closeReason,
          questions,
        });
        const data = res.data;
        if (data?.success) {
          toast.success(
            status === "Closed" ? "Task closed successfully" : "Status updated"
          );
        } else {
          toast.error(data?.message || "Failed to update status");
        }
      } catch (err: any) {
        toast.error(err?.message || "Network error");
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const loadResponses = useCallback(
    async (taskId: number) => {
      if (responseCache[taskId]) return;
      setLoadingTaskId(taskId);
      try {
        const res = await axios.get(`/api/tasks/taskResponses/${taskId}`);
        const json = await res.data;
        setResponseCache((prev) => ({
          ...prev,
          [taskId]: json.responses || [],
        }));
      } catch (err) {
        console.error("Failed to load responses", err);
        toast.error("Failed to load responses");
      } finally {
        setLoadingTaskId(null);
      }
    },
    [responseCache]
  );

  const toggleTask = useCallback(
    (taskId: number) => {
      const isOpen = openTaskId === taskId;
      if (!isOpen) loadResponses(taskId);
      setOpenTaskId(isOpen ? null : taskId);
    },
    [openTaskId, loadResponses]
  );
  toggleTask;
  const handleStatusChange = useCallback(
    (task: Task, newStatus: string) => {
      if (newStatus === "Closed") {
        setPendingCloseTask(task);
        setConfirmOpen(true);
      } else {
        setLocalStatuses((prev) => ({ ...prev, [task.task_id]: newStatus }));
        updateStatus(task.task_id, newStatus);
      }
    },
    [updateStatus]
  );

  const handleCloseConfirm = useCallback(
    async (questions: Record<string, string>, comments: string) => {
      if (!pendingCloseTask) return;
      setLocalStatuses((prev) => ({
        ...prev,
        [pendingCloseTask.task_id]: "Closed",
      }));
      await updateStatus(
        pendingCloseTask.task_id,
        "Closed",
        comments,
        questions
      );
      setPendingCloseTask(null);
    },
    [pendingCloseTask, updateStatus]
  );

  const handleMessageClick = useCallback(
    (responseId: number) => {
      router.push(`/messages/${responseId}`);
    },
    [router]
  );

  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isSearchingOrFiltering =
    searchQuery.trim() !== "" || statusFilter !== "all";

  const displayTasks = isSearchingOrFiltering
    ? filteredTasks
    : filteredTasks?.slice(0, visibleCount);

  const hasMoreTasks =
    !isSearchingOrFiltering &&
    filteredTasks &&
    filteredTasks.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleShowLess = () => {
    setVisibleCount(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!tasks?.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Inbox className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No tasks found</h3>
          <p className="text-slate-600">
            Create your first task to get started and connect with professionals
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push("/create-task")}
          >
            Create Your First Task
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
            <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <TaskStatusSelector
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-slate-600 dark:text-slate-400">
              Total Tasks:
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {tasks.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-600 dark:text-slate-400">Showing:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {displayTasks?.length || 0}
              {!isSearchingOrFiltering &&
                filteredTasks &&
                filteredTasks.length > visibleCount && (
                  <span className="text-slate-500 dark:text-slate-500">
                    {` of ${filteredTasks.length}`}
                  </span>
                )}
            </span>
          </div>
        </div>
      </div>

      {!displayTasks?.length ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium">No tasks match your filters</p>
          <p className="text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayTasks.map((task, idx) => (
            <motion.div
              key={task.task_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <TaskCard
                task={task}
                responses={responseCache[task.task_id] || []}
                isExpanded={openTaskId === task.task_id}
                isLoading={loadingTaskId === task.task_id}
                currentStatus={localStatuses[task.task_id] ?? task.status}
                onToggle={() => toggleTask(task.task_id)}
                onStatusChange={(status) => handleStatusChange(task, status)}
                onMessageClick={handleMessageClick}
              />
            </motion.div>
          ))}
        </div>
      )}

      {!isSearchingOrFiltering && filteredTasks && filteredTasks.length > 5 && (
        <div className="flex justify-center gap-3 mt-8">
          {hasMoreTasks && (
            <Button
              onClick={handleShowMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              size="lg"
            >
              Show More Tasks ({filteredTasks.length - visibleCount} remaining)
            </Button>
          )}
          {visibleCount > 5 && !hasMoreTasks && (
            <Button
              onClick={handleShowLess}
              variant="outline"
              className="px-8"
              size="lg"
            >
              Show Less
            </Button>
          )}
        </div>
      )}

      <CloseTaskDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setPendingCloseTask(null);
        }}
        onConfirm={handleCloseConfirm}
        taskTitle={pendingCloseTask?.title || ""}
      />
    </div>
  );
}
