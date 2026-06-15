"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Calendar,
  CalendarRange,
  CheckCircle,
  Clock,
  ClipboardList,
  FileText,
  Filter,
  Forward,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  User,
  Users,
  Wallet,
  Eye,
  LucideMessageCircleQuestion,
  PhoneCall,
} from "lucide-react";
import { AdminBreadcrumb } from "../components/Adminbreadcrumb";
import PageSkeleton from "@/components/skeleton/PageSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminTasks } from "@/hooks/Admin/useAdminTasks";

interface TaskAnswer {
  question_id?: number | string;
  question: string;
  answer: string;
}

interface AdminTask {
  task_id: number;
  public_id?: string;
  customer_id?: number;
  title: string;
  description?: string | null;
  category_name: string;
  customer_name?: string | null;
  customer_email?: string | null;
  phone?: string | null;
  location_name?: string | null;
  postcode?: string | null;
  address_line?: string | null;
  queries?: string | null;
  preferred_date_start?: string | null;
  preferred_date_end?: string | null;
  created_at: string;
  updated_at?: string | null;
  estimated_budget?: number | null;
  budget_min?: number | null;
  budget_max?: number | null;
  status: string;
  is_remote_allowed?: boolean;
  response_count?: number;
  answers?: TaskAnswer[];
}

const ITEMS_PER_PAGE = 8;

function formatDate(value?: string | null) {
  if (!value) return "Not provided";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "Not provided";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value?: number | string | null) {
  if (value === null || value === undefined || Number(value) <= 0) {
    return "No budget";
  }

  return Number(value).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
}

function formatAnswerValue(value?: string | null) {
  if (!value) return "Not answered yet";

  const date = new Date(value);
  const looksLikeDate = /^\d{4}-\d{2}-\d{2}/.test(value);

  if (looksLikeDate && !Number.isNaN(date.getTime())) {
    return formatDate(value);
  }

  return value;
}

