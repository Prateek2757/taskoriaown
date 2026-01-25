import { ProviderResponse } from "@/app/(public)/(pages)/provider-responses/page";
import { 
    User, 
    Calendar, 
    DollarSign, 
    MessageSquare, 
    ChevronDown, 
    ChevronUp,
    Users
  } from "lucide-react";
  
  interface ResponseCardProps {
    response: ProviderResponse;
    isExpanded: boolean;
    onToggleExpand: (taskId: number) => void;
  } 

  
  export default function ResponseCard({ 
    response, 
    isExpanded, 
    onToggleExpand 
  }: ResponseCardProps) {
    const getStatusColor = (status: string) => {
      switch (status?.toLowerCase()) {
        case "open":
          return "bg-green-100 text-green-800 border-green-200";
        case "in_progress":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "completed":
          return "bg-gray-100 text-gray-800 border-gray-200";
        case "closed":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };
  
      const formatAnswerValue = (value?: string) => {
    if (!value) return "Not answered yet";

    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

    if (isoDateRegex.test(value)) {
      return value.split("T")[0]; // YYYY-MM-DD
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
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {response.title}
                </h3>
                <span
                  className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    response.status
                  )}`}
                >
                  {response.status?.replace("_", " ").toUpperCase()}
                </span>
                {/* <span className="px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  {response.category_name}
                </span> */}
              </div>
              <p className="text-sm md:text-base text-gray-600 line-clamp-2">
                {response.description}
              </p>
            </div>
          </div>
  
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 pb-4 border-b border-gray-200 text-sm">
            <div className="flex items-center gap-2">
              {response.customer_profile_picture ? (
                <img
                  src={response.customer_profile_picture}
                  alt={`${response.customer_name}`}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {response.customer_name}
                </p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
            </div>
  
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-xs md:text-sm">{response.total_responses} responses</span>
            </div>
  
            {/* <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs md:text-sm">Budget: ${response.estimated_budget}</span>
            </div> */}
  
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-xs md:text-sm">
                Posted {formatRelativeTime(response.task_created_at)}
              </span>
            </div>
          </div>
  
          <div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <p className="font-semibold text-blue-900 text-sm md:text-base">
                    Your Response
                  </p>
                  <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
                    <span className="text-blue-700">
                      {formatRelativeTime(response.response_created_at)}
                    </span>
                    {response.credits_spent > 0 && (
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {response.credits_spent} credits
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 break-words">
                  {response.response_message}
                </p>
              </div>
            </div>
          </div>
  
          {response.task_answers && response.task_answers.length > 0 && (
            <button
              onClick={() => onToggleExpand(response.task_id)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition text-sm md:text-base"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  Hide Task Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  View Task Details ({response.task_answers.length} answers)
                </>
              )}
            </button>
          )}
        </div>
  
        {isExpanded && response.task_answers && (
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-3 md:space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">
                Task Details
              </h4>
              {response.task_answers.map((answer, index) => (
                <div
                  key={answer.question_id || index}
                  className="bg-white rounded p-3 border border-gray-200"
                >
                  <p className="text-xs md:text-sm font-semibold text-gray-700 mb-1">
                    {answer.question}
                  </p>
                  <p className="text-sm md:text-base text-gray-900 break-words">
                    {formatAnswerValue(answer.answer)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }