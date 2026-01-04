"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import formatMessageTime from "./messageTimeUtility";

interface Participant {
  user_id: string;
  name: string;
}

interface Conversation {
  id: string;
  task_id: string;
  task_title: string;
  participants: Participant[];
  last_message?: string;
  last_message_sender?: string;
  unread_count?: number;
  last_message_at?: string;
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
      className="w-full sm:w-80 h-[calc(100vh-75px)] border-r shadow-lg flex flex-col bg-white/90 dark:bg-black/40 backdrop-blur-xl border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b bg-white/60 dark:bg-black/30 border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-extrabold tracking-tight bg-[#3C7DED] bg-clip-text text-transparent">
          ChatLink
        </h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="sm:hidden text-gray-400 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <div className="p-3 border-b bg-white/40 dark:bg-black/20 border-gray-100 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search chats or names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white/70 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6C63FF]/50 outline-none"
          />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
            No matching conversations
          </div>
        ) : (
          filteredConversations.map((c) => {
            const otherName = getOtherParticipantName(c);
            const firstLetter = otherName.charAt(0).toUpperCase();
            const unread = Number(c.unread_count || 0);
            const hasUnread = unread > 0;

            // WhatsApp-style message preview with sender
            const messagePreview = c.last_message
              ? c.last_message_sender
                ? `${c.last_message_sender}: ${c.last_message}`
                : c.last_message
              : "No messages yet";

            return (
              <div
                key={c.id}
                onClick={() => onSelectConversation(c)}
                className={`cursor-pointer px-5 py-4 border-b transition-all border-gray-100 dark:border-gray-800 group flex justify-between items-center ${
                  activeConversationId === c.id
                    ? "bg-[#f4f1ff] dark:bg-[#1a1535] border-l-4 border-l-[#6C63FF]"
                    : hasUnread
                      ? "bg-[#f0f5ff] dark:bg-[#1c163a] hover:bg-[#f9f8ff] dark:hover:bg-black/30"
                      : "hover:bg-[#f9f8ff] dark:hover:bg-black/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] flex items-center justify-center text-white font-semibold shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                    {firstLetter}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center w-full gap-2">
                      <div className="font-bold text-gray-800 dark:text-gray-200 truncate text-base group-hover:text-[#6C63FF] transition-colors flex-1 min-w-0">
                        {otherName}
                      </div>

                      {c.last_message_at && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatMessageTime(c.last_message_at)}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-0.5 gap-2">
                      <p
                        className={`text-sm truncate flex-1 min-w-0 ${
                          hasUnread
                            ? "font-medium text-gray-900 dark:text-gray-100"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {messagePreview}
                      </p>

                      {hasUnread && (
                        <span className="flex-shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 bg-[#6C63FF] dark:bg-[#7da2ff] text-white text-xs font-bold px-1.5 rounded-full">
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
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