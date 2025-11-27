"use client";

import { useEffect, useRef, useState } from "react";
import MessageList from "./messageList";
import { supabaseServer } from "@/lib/supabase-server";

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
  conversationId,
  otherName,
  conversationTitle,
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

  const sortMessages = (arr: Message[]) =>
    arr.sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );

  const uniqueMessages = (arr: Message[]) =>
    Array.from(new Map(arr.map((m) => [m.id, m])).values());

  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/messages/conversation-read/${conversationId}`
        );

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        const cleaned = uniqueMessages(data.messages);
        setMessages(sortMessages(cleaned));
      } catch (err) {
        console.error("Fetch messages error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    const chan = supabaseServer.channel(`conversation:${conversationId}`, {
      config: { broadcast: { self: false } },
    });

    chan.on("broadcast", { event: "message" }, (payload) => {
      const msg: Message = payload.payload?.message;
      if (!msg?.id) return;

      setMessages((prev) => {
        const merged = uniqueMessages([...prev, msg]);
        return sortMessages(merged);
      });
    });

    chan.on("broadcast", { event: "typing" }, (payload) => {
      const uid = payload.payload?.user_id;
      if (!uid || uid === me.id) return;
      setTypingUsers((prev) => ({ ...prev, [uid]: Date.now() }));
    });

    chan.subscribe((status) => {
      if (status === "SUBSCRIBED") channelRef.current = chan;
    });

    const cleanTyping = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) => {
        const next: Record<string, number> = {};
        for (const [uid, ts] of Object.entries(prev)) {
          if (now - ts < 1000) next[uid] = ts;
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(cleanTyping);
      if (channelRef.current) supabaseServer.removeChannel(channelRef.current);
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

      setMessages((prev) =>
        sortMessages(
          uniqueMessages(
            prev.map((m) =>
              m.id === tempId ? { ...data.message, status: "sent" } : m
            )
          )
        )
      );
    } catch (err) {
      console.error("Send message error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, status: "failed" } : m
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
    <div className="flex flex-col h-[calc(100vh-75px)] overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-black/30">
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
