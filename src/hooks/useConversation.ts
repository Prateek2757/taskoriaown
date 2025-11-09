"use client";
import { useState, useEffect } from "react";

export function useConversation(participantIds: string[], title?: string) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!participantIds || participantIds.length === 0) return;

    async function fetchOrCreate() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/messages/create-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantIds, title }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to get conversation");
        }

        const data = await res.json();
        setConversationId(data.conversation.id);
      } catch (err: any) {
        console.error("useConversation error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrCreate();
  }, [participantIds.join(",")]); // re-run if participants change

  return { conversationId, loading, error };
}
