"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Award,
  MessageSquare,
  Bookmark,
  Quote,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { CreditPurchaseModal } from "../payments/CreditTopup";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { useConversation } from "@/hooks/useConversation";
import LocationMap from "../map/map";

interface LeadAnswer {
  question_id?: string | number;
  question: string;
  answer: string;
}

interface Lead {
  user_id?: string | number;
  task_id?: number;
  title: string;
  longitude?: number;
  latitude?: number;
  category_name: string;
  customer_name?: string;
  customer_email?: string;
  location_name: string;
  postcode?:number;
  phone: number;
  created_at: string;
  description: string;
  status?: string;
  budget_min?: number;
  budget_max?: number;
  is_remote_allowed?: boolean;
  answers?: LeadAnswer[];
  responses_count?: number;
  queries?:string;
}

interface LeadDetailsProps {
  lead: Lead;
  requiredCredits: number;
  taskId?: number | string;
  userId?: string | number;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({
  lead,
  requiredCredits,
  taskId,
  userId,
}) => {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [leadStatus, setLeadStatus] = useState({ count: 0, purchased: false });
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const maxResponses = 5;

  const participantIds = useMemo(
    () => (userId ? [String(userId)] : []),
    [userId]
  );

  const fetchResponses = useCallback(async () => {
    if (!taskId) return;
    setLoadingResponses(true);
    try {
      const { data } = await axios.get(`/api/admin/task-responses/${taskId}`);
      setLeadStatus((prev) =>
        prev.purchased === data.purchased && prev.count === data.count
          ? prev
          : data
      );
    } catch (err) {
      console.error("Error fetching responses:", err);
      toast.error("Failed to fetch lead status");
    } finally {
      setLoadingResponses(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const shouldFetchConversation = leadStatus.purchased && !!taskId && !!userId;

  const {
    conversationId,
    loading: convoLoading,
    error: convoError,
    refetch: refetchConversation,
  } = useConversation(
    shouldFetchConversation ? participantIds : [],
    "Private Chat",
    shouldFetchConversation ? taskId : null
  );

  const handleGoToChat = useCallback(async () => {
    if (isNavigating) return;

    if (!conversationId && !convoLoading) {
      setIsNavigating(true);
      toast.info("Preparing chat...");

      try {
        const newConvoId = await refetchConversation();

        if (newConvoId) {
          window.location.href = `/messages/${newConvoId}`;
        } else {
          toast.error("Failed to create conversation. Please try again.");
          setIsNavigating(false);
        }
      } catch (err) {
        console.error("Error creating conversation:", err);
        toast.error("Failed to create conversation. Please try again.");
        setIsNavigating(false);
      }
      return;
    }

    if (convoError) {
      toast.error(convoError);
      return;
    }

    if (conversationId) {
      setIsNavigating(true);
      window.location.href = `/messages/${conversationId}`;
    }
  }, [
    conversationId,
    convoLoading,
    convoError,
    refetchConversation,
    isNavigating,
  ]);

  const handlePurchaseSuccess = useCallback(async () => {
    toast.success("Purchase successful! Preparing your chat...");

    await fetchResponses();

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newConvoId = await refetchConversation();

    if (newConvoId) {
      toast.success("Chat is ready!");
    } else {
      toast.info("Click 'Chat' button to start your conversation");
    }
  }, [fetchResponses, refetchConversation]);

  const formatTimeAgo = useCallback((timestamp: string): string => {
    const now = new Date();
    const created = new Date(timestamp);
    const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  }, []);

  const getInitials = useCallback(
    (name: string) =>
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    []
  );

  const maskPhone = useCallback((phone: number | string = "") => {
    const s = String(phone);
    return s.length > 5
      ? `${s.slice(0, 3)}${"*".repeat(s.length - 5)}${s.slice(-2)}`
      : s;
  }, []);

  const maskEmail = useCallback((email?: string) => {
    if (!email) return "k******************@g***.com";
    const [local, domain] = email.split("@");
    const maskedLocal = local[0] + "*".repeat(Math.max(local.length - 1, 3));
    const [name, ext] = domain.split(".");
    const maskedDomain = name[0] + "*".repeat(Math.max(name.length - 1, 2));
    return `${maskedLocal}@${maskedDomain}.${ext}`;
  }, []);

  const responseRate = leadStatus.count ?? 0;
  const customerFirstName = (lead.customer_name ?? "Customer").split(" ")[0];

  const isChatButtonDisabled = !leadStatus.purchased || isNavigating;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] px-6 py-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                {getInitials(lead.customer_name || "N/A")}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {lead.customer_name}
                </h1>
                <div className="flex items-center gap-2 text-blue-100">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{lead.location_name} {lead.postcode}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 dark:bg-gray-800 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30 dark:border-gray-700">
              {lead.category_name}
            </span>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm border transition-all duration-300 ${
                lead.status === "Open"
                  ? "bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-200 dark:border-cyan-700 hover:dark:bg-cyan-800"
                  : lead.status === "Pending"
                  ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700 hover:dark:bg-orange-800"
                  : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:dark:bg-gray-700"
              }`}
            >
              {lead.status}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 dark:bg-gray-800 backdrop-blur-sm rounded-full text-sm">
              <Clock className="w-4 h-4" />
              {formatTimeAgo(lead.created_at)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-600" /> Verified Contact
              Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      Phone Number
                    </div>
                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                      {leadStatus.purchased
                        ? lead.phone
                        : maskPhone(lead.phone)}
                    </div>
                  </div>
                </div>
                {leadStatus.purchased && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 dark:bg-cyan-700 text-cyan-700 dark:text-cyan-100 text-xs font-semibold rounded-md">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      Email Address
                    </div>
                    <div className="flex items-center gap-2 font-mono text-sm text-gray-900 dark:text-gray-100">
                      {leadStatus.purchased ? (
                        <>
                          <span>{lead.customer_email}</span>
                          <a
                            href={`mailto:${lead.customer_email}`}
                            className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            Send Email
                          </a>
                        </>
                      ) : (
                        maskEmail(lead.customer_email)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Response Progress
              </h3>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                {responseRate}/{maxResponses}
              </span>
            </div>
            <div className="relative w-full h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(responseRate / maxResponses) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              <strong>{maxResponses - responseRate} spots remaining</strong> •
              Be one of the first to respond
            </p>
          </div>

          {!leadStatus.purchased && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-xl border border-orange-200 dark:border-orange-700 p-5 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {requiredCredits}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      credits required
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    🏆 Protected by Get Hired Guarantee
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Full credit refund if you're not hired during your starter
                    pack period
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {leadStatus.purchased ? (
              <button
                onClick={handleGoToChat}
                disabled={isChatButtonDisabled}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating || convoLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isNavigating ? "Opening Chat..." : "Preparing Chat..."}
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Chat with {customerFirstName}
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setShowCreditModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Contact {customerFirstName}
              </button>
            )}

            <CreditPurchaseModal
              open={showCreditModal}
              onOpenChange={setShowCreditModal}
              requiredCredits={requiredCredits}
              contactName={lead.customer_name}
              taskId={taskId}
              userId={userId}
              professionalId={session?.user?.id}
              onPurchaseSuccess={handlePurchaseSuccess}
            />

            {/* <button className="px-6 py-3.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2">
              <ThumbsDown className="w-5 h-5" />
              Not Interested
            </button>
            <button className="px-4 py-3.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <Share2 className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Project Details
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {lead.description}
        </p>

        {lead.answers && lead.answers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              Lead Questions & Answers
            </h3>
            <div className="space-y-4">
              {lead.answers.map((ans, idx) => (
                <div
                  key={ans.question_id || idx}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare
                      size={16}
                      className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {ans.question || "—"}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 ml-6">
                    <Quote
                      size={16}
                      className="text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      {ans.answer?.trim() ? ans.answer : "Not answered yet"}
                    </p>
                  </div>
                </div>
              ))}
              {lead.queries?.trim() && (
  <div className="mt-6">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
      Additional Queries
    </h3>

    <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <HelpCircle
          size={18}
          className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
        />
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          {lead.queries}
        </p>
      </div>
    </div>
  </div>
)}
            </div>
          </div>
        )}
        <LocationMap
          name={lead.location_name || lead.customer_name as string} 
          latitude={lead.latitude as number} 
          longitude={lead.longitude as number}
        />
      </div>
    </div>
  );
};

export default LeadDetails;
