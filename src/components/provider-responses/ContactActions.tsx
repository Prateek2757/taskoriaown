"use client";

import {
  Phone,
  MessageCircle,
  Mail,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import ContactAction from "./ContactAction";
import { ProviderResponse } from "@/types";
import { useState } from "react";
import EstimateModal from "./EstimateModal";
import EmailComposeModal from "./EmailComposeModal";


const compactColor = (bg: string) => {
  const map: Record<string, string> = {
    "bg-blue-500":
      "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    "bg-green-500":
      "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
"bg-violet-500":
  "bg-[#E24134]/10 text-[#E24134] border-[#E24134]/30 dark:bg-[#E24134]/20 dark:text-[#ff6a5c] dark:border-[#E24134]/40",
    "bg-cyan-500":
      "bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800",
    "bg-amber-500":
      "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  };

  return map[bg] || "";
};

const getActions = (response: ProviderResponse) => {
  const phone = response.customer_phone;
  const email = response.customer_email;

  return [
    {
      icon: Phone,
      label: "Call",
      condition: !!phone,
      description: "Connect directly to discuss their project",
      actionLabel: `Call ${phone}`,
      href: `tel:${phone}`,
      iconBg: "bg-blue-500",
hover:
"hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-500 dark:hover:text-white"
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      condition: !!phone,
      description: "Message them on WhatsApp",
      actionLabel: "Open WhatsApp",
      href: `https://wa.me/${phone?.replace(/\D/g, "")}?text=Hi ${encodeURIComponent(
        response.customer_name
      )}, I saw your request on the platform.`,
      target: "_blank",
      iconBg: "bg-green-500",
hover:
"hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-green-500 dark:hover:text-white"
    },
    {
      icon: Mail,
      label: "Email",
      condition: !!email,
      description: "Send a professional email",
      actionLabel: `Email ${email}`,
      type: "email", 
      iconBg: "bg-violet-500",
hover:
  "hover:bg-[#E24134] hover:text-white hover:border-[#E24134] dark:hover:bg-[#E24134] dark:hover:text-white"
    },
    {
      icon: MessageSquare,
      label: "SMS",
      condition: !!phone,
      description: "Send a quick text message",
      actionLabel: `SMS ${phone}`,
      href: `sms:${phone}`,
      iconBg: "bg-cyan-500",
hover:
"hover:bg-cyan-600 hover:text-white hover:border-cyan-600 dark:hover:bg-cyan-500 dark:hover:text-white"
    },
    {
      icon: DollarSign,
      label: "Estimate",
      condition: true,
      description: "Send a price quote for the job",
      actionLabel: "Send Estimate",
      type: "estimate",
      iconBg: "bg-amber-500",
hover:
"hover:bg-amber-500 hover:text-white hover:border-amber-500 dark:hover:bg-amber-400 dark:hover:text-black"
    },
  ].filter((a) => a.condition);
};

interface ContactActionsProps {
  response: ProviderResponse;
  variant?: "compact" | "full";
}

export default function ContactActions({
  response,
  variant = "full",
}: ContactActionsProps) {
  const actions = getActions(response);
  const [openEstimate, setOpenEstimate] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);

  if (variant === "compact") {
    return (
      <>
        {actions.map(({ icon: Icon, label, href, target, hover, type ,iconBg}) => {
          if (type === "estimate") {
            return (
              <button
              key={label}
              onClick={() => setOpenEstimate(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${compactColor(
                iconBg
              )} ${hover}`}
            >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            );
          }
 
          if (type === "email") {
            return (
              <button
              key={label}
              onClick={() => setOpenEmail(true)}
              className={`flex items-center gap-1.5  px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${compactColor(
                iconBg
              )} ${hover}`}
            >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            );
          }

          return (
            <a
            key={label}
            href={href}
            title={label}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${compactColor(
              iconBg
            )} ${hover}`}
          >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </a>
          );
        })}

        <EstimateModal
          open={openEstimate}
          onClose={() => setOpenEstimate(false)}
          response={response}
        />
        <EmailComposeModal
          open={openEmail}
          onClose={() => setOpenEmail(false)}
          response={response}
        />
      </>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-start gap-3">
        <span className="mt-0.5 shrink-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Great!
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You're now able to contact {response.customer_name}.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {actions.map((action) => {
          if (action.type === "estimate") {
            return (
              <ContactAction
                key={action.label}
                {...action}
                onClick={() => setOpenEstimate(true)}
              />
            );
          }

          if (action.type === "email") {
            return (
              <ContactAction
                key={action.label}
                {...action}
                onClick={() => setOpenEmail(true)}
              />
            );
          }

          return <ContactAction key={action.label} {...action} />;
        })}
      </div>

      <EstimateModal
        open={openEstimate}
        onClose={() => setOpenEstimate(false)}
        response={response}
      />
      <EmailComposeModal
        open={openEmail}
        onClose={() => setOpenEmail(false)}
        response={response}
      />
    </div>
  );
}