"use client";
import { useSession } from "next-auth/react";
import ChatWindow from "@/components/chatWindow";
import { useConversation } from "@/hooks/useConversation";

export default function ChatPage({ otherUserId }: { otherUserId: string | number }) {
  const { data: session } = useSession();
  const { conversationId, loading, error } = useConversation(
    [String(otherUserId)], // users involved (excluding self)
    "Private Chat"
  );

  if (!session?.user) return <div>Please login</div>;
  if (loading) return <div>Loading conversation...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!conversationId) return <div>Could not create conversation</div>;

  return (
    <ChatWindow
      conversationId={conversationId}
      me={{ id: session.user.id, name: session.user.name || "" }}
    />
  );
}
