"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LeadSettingsCard from "../Lead-setting/leadsetting";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MapPin, BarChart3, Users, Star, Target } from "lucide-react";

const theme = {
  background: "#f8fafc",
  card: "rgba(255,255,255,0.85)",
  primary: "#16a34a",
  secondary: "#3b82f6",
  muted: "#f1f5f9",
  border: "#e2e8f0",
  gradient: "linear-gradient(to right, #16a34a, #3b82f6)",
};

export default function ProviderDashboard() {
  const router = useRouter();
  const { data: session, status  } = useSession();
  const [showStats, setShowStats] = useState(false);
  const [totalLeads, setTotalLeads] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, router]);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      const data = await res.json();
      setTotalLeads(data.length);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchLeads();
    const handleCategoryChange = () => fetchLeads();
    window.addEventListener("categoriesUpdated", handleCategoryChange);
    return () =>
      window.removeEventListener("categoriesUpdated", handleCategoryChange);
  }, [status]);

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
      className="min-h-screen py-10"
      style={{
        background: "linear-gradient(to bottom right, #f0fdf4, #eff6ff)",
        color: "#1e293b",
      }}
    >
      <main className="container mx-auto px-6 space-y-10">
        {/* Header */}
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
              {
                label: "Total Leads",
                value: totalLeads ?? "—",
                icon: <BarChart3 className="w-5 h-5" />,
              },
              {
                label: "Active Projects",
                value: 4,
                icon: <Target className="w-5 h-5" />,
              },
              {
                label: "Success Rate",
                value: "94%",
                icon: <Star className="w-5 h-5" />,
              },
              {
                label: "Profile Views",
                value: 156,
                icon: <Users className="w-5 h-5" />,
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="p-5 rounded-2xl shadow-lg backdrop-blur-md hover:shadow-xl transition-shadow"
                style={{ background: theme.card, borderColor: theme.border }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card
              className="border rounded-2xl shadow-lg backdrop-blur-sm hover:shadow-2xl transition-shadow"
              style={{ background: theme.card, borderColor: theme.border }}
            >
              <CardContent className="pt-6 text-center">
                <Avatar className="h-24 w-24 mb-4 ring-4 ring-green-100 mx-auto">
                  <AvatarFallback className="text-2xl font-semibold bg-green-600 text-white">
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
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Profile completion:{" "}
                      <span className="font-semibold">27%</span>
                    </span>
                    <Link
                      href="/settings/profile/my-profile"
                      className="text-sm text-green-700 font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                  <Progress value={27} className="h-2 rounded-md" />
                </div>
              </CardContent>
            </Card>

            {/* Starter Pack */}
            <Card
              className="border rounded-2xl shadow-lg backdrop-blur-sm hover:shadow-2xl transition-shadow"
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
                  style={{ background: theme.gradient, color: "#fff" }}
                >
                  20% OFF STARTER PACK
                </Badge>
                <p className="font-semibold">Respond to 10 customers</p>
                <p className="text-sm text-slate-600">
                  Get early exposure and build credibility fast.
                </p>
                <Button className="mt-3 w-full bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 text-white">
                  Get Offer
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Column */}
          <LeadSettingsCard />

          {/* Right Column */}
          <div className="space-y-6">
            {/* Leads Overview */}
            <Card
              className="border rounded-2xl shadow-lg backdrop-blur-sm hover:shadow-2xl transition-shadow"
              style={{ background: theme.card, borderColor: theme.border }}
            >
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">
                  Leads Overview
                </CardTitle>
                <Button
                  variant="link"
                  className="text-green-700"
                  onClick={() => router.push("/provider/leads")}
                >
                  View
                </Button>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700 text-3xl font-bold">
                  {totalLeads ?? "—"}
                </div>
                <p className="font-semibold text-sm text-slate-700">
                  Total Leads Received
                </p>
              </CardContent>
            </Card>

            {/* Responses */}
            <Card
              className="border rounded-2xl shadow-lg backdrop-blur-sm hover:shadow-2xl transition-shadow"
              style={{ background: theme.card, borderColor: theme.border }}
            >
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">
                  Responses
                </CardTitle>
                <Button variant="link" className="text-green-700">
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
