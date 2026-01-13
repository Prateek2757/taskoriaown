"use client";
import { MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Lead {
  task_id?: number;
  title: string;
  image?: string;
  location_name: string;
  postcode?: number;
  category_name: string;
  customer_name?: string;
  phone: number;
  customer_email?: string;
  created_at: string;
  description: string;
  status?: string;
  estimated_budget?: number;
  is_seen?: boolean;
}

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  requiredCredits: number;
  onSelect: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  isSelected,
  requiredCredits,
  onSelect,
}) => {
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getInitials = (name: string): string =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getBudgetDisplay = (): string => {
    if (lead.estimated_budget) {
      return `A$${lead.estimated_budget}`;
    }
    return "Budget not specified";
  };

  return (
    <div
      onClick={() => onSelect(lead)}
      className={`group relative p-5  rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer overflow-hidden
        ${
          isSelected
            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 shadow-md"
            : "border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-lg hover:bg-gradient-to-br hover:from-white dark:hover:from-gray-800 hover:to-blue-50 dark:hover:to-blue-700"
        }`}
    >
      <div className="absolute top-2 right-3">
        {!lead.is_seen ? (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
          </span>
        ) : (
          ""
        )}
      </div>
      <div
        className={`absolute top-0 left-0 h-1 w-full rounded-t-2xl transition-all duration-300 ${
          isSelected ? "bg-blue-500" : "bg-transparent group-hover:bg-blue-400"
        }`}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {lead.image ? (
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <Image
                src={lead.image}
                width={56}
                height={56}
                alt="lead image"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-cyan-600 text-white text-2xl font-semibold">
              {getInitials(lead.customer_name || "N/A")}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-gray-900 dark:text-gray-100 text-base font-semibold leading-tight ">
              {lead.customer_name}
            </h3>
            <p className=" flex items-center p-1 gap-1 text-sm text-gray-500 dark:text-gray-400 ">
            <MapPin className="w-3 h-3" />

              <span>
                {lead.postcode ? lead.postcode : lead.location_name}
              </span>
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap font-medium">
          {formatTimeAgo(lead.created_at)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {lead.status === "Urgent" && (
          <span className="px-2 py-1 text-[11px] font-medium rounded-full bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100 border border-red-200 dark:border-red-600">
            ⚡ Urgent
          </span>
        )}
        <span className="px-2 py-1 text-[11px] font-medium rounded-full bg-cyan-100 dark:bg-cyan-700 text-cyan-700 dark:text-cyan-100 border border-cyan-200 dark:border-cyan-600">
          ✓ Verified phone
        </span>
        <span className="px-2 py-1 text-[11px] font-medium rounded-full bg-purple-100 dark:bg-purple-700 text-purple-700 dark:text-purple-100 border border-purple-200 dark:border-purple-600">
          📋 Extra details
        </span>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
          {lead.category_name}
        </h4>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        {/* <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
            {" "}
            Estimated Budget
          </span>
          <span className="text-sm font-medium  text-gray-800 dark:text-gray-100 blur-xs">
            {getBudgetDisplay()}
          </span>
        </div> */}

        <div className="flex items-center mt-3 gap-2">
          <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
            <span>🎯</span>
            <span>{requiredCredits} Credits</span>
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className="text-blue-500 dark:text-blue-400 font-semibold">
              •
            </span>
            <span>1st to respond</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
