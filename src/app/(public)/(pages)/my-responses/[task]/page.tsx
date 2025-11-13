"use client";

import ChatPage from "@/components/chatPage";
import { useSearchParams } from "next/navigation";

export default function ChatRoute({ params }: { params: { task: string } }) {
  const searchParams = useSearchParams();
  const otherUserId = searchParams.get("u");

  if (!otherUserId) {
    return <div className="p-6">Missing user. Cannot load chat.</div>;
  }

  return (
    <div className="h-screen">
      <ChatPage
        otherUserId={otherUserId}
        taskId={Number(params.task)}
      />
    </div>
  );
}