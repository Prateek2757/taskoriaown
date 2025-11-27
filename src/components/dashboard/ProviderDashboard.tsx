"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { BarChart3, Users, Star, Target } from "lucide-react";
import LeadSettingsCard from "../Lead-setting/leadsetting";
import { useLeadProfile } from "@/hooks/useLeadProfile";

export default function ProviderDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile } = useLeadProfile();

  const [showStats, setShowStats] = useState(false);
  const [totalLeads, setTotalLeads] = useState<number | null>(null);

  
  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, router]);


  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      const data = await res.json();
      setTotalLeads(data.length ?? 0);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchLeads();
    const handler = () => fetchLeads();

    window.addEventListener("categoriesUpdated", handler);
    return () => window.removeEventListener("categoriesUpdated", handler);
  }, [status]);
 const greeting = useMemo(() => {
    const now = new Date();
    return now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
      ? "Good afternoon"
      : "Good evening";
  }, []);


  const stats = useMemo(
    () => [
      {
        id: "leads",
        label: "Total Leads",
        value: totalLeads ?? "—",
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        id: "projects",
        label: "Active Projects",
        value: 4,
        icon: <Target className="w-5 h-5" />,
      },
      {
        id: "success",
        label: "Success Rate",
        value: "94%",
        icon: <Star className="w-5 h-5" />,
      },
      {
        id: "views",
        label: "Profile Views",
        value: 156,
        icon: <Users className="w-5 h-5" />,
      },
    ],
    [totalLeads]
  );
  if (status === "loading" || !session?.user) return null;

  const user = session.user;

  
 

  return (
    <div
      className="
        min-h-screen py-10 
        bg-gray-50 dark:bg-[#0d1117]
        transition-colors duration-300
      "
    >
      <main className="container mx-auto rounded-2xl px-6 space-y-10 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="
                text-3xl font-bold 
                bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#00E5FF]
                bg-clip-text text-transparent
              "
            >
              {greeting}, {user.name?.split(" ")[0] || "User"}!
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}{" "}
              {new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>

          <Button
            variant="outline"
            className="
              border-cyan-600 text-cyan-700 
              dark:border-cyan-400 dark:text-cyan-300
              dark:hover:bg-cyan-400/10
            "
            onClick={() => setShowStats((prev) => !prev)}
          >
            {showStats ? "Hide Insights" : "View Insights"}
          </Button>
        </div>

        {showStats && (
          <div
            className="
              grid grid-cols-2 md:grid-cols-4 gap-5 
              animate-in fade-in-10 duration-300
            "
          >
            {stats.map((stat) => (
              <Card
                key={stat.id}
                className="
                  p-5 rounded-2xl shadow-lg backdrop-blur-md
                  bg-white/80 dark:bg-white/5
                  border border-gray-200 dark:border-white/10
                  hover:shadow-xl transition-shadow
                "
              >
                <div className="p-2 rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-300 w-fit">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold mt-3 text-slate-800 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <Card
              className="
                border rounded-2xl shadow-lg backdrop-blur
                bg-white/80 dark:bg-white/5
                border-gray-200 dark:border-white/10
              "
            >
              <CardContent className="pt-6 text-center">
                <Avatar className="h-24 w-24 mb-4 ring-4 ring-blue-100 dark:ring-blue-900 mx-auto">
                  {profile?.profile_image_url ? (
                    <Image
                      height={96}
                      width={96}
                      src={profile.profile_image_url}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <AvatarFallback
                      className="text-2xl font-semibold bg-cyan-600 text-white"
                    >
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <h2 className="text-xl font-semibold dark:text-white">
                  {user.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>

                <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                  Role: <strong>{user.role}</strong>
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-slate-300">
                      Profile completion:{" "}
                      <span className="font-semibold">27%</span>
                    </span>
                    <Link
                      href="/settings/profile/my-profile"
                      className="text-sm text-blue-700 dark:text-blue-400 font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                  <Progress value={27} className="h-2 rounded-md" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="
                border rounded-2xl shadow-lg 
                bg-white/80 dark:bg-white/5
                border-gray-200 dark:border-white/10
              "
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold dark:text-white">
                  🎯 Starter Pack
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Badge
                  className="font-medium mb-2 text-white"
                  style={{
                    background:
                      "linear-gradient(to right, #3C7DED, #46CBEE)",
                  }}
                >
                  20% OFF STARTER PACK
                </Badge>

                <p className="font-semibold dark:text-white">
                  Respond to 10 customers
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get early exposure and build credibility fast.
                </p>

                <Link href="/settings/billing/my_credits">
                  <Button className="mt-3 w-full bg-gradient-to-r from-[#3C7DED] to-[#46CBEE] hover:opacity-90 text-white">
                    Get Offer
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <LeadSettingsCard />

          <div className="space-y-6">
            <Card
              className="
                border rounded-2xl shadow-lg backdrop-blur 
                bg-white/80 dark:bg-white/5
                border-gray-200 dark:border-white/10
              "
            >
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold dark:text-white">
                  Leads Overview
                </CardTitle>
                <Button
                  variant="link"
                  className="text-cyan-700 dark:text-cyan-300"
                  onClick={() => router.push("/provider/leads")}
                >
                  View
                </Button>
              </CardHeader>

              <CardContent className="flex items-center gap-4">
                <div
                  className="
                    flex h-20 w-20 items-center justify-center 
                    rounded-full bg-cyan-100 dark:bg-cyan-900/40 
                    text-cyan-700 dark:text-cyan-300 
                    text-3xl font-bold
                  "
                >
                  {totalLeads ?? "—"}
                </div>

                <p className="font-semibold text-sm dark:text-slate-300">
                  Total Leads Received
                </p>
              </CardContent>
            </Card>

            <Card
              className="
                border rounded-2xl shadow-lg 
                bg-white/80 dark:bg-white/5
                border-gray-200 dark:border-white/10
              "
            >
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold dark:text-white">
                  Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-8">
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
