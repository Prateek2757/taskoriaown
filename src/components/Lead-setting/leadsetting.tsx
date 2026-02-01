"use client";

import { useLeadProfile } from "@/hooks/useLeadProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Wrench, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function LeadSettingsCard() {
  const { profile, userLocations, loading } = useLeadProfile();

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg" />
            <div className="w-28 h-4 bg-gray-100 dark:bg-gray-800 rounded-full" />
          </div>
          <div className="w-32 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        </div>
        <div className="space-y-3">
          <div className="w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded-full" />
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-7 bg-gray-100 dark:bg-gray-800 rounded-full" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-20 h-3 bg-gray-100 dark:bg-gray-800 rounded-full" />
          <div className="w-40 h-3 bg-gray-100 dark:bg-gray-800 rounded-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex items-center justify-center h-64">
        <p className="text-sm text-gray-400 dark:text-gray-500">No profile data available</p>
      </div>
    );
  }

  const location = profile.is_nationwide
    ? "Nationwide"
    : userLocations || "Not set";

  const locationDisplay = Array.isArray(location)
    ? location.map((loc: { city_name: string }) => loc.city_name).join(", ")
    : location;

  return (
    <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden self-start">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#3C7DED]/10 rounded-lg flex items-center justify-center">
            <Wrench className="w-4.5 h-4.5 text-[#3C7DED]" />
          </div>
          <h2 className="text-sm font-bold text-gray-800 dark:text-white">Lead Settings</h2>
        </div>
        <Link href="/settings/leads/myservices">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-semibold border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#3C7DED] hover:text-white hover:border-[#3C7DED] transition-all"
          >
            Manage <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </Button>
        </Link>
      </div>

      {/* Body */}
      <div className="p-5 space-y-6">
        {/* Services section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Your Services
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {profile.categories.length} {profile.categories.length === 1 ? "service" : "services"}
            </span>
          </div>

          {profile.categories.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.categories.map((c: { category_id: string; category_name: string }) => (
                <Badge
                  key={c.category_id}
                  className="
                    bg-[#3C7DED]/8 text-[#3C7DED] border border-[#3C7DED]/20 
                    px-3 py-1 text-xs font-medium rounded-full
                    hover:bg-[#3C7DED]/15 transition-colors cursor-default
                    dark:bg-[#3C7DED]/10 dark:text-[#60A5FA] dark:border-[#3C7DED]/25
                  "
                >
                  {c.category_name}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">No categories added yet.</p>
              <Link href="/settings/leads/myservices">
                <span className="text-xs text-[#3C7DED] hover:underline cursor-pointer mt-1 inline-block">
                  + Add a service
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Location section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Location
          </h3>
          <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-gray-800">
            <div className="w-7 h-7 bg-[#3C7DED]/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-[#3C7DED]" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{locationDisplay}</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
            This is where you'll receive leads from. Update your location on the{" "}
            <Link href="/settings/leads/myservices" className="text-[#3C7DED] hover:underline">
              Manage Services
            </Link>{" "}
            page.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Profile footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-500">Profile</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {profile.display_name ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}