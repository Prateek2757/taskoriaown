"use client";
import { useState } from "react";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import ContactActions from "./ContactActions";
import DetailTabs from "./DetailTabs";
import { ProviderResponse } from "@/types";
import {
  ArrowLeft,
  Coins,
  Phone,
  MessageCircle,
  Mail,
  MessageSquare,
  DollarSign,
} from "lucide-react";

const CONTACT_ACTIONS = [
  {
    icon: Phone,
    label: "Call",
    condition: (r: ProviderResponse) => !!r.customer_phone,
    getHref: (r: ProviderResponse) => `tel:${r.customer_phone}`,
    hover:
      "hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    condition: (r: ProviderResponse) => !!r.customer_phone,
    getHref: (r: ProviderResponse) =>
      `https://wa.me/${r.customer_phone?.replace(/\D/g, "")}`,
    hover:
      "hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 hover:border-green-200 dark:hover:border-green-800",
  },
  {
    icon: Mail,
    label: "Email",
    condition: (r: ProviderResponse) => !!r.customer_email,
    getHref: (r: ProviderResponse) => `mailto:${r.customer_email}`,
    hover:
      "hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800",
  },
  {
    icon: MessageSquare,
    label: "SMS",
    condition: (r: ProviderResponse) => !!r.customer_phone,
    getHref: (r: ProviderResponse) => `sms:${r.customer_phone}`,
    hover:
      "hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-800",
  },
  {
    icon: DollarSign,
    label: "Estimate",
    condition: () => true,
    getHref: () => "#",
    hover:
      "hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-800",
  },
];

interface DetailPanelProps {
  response: ProviderResponse;
  onBack?: () => void;
}

export default function DetailPanel({ response, onBack }: DetailPanelProps) {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0d1117] overflow-hidden">
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden flex-shrink-0"
              aria-label="Back to list"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500" />
            </button>
          )}

          <Avatar
            name={response.customer_name}
            picture={response.customer_profile_picture}
            size="md"
          />

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                {response.customer_name}
              </h2>

              <div className="shrink-0">
                <StatusBadge status={response.status} />
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 truncae">
              {response.category_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {response.credits_spent > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded-full">
              <Coins className="w-3 h-3" />
              {response.credits_spent}
            </div>
          )}

          <div className="hidden gap-3  lg:flex">
            <ContactActions response={response} variant="compact" />
          </div>

          <button
            onClick={() => setShowContact((p) => !p)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors md:hidden ${
              showContact
                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {showContact ? "← Back" : "Contact"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {showContact ? (
          <div className="h-full overflow-y-auto p-4">
            <ContactActions response={response} />
            <DetailTabs response={response} />
          </div>
        ) : (
          <DetailTabs response={response} />
        )}
      </div>
    </div>
  );
}
