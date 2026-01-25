"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, MessageSquare } from "lucide-react";
import ResponseStats from "@/components/providers/provider-responses-stats";
import ResponseCard from "@/components/providers/provider-responses-task";
import axios from "axios";

export interface TaskAnswer {
  question_id: number;
  question: string;
  answer: string;
}

export interface ProviderResponse {
  response_id: number;
  response_message: string;
  credits_spent: number;
  response_created_at: string;
  task_id: number;
  title: string;
  description: string;
  status: "open" | "in_progress" | "completed" | "closed";
  task_created_at: string;
  estimated_budget: number;
  category_id: number;
  category_name: string;
  customer_id: number;
  customer_name: string;
  customer_profile_picture: string | null;
  total_responses: number;
  task_answers: TaskAnswer[];
}

export interface ResponsesStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  totalCreditsSpent: number;
}
export default function ProviderResponsesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [responses, setResponses] = useState<ProviderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchResponses();
    }
  }, [status]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/provider-responss");
      const data = await res.data;""

      if (!res.status) {
        throw new Error(data.error || "Failed to fetch responses");
      }

      setResponses(data.responses);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const filteredResponses = responses.filter((response) => {
    if (filterStatus !== "all" && response.status?.toLowerCase() !== filterStatus) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        response.title.toLowerCase().includes(query) ||
        response.category_name.toLowerCase().includes(query) ||
        `${response.customer_name}`
          .toLowerCase()
          .includes(query)
      );
    }

    return true;
  });

  const stats: ResponsesStats = {
    total: responses.length,
    open: responses.filter((r) => r.status?.toLowerCase() === "open").length,
    inProgress: responses.filter((r) => r.status?.toLowerCase() === "in_progress")
      .length,
    completed: responses.filter((r) => r.status?.toLowerCase() === "completed")
      .length,
    totalCreditsSpent: responses.reduce((sum, r) => sum + (r.credits_spent || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchResponses}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            My Responses
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Track all tasks you've responded to
          </p>
        </div>

        <div className="mb-6 md:mb-8">
          <ResponseStats stats={stats} />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by task title,  customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base ${filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus("open")}
              className={`px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base ${filterStatus === "open"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Open ({stats.open})
            </button>
            <button
              onClick={() => setFilterStatus("in_progress")}
              className={`px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base ${filterStatus === "in_progress"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base ${filterStatus === "completed"
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 md:p-12 text-center">
            <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              {searchQuery
                ? "No responses found"
                : filterStatus === "all"
                  ? "No responses yet"
                  : `No ${filterStatus.replace("_", " ")} tasks`}
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              {searchQuery
                ? "Try adjusting your search criteria"
                : filterStatus === "all"
                  ? "Start responding to tasks to see them here"
                  : `You don't have any ${filterStatus.replace("_", " ")} tasks`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-2">
              Showing {filteredResponses.length} of {responses.length} responses
            </div>
            {filteredResponses.map((response) => (
              <ResponseCard
                key={response.response_id}
                response={response}
                isExpanded={expandedTasks.has(response.task_id)}
                onToggleExpand={toggleTaskExpansion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}