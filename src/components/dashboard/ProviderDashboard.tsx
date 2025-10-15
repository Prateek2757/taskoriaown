"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronRight, BarChart3, Users, Star, Target } from "lucide-react";

const theme = {
  background: "#f8fafc",
  card: "rgba(255,255,255,0.9)",
  primary: "#16a34a",
  secondary: "#3b82f6",
  muted: "#f1f5f9",
  border: "#e2e8f0",
  gradient: "linear-gradient(to right, #16a34a, #3b82f6)",
};

export default function ProviderDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showStats, setShowStats] = useState(false);
  const [totalLeads, setTotalLeads] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/en/signin");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchLeads();
  }, [status]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/api/leads");
      setTotalLeads(res.data.length);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  if (status === "loading" || !session?.user) return null;

  const user = session.user;
  const currentTime = new Date();
  const greeting =
    currentTime.getHours() < 12
      ? "Good morning"
      : currentTime.getHours() < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #f0fdf4, #eff6ff)",
        color: "#1e293b",
      }}
    >
      <main className="container mx-auto px-6 py-10 space-y-10">
        {/* Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {greeting}, {user.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-sm text-slate-600">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}{" "}
              {currentTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-all"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? "Hide Insights" : "View Insights"}
          </Button>
        </div>

        {/* Stats Section */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-in fade-in-10">
            {[
              { label: "Total Leads", value: totalLeads ?? "—", icon: <BarChart3 className="w-5 h-5" /> },
              { label: "Active Projects", value: 4, icon: <Target className="w-5 h-5" /> },
              { label: "Success Rate", value: "94%", icon: <Star className="w-5 h-5" /> },
              { label: "Profile Views", value: 156, icon: <Users className="w-5 h-5" /> },
            ].map((stat, i) => (
              <Card
                key={i}
                className="p-5 rounded-2xl shadow-md backdrop-blur-md"
                style={{
                  background: theme.card,
                  borderColor: theme.border,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Profile + Starter Pack */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card
              className="border rounded-2xl shadow-lg backdrop-blur-sm"
              style={{ background: theme.card, borderColor: theme.border }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4 ring-4 ring-green-100">
                    <AvatarFallback
                      className="text-2xl font-semibold bg-green-600 text-white"
                    >
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <p className="text-xs mt-1 text-slate-500">
                    Role: <strong>{user.role}</strong>
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Profile completion: <span className="font-semibold">27%</span>
                    </span>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm text-green-700"
                    >
                      Edit
                    </Button>
                  </div>
                  <Progress value={27} className="h-2 rounded-md" />
                  <p className="text-sm text-slate-500">
                    Completing your profile helps attract customers.{" "}
                    <Link
                      href="/en/provider/profile"
                      className="underline text-green-700 font-medium"
                    >
                      Edit profile
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Starter Pack */}
            <Card
              className="border rounded-2xl shadow-lg backdrop-blur-sm"
              style={{ background: theme.card, borderColor: theme.border }}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  🎯 Starter Pack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  className="font-medium mb-2"
                  style={{
                    background: theme.gradient,
                    color: "#fff",
                  }}
                >
                  20% OFF STARTER PACK
                </Badge>
                <div className="space-y-1">
                  <p className="font-semibold">Respond to 10 customers</p>
                  <p className="text-sm text-slate-600">
                    Get early exposure and build credibility fast.
                  </p>
                  <Button
                    className="mt-3 w-full bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 text-white"
                  >
                    Get Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lead Settings */}
          <Card
            className="border rounded-2xl shadow-lg backdrop-blur-sm"
            style={{ background: theme.card, borderColor: theme.border }}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                ⚙️ Lead Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Services
                  </h3>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-green-700"
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-slate-500 mb-3">
                  You’ll receive leads in these categories:
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Graphic Design", "Logo Design", "+1"].map((s, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-slate-100 text-slate-700"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Locations
                  </h3>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-green-700"
                  >
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-slate-500 mb-3">
                  You’re receiving customers within:
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-green-600" /> Nationwide
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Activity */}
          <div className="space-y-6">
            {/* Leads */}
            <Card
              className="border rounded-2xl shadow-lg"
              style={{ background: theme.card, borderColor: theme.border }}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Leads Overview
                </CardTitle>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-green-700"
                  onClick={() => router.push("/en/provider/leads")}
                >
                  View
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <span className="text-3xl font-bold text-green-700">
                      {totalLeads ?? "—"}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-slate-700">
                    Total Leads Received
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Responses */}
            <Card
              className="border rounded-2xl shadow-lg"
              style={{ background: theme.card, borderColor: theme.border }}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Responses
                </CardTitle>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-green-700"
                >
                  View
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-slate-500 py-8">
                  You haven’t responded to any leads yet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
