"use client";
import React from "react";

interface Lead {
  task_id?: string | number;
  title: string;
  location_name: string;
  category_name: string;
  customer_name?:string;
  phone:number;
  customer_email?:string;
  created_at: string;
  description: string;
  status?: string;
  budget_min?: number;
  budget_max?: number;
}

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  onSelect: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, isSelected, onSelect }) => {
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

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
    if (lead.budget_min && lead.budget_max) {
      return `£${lead.budget_min} - £${lead.budget_max}`;
    }
    return "Budget not specified";
  };

  return (
    <div
      onClick={() => onSelect(lead)}
      className={`group relative p-5 rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer overflow-hidden
        ${
          isSelected
            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md"
            : "border-gray-200 hover:border-blue-400 hover:shadow-lg hover:bg-gradient-to-br hover:from-white hover:to-blue-50"
        }`}
    >
      {/* Decorative Accent */}
      <div
        className={`absolute top-0 left-0 h-1 w-full rounded-t-2xl transition-all duration-300 ${
          isSelected ? "bg-blue-500" : "bg-transparent group-hover:bg-blue-400"
        }`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-400 flex items-center justify-center text-white font-semibold text-base shadow-sm">
            {getInitials(lead.customer_name || "N/A")}
          </div>
          <div className="min-w-0">
            <h3 className="text-gray-900 text-base font-semibold leading-tight line-clamp-1">
              {lead.customer_name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">{lead.location_name}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap font-medium">
          {formatTimeAgo(lead.created_at)}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {lead.status === "Urgent" && (
          <span className="px-2 py-1 text-[11px] font-medium rounded-full bg-red-100 text-red-700 border border-red-200">
            ⚡ Urgent
          </span>
        )}
        <span className="px-2 py-1 text-[11px] font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
          ✓ Verified phone
        </span>
        <span className="px-2 py-1 text-[11px] font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
          📋 Extra details
        </span>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-1">
          {lead.category_name}
        </h4>
        {/* <p className="text-sm text-gray-600 leading-snug line-clamp-2">
          {lead.description?.substring(0, 100)}...
        </p> */}
      </div>

      {/* Budget + Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-0.5">Budget</span>
          <span className="text-sm font-medium text-gray-800">
            {getBudgetDisplay()}
          </span>
        </div>

        <div className="flex items-center mt-3 gap-2">
          <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
            <span>🎯</span>
            <span>{Math.floor(Math.random() * 10) + 3} Credits</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span className="text-blue-500 font-semibold">•</span>
            <span>1st to respond</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
