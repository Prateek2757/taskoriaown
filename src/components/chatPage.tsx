"use client";
import { useSession } from "next-auth/react";
import ChatWindow from "@/components/chatWindow";
import { useConversation } from "@/hooks/useConversation";

interface ChatPageProps{
  otherUserId:string | number,
  taskId: number
}

export default function ChatPage(
  { otherUserId , taskId} :ChatPageProps
 
) {
  const { data: session } = useSession();
  const { conversationId, loading, error } = useConversation(
    [String(otherUserId)],
    "Private Chat",
    taskId
  );

  if (!session?.user) return <div>Please login</div>;
  if (loading) return <div>Loading conversation...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!conversationId) return <div>Could not create conversation</div>;

  return (
    <ChatWindow
      conversationId={conversationId}
      me={{ id: session.user.id, name: session.user.name || "" }}
      taskId ={taskId} 
        />
  );
}
