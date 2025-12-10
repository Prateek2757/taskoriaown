"use client";

import { useLeadProfile } from "@/hooks/useLeadProfile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Wrench } from "lucide-react";
import Link from "next/link";

export default function LeadSettingsCard() {
  const { profile, loading } = useLeadProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-slate-500 dark:text-slate-400 text-lg">
          Loading your lead settings…
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
      </div>
    );
  }

  const location = profile.is_nationwide
    ? "Nationwide"
    : profile.location_name || "Not set";

  return (
    <Card
      className="
        border rounded-3xl shadow-2xl backdrop-blur-sm overflow-hidden 
        hover:shadow-3xl transition-shadow duration-300 w-full
        bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10
      "
    >
      <CardHeader
        className="
          px-6 py-4 flex items-center justify-between
          bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] 
          text-white rounded-t-3xl
        "
      >
        <div className="flex items-center gap-3">
          <Wrench className="w-6 h-6" />
          <CardTitle className="text-xl font-bold">Lead Settings</CardTitle>
        </div>

        <Link href="/settings/leads/myservices">
          <Button
            size="lg"
            variant="outline"
            className="
              border-white text-black hover:bg-white/20
              dark:border-cyan-400 dark:text-white dark:hover:bg-cyan-500/10
            "
          >
            Manage Services
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="grid gap-8 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Your Services
          </h3>
          {profile.categories.length ? (
            <div className="flex flex-wrap gap-3">
              {profile.categories.map((c) => (
                <Badge
                  key={c.category_id}
                  className="
                    bg-cyan-100 text-cyan-800 px-3 py-1 text-sm font-medium
                    hover:scale-105 transition-transform cursor-default
                    dark:bg-cyan-900/30 dark:text-cyan-300
                  "
                >
                  {c.category_name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-slate-400 dark:text-slate-500">
              No categories added yet.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Location
          </h3>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-sm">{location}</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This is where you'll receive leads from. Update your location on
            the “Manage Services” page.
          </p>
        </div>
      </CardContent>

      <div className="bg-slate-50 dark:bg-white/5 px-6 py-4 text-center text-slate-600 dark:text-slate-400 text-sm rounded-b-3xl">
        Profile: <span className="font-medium">{profile.display_name ?? "—"}</span>
      </div>
    </Card>
  );
}
