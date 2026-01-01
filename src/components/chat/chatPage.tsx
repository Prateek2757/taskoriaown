"use client";

import { useSession } from "next-auth/react";
import { useConversation } from "@/hooks/useConversation";
import ChatWindow from "./chatWindow";

interface ChatPageProps {
  otherUserId: string | number;
  taskId: number;
}

export default function ChatPage({ otherUserId, taskId }: ChatPageProps) {
  const { data: session, status } = useSession();
  const { conversationId, loading, error } = useConversation(
    [String(otherUserId)],
    "Private Chat",
    taskId
  );
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            🔐 Authentication Required
          </p>
          <p className="text-gray-600">Please login to access chat.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    const notPurchased =
      error.toLowerCase().includes("not purchased") ||
      error.toLowerCase().includes("unauthorized");

    if (notPurchased) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              🔒 Lead Not Purchased
            </p>
            <p className="text-gray-600">
              You need to purchase this lead to start chatting.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <p className="text-lg font-semibold text-red-900 mb-2">
            ⚠️ Error Loading Chat
          </p>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (conversationId) {
    return (
      
            
      <ChatWindow
        conversationId={conversationId}
        OtherUserId={String(otherUserId)}
        me={{ id: session.user.id, name: session.user.name || "" }}
        taskId={taskId}
      />
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-lg font-semibold text-gray-900 mb-2">
          💬 Could Not Create Conversation
        </p>
        <p className="text-gray-600">Please try again or contact support.</p>
      </div>
    </div>
  );
}
