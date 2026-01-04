"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/chatWindow";
import { Button } from "@/components/ui/button";

export default function ChatPageInline({
  params,
}: {
  params: Promise<{ convoId: string }>;
}) {
  const paramsWrapped = use(params);
  const routeConvoId = paramsWrapped?.convoId || null;
  const { data: session } = useSession();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [endpoint, setEndpoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasFetched = useRef(false);
  const cacheKey = `chat_conversations_${session?.user?.id}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedView = localStorage.getItem("viewMode");
    if (storedView === "customer" || storedView === "provider") {
      setEndpoint(
        storedView === "customer"
          ? "/api/messages/customerconversation"
          : "/api/messages/myconversations"
      );
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) setConversations(JSON.parse(cached));
  }, [cacheKey, session?.user?.id]);

  const fetchConversations = useCallback(async () => {
    if (!endpoint || hasFetched.current) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const data = await res.json();
      setConversations(data.conversations || []);
      hasFetched.current = true;
    } catch (err) {
      setError(err?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (endpoint) {
      hasFetched.current = false;
      fetchConversations();
    }
  }, [endpoint]);

  useEffect(() => {
    if (!routeConvoId) return;
    if (!conversations.length) return;
    const found = conversations.find(
      (c) => String(c.id) === String(routeConvoId)
    );
    if (found) setActiveConversation(found);
  }, [routeConvoId, conversations]);

  const getOtherParticipantName = useCallback(
    (conversation) =>
      conversation.participants.find(
        (p) => Number(p.user_id) !== Number(session?.user?.id)
      )?.name || "Unknown",
    [session?.user?.id]
  );
  const getOtherParticipantId = useCallback(
    (conversation) =>
      conversation.participants.find(
        (p) => Number(p.user_id) !== Number(session?.user?.id)
      )?.user_id || null,
    [session?.user?.id]
  );

  const handleSelectConversation = useCallback((conversation) => {
    setActiveConversation(conversation);
    if (window.matchMedia("(max-width: 640px)").matches) setSidebarOpen(false);
  }, []);

  const otherParticipant =
    activeConversation && session?.user?.id
      ? {
          name: getOtherParticipantName(activeConversation),
          otherId: getOtherParticipantId(activeConversation),
        }
      : { name: "Unknown", otherId: null };
  const otherName = otherParticipant.name;
  const otherId = otherParticipant.otherId;
  const conversationTitle = activeConversation?.task_title || "Conversation";

  useEffect(() => {
    if (!routeConvoId) return;
    fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: routeConvoId }),
    }).then(() => {
      document.title = conversationTitle;
    });
  }, [routeConvoId]);

  if (!session?.user)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-[#0a0a0f] dark:via-[#0f1117] dark:to-[#11131a]"></div>
    );

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#050507] dark:via-[#0b0c10] dark:to-[#11131a] text-gray-800 dark:text-gray-200">
      <AnimatePresence mode="wait">
        {(sidebarOpen ||
          typeof window === "undefined" ||
          !window.matchMedia("(max-width: 640px)").matches) && (
          <motion.div
            key="sidebar"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute sm:relative w-full sm:w-80 h-full z-10 bg-white dark:bg-[#0f1015] border-r border-gray-200 dark:border-[#1d1f27] shadow-md dark:shadow-lg"
          >
            <ChatSidebar
              conversations={conversations}
              activeConversationId={activeConversation?.id || null}
              onSelectConversation={handleSelectConversation}
              sessionUserId={session.user.id}
              sessionUserName={session.user.name}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative">
        {activeConversation && (
          <div className="sm:hidden p-3 flex items-center gap-3 bg-white/80 dark:bg-[#12131a]/80 border-b border-gray-200 dark:border-[#1d1f27] backdrop-blur-md shadow-sm">
            <Button
              onClick={() => setSidebarOpen(true)}
              className="text-[#6C63FF] dark:text-[#78aaff] flex items-center gap-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Button>
            <div className="flex-1 text-center font-semibold truncate dark:text-gray-200">
              {conversationTitle}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-1 text-gray-500 dark:text-gray-400"
            >
              <div className="animate-spin border-4 border-[#6C63FF]/20 border-t-[#6C63FF] rounded-full w-10 h-10 mb-3"></div>
              <p>Loading conversations...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-1 text-red-500 dark:text-red-400"
            >
              <p className="text-lg font-medium">{error}</p>
            </motion.div>
          ) : activeConversation ? (
            <motion.div
              key={activeConversation.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-[#0e0f14]"
            >
              <ChatWindow
                otherName={otherName}
                OtherUserId={String(otherId)}
                conversationTitle={conversationTitle}
                conversationId={activeConversation.id}
                me={{ id: session.user.id }}
                taskId={Number(activeConversation.task_id)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-1 text-gray-500 dark:text-gray-400"
            >
              <MessageCircle className="w-12 h-12 mb-4 text-[#6C63FF] dark:text-[#7da2ff]" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm mt-1">Start chatting with your clients</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
