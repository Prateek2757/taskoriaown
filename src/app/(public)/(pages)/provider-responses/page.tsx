"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  AlertCircle, 
  Loader2, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Filter,
  SlidersHorizontal
} from "lucide-react";
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
  status: "open" | "In Progress" | "completed" | "closed";
  task_created_at: string;
  estimated_budget: number;
  category_id: number;
  category_name: string;
  customer_id: number;
  customer_email: string;
  customer_phone: string;
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

const ITEMS_PER_PAGE = 10;

export default function ProviderResponsesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [responses, setResponses] = useState<ProviderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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
   
  useEffect(() => {
    if(currentPage !== 1){
      window.scrollTo({
        top: 320,
        behavior: "smooth",
      });
    }
  }, [currentPage]);
    

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/provider-responses");
      const data = await res.data;

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
        response.customer_name.toLowerCase().includes(query) 
      );
    }

    return true;
  });

  const totalPages = Math.ceil(filteredResponses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedResponses = filteredResponses.slice(startIndex, endIndex);

  const stats: ResponsesStats = {
    total: responses.length,
    open: responses.filter((r) => r.status?.toLowerCase() === "open").length,
    inProgress: responses.filter((r) => r.status?.toLowerCase() === "in progress").length,
    completed: responses.filter((r) => r.status?.toLowerCase() === "completed").length,
    totalCreditsSpent: responses.reduce((sum, r) => sum + (r.credits_spent || 0), 0),
  };

  const filterButtons = [
    { key: "all", label: "All", count: stats.total, color: "blue" },
    { key: "open", label: "Open", count: stats.open, color: "green" },
    { key: "in progress", label: "In Progress", count: stats.inProgress, color: "amber" },
    { key: "completed", label: "Completed", count: stats.completed, color: "purple" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <div className="absolute inset-0 blur-xl bg-blue-500/20 dark:bg-blue-400/20 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md text-center border border-gray-200 dark:border-gray-700">
          <div className="relative mb-6">
            <AlertCircle className="w-20 h-20 text-red-500 dark:text-red-400 mx-auto" />
            <div className="absolute inset-0 blur-2xl bg-red-500/20 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchResponses}
            className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-black dark:via-gray-900 dark:to-black py-6 md:py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 ">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg">
              <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl  font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                My Responses
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                Track and manage all your task responses in one place
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 ">
          <ResponseStats stats={stats} />
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl  border border-gray-200 dark:border-gray-700 p-4 md:p-6 mb-6 md:mb-8 transition-colors">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, category, customer name, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-12 py-3 md:py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg mb-4 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </span>
          </button>

          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
            </div>
            <div className="flex flex-wrap gap-2 ">
              {filterButtons.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterStatus(filter.key)}
                  className={`
                    px-4 md:px-5 py-2 rounded-xl font-medium transition-all duration-200 text-sm md:text-base
                    ${filterStatus === filter.key
                      ? `bg-gradient-to-r from-${filter.color}-500 to-${filter.color}-600 text-white shadow-lg shadow-${filter.color}-500/30 scale-105`
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }
                  `}
                >
                  {filter.label} <span className="ml-1.5 opacity-90">({filter.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 md:p-16 text-center transition-colors">
            <div className="relative inline-block mb-6">
              <MessageSquare className="w-20 h-20 md:w-24 md:h-24 text-gray-400 dark:text-gray-600 mx-auto" />
              <div className="absolute inset-0 blur-2xl bg-gray-400/20 dark:bg-gray-600/20" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {searchQuery
                ? "No responses found"
                : filterStatus === "all"
                  ? "No responses yet"
                  : `No ${filterStatus.replace("_", " ")} tasks`}
            </h3>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? "Try adjusting your search criteria or filters"
                : filterStatus === "all"
                  ? "Start responding to tasks to see them here"
                  : `You don't have any ${filterStatus.replace("_", " ")} tasks at the moment`}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                Showing <span className="text-gray-900 dark:text-white font-bold">{startIndex + 1}</span> to{" "}
                <span className="text-gray-900 dark:text-white font-bold">
                  {Math.min(endIndex, filteredResponses.length)}
                </span>{" "}
                of <span className="text-gray-900 dark:text-white font-bold">{filteredResponses.length}</span> responses
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            <div className="space-y-4 md:space-y-5 mb-8">
              {paginatedResponses.map((response) => (
                <ResponseCard
                  key={response.response_id}
                  response={response}
                  isExpanded={expandedTasks.has(response.task_id)}
                  onToggleExpand={toggleTaskExpansion}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> of{" "}
                    <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
                        ${currentPage === 1
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white hover:shadow-lg hover:scale-105"
                        }
                      `}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`
                              w-10 h-10 rounded-lg font-medium transition-all duration-200
                              ${currentPage === pageNumber
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg scale-110"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                              }
                            `}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200
                        ${currentPage === totalPages
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white hover:shadow-lg hover:scale-105"
                        }
                      `}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* <div className="flex items-center gap-2">
                    <label htmlFor="pageJump" className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      Go to:
                    </label>
                    <input
                      id="pageJump"
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          setCurrentPage(page);
                        }
                      }}
                      className="w-16 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all"
                    />
                  </div> */}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}