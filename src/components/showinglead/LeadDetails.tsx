"use client";
import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  DollarSign,
  Wifi,
  AlertCircle,
  Award,
  MessageSquare,
  ThumbsDown,
  Share2,
  Bookmark,
  Quote,
} from "lucide-react";

interface LeadAnswer {
  question_id?: string | number;
  question: string;
  answer: string;
}

interface Lead {
  title: string;

  category_name: string;
  customer_name?: string;
  customer_email?: string;
  location_name: string;
  created_at: string;
  description: string;
  status?: string;
  budget_min?: number;
  budget_max?: number;
  is_remote_allowed?: boolean;
  answers?: LeadAnswer[];
}

interface LeadDetailsProps {
  lead: Lead;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead }) => {
  const [isSaved, setIsSaved] = useState(false);

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
      .toUpperCase()
      .slice(0, 2);

  const maskPhone = (phone = "079********"): string => phone;
  const maskEmail = (email?: string): string => {
    if (!email) return "k******************@g***.com"; // fallback if no email
  
    const [local, domain] = email.split("@");
    if (!domain) return email;
  
    const firstChar = local[0];
    const maskedLocal = firstChar + "*".repeat(Math.max(local.length - 1, 3));
  
    const domainParts = domain.split(".");
    const domainName = domainParts[0];
    const domainExt = domainParts.slice(1).join(".");
    const maskedDomain = domainName[0] + "*".repeat(Math.max(domainName.length - 1, 2));
  
    return `${maskedLocal}@${maskedDomain}.${domainExt}`;
  };

  const creditsRequired = Math.floor(Math.random() * 10) + 5;
  const responseRate = 0;
  const maxResponses = 5;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-green-600 px-6 py-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                {getInitials(lead.customer_name || "N/A")}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {lead.customer_name}
                </h1>
                <div className="flex items-center gap-2 text-blue-100">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{lead.location_name}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
              {lead.category_name}
            </span>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm border transition-all duration-300 ${
                lead.status === "Open"
                  ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                  : lead.status === "Pending"
                  ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {lead.status}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              <Clock className="w-4 h-4" />
              {formatTimeAgo(lead.created_at)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Contact Information Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Verified Contact Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">
                      Phone Number
                    </div>
                    <div className="font-mono text-sm text-gray-900">
                      {maskPhone()}
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">
                      Email Address
                    </div>
                    <div className="font-mono text-sm text-gray-900">
                      {maskEmail(lead.customer_email)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Response Progress */}
          <div className="bg-blue-50 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Response Progress
              </h3>
              <span className="text-sm font-semibold text-blue-600">
                {responseRate}/{maxResponses}
              </span>
            </div>
            <div className="relative w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(responseRate / maxResponses) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              <strong>{maxResponses - responseRate} spots remaining</strong> •
              Be one of the first to respond
            </p>
          </div>

          {/* Credits & Guarantee */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-orange-200 p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {creditsRequired}
                  </span>
                  <span className="text-sm text-gray-600">
                    credits required
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  🏆 Protected by Get Hired Guarantee
                </h4>
                <p className="text-xs text-gray-600">
                  Full credit refund if you're not hired during your starter
                  pack period
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg shadow-blue-500/30">
              <MessageSquare className="w-5 h-5" />
              Contact {(lead.customer_name ?? "N/A").split(" ")[0]}
            </button>
            <button className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <ThumbsDown className="w-5 h-5" />
              Not Interested
            </button>
            <button className="px-4 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Project Details
        </h2>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed">{lead.description}</p>
        </div>

        {/* Budget & Remote */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Budget Range
              </h3>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {lead.budget_min && lead.budget_max
                ? `£${lead.budget_min.toLocaleString()} - £${lead.budget_max.toLocaleString()}`
                : "To be discussed"}
            </p>
          </div>

          {lead.is_remote_allowed && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Work Type
                </h3>
              </div>
              <p className="text-lg font-bold text-teal-700">Remote Allowed</p>
            </div>
          )}
        </div>

        {/* Quick Info Tags */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Highlights
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg">
              <AlertCircle className="w-3.5 h-3.5" />
              Urgent Response Required
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-lg">
              <Award className="w-3.5 h-3.5" />
              Premium Lead
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              Fast Response Needed
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified Lead
            </span>
          </div>
        </div>

        {/* Lead Q&A */}
        {lead.answers && lead.answers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Lead Questions & Answers
            </h3>

            <div className="space-y-4">
              {lead.answers.map((ans) => (
                <div
                  key={ans.question_id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <MessageSquare size={16} className="text-blue-600 mt-0.5" />
                    <p className="text-sm font-medium text-gray-900">
                      {ans.question || "—"}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <Quote size={16} className="text-green-600 mt-0.5" />
                    <p className="text-sm text-gray-700 italic">
                      {ans.answer?.trim() ? ans.answer : "Not answered yet"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {/* <div className="flex flex-wrap gap-3 mt-6">
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg shadow-blue-500/30">
            <MessageSquare className="w-5 h-5" />
            Contact {lead.title.split(" ")[0]}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
            <ThumbsDown className="w-5 h-5" />
            Not Interested
          </button>
          <button className="px-4 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default LeadDetails;
