"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseServer } from "@/lib/supabase-server";
import MessageList from "./messageList";
import { is } from "date-fns/locale";

export type Message = {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  created_at: string;
  status?: "sending" | "sent" | "failed";
};
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

export default function ChatWindow({
  otherName,
  conversationTitle,

  conversationId,
  me,
  taskId,
}: {
  conversationId: string;
  me: { id: string; name?: string };
  taskId: number;
  conversationTitle: string;
  otherName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!conversationId) return;
    let isMounted = true;
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/messages/conversation-read/${conversationId}`
        );
        console.log(res);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch messages: ${text}`);
        }
        const data = await res.json();
        if (isMounted) {
          const uniqueMessages = Array.from(
            new Map((data.messages as Message[]).map((m) => [m.id, m])).values()
          );
          setMessages(
            uniqueMessages.sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            )
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch messages error:", err);
      } finally {
        if (!isMounted) setLoading(false);
      }
    };

    fetchMessages();

    const channelName = `conversation:${conversationId}`;
    const chan = supabaseServer.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    chan.on("broadcast", { event: "message" }, (payload) => {
      const msg = payload.payload?.message;
      if (!msg?.id) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;

        const combined = [...prev, msg];
        const unique = Array.from(
          new Map(combined.map((m) => [m.id, m])).values()
        );
        return unique.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
    });

    chan.on("broadcast", { event: "typing" }, (payload) => {
      const { user_id } = payload.payload || {};
      if (!user_id || user_id === me.id) return;
      setTypingUsers((prev) => ({ ...prev, [user_id]: Date.now() }));
    });

    chan.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channelRef.current = chan;
      }
    });

    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) => {
        const cleaned = Object.entries(prev).reduce((acc, [uid, ts]) => {
          if (now - ts < 1000) acc[uid] = ts;
          return acc;
        }, {} as Record<string, number>);
        return cleaned;
      });
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (channelRef.current) {
        supabaseServer.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, me.id]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const tempId = "tmp_" + Math.random().toString(36).slice(2, 11);
    const optimistic: Message = {
      id: tempId,
      conversation_id: conversationId,
      user_id: me.id,
      content: text,
      created_at: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/messages/message-created", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          content: text,
          taskId,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();

      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "message",
          payload: { message: data.message },
        });
      }

      setMessages((prev) => {
        const combined = prev.map((msg) =>
          msg.id === tempId ? { ...data.message, status: "sent" } : msg
        );
        const unique = Array.from(
          new Map(combined.map((m) => [m.id, m])).values()
        );
        return unique.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
    } catch (err) {
      console.error("Send message error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  const sendTyping = () => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { user_id: me.id },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-75px)] border overflow-hidden">
      <MessageList
        messages={messages}
        otherName={otherName}
        conversationTitle={conversationTitle}
        me={me}
        typingUsers={typingUsers}
        onSend={sendMessage}
        onTyping={sendTyping}
        isLoading={loading}
      />
    </div>
  );
}
