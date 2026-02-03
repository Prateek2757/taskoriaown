// "use client";

// import ChatPage from "@/components/chat/chatPage";
// import { useSearchParams } from "next/navigation";
// import { use } from "react";

// export default function ChatRoute({ params }: { params: Promise<{ task: string }> }) {
//   const unwrappedParams = use(params); // unwrap the promise
//   const taskId = unwrappedParams.task;

//   const searchParams = useSearchParams();
//   const otherUserId = searchParams.get("u");

//   if (!otherUserId) {
//     return <div className="p-6">Missing user. Cannot load chat.</div>;
//   }

//   return (
//     <div className="h-screen">
//       <ChatPage otherUserId={otherUserId} taskId={Number(taskId)} />
//     </div>
//   );
// }