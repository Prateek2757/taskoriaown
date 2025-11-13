"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";

export function useConversation(
  participantIds: string[],
  title: string,
  taskId: number | string
) {
  const { data: session, status } = useSession();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Ensure participantIds array is stable
  const stableParticipants = useMemo(() => {
    return Array.from(new Set(participantIds.filter(Boolean)));
  }, [participantIds.join(",")]);

  const fetchOrCreateConversation = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id || !taskId) return;

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Check if purchased
      const purchaseRes = await fetch(`/api/admin/task-responses/${taskId}`);
      const purchaseData = await purchaseRes.json();

      if (!purchaseRes.ok) throw new Error(purchaseData.error || "Failed to check lead status");
      if (!purchaseData.purchased) {
        setConversationId(null);
        setError("Lead not purchased");
        return;
      }

      // 2️⃣ Check if conversation exists
      const checkRes = await fetch(`/api/messages/conversation-check/${taskId}`);
      const checkData = await checkRes.json();

      if (checkData.conversationId) {
        setConversationId(checkData.conversationId);
        return;
      }

      // 3️⃣ Create new conversation
      const createRes = await fetch("/api/messages/create-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          taskId,
          participantIds: [...stableParticipants, session.user.id],
        }),
      });

      const createData = await createRes.json();

      if (createRes.ok && createData.conversationId) {
        setConversationId(createData.conversationId);
      } else if (createData.message?.toLowerCase().includes("already exists")) {
        const retry = await fetch(`/api/messages/conversation-check/${taskId}`);
        const retryData = await retry.json();
        setConversationId(retryData.conversationId || null);
      } else {
        console.warn("Conversation creation failed:", createData.message);
        setConversationId(null);
      }
    } catch (err: any) {
      console.error("Conversation hook error:", err);
      setError(err?.message || "Error while preparing conversation");
    } finally {
      setLoading(false);
    }
  }, [status, session?.user?.id, taskId, title, stableParticipants]);

  useEffect(() => {
    fetchOrCreateConversation();
  }, [fetchOrCreateConversation]);

  return { conversationId, loading, error };
}