function getStatusBadgeClass(status?: string) {
  const normalized = status?.toLowerCase() ?? "";

  if (normalized.includes("urgent")) {
    return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800";
  }

  if (normalized.includes("progress")) {
    return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800";
  }

  if (normalized.includes("complete") || normalized.includes("closed")) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800";
  }

  return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800";
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <Label className=" flex mb-2 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
          <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </div>
        {label}
      </Label>

      <div className="flex items-center justify-center text-center">
        <span className="text-md font-bold text-slate-900 dark:text-slate-100">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function AdminTasksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBudget, setFilterBudget] = useState("all");

  const { tasks, loading } = useAdminTasks();

  const typedTasks = tasks as AdminTask[];

  const categories = useMemo(
    () => ["all", ...new Set(typedTasks.map((task) => task.category_name))],
    [typedTasks]
  );

  const statuses = useMemo(
    () => ["all", ...new Set(typedTasks.map((task) => task.status))],
    [typedTasks]
  );

  const filteredTasks = typedTasks.filter((task) => {
    const q = searchTerm.toLowerCase().trim();
    const searchTarget = [
      task.title,
      task.description,
      task.category_name,
      task.customer_name,
      task.customer_email,
      task.phone,
      task.location_name,
      task.postcode,
      String(task.task_id),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const hasBudget = Number(task.estimated_budget ?? 0) > 0;
    const matchesSearch = !q || searchTarget.includes(q);
    const matchesCategory =
      filterCategory === "all" || task.category_name === filterCategory;
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesBudget =
      filterBudget === "all" ||
      (filterBudget === "with" && hasBudget) ||
      (filterBudget === "without" && !hasBudget);

    return matchesSearch && matchesCategory && matchesStatus && matchesBudget;
  });

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = useMemo(() => {
    const withBudget = typedTasks.filter(
      (task) => Number(task.estimated_budget ?? 0) > 0
    ).length;
    const totalResponses = typedTasks.reduce(
      (sum, task) => sum + Number(task.response_count ?? 0),
      0
    );

    return {
      total: typedTasks.length,
      withBudget,
      withoutBudget: typedTasks.length - withBudget,
      totalResponses,
    };
  }, [typedTasks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStatus, filterBudget]);

  const openDetailsModal = (task: AdminTask) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-3">
      <AdminBreadcrumb />

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Tasks
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Review every customer request, status, budget, response count, and
            submitted detail from one admin view.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-2">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Tasks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-2">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.withBudget}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  With Budget
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-2">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-200">
                <BadgeDollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.withoutBudget}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Missing Budget
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-2">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 text-purple-700 dark:bg-purple-950 dark:text-purple-200">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalResponses}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Provider Responses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_180px_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search title, customer, category, phone, location, or task ID..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
                className="h-10 w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm text-gray-900 dark:bg-slate-800 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="h-10 w-full rounded-lg border bg-white px-4 py-2 text-sm text-gray-900 dark:bg-slate-800 dark:text-white"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Statuses" : status}
                </option>
              ))}
            </select>

            <select
              value={filterBudget}
              onChange={(event) => setFilterBudget(event.target.value)}
              className="h-10 w-full rounded-lg border bg-white px-4 py-2 text-sm text-gray-900 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">All Budgets</option>
              <option value="with">With Budget</option>
              <option value="without">Missing Budget</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="mb-4 h-16 w-16 text-gray-300" />
            <p className="text-center text-gray-600 dark:text-gray-400">
              No tasks match your current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {paginatedTasks.map((task) => {
            const hasBudget = Number(task.estimated_budget ?? 0) > 0;

            return (
              <Card
                key={task.task_id}
                className="overflow-hidden py-0 transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
                    <div className="space-y-4 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge className={getStatusBadgeClass(task.status)}>
                              {task.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                              {task.category_name}
                            </Badge>
                            <span className="text-xs font-medium text-slate-500">
                              Task #{task.task_id}
                            </span>
                          </div>
                          <h2 className="line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                            {task.title}
                          </h2>
                          {task.description && (
                            <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-start  gap-2 text-gray-600 dark:text-gray-400">
                          <div className="min-w-0 space-y-1  ">

                            <p className="font-medium flex gap-2 text-gray-900 dark:text-white">
                            <User className="mt-0.5 h-4 w-4 shrink-0" />

                              {task.customer_name || "Unknown customer"}
                            </p>
                            <p className="truncate  flex gap-2 text-sm">
                              <Mail className="w-4 h-4"/>
                              {task.customer_email || "No email"}
                            </p>
                            {task.phone && (
                              <p className="text-sm flex gap-2">
                                <PhoneCall className="w-4 h-4"/>{task.phone}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                          <div className="min-w-0 text-sm">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {task.location_name || "No location"}
                              {task.postcode ? `, ${task.postcode}` : ""}
                            </p>
                            {task.address_line && (
                              <p className="line-clamp-1">
                                {task.address_line}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span>
                            {formatDate(task.preferred_date_start)} -{" "}
                            {formatDate(task.preferred_date_end)}
                          </span>
                        </div> */}

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>Posted {formatDateTime(task.created_at)}</span>
                        </div>
                      </div>

                      {task.queries && (
                        <div>
                          <Label className="mb-1 block text-sm font-semibold">
                            Customer Query
                          </Label>
                          <p className="line-clamp-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-slate-800 dark:text-gray-300">
                            {task.queries}
                          </p>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailsModal(task)}
                        className="mt-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Full Details
                      </Button>
                    </div>

                    <div className="border-t bg-slate-50 p-5 dark:bg-slate-900/50 lg:border-l lg:border-t-0">
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                            <Wallet className="h-4 w-4 text-blue-600" />
                            Budget
                          </Label>
                          <p
                            className={`text-xl font-bold ${
                              hasBudget
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-amber-700 dark:text-amber-300"
                            }`}
                          >
                            {formatMoney(task.estimated_budget)}
                          </p>
                          {(task.budget_min || task.budget_max) && (
                            <p className="mt-1 text-xs text-gray-500">
                              Customer range: {formatMoney(task.budget_min)} -{" "}
                              {formatMoney(task.budget_max)}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border bg-white p-3 text-center dark:bg-slate-950">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {task.response_count ?? 0}
                            </p>
                            <p className="text-xs text-gray-500">Responses</p>
                          </div>
                          <div className="rounded-lg border bg-white p-3 text-center dark:bg-slate-950">
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {task.answers?.length ?? 0}
                            </p>
                            <p className="text-xs text-gray-500">Answers</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg border bg-white p-3 text-sm dark:bg-slate-950">
                          <CheckCircle
                            className={`h-4 w-4 ${
                              task.is_remote_allowed
                                ? "text-green-600"
                                : "text-slate-400"
                            }`}
                          />
                          <span className="text-gray-600 dark:text-gray-400">
                            {task.is_remote_allowed
                              ? "Remote allowed"
                              : "On-site task"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {totalPages > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredTasks.length)}{" "}
                of {filteredTasks.length} tasks
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Eye className="h-5 w-5 text-blue-600" />
              {selectedTask?.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Full task details including customer, location, budget, dates,
              query, and question answers.
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getStatusBadgeClass(selectedTask.status)}>
                  {selectedTask.status}
                </Badge>
                <Badge variant="outline">{selectedTask.category_name}</Badge>
                <span className="text-sm font-medium text-slate-500">
                  Task #{selectedTask.task_id}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  icon={Wallet}
                  label="Estimated Budget"
                  value={formatMoney(selectedTask.estimated_budget)}
                />
                <DetailItem
                  icon={Users}
                  label="Responses"
                  value={selectedTask.response_count ?? 0}
                />
                {/* <DetailItem
                  icon={CalendarRange}
                  label="Preferred Dates"
                  value={`${formatDate(
                    selectedTask.preferred_date_start
                  )} - ${formatDate(selectedTask.preferred_date_end)}`}
                /> */}
                <DetailItem
                  icon={Clock}
                  label="Posted"
                  value={formatDateTime(selectedTask.created_at)}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    <User className="h-4 w-4 text-gray-500" />
                    Customer
                  </Label>
                  <div className="rounded-lg bg-gray-50 p-2 dark:bg-slate-800">
                    <p className="font-medium">
                      {selectedTask.customer_name || "Unknown customer"}
                    </p>
                    <div className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2 w-full min-w-0">
                        <Mail className="h-4 w-4 " />

                        <span className="truncate text-sm text-slate-900 dark:text-slate-100">
                          {" "}
                          {selectedTask.customer_email || "No email"}
                        </span>
                      </div>
                      {selectedTask.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />

                          {selectedTask.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Location
                  </Label>
                  <div className="rounded-lg bg-gray-50 p-2 dark:bg-slate-800">
                    <p className="font-medium">
                      {selectedTask.location_name || "No location"}
                      {selectedTask.postcode
                        ? `, ${selectedTask.postcode}`
                        : ""}
                    </p>
                    {selectedTask.address_line && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {selectedTask.address_line}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {selectedTask.is_remote_allowed
                        ? "Remote work is allowed"
                        : "Remote work is not marked as allowed"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedTask.description && (
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-slate-500" />
                    Description
                  </Label>
                  <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm dark:bg-slate-800">
                    {selectedTask.description}
                  </div>
                </div>
              )}

              {selectedTask.queries && (
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    Customer Query
                  </Label>
                  <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm dark:bg-slate-800">
                    {selectedTask.queries}
                  </div>
                </div>
              )}

              {selectedTask.answers && selectedTask.answers.length > 0 && (
                <div>
                  <Label className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <HelpCircle className="h-4 w-4 text-purple-500" />
                    Question Answers
                  </Label>

                  <div className="max-h-72 space-y-3 overflow-y-auto">
                    {selectedTask.answers.map((qa, index) => (
                      <div
                        key={`${qa.question_id ?? qa.question}-${index}`}
                        className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800"
                      >
                        <p className="mb-1 flex gap-2 font-medium">
                          <LucideMessageCircleQuestion className="h-5 w-5 shrink-0" />
                          <span>{qa.question}</span>
                        </p>
                        <p className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Forward className="h-5 w-5 shrink-0" />
                          <span>{formatAnswerValue(qa.answer)}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
