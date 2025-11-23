"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Clock, AlertCircle, Send, Smile, Paperclip, Phone, Video, MoreVertical, X, Loader2 } from "lucide-react";

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
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (Object.keys(typingUsers).length > 0) {
      typingRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [typingUsers]);

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
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
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
    <div className="flex flex-col h-full bg-white">
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3C7DED]  via-[#41A6EE] to-[#46CBEE] flex items-center justify-center text-white text-sm font-semibold shadow-md">
                {getInitials(otherName || "User")}
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{otherName || "User"}</p>
              <p className="text-xs text-gray-500">{conversationTitle || "Chat"}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-gray-50/50 to-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
      >
        {isLoading ? (
          <LoadingState />
        ) : Object.keys(groupedMessages).length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="flex items-center justify-center my-6">
                  <div className="px-3 py-1 bg-gray-100 rounded-full">
                    <span className="text-xs font-medium text-gray-600">
                      {formatDate(msgs[0].created_at)}
                    </span>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {msgs.map((m, index) => {
                    const isMe = m.user_id === me.id;
                    const showAvatar = !isMe && (index === 0 || msgs[index - 1]?.user_id !== m.user_id);

                    return (
                      <motion.div
                        key={`${m.id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                          {!isMe && (
                            <div className={`flex-shrink-0 w-8 h-8 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#8A2BE2] flex items-center justify-center text-white text-xs font-semibold shadow">
                                {getInitials(otherName)}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col">
                            {!isMe && showAvatar && (
                              <span className="text-xs text-gray-500 mb-1 ml-2">{otherName || "User"}</span>
                            )}
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isMe
                                  ? "bg-[#6C63FF] text-white rounded-br-md shadow-md"
                                  : "bg-gray-100 text-gray-900 rounded-bl-md shadow-sm"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                {m.content}
                              </p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                              <span className="text-[10px] text-gray-500">
                                {formatTime(m.created_at)}
                              </span>
                              {isMe && (
                                <span>
                                  {m.status === "sending" && (
                                    <Clock className="w-3 h-3 text-gray-400 animate-pulse" />
                                  )}
                                  {m.status === "sent" && (
                                    <CheckCheck className="w-3 h-3 text-[#6C63FF]" />
                                  )}
                                  {m.status === "failed" && (
                                    <AlertCircle className="w-3 h-3 text-red-500" />
                                  )}
                                </span>
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
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#8A2BE2] flex items-center justify-center text-white text-xs font-semibold shadow">
                    {getInitials(otherName)}
                  </div>
                  <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1">
                      <motion.span
                        className="w-2 h-2 bg-gray-500 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-gray-500 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-gray-500 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
            title="Attach file"
          >
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
            className={`flex-1 px-4 py-2 bg-gray-50 border-2 rounded-full text-gray-900 placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 transition-all ${
              isFocused ? "border-[#6C63FF] bg-white" : "border-gray-200"
            }`}
            style={{ minHeight: "40px" }}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2 rounded-full transition-all flex-shrink-0 ${
              input.trim()
                ? "bg-[#6C63FF] text-white hover:bg-[#5a52d5] shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
      <Loader2 className="w-8 h-8 text-[#6C63FF] animate-spin mb-3" />
      <p className="text-sm text-gray-500">Loading messages...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6C63FF]/10 to-[#8A2BE2]/10 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-[#6C63FF]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Send a message to start the conversation
        </p>
      </motion.div>
    </div>
  );
}