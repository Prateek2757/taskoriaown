"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Phone, Video, MoreVertical } from "lucide-react";

// Types
interface Conversation {
  id: number;
  name: string;
  service: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  profileImage: string;
}

interface Message {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  isProvider: boolean;
}

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [newMessage, setNewMessage] = useState<string>("");

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      service: "Interior Design",
      lastMessage: "I'll be there at 2 PM tomorrow for the consultation.",
      timestamp: "10:30 AM",
      unread: 2,
      online: true,
      profileImage:
        "https://images.unsplash.com/photo-1494790108755-2616b12b2134?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Mike Chen",
      service: "Plumbing",
      lastMessage: "The parts have arrived. When can I schedule the repair?",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      service: "Photography",
      lastMessage: "Thank you for choosing me for your wedding photography!",
      timestamp: "2 days ago",
      unread: 0,
      online: true,
      profileImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "David Kim",
      service: "Web Development",
      lastMessage: "The website is ready for review. Here's the preview link.",
      timestamp: "3 days ago",
      unread: 1,
      online: false,
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: 1,
      sender: "Sarah Johnson",
      message:
        "Hi! I received your booking for the interior design consultation. I'm excited to work with you!",
      timestamp: "9:15 AM",
      isProvider: true,
    },
    {
      id: 2,
      sender: "You",
      message:
        "Thank you! I'm looking forward to it. Could you let me know what I should prepare before our meeting?",
      timestamp: "9:20 AM",
      isProvider: false,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      message:
        "Great question! Please prepare:\n• Photos of your current space\n• Budget range\n• Style preferences or inspiration photos\n• List of functional requirements",
      timestamp: "9:25 AM",
      isProvider: true,
    },
    {
      id: 4,
      sender: "You",
      message:
        "Perfect! I'll have all of that ready. What time works best for you tomorrow?",
      timestamp: "9:30 AM",
      isProvider: false,
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      message:
        "I'll be there at 2 PM tomorrow for the consultation. Looking forward to seeing your space!",
      timestamp: "10:30 AM",
      isProvider: true,
    },
  ];

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg" />
            <span className="text-2xl font-bold text-gray-900">Taskoria</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/discover"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Browse Services
            </Link>
            <Button variant="outline">Profile</Button>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-80px)]">
        {/* Conversations Sidebar */}
        <div className="md:w-1/3 w-full bg-white border-r flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id
                    ? "bg-blue-50 border-r-2 border-r-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={conversation.profileImage}
                        alt={conversation.name}
                      />
                      <AvatarFallback>
                        {conversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {conversation.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 mb-1">
                      {conversation.service}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={selectedConv.profileImage}
                        alt={selectedConv.name}
                      />
                      <AvatarFallback>
                        {selectedConv.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConv.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedConv.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedConv.service}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isProvider ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        message.isProvider ? "order-2" : ""
                      }`}
                    >
                      {message.isProvider && (
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={selectedConv.profileImage}
                              alt={selectedConv.name}
                            />
                            <AvatarFallback className="text-xs">
                              {selectedConv.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500">
                            {message.sender}
                          </span>
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.isProvider
                            ? "bg-gray-100 text-gray-900"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">
                          {message.message}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <p className="text-gray-500 mb-4">
                  Select a conversation to start messaging
                </p>
                <Button asChild>
                  <Link href="/discover">Find Service Providers</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
