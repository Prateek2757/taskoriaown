"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";

export function useConversation(
  participantIds: string[],
  title: string,
  taskId: number | string,
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
    if ( status !== "authenticated" || !session?.user?.id || !taskId)
      return;

    setLoading(true);
    setError(null);

    try {
      const checkRes = await fetch(`/api/messages/conversation-check/${taskId}`);
      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.conversationId) {
        setConversationId(checkData.conversationId);
        return;
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

      if (createRes.ok && createData.conversationId) {
        setConversationId(createData.conversationId);
      } 
    } catch (err: any) {
      console.error("Conversation hook error:", err);
      setError(err?.message || "Error while preparing conversation");
    } finally {
      setLoading(false);
    }
  }, [ status, session?.user?.id, taskId, title, stableParticipants]);

  useEffect(() => {
    fetchOrCreateConversation();
  }, [fetchOrCreateConversation]);

  return { conversationId, loading, error , refetch:fetchOrCreateConversation};
}