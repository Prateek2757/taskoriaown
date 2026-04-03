"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  MapPin,
  Clock,
  Award,
  MessageSquare,
  Bookmark,
  Loader2,
  HelpCircle,
  CheckCircle,
  Settings,
} from "lucide-react";
import { CreditPurchaseModal } from "../payments/CreditTopup";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { useConversation } from "@/hooks/useConversation";
import LocationMap from "../map/map";
import { createNotification } from "@/lib/notifications";
import { useSubscription } from "@/hooks/useSubcription";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ContactActions from "../provider-responses/ContactActions";
import { ProviderResponse } from "@/types";

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
  postcode?: number;
  image?: string;
  phone: number;
  created_at: string;
  description: string;
  status?: string;
  budget_min?: number;
  budget_max?: number;
  is_remote_allowed?: boolean;
  answers?: LeadAnswer[];
  responses_count?: number;
  queries?: string;
}

interface LeadDetailsProps {
  lead: Lead;
  requiredCredits: number;
  taskId?: number | string;
  userId?: string | number;
}

function toProviderResponse(lead: Lead, session: any): ProviderResponse {
  return {
    customer_name: lead.customer_name ?? "Customer",
    customer_phone: lead.phone ? String(lead.phone) : "",
    customer_email: lead.customer_email ?? "",
    professional_name: session?.user?.name ?? "",
    professional_contact_number: session?.user?.phone ?? "",
    professional_company_name: session?.user?.company_name ?? "",
    professional_website: session?.user?.website ?? "",
  } as ProviderResponse;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({
  lead,
  requiredCredits,
  taskId,
  userId,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const cacheKey = taskId ? `lead_status_${taskId}` : null;

  const [leadStatus, setLeadStatus] = useState<{
    count: number;
    purchased: boolean;
    hydrated: boolean;
  }>(() => {
    if (typeof window === "undefined" || !cacheKey) {
      return { count: 0, purchased: false, hydrated: false };
    }
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);

        return {
          count: parsed.count ?? 0,
          purchased: parsed.purchased ?? false,
          hydrated: false,
        };
      }
    } catch {}
    return { count: 0, purchased: false, hydrated: false };
  });

  const { loading: subscriptionLoading } = useSubscription();

  const maxResponses = 5;

  const participantIds = useMemo(
    () => (userId ? [String(userId)] : []),
    [userId]
  );

  const formatAnswerValue = (value?: string) => {
    if (!value) return "Not answered yet";
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
    if (isoDateRegex.test(value)) return value.split("T")[0];
    return value;
  };

  const fetchResponses = useCallback(async () => {
    if (!taskId || !cacheKey) return;
    try {
      const { data } = await axios.get(`/api/admin/task-responses/${taskId}`);
      setLeadStatus((prev) => {
        if (
          prev.purchased === data.purchased &&
          prev.count === data.count &&
          prev.hydrated
        ) {
          return prev;
        }
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ count: data.count, purchased: data.purchased })
        );
        return { count: data.count, purchased: data.purchased, hydrated: true };
      });
    } catch (err) {
      console.error("Error fetching responses:", err);
      setLeadStatus((prev) => ({ ...prev, hydrated: true }));
    }
  }, [taskId, cacheKey]);

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
    toast.success("Purchase successful!");
    if (cacheKey) {
      const next = { count: leadStatus.count + 1, purchased: true };
      localStorage.setItem(cacheKey, JSON.stringify(next));
      setLeadStatus({ ...next, hydrated: true });
    }
    await fetchResponses();

    await createNotification({
      userId: String(session?.user?.id),
      title: "Lead Purchased Successfully🎉!",
      type: "lead_purchased",
      body: `Congratulations ${session?.user?.name}! You have Purchased Lead For ${lead.category_name}`,
      action_url: `/provider-responses`,
    });

    await createNotification({
      userId: String(userId),
      title: "Lead Response 🎉",
      type: "lead_response",
      body: `Congratulations! Your Posted ${lead.category_name} Lead Got Response By ${session?.user?.name}`,
      action_url: `/customer/dashboard`,
    });

    toast.info("Preparing your chat...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newConvoId = await refetchConversation();
    if (newConvoId) {
      toast.success("Chat is ready!");
    } else {
      toast.info("Click 'Chat' button to start your conversation");
    }
  }, [
    fetchResponses,
    refetchConversation,
    session,
    userId,
    lead,
    cacheKey,
    leadStatus.count,
  ]);

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

  const isChatButtonDisabled =
    !leadStatus.purchased || isNavigating || subscriptionLoading;

  const providerResponse = useMemo(
    () => toProviderResponse(lead, session),
    [lead, session]
  );
  return (
    <div className="max-w-auto mx-auto">
      <div className="b dark:bg-[#0d1117] bg-gray-50 rounded-2xl shadow- dark:shadow-md borde border-gra-200 dark:border-gray-700 overflow-hidden">
        <div className="p-2">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              {/* {lead.image ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900">
                  <Image
                    src={lead.image}
                    width={56}
                    height={56}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : ( */}
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
                  {getInitials(lead.customer_name || "N A")}
                </div>
              {/* )} */}
              {lead.status === "Open" && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {lead.customer_name}
                </h1>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border">
                  {lead.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {lead.postcode || lead.location_name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTimeAgo(lead.created_at)}
                </span>
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-800">
                  {lead.category_name}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700"
                  : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 transition-colors ${
                  isSaved ? "fill-blue-500 text-blue-500" : "text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        <div className="p-2">
          <div className=" bg-blue-50 bg-linear-to-br mx-auo dark:from-gray-800 dark:to-black rounded-xl border border-gray-200 dark:border-gray-700 p-3 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-600" />
              {leadStatus.purchased
                ? "Contact Details"
                : "Contact Details (Locked)"}
            </h3>

            {!leadStatus.hydrated && !leadStatus.purchased ? (
              <div className="space-y-3  animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-2.5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ) : leadStatus.purchased ? (
              <>
                <div className="hidden lg:flex items-center gap-3">
                  <ContactActions
                    response={providerResponse}
                    variant="compact"
                  />
                </div>
                <div className="flex lg:hidden justify-center mx-0 p-0 items-center gap-3">
                  <ContactActions response={providerResponse} variant="full" />
                </div>
              </>
            ) : (
              <div className="  space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      Phone Number
                    </div>
                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100 select-none">
                      {lead.phone ? (
                        maskPhone(lead.phone)
                      ) : (
                        <span className="italic text-gray-400">
                          Not provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      Email Address
                    </div>
                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100 select-none">
                      {maskEmail(lead.customer_email)}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 pt-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Purchase this lead to unlock full contact details & actions
                </p>
              </div>
            )}
          </div>

          <div className=" bg-linear-to-br bg-blue-50  dark:from-gray-800 dark:to-black rounded-xl p-3 mb-6">
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
                className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(responseRate / maxResponses) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              <strong>{maxResponses - responseRate} spots remaining</strong> •
              Be one of the first to respond
            </p>
          </div>

          {!leadStatus.purchased && (
            <div className=" bg-blue-50 bg-linear-to-br  dark:from-gray-800 dark:to-black rounded-xl border border-orange-200 dark:border-orange-700 p-3 mb-6">
              <div className="flex items-start gap-2">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {requiredCredits}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      credits required
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    🏆 Protected by Premium Credit Pack
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Full credit refund if you're not hired during your premium
                    credit pack period
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
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl bg-linear-to-r from-blue-500 to-[#2563EB] text-white hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Contact {customerFirstName}
              </button>
            )}
          </div>

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
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d1117] rounded-2xl shadow-sm dark:shadow-md border border-gray-200 dark:border-gray-700 m-1 p-5 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 ">
          Project Details
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed ">
          {lead.description}
        </p>

        {lead.answers && lead.answers.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              Lead Questions & Answers
            </h3>
            <div className="space-y-3">
              {lead.answers.map((ans, idx) => (
                <div
                  key={ans.question_id || idx}
                  className="bg-gray-50 dark:bg-blue-900/10 border border-gray-200 dark:border-gray-700 rounded-xl p-3"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {ans.question || "—"}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    {formatAnswerValue(ans.answer)}
                  </p>
                </div>
              ))}

              {lead.queries?.trim() && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                    Additional Queries
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <HelpCircle
                        size={18}
                        className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
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
          name={lead.location_name || (lead.customer_name as string)}
          latitude={lead.latitude as number}
          longitude={lead.longitude as number}
        />
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800" />

      <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-black p-3 flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Not seeing the right leads?
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Stop seeing leads with specific answers by customising your
            settings.
          </p>
          <button
            onClick={() => router.push("/settings/leads/myservices")}
            className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
          >
            Update lead settings →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
