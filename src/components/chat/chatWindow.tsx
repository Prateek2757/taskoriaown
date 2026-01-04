"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import MessageList from "./messageList";
import { supabaseBrowser } from "@/lib/supabase-server";
import { createNotification } from "@/lib/notifications";
import axios from "axios";

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
  OtherUserId,
  otherName,
  conversationTitle,
  me,
  taskId,
}: {
  conversationId: string;
  me: { id: string; name?: string };
  taskId: number;
  OtherUserId?: string;
  conversationTitle?: string;
  otherName?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, number>>({});
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const channelRef = useRef<any>(null);
  const { data: session } = useSession();

  const sortMessages = (arr: Message[]) =>
    arr.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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
        setMessages(sortMessages(uniqueMessages(data.messages)));
      } catch (err) {
        console.error("Fetch messages error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    const chan = supabaseBrowser.channel(`conversation:${conversationId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: me.id },
      },
    });

    chan.on("broadcast", { event: "message" }, (payload) => {
      const msg: Message = payload.payload?.message;
      if (!msg?.id) return;

      console.log("💬 ChatWindow received broadcast:", msg);

      if (msg.user_id !== me.id) {
        setMessages((prev) => sortMessages(uniqueMessages([...prev, msg])));
      }
    });

    chan.on("broadcast", { event: "typing" }, (payload) => {
      const uid = payload.payload?.user_id;
      if (!uid || uid === me.id) return;

      setTypingUsers((prev) => ({ ...prev, [uid]: Date.now() }));
    });

    chan.on("presence", { event: "sync" }, () => {
      const state = chan.presenceState();
      const users = Object.values(state)
        .flat()
        .map((p: any) => p.user_id);
      setActiveUsers(users);
    });

    chan.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        console.log(`✅ ChatWindow subscribed to conversation:${conversationId}`);
        channelRef.current = chan;
        await chan.track({
          user_id: me.id,
          conversation_id: conversationId,
        });
      }
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
      if (channelRef.current) {
        channelRef.current.untrack();
        supabaseBrowser.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, me.id]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const tempId = "tmp_" + Math.random().toString(36).slice(2);
    const now = new Date().toISOString();

    const optimisticMessage: Message = {
      id: tempId,
      conversation_id: conversationId,
      user_id: me.id,
      content: text,
      created_at: now,
      status: "sending",
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await axios.post("/api/messages/message-created", {
        conversation_id: conversationId,
        content: text,
        taskId,
      });

      if (res.data.error) throw new Error("Failed to send message");

      const savedMessage = res.data.message;

      console.log("📤 Message saved to DB:", savedMessage);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...savedMessage, status: "sent" } : m
        )
      );

      const broadcastPromises = [];

      if (channelRef.current) {
        const broadcastPayload = {
          type: "broadcast",
          event: "message",
          payload: { message: savedMessage },
        };

        console.log("📡 Broadcasting to conversation channel");
        broadcastPromises.push(channelRef.current.send(broadcastPayload));
      }

      const sidebarChannelName = `sidebar:${conversationId}`;
      console.log(`📡 Broadcasting to ${sidebarChannelName}`);
      
      const sidebarChannel = supabaseBrowser.channel(sidebarChannelName, {
        config: {
          broadcast: { self: true, ack: true },
        },
      });

      await sidebarChannel.subscribe();
      
      const sidebarBroadcast = sidebarChannel.send({
        type: "broadcast",
        event: "message",
        payload: { message: savedMessage },
      });

      broadcastPromises.push(sidebarBroadcast);

      // Wait for both broadcasts
      const results = await Promise.all(broadcastPromises);
      console.log("✅ Broadcast results:", results);

      // Clean up sidebar channel after short delay
      setTimeout(() => {
        supabaseBrowser.removeChannel(sidebarChannel);
      }, 100);

      // Send notification if other user is not viewing
      const otherUserIsViewing =
        OtherUserId && activeUsers.includes(String(OtherUserId));

      if (!otherUserIsViewing && OtherUserId) {
        await createNotification({
          userId: String(OtherUserId),
          type: "message",
          user_name: `${session?.user.name}`,
          title: `${session?.user.name} is messaging you`,
          body: `You have received a message from ${session?.user.name}`,
        });
      }
    } catch (err) {
      console.error("Send message error:", err);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
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