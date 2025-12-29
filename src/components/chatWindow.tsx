"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Paperclip, Smile, Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-server";

export type Message = {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  created_at: string;
  status?: "sending" | "sent" | "failed";
};

export default function ChatWindow({
  conversationId,
  me,
  taskId,
}: {
  conversationId: string;
  me: { id: string; name?: string };
  taskId: number | string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const channelRef = useRef<any>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/messages/conversation-read/${conversationId}`
        );
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        if (isMounted) setMessages(data.messages || []);
        await fetch(`/api/messages/conversation-read/${conversationId}`, {
          method: "POST",
        });
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchMessages();

    const setupChannel = async () => {
      const chan = supabaseBrowser.channel(
        `conversation:${conversationId}:task:${taskId}`,
        {
          config: { broadcast: { self: true } },
        }
      );

      chan.on("broadcast", { event: "message" }, (payload) => {
        const msg = payload.payload?.message;
        if (!msg?.id) return;

        setMessages((prev) => {
          const exists = prev.find((m) => m.id === msg.id);
          if (exists) return prev;
          return [...prev, msg].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        });
      });

      chan.on("broadcast", { event: "typing" }, (payload) => {
        const { user_id } = payload.payload || {};
        if (!user_id || user_id === me.id) return;
        setTypingUsers((prev) => ({ ...prev, [user_id]: Date.now() }));
      });

      const interval = setInterval(() => {
        setTypingUsers((prev) => {
          const now = Date.now();
          return Object.fromEntries(
            Object.entries(prev).filter(([_, t]) => now - t < 2000)
          );
        });
      }, 1000);

      chan.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channelRef.current = chan;
        }
      });

      return interval;
    };

    const cleanupPromise = setupChannel();

    return () => {
      isMounted = false;
      cleanupPromise.then((interval) => clearInterval(interval));
      if (channelRef.current) supabaseBrowser.removeChannel(channelRef.current);
    };
  }, [conversationId, me.id]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendTyping = () => {
    if (!channelRef.current) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { user_id: me.id },
    });

    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");

    const tempId = "tmp_" + Math.random().toString(36).slice(2, 9);
    const optimistic: Message = {
      id: tempId,
      conversation_id: conversationId,
      user_id: me.id,
      content: trimmed,
      created_at: new Date().toISOString(),
      status: "sending",
    };
    setMessages((m) => [...m, optimistic]);

    try {
      const res = await fetch("/api/messages/message-created", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          content: trimmed,
          taskId,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      const data = await res.json();

      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "message",
          payload: { message: data.message },
        });
      }

      setMessages((m) =>
        m.map((msg) =>
          msg.id === tempId ? { ...data.message, status: "sent" } : msg
        )
      );
    } catch (err) {
      console.error("Send failed:", err);
      setMessages((m) =>
        m.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" } : msg))
      );
    }
  };

  const retryMessage = (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    setInput(msg.content);
    setMessages((m) => m.filter((x) => x.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white via-[#f8f9ff] to-[#f3fbff] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6 relative z-10"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#d4d4ff transparent",
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-gray-500 text-lg font-medium">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Start the conversation 💬
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  m.user_id === me.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-md break-words ${
                    m.user_id === me.id
                      ? "bg-gradient-to-r from-[#8A2BE2] via-[#6C63FF] to-[#00E5FF] text-white"
                      : "bg-white border border-gray-100 text-gray-800"
                  }`}
                >
                  <p>{m.content}</p>
                  <div
                    className={`text-xs opacity-70 mt-1 text-right ${
                      m.user_id === me.id ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {m.status === "failed" ? (
                      <button
                        onClick={() => retryMessage(m.id)}
                        className="text-red-500 underline"
                      >
                        Retry
                      </button>
                    ) : (
                      new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Typing Indicator */}
        {Object.keys(typingUsers).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/80 border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
              <span className="italic text-sm text-gray-500 animate-pulse">
                Someone is typing...
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Bar (Raised Send Button + Emoji + Attach) */}
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/70 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
        <div className="px-6 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-3 max-w-4xl mx-auto"
          >
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-purple-600 hover:border-purple-300 transition"
            >
              <Smile size={20} />
            </button>

            {/* Attachment Button */}
            <button
              type="button"
              className="p-3 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300 transition"
            >
              <Paperclip size={20} />
            </button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  sendTyping();
                }}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-5 py-3 bg-white border-2 border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/20 outline-none transition-all duration-200 resize-none min-h-[48px] max-h-32 text-[15px] leading-relaxed shadow-sm"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#d4d4ff transparent",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>

            {/* Send Button (Raised) */}
            <button
              type="submit"
              disabled={!input.trim()}
              className={`relative overflow-hidden p-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                input.trim()
                  ? "bg-gradient-to-r from-[#8A2BE2] via-[#6C63FF] to-[#00E5FF] text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={18} />
            </button>
          </form>

          {/* Emoji Picker (Optional simple mockup) */}
          {showEmojiPicker && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 shadow-lg absolute bottom-20 left-10 w-64 grid grid-cols-8 gap-2 text-lg">
              {[
                "😀",
                "😁",
                "😂",
                "😍",
                "🥰",
                "😎",
                "😢",
                "👍",
                "🔥",
                "💡",
                "💬",
                "❤️",
                "🎉",
                "🙏",
                "🌈",
                "⭐",
              ].map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    setInput((prev) => prev + e);
                    setShowEmojiPicker(false);
                  }}
                  className="hover:scale-125 transition-transform"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
