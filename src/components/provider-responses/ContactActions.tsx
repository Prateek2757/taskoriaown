"use client";

import { Phone, MessageCircle, Mail, MessageSquare, DollarSign } from "lucide-react";
import ContactAction from "./ContactAction";
import { ProviderResponse } from "@/types";

export const getActions = (response: ProviderResponse) => {
  const phone = response.customer_phone;
  const email = response.customer_email;
  const name = response.customer_name;

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
        "hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      condition: !!phone,
      description: "Message them on WhatsApp",
      actionLabel: "Open WhatsApp",
      href: `https://wa.me/${phone?.replace(/\D/g, "")}?text=Hi ${encodeURIComponent(
        name
      )}, I saw your request on the platform.`,
      target: "_blank",
      iconBg: "bg-green-500",
      hover:
        "hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 hover:border-green-200 dark:hover:border-green-800",
    },
    {
      icon: Mail,
      label: "Email",
      condition: !!email,
      description: "Send a professional email",
      actionLabel: `Email ${email}`,
      href: `mailto:${email}`,
      iconBg: "bg-violet-500",
      hover:
        "hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800",
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
        "hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-800",
    },
    {
      icon: DollarSign,
      label: "Estimate",
      condition: true,
      description: "Send a price quote for the job",
      actionLabel: "Send Estimate",
      href: "#",
      iconBg: "bg-amber-500",
      hover:
        "hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-800",
    },
  ].filter((a) => a.condition);
};

interface ContactActionsProps {
  response: ProviderResponse;
  variant?: "compact" | "full"; 
}

export default function ContactActions({ response, variant = "full" }: ContactActionsProps) {
  const actions = getActions(response);

  if (variant === "compact") {
    return (
      <>
        {actions.map(({ icon: Icon, label, href, target, hover }) => (
          <a
            key={label}
            href={href}
            title={label}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 transition-all ${hover}`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            {label}
          </a>
        ))}
      </>
    );
  }

  return (
    <div className="space-y-2">
      <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-start gap-3">
        <span className="mt-0.5 flex-shrink-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Great!</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You're now able to contact {response.customer_name}.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {actions.map((action) => (
          <ContactAction key={action.label} {...action} />
        ))}
      </div>
    </div>
  );
}