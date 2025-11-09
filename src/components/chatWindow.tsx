"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseServer } from "@/lib/supabase-server";

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
}: {
  conversationId: string;
  me: { id: string; name?: string };
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const channelRef = useRef<any>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/messages/conversation-read/${conversationId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        if (isMounted) setMessages(data.messages || []);

        await fetch(`/api/messages/conversation-read/${conversationId}`, { method: "POST" });
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMessages();

    // Setup Supabase channel
    const setupChannel = async () => {
      const chan = supabaseServer.channel(`conversation:${conversationId}`, {
        config: { broadcast: { self: true } },
      });

      // Listen for new messages
      chan.on("broadcast", { event: "message" }, (payload) => {
        const msg = payload.payload?.message;
        if (!msg?.id) return; // Prevent crash

        setMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id);
          if (exists) {
            return prev.map((m) =>
              m.id === msg.id || (m.id.startsWith("tmp_") && m.content === msg.content)
                ? { ...msg, status: "sent" }
                : m
            );
          }
          return [...prev, msg].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
      });

      chan.on("broadcast", { event: "typing" }, (payload) => {
        const { user_id } = payload.payload || {};
        if (!user_id || user_id === me.id) return;

        setTypingUsers((t) => ({ ...t, [user_id]: Date.now() }));
        setTimeout(() => {
          setTypingUsers((t) => {
            const copy = { ...t };
            if (Date.now() - (copy[user_id] || 0) >= 3000) delete copy[user_id];
            return copy;
          });
        }, 3500);
      });

      chan.on("broadcast", { event: "read" }, (payload) => {
        console.log("Read event:", payload);
      });

      chan.subscribe((status) => {
        if (status === "SUBSCRIBED") channelRef.current = chan;
        else if (status === "CHANNEL_ERROR") console.error("Channel error");
      });
    };

    setupChannel();

    return () => {
      isMounted = false;
      if (channelRef.current) supabaseServer.removeChannel(channelRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [conversationId, me.id]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const tempId = "tmp_" + Math.random().toString(36).slice(2, 11);
    const optimistic: Message = {
      id: tempId,
      conversation_id: conversationId,
      user_id: me.id,
      content: trimmed,
      created_at: new Date().toISOString(),
      status: "sending",
    };

    setMessages((m) => [...m, optimistic]);
    setInput("");

    try {
      const res = await fetch("/api/messages/message-created", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId, content: trimmed }),
      });

      if (!res.ok) throw new Error("Send failed");

      const data = await res.json();
      setMessages((m) =>
        m.map((msg) => (msg.id === tempId ? { ...data.message, status: "sent" } : msg))
      );
    } catch (err) {
      console.error("Send failed:", err);
      setMessages((m) =>
        m.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" } : msg))
      );
    }
  };

  // Typing indicator
  const sendTyping = () => {
    if (!channelRef.current) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    channelRef.current.send({ type: "broadcast", event: "typing", payload: { user_id: me.id } });
    typingTimeoutRef.current = setTimeout(() => (typingTimeoutRef.current = null), 2000);
  };

  // Retry failed message
  const handleRetry = async (messageId: string) => {
    const failedMsg = messages.find((m) => m.id === messageId);
    if (!failedMsg) return;

    setMessages((m) =>
      m.map((msg) => (msg.id === messageId ? { ...msg, status: "sending" } : msg))
    );

    try {
      const res = await fetch("/api/messages/message-created", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId, content: failedMsg.content }),
      });

      if (!res.ok) throw new Error("Retry failed");
      const data = await res.json();
      setMessages((m) =>
        m.map((msg) => (msg.id === messageId ? { ...data.message, status: "sent" } : msg))
      );
    } catch {
      setMessages((m) =>
        m.map((msg) => (msg.id === messageId ? { ...msg, status: "failed" } : msg))
      );
    }
  };

  if (isLoading)
    return <div className="flex items-center justify-center h-full text-neutral-400">Loading messages...</div>;

  return (
    <div className="flex flex-col h-full border rounded">
      <div className="flex-1 overflow-auto p-4" ref={listRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-neutral-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`mb-2 ${m.user_id === me.id ? "text-right" : "text-left"}`}>
              <div className={`inline-block px-4 py-2 rounded-lg ${m.user_id === me.id ? "bg-blue-600 text-white" : "bg-gray-800 text-white"}`}>
                {m.content}
                {m.status === "sending" && <span className="ml-2 text-xs opacity-70">Sending...</span>}
                {m.status === "failed" && (
                  <button onClick={() => handleRetry(m.id)} className="ml-2 text-xs underline opacity-70 hover:opacity-100">
                    Retry
                  </button>
                )}
              </div>
              <div className="text-xs text-neutral-400 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
            </div>
          ))
        )}
        {Object.keys(typingUsers).length > 0 && (
          <div className="text-sm text-neutral-400 italic">Someone is typing...</div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-3 border-t flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            sendTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-full bg-neutral-900 text-white border-none focus:outline-none"
        />
        <button type="submit" disabled={!input.trim()} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed">
          Send
        </button>
      </form>
    </div>
  );
}
