import { ProviderResponse } from "@/app/(public)/(pages)/provider-responses/page";
import {
  User,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  CheckCircle2,
  ShieldQuestion,
  ForwardIcon,
  PhoneCall,
  Mail
} from "lucide-react";

interface ResponseCardProps {
  response: ProviderResponse;
  isExpanded: boolean;
  onToggleExpand: (taskId: number) => void;
}

const normalizePhone = (phone?: string) =>
  phone ? phone.replace(/\D/g, "") : null;

const whatsappLink = (phone?: string) =>
  phone ? `https://wa.me/${normalizePhone(phone)}` : null;

const smsLink = (phone?: string) =>
  phone ? `sms:${normalizePhone(phone)}` : null;

const emailLink = (email?: string) =>
  email ? `mailto:${email}` : null;


export default function ResponseCard({
  response,
  isExpanded,
  onToggleExpand
}: ResponseCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return {
          bg: "bg-green-50 dark:bg-green-950/30",
          text: "text-green-700 dark:text-green-400",
          border: "border-green-200 dark:border-green-800",
          icon: "text-green-600 dark:text-green-400",
          gradient: "from-green-500 to-emerald-600"
        };
      case "in progress":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/30",
          text: "text-blue-700 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800",
          icon: "text-blue-600 dark:text-blue-400",
          gradient: "from-blue-500 to-blue-600"
        };
      case "completed":
        return {
          bg: "bg-purple-50 dark:bg-purple-950/30",
          text: "text-purple-700 dark:text-purple-400",
          border: "border-purple-200 dark:border-purple-800",
          icon: "text-purple-600 dark:text-purple-400",
          gradient: "from-purple-500 to-purple-600"
        };
      case "closed":
        return {
          bg: "bg-red-50 dark:bg-red-950/30",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-800",
          icon: "text-red-600 dark:text-red-400",
          gradient: "from-red-500 to-red-600"
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/30",
          text: "text-gray-700 dark:text-gray-400",
          border: "border-gray-200 dark:border-gray-700",
          icon: "text-gray-600 dark:text-gray-400",
          gradient: "from-gray-500 to-gray-600"
        };
    }
  };

  const statusConfig = getStatusConfig(response.status);

  const formatAnswerValue = (value?: string) => {
    if (!value) return "Not answered yet";

    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

    if (isoDateRegex.test(value)) {
      return value.split("T")[0];
    }

    return value;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xs hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden hover:scale-[1.01]">
      <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />

      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusConfig.gradient}`} />

      <div className="relative p-4 md:p-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-5 gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {response.title}
              </h3>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} uppercase tracking-wide`}>
                {response.status?.replace("_", " ")}
              </span>
              <div className=" flex  z-10  p-3  gap-4">
                {response.customer_phone && (
                  <a
                    href={smsLink(response.customer_phone)!}
                    className="px-4 py-2 flex rounded-lg bg-green-600 text-white"
                  >
                    <MessageSquare className="h-6" />  <span className="ml-2">Sms</span>     </a>
                )}
                {response.customer_email && (
                  <a
                    href={emailLink(response.customer_email)!}
                    className="px-4 py-2 flex rounded-lg bg-blue-600 text-white"
                  >
                    <Mail className="h-6" />  <span className="ml-2"> Email</span>
                  </a>
                )}
              </div>

            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {response.description}
            </p>

          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/30 transition-colors">
            {response.customer_profile_picture ? (
              <img
                src={response.customer_profile_picture}
                alt={response.customer_name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {response.customer_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Customer</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/30 transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {response.total_responses}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Responses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/30 transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {formatRelativeTime(response.task_created_at)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Posted</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl p-4 md:p-2 mb-5 border border-blue-200 dark:border-blue-800/50 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/5 dark:bg-blue-300/10 rounded-full blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-blue-900 dark:text-blue-300 text-sm md:text-base">
                    Your Response
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatRelativeTime(response.response_created_at)}</span>
                  </div>
                  {response.credits_spent > 0 && (
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {response.credits_spent} credits
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 break-words leading-relaxed">
                {response.response_message}
              </p>
            </div>
          </div>
        </div>

        {response.task_answers && response.task_answers.length > 0 && (
          <button
            onClick={() => onToggleExpand(response.task_id)}
            className="group/btn flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all text-sm md:text-base"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-5 h-5 group-hover/btn:translate-y-[-2px] transition-transform" />
                Hide Task Details
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5 group-hover/btn:translate-y-[2px] transition-transform" />
                View Task Details ({response.task_answers.length} answer{response.task_answers.length !== 1 ? 's' : ''})
              </>
            )}
          </button>
        )}
      </div>

      {isExpanded && response.task_answers && (
        <div className="px-5  pb-5 md:pb-7 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/30 rounded-xl p-4 md:p-5 space-y-3 md:space-y-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg">
                Task Details
              </h4>
            </div>
            <div className="grid gap-2">
              {response.task_answers.map((answer, index) => (
                <div
                  key={answer.question_id || index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <p className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-start pl-4 gap-2">
                    {/* <span className="text-blue-600 dark:text-blue-400">Q{index + 1}.</span> */}
                    <ShieldQuestion />
                    <span className="flex-1">{answer.question}</span>
                  </p>
                  <p className="text-sm md:text-base text-gray-900 flex dark:text-white break-words pl-4 leading-relaxed">
                    <ForwardIcon />
                    <span className="ml-3">
                      {formatAnswerValue(answer.answer)}
                    </span>

                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}