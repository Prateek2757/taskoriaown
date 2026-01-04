"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCheck,
  Clock,
  AlertCircle,
  Send,
  Smile,
  Paperclip,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  created_at: string;
  status?: "sending" | "sent" | "failed";
}

export default function MessageList({
  messages,
  me,
  otherName,
  typingUsers,
  onSend,
  onTyping,
  conversationTitle,
  isLoading,
}: {
  messages: Message[];
  me: { id: string; name?: string };
  typingUsers: Record<string, number>;
  onSend: (text: string) => void;
  onTyping: () => void;
  conversationTitle?: string;
  otherName?: string;
  isLoading?: boolean;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isAtBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      setShouldAutoScroll(isAtBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el || !shouldAutoScroll) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typingUsers, shouldAutoScroll]);


  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    onTyping();

    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const y = new Date();
    y.setDate(y.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === y.toDateString()) return "Yesterday";

    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.created_at).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0E0F11]">

      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0E0F11]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white flex items-center justify-center font-semibold shadow-md">
            {getInitials(otherName)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{otherName}</p>
            <p className="text-xs text-gray-500">{conversationTitle || "Chat"}</p>
          </div>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-[#0E0F11] dark:to-[#0E0F11] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      >
        {isLoading ? (
          <LoadingState />
        ) : Object.keys(groupedMessages).length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="flex justify-center my-6">
                  <div className="px-3 py-1 bg-gray-100 dark:bg-[#1A1C1F] rounded-full">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {formatDate(msgs[0].created_at)}
                    </span>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {msgs.map((m, index) => {
                    const isMe = m.user_id === me.id;
                    const prev = msgs[index - 1];
                    const showAvatar = !isMe && (!prev || prev.user_id !== m.user_id);

                    return (
                      <motion.div
                        key={m.id + index}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>

                          {!isMe && (
                            <div className={`w-8 h-8 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white flex items-center justify-center text-xs font-semibold shadow">
                                {getInitials(otherName)}
                              </div>
                            </div>
                          )}

                          <div>
                            {!isMe && showAvatar && (
                              <p className="text-xs mb-1 ml-2 text-gray-500 dark:text-gray-400">
                                {otherName}
                              </p>
                            )}

                            <div
                              className={`px-4 py-2 rounded-2xl shadow-sm ${
                                isMe
                                  ? "bg-[#3C7DED] text-white rounded-br-md shadow-md"
                                  : "bg-gray-100 dark:bg-[#1A1C1F] text-gray-900 dark:text-white rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {m.content}
                              </p>
                            </div>

                            <div className={`flex gap-1 mt-1 ${isMe ? "justify-end" : ""}`}>
                              <span className="text-[10px] text-gray-500">
                                {formatTime(m.created_at)}
                              </span>

                              {isMe && (
                                <>
                                  {m.status === "sending" && (
                                    <Clock className="w-3 h-3 text-gray-400 animate-pulse" />
                                  )}
                                  {m.status === "sent" && (
                                    <CheckCheck className="w-3 h-3 text-[#3C7DED]" />
                                  )}
                                  {m.status === "failed" && (
                                    <AlertCircle className="w-3 h-3 text-red-500" />
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ))}

            <AnimatePresence>
              {Object.keys(typingUsers).length > 0 && (
                <motion.div
                  ref={typingRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3C7DED] to-[#41A6EE] text-white flex items-center justify-center text-xs font-semibold shadow">
                    {getInitials(otherName)}
                  </div>

                  <div className="px-4 py-3 bg-gray-100 dark:bg-[#1A1C1F] rounded-2xl">
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 bg-white dark:bg-[#0E0F11] border-t border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2">

          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Smile className="w-5 h-5" />
          </button>

          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message..."
            rows={1}
            className={`flex-1 px-4 py-2 rounded-full border-2 bg-gray-50 dark:bg-[#101114] text-gray-900 dark:text-white placeholder-gray-500 resize-none max-h-[120px] scrollbar-thin transition-all ${
              isFocused
                ? "border-[#3C7DED] bg-white dark:bg-[#1A1C1F]"
                : "border-gray-200 dark:border-gray-700"
            }`}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2 rounded-full transition-all ${
              input.trim()
                ? "bg-[#3C7DED] hover:bg-[#3574d1] text-white shadow"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>

        </div>
      </div>
    </div>
  );
}


function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-[#3C7DED] animate-spin mb-2" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-20 h-20 rounded-full bg-[#3C7DED]/10 flex items-center justify-center mb-4">
      <svg className="w-10 h-10 text-[#3C7DED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">No messages yet</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
      Say hello to start the conversation!
    </p>
  </div>
  );
}
