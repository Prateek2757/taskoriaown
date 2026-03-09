"use client";

import { useState } from "react";
import {
  MapPin,
  Tag,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { ProviderResponse, TabKey } from "@/types";
import { formatDate, timeAgo } from "./helpers";

interface DetailTabsProps {
  response: ProviderResponse;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "activity", label: "Activity" },
  { key: "details", label: "Lead Details" },
  { key: "notes", label: "My Notes" },
];

const formatAnswerValue = (value?: string) => {
  if (!value) return "Not answered yet";

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

  if (isoDateRegex.test(value)) {
    return value.split("T")[0]; // YYYY-MM-DD
  }

  return value;
};

function ActivityTab({ response }: { response: ProviderResponse }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400 font-medium px-2">
          {formatDate(response.response_created_at)}
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="relative pl-6 space-y-6">
        <div className="absolute left-3 top-2 bottom-[-16px] w-px bg-gray-200 dark:bg-gray-700" />

        <div className="relative flex gap-4">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                You responded to this task
              </span>

              <span className="text-[11px] text-gray-400">
                {timeAgo(response.response_created_at)}
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {response.response_message}
            </p>
          </div>
        </div>

        <div className="relative flex gap-4">
          <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />

                {response.customer_name}
              </span>

              <span className="text-[11px] text-gray-400">
                {timeAgo(response.task_created_at)}
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Looking for a{" "}
              <span className="font-medium">{response.category_name}</span>{" "}
              professional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsTab({ response }: { response: ProviderResponse }) {
  const fields = [
    { icon: Tag, label: "Category", value: response.category_name },
    { icon: MapPin, label: "Task", value: response.title },
    // {
    //   icon: DollarSign,
    //   label: "Budget",
    //   value: response.estimated_budget
    //     ? `$${response.estimated_budget.toLocaleString()}`
    //     : "Not specified",
    // },
    {
      icon: Users,
      label: "Total responses",
      value: `${response.total_responses} providers responded`,
    },
    {
      icon: Calendar,
      label: "Posted",
      value: formatDate(response.task_created_at),
    },
  ];

  return (
    <div className="space-y-3">
      {/* <div className="flex items-center gap-2 mb-1">
        <StatusBadge status={response.status} />
      </div> */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {response.description}
      </p>
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 px-4 py-3">
            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-400 leading-none mb-0.5">
                {label}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium truncate">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {response.task_answers?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Answers
          </p>
          {response.task_answers.map((qa) => (
            <div
              key={qa.question_id}
              className="bg-gray-50 dark:bg-blue-900/20 rounded-xl px-4 py-3"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {qa.question}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                {formatAnswerValue(qa.answer)}{" "}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotesTab() {
  const [note, setNote] = useState("");
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Private notes — only visible to you.
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={5}
        placeholder="Write a note about this lead..."
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
      />
      <button
        disabled={!note.trim()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
      >
        Save note
      </button>
    </div>
  );
}

export default function DetailTabs({ response }: DetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("activity");

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === tab.key
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "activity" && <ActivityTab response={response} />}
        {activeTab === "details" && <DetailsTab response={response} />}
        {activeTab === "notes" && <NotesTab />}
      </div>
    </div>
  );
}
