"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";

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

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  sessionUserId: number | string;
  sessionUserName?: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  sessionUserId,
  sessionUserName,
  sidebarOpen,
  setSidebarOpen,
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getOtherParticipantName = (c: Conversation) => {
    const other = c.participants.find(
      (p) => Number(p.user_id) !== Number(sessionUserId)
    );
    return other?.name || "Unknown";
  };

  const filteredConversations = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return conversations.filter(
      (c) =>
        c.task_title?.toLowerCase().includes(term) ||
        getOtherParticipantName(c).toLowerCase().includes(term)
    );
  }, [conversations, searchTerm, sessionUserId]);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      className="w-full sm:w-80 bg-white/90 h-[calc(100vh-75px)] backdrop-blur-xl border-r border-gray-100 shadow-lg flex flex-col"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white/60 flex-shrink-0">
        <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#8A2BE2] via-[#6C63FF] to-[#00E5FF] bg-clip-text text-transparent">
          ChatLink
        </h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="sm:hidden text-gray-400 hover:text-gray-700 transition"
        >
          ✕
        </button>
      </div>

      <div className="p-3 border-b border-gray-100 bg-white/40 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats or names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto touch-pan-y scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={{
          WebkitOverflowScrolling: "touch", 
        }}
      >
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No matching conversations
          </div>
        ) : (
          filteredConversations.map((c) => {
            const otherName = getOtherParticipantName(c);
            const firstLetter = otherName.charAt(0).toUpperCase();

            return (
              <div
                key={c.id}
                onClick={() => onSelectConversation(c)}
                className={`cursor-pointer px-5 py-4 border-b border-gray-100 transition-all group ${
                  activeConversationId === c.id
                    ? "bg-[#f4f1ff] border-l-4 border-l-[#6C63FF]"
                    : "hover:bg-[#f9f8ff]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#00E5FF] flex items-center justify-center text-white font-semibold shadow-md group-hover:scale-105 transition-transform">
                    {firstLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 truncate text-base group-hover:text-[#6C63FF] transition-colors">
                      {otherName}
                    </div>
                    <div className="text-sm text-gray-600 truncate font-medium mt-0.5">
                      {c.task_title || "Untitled Conversation"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.aside>
  );
}