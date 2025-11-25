"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowLeft } from "lucide-react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/chatWindow";
import { Button } from "@/components/ui/button";

interface Participant {
  user_id: string;
  name: string;
}

interface Conversation {
  id: string;
  task_id: string;
  task_title: string;
  participants: Participant[];
}
type ViewMode = "customer" | "provider" | null;


export default function ChatPageInline({params}:{params:Promise<{convoId:string}>}) {
  const paramsWrapped = use(params)
  const routeConvoId = paramsWrapped?.convoId || null;
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);
  const cacheKey = `chat_conversations_${session?.user?.id}`;
  // const role = typeof window !== "undefined"
  // ? localStorage.getItem("viewmode")
  // : "provider";
  // const [viewMode, setViewMode] = useState<ViewMode>(null);

  
const [endpoint, setEndpoint] = useState<string | null>(null);

useEffect(() => {
  if (typeof window === "undefined") return;

  const storedView = localStorage.getItem("viewMode");
  if (storedView === "customer" || storedView === "provider") {
    // setViewMode(storedView);
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
    hasFetched.current = true;
  
    setLoading(true);
    setError(null);
  
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch conversations");
  
      const data = await res.json();
      const convos = data.conversations || [];
  
      setConversations(convos);
    } catch (err: any) {
      console.error("Error loading conversations:", err);
      setError(err?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [endpoint, session?.user?.id]);

  useEffect(()=>{
    if(!routeConvoId) return
    if(!conversations.length) return
     const found = conversations.find((c)=>String(c.id)===String(routeConvoId));
    if(found)
      setActiveConversation(found)

  },[routeConvoId,conversations])

  useEffect(() => {
    if (!session?.user?.id) return;

    const lastFetched = Number(sessionStorage.getItem(`${cacheKey}_timestamp`));
    const isExpired = Date.now() - lastFetched > 5 * 60 * 1000; // 5 min

    if (isExpired || !lastFetched) {
      hasFetched.current = false; 
      fetchConversations();
    }
  }, [cacheKey, session?.user?.id, fetchConversations]);

  const getOtherParticipantName = useCallback(
    (conversation: Conversation) => {
      const other = conversation.participants.find(
        (p) => Number(p.user_id) !== Number(session?.user?.id)
      );
      return other?.name || "Unknown";
    },
    [session?.user?.id]
  );

  const handleSelectConversation = useCallback(
    (conversation: Conversation) => {
      setActiveConversation(conversation);
      if (window.innerWidth < 640) setSidebarOpen(false);
    },
    []
  );

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#8A2BE2]/10 via-[#6C63FF]/10 to-[#00E5FF]/10">
        {/* <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">🔒 Login Required</p>
          <p className="text-gray-500">Please log in to access your chats.</p>
        </div> */}
      </div>
    );
  }

  const otherName =
    activeConversation && session?.user?.id
      ? getOtherParticipantName(activeConversation)
      : "Unknown";

  const conversationTitle = activeConversation?.task_title || "Untitled Conversation";

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-[#faf9ff] via-[#f9fbff] to-[#f4fdff] text-gray-800 overflow-hidden">
      <AnimatePresence mode="wait">
        {(sidebarOpen || window.innerWidth >= 640) && (
          <motion.div
            key="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute sm:relative w-full sm:w-80 h-full z-10 bg-white sm:bg-transparent"
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
        {activeConversation && window.innerWidth < 640 && (
          <div className="p-3 flex items-center gap-3 bg-white/80 border-b border-gray-100 shadow-sm backdrop-blur-md">
            <Button  
              onClick={() => setSidebarOpen(true)}
              className="text-[#6C63FF] flex items-center gap-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Button>
            <div className="flex-1 text-center font-semibold text-gray-800 truncate">
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
              className="flex flex-col items-center justify-center flex-1 text-gray-400"
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
              className="flex flex-col items-center justify-center flex-1 text-red-400"
            >
              <p className="text-lg font-medium">{error}</p>
            </motion.div>
          ) : activeConversation ? (
            <motion.div
              key={activeConversation.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 bg-white overflow-hidden flex flex-col"
            >
              <ChatWindow
                otherName={otherName}
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
              className="flex flex-col items-center justify-center flex-1 text-gray-400"
            >
              <MessageCircle className="w-12 h-12 mb-4 text-[#6C63FF]" />
              <p className="text-lg font-medium text-gray-600">Select a conversation</p>
              <p className="text-sm text-gray-400 mt-1">
                Start chatting with your clients or team
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
