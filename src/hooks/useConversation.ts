"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";

export function useConversation(
  participantIds: string[],
  title: string,
  taskId: number | string | null,
) {
  const { data: session, status } = useSession();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stableParticipants = useMemo(
    () => Array.from(new Set(participantIds.filter(Boolean))),
    [participantIds.join(",")]
  );

  const fetchOrCreateConversation = useCallback(async () => {
    if (!taskId || status !== "authenticated" || !session?.user?.id) {
      setConversationId(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const checkRes = await fetch(
        `/api/messages/conversation-check/${taskId}?participants=${stableParticipants.join(",")}`,
        { cache: "no-store" }
      );
      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.conversationId) {
        setConversationId(checkData.conversationId);
        setLoading(false);
        return checkData.conversationId;
      }

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

      if (createRes.ok && createData.conversation?.id) {
        const newConvoId = createData.conversation.id;
        setConversationId(newConvoId);
        setLoading(false);
        return newConvoId;
      } else {
        const errorMsg = createData.error || createData.message || "Failed to create conversation";
        setError(errorMsg);
        setLoading(false);
        return null;
      }
    } catch (err: any) {
      console.error("Conversation hook error:", err);
      const errorMsg = err?.message || "Error while preparing conversation";
      setError(errorMsg);
      setLoading(false);
      return null;
    }
  }, [taskId, stableParticipants.join(","), session?.user?.id, status, title]);

  useEffect(() => {
    if (taskId && status === "authenticated" && session?.user?.id) {
      fetchOrCreateConversation();
    }
  }, [taskId, status, session?.user?.id]);

  return {
    conversationId,
    loading,
    error,
    refetch: fetchOrCreateConversation,
  };
}