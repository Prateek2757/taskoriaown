// "use client";
// import { useState, useRef, useEffect } from "react";
// import { MessageCircle, X, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { motion, AnimatePresence } from "motion/react";

// type Message = {
//   id: string;
//   text: string;
//   sender: "user" | "bot";
//   timestamp: Date;
// };

// export default function SupportChatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       text: "Hi! I'm your AI assistant. How can I help you today?",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ]);
//   const [input, setInput] = useState("");

//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Quick actions
//   const quickActions = [
//     "How do I request a quote?",
//     "What if a provider doesn't respond?",
//     "How does payment work?",
//     "How do I contact support?",
//   ];

//   // Auto-scroll on new message
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSend = () => {
//     if (!input.trim()) return;

//     const userMsg: Message = {
//       id: Date.now().toString(),
//       text: input,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");

//     // Simulate bot response
//     setTimeout(() => {
//       const botMsg: Message = {
//         id: (Date.now() + 1).toString(),
//         text: "Thanks for your question! A support agent will assist you shortly, or you can browse our Help Center for immediate answers.",
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMsg]);
//     }, 1000);
//   };

//   return (
//     <>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.8, y: 20 }}
//             className="fixed bottom-24 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-card  rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
//           >
//             <div className="text-white p-4 rounded-t-2xl bg-blue-600 animate-gradient flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="h-8 w-8 rounded-full bg-white/20 grid place-content-center">
//                   <MessageCircle className="h-4 w-4" />
//                 </div>
//                 <div>
//                   <div className="font-semibold">Support Assistant</div>
//                   <div className="text-xs opacity-90">Always here to help</div>
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="text-white hover:bg-white/20"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>

//             <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
//               <div className="space-y-4 break-words">
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`max-w-[80%] break-words rounded-2xl px-4 py-2 ${
//                         msg.sender === "user"
//                           ? "text-primary-foreground bg-primary"
//                           : "bg-muted text-foreground"
//                       }`}
//                     >
//                       <p className="text-sm">{msg.text}</p>
//                       <p className="text-xs opacity-70 mt-1">
//                         {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                       </p>
//                     </div>
//                   </div>
//                 ))}

//                 {messages.length === 1 && (
//                   <div className="space-y-2 mt-4">
//                     <p className="text-xs text-muted-foreground">Quick actions:</p>
//                     {quickActions.map((action, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => {
//                           setInput(action);
//                           handleSend();
//                         }}
//                         className="block w-full text-left text-sm border border-border rounded-lg px-3 py-2 hover:bg-accent transition"
//                       >
//                         {action}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </ScrollArea>

//             <div className="p-4 border-t">
//               <div className="flex gap-2">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                   placeholder="Type your message..."
//                   className="flex-1"
//                 />
//                 <Button onClick={handleSend} size="icon" className="bg-blue-600 animate-gradient text-white">
//                   <Send className="h-5 w-4" />
//                 </Button>
//               </div>
//               <p className="text-xs text-muted-foreground mt-2 text-center">
//                 Powered by AI • 24/7 Support
//               </p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed bottom-3 right-4 h-14 w-14 rounded-full bg-blue-700 animate-gradient text-white shadow-glow-lg z-50 grid place-content-center"
//         aria-label="Open support chat"
//       >
//         {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
//       </motion.button>
//     </>
//   );
// } 
"use client";
import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "‪+61 474 655 902‬";

export default function WhatsAppSupportButton() {
  const message = "Hi, I need support regarding your service.";

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleWhatsApp}
      className="fixed bottom-3 right-2 h-14 w-14 rounded-full bg-[#2AB319] text-white shadow-glow-lg z-50 grid place-content-center"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="h-11 w-12" />
    </motion.button>
  );
}