"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Grid2X2,
  Inbox,
  MessageSquare,
  RotateCcw,
  Search,
  SlidersHorizontal,
  SortDesc,
} from "lucide-react";
import { TaskCard } from "./TaskCard";
import { CloseTaskDialog } from "./CloseTaskDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LeadAnswer = {
  question_id?: string | number;
  question: string;
  answer: string;
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
  response_count?: number;
  queries?: string;
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

export default function TasksList({
  tasks,
  onNewRequest,
}: {
  tasks?: Task[];
  onNewRequest?: () => void;
}) {
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
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [page, setPage] = useState(1);
  const pageSize = 5;

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
    (responseId: string | number) => {
      router.push(`/messages/${responseId}`);
    },
    [router]
  );

  const handleProfileClick = useCallback(
    (company_slug: string) => {
      router.push(`/providerprofile/${company_slug}`);
    },
    [router]
  );

  const serviceOptions =
    tasks
      ?.map((task) => task.title)
      .filter((title, index, all) => all.indexOf(title) === index)
      .sort((a, b) => a.localeCompare(b)) ?? [];

  const filteredTasks = (tasks ?? [])
    .filter((task) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.queries?.toLowerCase().includes(query);
    const matchesStatus =
        statusFilter === "all" ||
        (localStatuses[task.task_id] ?? task.status) === statusFilter;
      const matchesService =
        serviceFilter === "all" || task.title === serviceFilter;
      const createdAt = new Date(task.created_at).getTime();
      const now = Date.now();
      const dateWindow =
        dateFilter === "7"
          ? 7
          : dateFilter === "30"
          ? 30
          : dateFilter === "90"
          ? 90
          : null;
      const matchesDate =
        !dateWindow ||
        now - createdAt <= dateWindow * 24 * 60 * 60 * 1000;

      return matchesSearch && matchesStatus && matchesService && matchesDate;
    })
    .sort((a, b) => {
      if (sortOrder === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      if (sortOrder === "budget") {
        return (b.estimated_budget ?? 0) - (a.estimated_budget ?? 0);
      }
      if (sortOrder === "responses") {
        return (b.response_count ?? 0) - (a.response_count ?? 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const displayTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isSearchingOrFiltering =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    serviceFilter !== "all" ||
    dateFilter !== "all" ||
    sortOrder !== "newest";

  const stats = {
    total: tasks?.length ?? 0,
    inProgress:
      tasks?.filter(
        (task) => (localStatuses[task.task_id] ?? task.status) === "In Progress"
      ).length ?? 0,
    completed:
      tasks?.filter(
        (task) => (localStatuses[task.task_id] ?? task.status) === "Closed"
      ).length ?? 0,
    responses:
      tasks?.reduce((sum, task) => sum + Number(task.response_count ?? 0), 0) ??
      0,
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setServiceFilter("all");
    setDateFilter("all");
    setSortOrder("newest");
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, serviceFilter, dateFilter, sortOrder]);

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
            onClick={onNewRequest ?? (() => router.push("/create-task"))}
          >
            Create Your First Task
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Requests"
          value={stats.total}
          helper="All time requests"
          icon={<Grid2X2 className="h-6 w-6" />}
          tone="blue"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          helper="Active requests"
          icon={<Clock3 className="h-6 w-6" />}
          tone="amber"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          helper="Successfully completed"
          icon={<CheckCircle2 className="h-6 w-6" />}
          tone="emerald"
        />
        <StatCard
          label="Responses Received"
          value={stats.responses}
          helper="Across all requests"
          icon={<MessageSquare className="h-6 w-6" />}
          tone="blue"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_repeat(4,minmax(150px,210px))]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search requests by service, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          <DashboardSelect
            icon={<SlidersHorizontal className="h-4 w-4" />}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
            items={[
              { value: "all", label: "All Status" },
              { value: "Urgent", label: "Urgent" },
              { value: "Open", label: "Open Quoting" },
              { value: "In Progress", label: "In Progress" },
              { value: "Closed", label: "Closed" },
            ]}
          />

          <DashboardSelect
            icon={<Grid2X2 className="h-4 w-4" />}
            value={serviceFilter}
            onChange={setServiceFilter}
            placeholder="All Services"
            items={[
              { value: "all", label: "All Services" },
              ...serviceOptions.map((service) => ({
                value: service,
                label: service,
              })),
            ]}
          />

          <DashboardSelect
            icon={<CalendarDays className="h-4 w-4" />}
            value={dateFilter}
            onChange={setDateFilter}
            placeholder="Date Range"
            items={[
              { value: "all", label: "Date Range" },
              { value: "7", label: "Last 7 days" },
              { value: "30", label: "Last 30 days" },
              { value: "90", label: "Last 90 days" },
            ]}
          />

          <DashboardSelect
            icon={<SortDesc className="h-4 w-4" />}
            value={sortOrder}
            onChange={setSortOrder}
            placeholder="Sort: Newest"
            items={[
              { value: "newest", label: "Sort: Newest" },
              { value: "oldest", label: "Sort: Oldest" },
              { value: "budget", label: "Sort: Budget" },
              { value: "responses", label: "Sort: Responses" },
            ]}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600 dark:text-slate-400">
            Showing{" "}
            <span className="font-bold text-slate-950 dark:text-slate-100">
              {displayTasks.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-950 dark:text-slate-100">
              {filteredTasks.length}
            </span>{" "}
            requests
          </p>

          {isSearchingOrFiltering && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="w-fit rounded-xl text-slate-600 hover:text-blue-700"
            >
              Clear Filters
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {!displayTasks.length ? (
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
                onViewProfile={handleProfileClick}
              />
            </motion.div>
          ))}
        </div>
      )}

      {filteredTasks.length > pageSize && (
        <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
          <div className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl"
              disabled={currentPage === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              if (
                totalPages > 5 &&
                pageNumber !== 1 &&
                pageNumber !== totalPages &&
                Math.abs(pageNumber - currentPage) > 1
              ) {
                if (pageNumber === 2 || pageNumber === totalPages - 1) {
                  return (
                    <span key={pageNumber} className="px-2 text-slate-400">
                      ...
                    </span>
                  );
                }
                return null;
              }
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  className={cn(
                    "h-10 w-10 rounded-xl",
                    pageNumber === currentPage &&
                      "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl"
              disabled={currentPage === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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

function StatCard({
  label,
  value,
  helper,
  icon,
  tone,
}: {
  label: string;
  value: number;
  helper: string;
  icon: React.ReactNode;
  tone: "blue" | "amber" | "emerald" | "violet";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            tones[tone]
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-950 dark:text-slate-50">
            {value}
          </p>
          <p className="text-sm text-slate-500">{helper}</p>
        </div>
      </div>
    </div>
  );
}

function DashboardSelect({
  icon,
  value,
  onChange,
  placeholder,
  items,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  items: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-slate-500">{icon}</span>
          <SelectValue placeholder={placeholder} />
        </span>
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
