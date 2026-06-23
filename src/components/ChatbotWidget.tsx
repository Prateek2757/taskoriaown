"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const quickRepliesClass = "flex flex-wrap gap-2";
const quickReplyButtonClass = "cursor-pointer rounded-full border border-blue-200 bg-card px-3 py-2 text-xs font-medium text-blue-700 transition hover:-translate-y-px hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-600 dark:text-blue-300 dark:hover:bg-slate-800";
const summaryItemClass = "grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2 py-1 text-xs";
const summaryLabelClass = "font-semibold text-muted-foreground";
const summaryValueClass = "break-words text-card-foreground";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  summaryCard?: "job" | "provider" | null;
}

interface LeadData {
  service?: string;
  location?: string;
  description?: string;
  timing?: string;
  urgency?: string;
  name?: string;
  phone?: string;
  email?: string;
  contactMethod?: string;
  consent?: boolean;
}

interface ProviderData {
  businessName?: string;
  category?: string;
  location?: string;
  abn?: string;
  licensed?: string;
  contactName?: string;
  phone?: string;
  email?: string;
}

type ChatMode = "chat" | "lead_flow" | "provider_flow";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  // Structured flow state
  const [leadStep, setLeadStep] = useState(0);
  const [leadData, setLeadData] = useState<LeadData>({});

  const [providerStep, setProviderStep] = useState(0);
  const [providerData, setProviderData] = useState<ProviderData>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chatbot welcome message
  useEffect(() => {
    const welcomeMsg: Message = {
      role: "assistant",
      content: "Hi, I’m Taskoria Assistant. I can help you post a job, find a provider, or join as a professional.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, leadStep, providerStep]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen((open) => {
      if (!open) setHasUnread(false);
      return !open;
    });
  };

  const addMessage = (role: "user" | "assistant", content: string, summaryCard?: "job" | "provider" | null) => {
    const newMsg: Message = {
      role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      summaryCard: summaryCard || null,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleReset = () => {
    const welcomeMsg: Message = {
      role: "assistant",
      content: "Hi, I’m Taskoria Assistant. I can help you post a job, find a provider, or join as a professional.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
    setMode("chat");
    setLeadStep(0);
    setLeadData({});
    setProviderStep(0);
    setProviderData({});
    setInputValue("");
  };

  // State machine handlers for Lead Capture Flow
  const startLeadFlow = (initialService = "") => {
    setMode("lead_flow");
    const updatedData = { service: initialService };
    setLeadData(updatedData);

    if (initialService) {
      addMessage("assistant", `Great, let's post a job for a ${initialService}! Where is the job located? Please enter the suburb, postcode, and state.`);
      setLeadStep(1); // Skip service name since we already got it
    } else {
      addMessage("assistant", "What service do you need? (e.g., cleaner, plumber, electrician, gardener, removalist, photographer, accountant, builder)");
      setLeadStep(0);
    }
  };

  const handleLeadStep = (value: string) => {
    const text = value.trim();
    if (!text && leadStep !== 4 && leadStep !== 8 && leadStep !== 9) return; // allow empty only for specific buttons

    addMessage("user", text || "Yes");

    const updatedData = { ...leadData };

    switch (leadStep) {
      case 0: // Service category
        updatedData.service = text;
        setLeadData(updatedData);
        addMessage("assistant", "Where is the job located? Please provide the suburb, postcode, and state.");
        setLeadStep(1);
        break;

      case 1: // Location
        updatedData.location = text;
        setLeadData(updatedData);
        addMessage("assistant", "Could you describe the job details? What would you like the professional to do?");
        setLeadStep(2);
        break;

      case 2: // Description
        updatedData.description = text;
        setLeadData(updatedData);
        addMessage("assistant", "When do you need it done? (e.g. As soon as possible, Within this week, Flexible)");
        setLeadStep(3);
        break;

      case 3: // Timing
        updatedData.timing = text;
        setLeadData(updatedData);
        addMessage("assistant", "Is this job urgent?");
        setLeadStep(4);
        break;

      case 4: // Urgency (handled via buttons mostly, but user could type)
        updatedData.urgency = text;
        setLeadData(updatedData);
        addMessage("assistant", "Got it. May I have your full name?");
        setLeadStep(5);
        break;

      case 5: // Name
        updatedData.name = text;
        setLeadData(updatedData);
        addMessage("assistant", "What is your phone number?");
        setLeadStep(6);
        break;

      case 6: // Phone
        updatedData.phone = text;
        setLeadData(updatedData);
        addMessage("assistant", "What is your email address?");
        setLeadStep(7);
        break;

      case 7: // Email
        updatedData.email = text;
        setLeadData(updatedData);
        addMessage("assistant", "What is your preferred contact method?");
        setLeadStep(8);
        break;

      case 8: // Preferred contact
        updatedData.contactMethod = text;
        setLeadData(updatedData);
        addMessage("assistant", "Do you consent to be contacted by Taskoria and matching professionals regarding this job request?");
        setLeadStep(9);
        break;

      case 9: // Consent
        updatedData.consent = text.toLowerCase().includes("agree") || text.toLowerCase().includes("yes");
        setLeadData(updatedData);

        if (!updatedData.consent) {
          addMessage("assistant", "No problem. I haven't saved or submitted your request. You can reset the conversation if you'd like to start again.");
          setLeadStep(10);
          break;
        }

        // Save progress to local storage so post-a-job route can prefill
        try {
          localStorage.setItem("taskoria_job_draft", JSON.stringify(updatedData));
        } catch {
          // The flow still works when storage is unavailable (for example, private browsing).
        }

        addMessage("assistant", "Great, your job details are ready. Click below to post your job for free.", "job");
        setLeadStep(10);
        break;
    }
  };

  // State machine handlers for Provider Onboarding Flow
  const startProviderFlow = () => {
    setMode("provider_flow");
    setProviderStep(0);
    setProviderData({});
    addMessage("assistant", "Let's get your professional profile ready! What is your registered business name?");
  };

  const handleProviderStep = (value: string) => {
    const text = value.trim();
    if (!text && providerStep !== 3 && providerStep !== 4) return;

    addMessage("user", text || "Skipped/Yes");

    const updatedData = { ...providerData };

    switch (providerStep) {
      case 0: // Business name
        updatedData.businessName = text;
        setProviderData(updatedData);
        addMessage("assistant", "What category of services do you offer? (e.g. plumbing, cleaning, accounting)");
        setProviderStep(1);
        break;

      case 1: // Category
        updatedData.category = text;
        setProviderData(updatedData);
        addMessage("assistant", "Which suburb, city, or state do you serve?");
        setProviderStep(2);
        break;

      case 2: // Service area
        updatedData.location = text;
        setProviderData(updatedData);
        addMessage("assistant", "What is your ABN (Australian Business Number)? You can skip if not available.");
        setProviderStep(3);
        break;

      case 3: // ABN
        updatedData.abn = text || "Not provided";
        setProviderData(updatedData);
        addMessage("assistant", "Do you hold active professional licences and insurance if required for your trade?");
        setProviderStep(4);
        break;

      case 4: // License/insurance
        updatedData.licensed = text || "Yes";
        setProviderData(updatedData);
        addMessage("assistant", "What is the primary contact name for your business?");
        setProviderStep(5);
        break;

      case 5: // Contact name
        updatedData.contactName = text;
        setProviderData(updatedData);
        addMessage("assistant", "What is your contact phone number?");
        setProviderStep(6);
        break;

      case 6: // Phone
        updatedData.phone = text;
        setProviderData(updatedData);
        addMessage("assistant", "What is your contact email address?");
        setProviderStep(7);
        break;

      case 7: // Email
        updatedData.email = text;
        setProviderData(updatedData);

        // Save progress to local storage so join-as-provider route can prefill
        try {
          localStorage.setItem("taskoria_provider_draft", JSON.stringify(updatedData));
        } catch {
          // The flow still works when storage is unavailable.
        }

        addMessage("assistant", "Fantastic! Your details are ready. Click below to complete your registration as a professional.", "provider");
        setProviderStep(8);
        break;
    }
  };

  // AI Chat Handler
  const handleAIChat = async (userMsgText: string) => {
    addMessage("user", userMsgText);
    setIsLoading(true);

    try {
      // Build conversation history format for endpoint
      // We map the latest messages to match the route contract
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Append latest user message
      history.push({ role: "user", content: userMsgText });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with chat server.");
      }

      const data = await res.json();
      setIsLoading(false);

      // Intent transition checking
      if (data.intent === "post_job") {
        addMessage("assistant", data.text || "Let's collect your job details to find a professional.");
        // If service was extracted, start lead flow directly with that service
        const extractedService = data.extractedData?.service || "";
        setTimeout(() => startLeadFlow(extractedService), 800);
      } else if (data.intent === "join_provider") {
        addMessage("assistant", data.text || "Let's get your business listed as a provider on Taskoria.");
        setTimeout(() => startProviderFlow(), 800);
      } else {
        // General Q&A response
        addMessage("assistant", data.text || "I'm here to help. You can post a job, find a provider, or join as a professional.");
      }
    } catch (err) {
      setIsLoading(false);
      addMessage(
        "assistant",
        "Sorry, I ran into an error connecting to my server. Taskoria can help you receive quotes from local professionals, but availability and pricing depend on provider responses. For urgent help, please reach out to contact@taskoria.com or call 1300 531 727."
      );
      console.error(err);
    }
  };

  // Handle Send Button click or Enter press
  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    setInputValue("");

    if (mode === "lead_flow") {
      handleLeadStep(text);
    } else if (mode === "provider_flow") {
      handleProviderStep(text);
    } else {
      handleAIChat(text);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleQuickReply = (label: string, value: string) => {
    if (value === "post_job") {
      addMessage("user", label);
      setTimeout(() => startLeadFlow(""), 300);
    } else if (value === "join_provider") {
      addMessage("user", label);
      setTimeout(() => startProviderFlow(), 300);
    } else {
      handleAIChat(value);
    }
  };

  return (
    <div className="fixed right-3 bottom-3 left-3 z-[1000] flex flex-col items-end font-[var(--font-inter),sans-serif] min-[481px]:right-6 min-[481px]:bottom-6 min-[481px]:left-auto">
      {/* Floating Chat Bubble Button */}
      {isOpen ? (
        <div className="mb-4 flex h-[calc(100dvh-100px)] max-h-[520px] w-full origin-bottom-right flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[0_12px_40px_rgba(15,23,42,0.15)] min-[481px]:h-[580px] min-[481px]:max-h-none min-[481px]:w-[380px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-br from-slate-900 to-slate-700 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex size-[38px] items-center justify-center rounded-full bg-[var(--primary)] text-xl shadow-[0_2px_8px_rgba(13,148,136,0.3)]">🇦🇺</div>
              <div className="flex flex-col">
                <span className="text-[15px] leading-[1.2] font-bold">Taskoria Assistant</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span className="size-1.5 rounded-full bg-green-500" /> Active Support
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="flex cursor-pointer items-center justify-center rounded p-1 text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white" title="Reset Conversation" onClick={handleReset}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
              <button className="flex cursor-pointer items-center justify-center rounded p-1 text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white" title="Close Chat" onClick={toggleChat}>
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages scroll content */}
          <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto bg-slate-50 p-5">
            {messages.map((msg, index) => (
              <div key={index} className="flex w-full flex-col">
                <div className={`flex max-w-[85%] flex-col px-4 py-3 text-sm leading-[1.45] shadow-sm ${msg.role === "user" ? "self-end rounded-[8px_0_8px_8px] bg-primary text-primary-foreground" : "self-start rounded-[0_8px_8px_8px] border border-border bg-card text-card-foreground"}`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <span className={`mt-1 self-end text-[10px] ${msg.role === "user" ? "text-white/70" : "text-[var(--text-muted)]"}`}>{msg.timestamp}</span>
                </div>

                {/* Lead Flow Summary Card */}
                {msg.summaryCard === "job" && (
                  <div className="mt-2 w-full rounded-lg border border-blue-200 bg-card p-4 shadow-sm dark:border-slate-700">
                    <div className="mb-2.5 border-b border-border pb-1.5 text-[13px] font-bold tracking-[0.05em] text-card-foreground uppercase">Job Request Summary</div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Service:</span>
                      <span className={summaryValueClass}>{leadData.service}</span>
                    </div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Location:</span>
                      <span className={summaryValueClass}>{leadData.location}</span>
                    </div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Description:</span>
                      <span className={summaryValueClass}>{leadData.description}</span>
                    </div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Timing:</span>
                      <span className={summaryValueClass}>{leadData.timing}</span>
                    </div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Urgency:</span>
                      <span className={summaryValueClass}>{leadData.urgency}</span>
                    </div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Contact Name:</span>
                      <span className={summaryValueClass}>{leadData.name}</span>
                    </div>
                    <Link href="/post-a-job" className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={() => setIsOpen(false)}>
                      Post Your Job for Free
                    </Link>
                  </div>
                )}

                {/* Provider Onboarding Summary Card */}
                {msg.summaryCard === "provider" && (
                  <div className="mt-2 w-full rounded-lg border border-blue-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-2.5 border-b border-slate-200 pb-1.5 text-[13px] font-bold tracking-[0.05em] text-slate-800 uppercase dark:border-slate-700 dark:text-slate-100">Provider Profile Summary</div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Business:</span>
                      <span className={summaryValueClass}>{providerData.businessName}</span>
                    </div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Category:</span>
                      <span className={summaryValueClass}>{providerData.category}</span>
                    </div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Service Area:</span>
                      <span className={summaryValueClass}>{providerData.location}</span>
                    </div>
                    <div className={summaryItemClass}>
                      <span className={summaryLabelClass}>Contact:</span>
                      <span className={summaryValueClass}>{providerData.contactName}</span>
                    </div>
                    <Link href="/create" className="mt-3 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={() => setIsOpen(false)}>
                      Complete Registration
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Quick replies showing conditionally */}
            {mode === "chat" && !isLoading && (
              <div className="flex flex-wrap gap-2">
                <button className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-blue-300" onClick={() => handleQuickReply("Post a Job", "post_job")}>
                  Post a Job 📝
                </button>
                <button className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-blue-300" onClick={() => handleQuickReply("Find a Provider", "post_job")}>
                  Find a Provider 🔍
                </button>
                <button className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-blue-300" onClick={() => handleQuickReply("Join as Provider", "join_provider")}>
                  Join as Provider 💼
                </button>
                <button className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-blue-300" onClick={() => handleQuickReply("Trust & Safety", "Tell me about trust and safety on Taskoria")}>
                  Trust & Safety 🛡️
                </button>
                <button className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-blue-300" onClick={() => handleQuickReply("Pricing", "What are the fees or pricing?")}>
                  Pricing 💰
                </button>
                <button className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-blue-300" onClick={() => handleQuickReply("Contact Support", "How can I contact support?")}>
                  Contact Support 📞
                </button>
              </div>
            )}

            {/* In-flow Quick replies */}
            {mode === "lead_flow" && leadStep === 4 && (
              <div className={quickRepliesClass}>
                <button className={quickReplyButtonClass} onClick={() => handleLeadStep("Yes, Urgent")}>
                  Yes, Urgent ⚡
                </button>
                <button className={quickReplyButtonClass} onClick={() => handleLeadStep("No, standard timeline")}>
                  No, standard timeline 📅
                </button>
              </div>
            )}

            {mode === "lead_flow" && leadStep === 8 && (
              <div className={quickRepliesClass}>
                <button className={quickReplyButtonClass} onClick={() => handleLeadStep("Phone call")}>
                  Phone call 📞
                </button>
                <button className={quickReplyButtonClass} onClick={() => handleLeadStep("Email")}>
                  Email ✉️
                </button>
                <button className={quickReplyButtonClass} onClick={() => handleLeadStep("Text message")}>
                  Text message 💬
                </button>
              </div>
            )}

            {mode === "lead_flow" && leadStep === 9 && (
              <div className={quickRepliesClass}>
                <button className={quickReplyButtonClass} onClick={() => handleLeadStep("I Agree")}>
                  I Agree ✅
                </button>
                <button className={quickReplyButtonClass} onClick={() => handleLeadStep("Decline")}>
                  Decline ❌
                </button>
              </div>
            )}

            {mode === "provider_flow" && providerStep === 3 && (
              <div className={quickRepliesClass}>
                <button className={quickReplyButtonClass} onClick={() => handleProviderStep("")}>
                  Skip ABN ➡️
                </button>
              </div>
            )}

            {mode === "provider_flow" && providerStep === 4 && (
              <div className={quickRepliesClass}>
                <button className={quickReplyButtonClass} onClick={() => handleProviderStep("Yes, licensed and insured")}>
                  Yes, licensed and insured ✅
                </button>
                <button className={quickReplyButtonClass} onClick={() => handleProviderStep("Not applicable for my services")}>
                  Not applicable 🚫
                </button>
              </div>
            )}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="self-start rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-sm" aria-label="Assistant is typing" role="status">
                <div className="flex min-h-4 items-center gap-1">
                  <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                  <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <div className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          {((mode === "lead_flow" && leadStep > 9) || (mode === "provider_flow" && providerStep > 7)) ? (
            <div className="flex items-center justify-center gap-2.5 border-t border-border bg-card p-3 text-[13px] text-muted-foreground">
              Flow completed. Thank you!
            </div>
          ) : (
            <div className="flex items-center gap-2.5 border-t border-border bg-card p-3">
              <input
                ref={inputRef}
                className="min-w-0 flex-1 rounded-full border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                type="text"
                placeholder={
                  mode === "lead_flow"
                    ? `Step ${leadStep + 1}/10: Enter details...`
                    : mode === "provider_flow"
                    ? `Step ${providerStep + 1}/8: Enter details...`
                    : "Type your message..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
              <button className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-45" onClick={handleSend} disabled={isLoading || !inputValue.trim()} aria-label="Send message">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : null}

      <button className="relative flex size-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 [&_svg]:size-6" onClick={toggleChat} aria-label={isOpen ? "Close support chat" : "Open support chat"} aria-expanded={isOpen}>
        {isOpen ? (
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.625.625 0 11-1.25 0 .625.625 0 011.25 0zm4.5 0a.625.625 0 11-1.25 0 .625.625 0 011.25 0zm4.5 0a.625.625 0 11-1.25 0 .625.625 0 011.25 0zM12 3c4.97 0 9 3.582 9 8c0 2.247-1.025 4.286-2.687 5.75L20 21l-4.5-1.5c-1.07.3-2.22.45-3.5.45-4.97 0-9-3.582-9-8s4.03-8 9-8z" />
            </svg>
            {hasUnread && <span className="absolute top-0.5 right-0.5 size-3 rounded-full border-2 border-white bg-red-500" />}
          </>
        )}
      </button>
    </div>
  );
}
