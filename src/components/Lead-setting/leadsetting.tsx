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
        <span className="text-slate-500 text-lg">Loading your lead settings…</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-red-600 text-lg">Failed to load profile.</span>
      </div>
    );
  }

  const location = profile.is_nationwide ? "Nationwide" : profile.location_name || "Not set";

  return (
    <Card className="border rounded-3xl shadow-2xl backdrop-blur-sm overflow-hidden hover:shadow-3xl transition-shadow duration-300 w-full">
      {/* HEADER */}
      <CardHeader className="bg-green-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="w-6 h-6 text-green-600" />
          <CardTitle className="text-xl font-bold text-slate-800">Lead Settings</CardTitle>
        </div>
        <Link href="/en/settings/leads/myservices">
          <Button
            size="lg"
            variant="outline"
            className="text-green-700 border-green-600 hover:bg-green-100"
          >
            Manage Services
          </Button>
        </Link>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="grid gap-8 p-6">
        {/* SERVICES */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700">Your Services</h3>
          {profile.categories.length ? (
            <div className="flex flex-wrap gap-3">
              {profile.categories.map((c) => (
                <Badge
                  key={c.category_id}
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 px-3 py-1 text-sm font-medium hover:scale-105 transition-transform cursor-default"
                >
                  {c.category_name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-slate-400">No categories added yet.</p>
          )}
        </div>

        {/* LOCATION */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700">Location</h3>
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-sm">{location}</span>
          </div>
          <p className="text-sm text-slate-500">
            This is where you'll receive leads from. Update your location on the “Manage Services” page.
          </p>
        </div>
      </CardContent>

      {/* FOOTER */}
      <div className="bg-slate-50 px-6 py-4 text-center text-slate-500 text-sm">
        Profile: <span className="font-medium">{profile.display_name ?? "—"}</span>
      </div>
    </Card>
  );
}
