import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  DollarSign,
  MapPin,
  User,
  MessageSquare,
  Clock,
  Tag,
  Phone,
  Mail,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";

interface TaskAnswer {
  question_id: number;
  question: string;
  answer: string;
  question_type: string;
}

interface TaskDetails {
  task_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  estimated_budget: number;
  preferred_date_end: string | null;
  category_id: number;
  category_name: string;
  category_icon?: string | null;
  customer_id: number;

  customer_email?: string;
  customer_profile_picture?: string | null;
  customer_display_name: string | null;
  customer_phone: string | null;
  customer_city?: string | null;
  customer_state?: string | null;
  total_responses: number;
  task_answers: TaskAnswer[];
}

interface TaskDetailsPanelProps {
  taskId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskDetailsPanel({
  taskId,
  isOpen,
  onClose,
}: TaskDetailsPanelProps) {
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    details: boolean;
    customer: boolean;
    answers: boolean;
  }>({
    details: true,
    customer: false,
    answers: true,
  });

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `/api/messages/task-details-message/${taskId}`
      );
      const data = await res.data;

      if (!res.status) {
        throw new Error(data.error || "Failed to fetch task details");
      }

      setTask(data.task);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="
              fixed lg:relative
              right-0  top-0 bottom-0
              w-full sm:w-96 lg:w-80 xl:w-96
              bg-white dark:bg-[#0f1015]
              border-l border-gray-200 dark:border-[#1d1f27]
              shadow-2xl lg:shadow-none
             z-50 lg:z-0
              overflow-y-auto
              flex flex-col
            "
          >
            <div className="sticky top-0 bg-white dark:bg-[#0f1015] border-b border-gray-200 dark:border-[#1d1f27] p-3 flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Task Details
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Loading task details...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                    <button
                      onClick={fetchTaskDetails}
                      className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : task ? (
                <>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                        {task.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status?.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>{task.category_name}</span>
                      </div>

                      {/* <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span>Budget: ${task.estimated_budget}</span>
                      </div> */}

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{task.total_responses} responses</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span>
                          Posted {formatRelativeTime(task.created_at)}
                        </span>
                      </div>

                      {task.preferred_date_end && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Calendar className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span>
                            Deadline: {formatDate(task.preferred_date_end)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => toggleSection("details")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                        Description
                      </h5>
                      {expandedSections.details ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedSections.details && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {task.description}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div> */}

                  {/* Customer Information Section */}
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => toggleSection("customer")}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                        Customer Information
                      </h5>
                      {expandedSections.customer ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedSections.customer && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3">
                            <div className="flex items-center gap-3">
                              {task.customer_profile_picture ? (
                                <img
                                  src={task.customer_profile_picture}
                                  alt={`${task.customer_display_name}`}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {task.customer_display_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Customer
                                </p>
                              </div>
                            </div>

                            {task.customer_email && (
                              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{task.customer_email}</span>
                              </div>
                            )}

                            {task.customer_phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{task.customer_phone}</span>
                              </div>
                            )}

                            {(task.customer_city || task.customer_state) && (
                              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>
                                  {[task.customer_city, task.customer_state]
                                    .filter(Boolean)
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {task.task_answers && task.task_answers.length > 0 && (
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => toggleSection("answers")}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                          Task Details ({task.task_answers.length})
                        </h5>
                        {expandedSections.answers ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedSections.answers && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3">
                              {task.task_answers.map((answer, index) => (
                                <div
                                  key={answer.question_id || index}
                                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                                >
                                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {answer.question}
                                  </p>
                                  <p className="text-sm text-gray-900 dark:text-gray-100">
                                    {answer.answer}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
