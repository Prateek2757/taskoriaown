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

import { BarChart3, Users, Star, Target, User } from "lucide-react";
import LeadSettingsCard from "../Lead-setting/leadsetting";
import { useLeadProfile } from "@/hooks/useLeadProfile";

export default function ProviderDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile } = useLeadProfile();

  const [showStats, setShowStats] = useState(false);
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const isPro = profile?.is_pro;
  const activeSubscription = profile?.active_subscription;
  console.log(profile?.company_size);

  const imageToShow =
    profile?.has_company && profile?.company_size !== "Sole-Trader"
      ? profile?.logo_url
      : profile?.profile_image_url;
  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, router]);
  const nameToShow =
    profile?.has_company && profile?.company_size !== "Sole-Trader"
      ? profile?.company_name
      : profile?.display_name;

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
    bg-white/80 dark:bg-white/5 py-0
    border-gray-200 dark:border-white/10
  "
            >
              <CardContent className="pt-6 text-center relative overflow-hidden">
                {isPro && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-yellow-600/5 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-full h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  </>
                )}

                <div className="relative z-10">
                  <div className="relative h-28 w-28 mx-auto mb-4 group">
                    {isPro && (
                      <>
                        <div
                          className="absolute -inset-4 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background:
                              "conic-gradient(from 0deg, #eab308, #f59e0b, #d97706, #ca8a04, #eab308)",
                            animation: "spin 5s linear infinite",
                            filter: "blur(16px)",
                          }}
                        ></div>

                        <div className="absolute -inset-2 rounded-full border-[3px] border-yellow-400/70 animate-pulse shadow-[0_0_50px_rgba(234,179,8,0.8),0_0_100px_rgba(234,179,8,0.4)] pointer-events-none"></div>
                        <div className="absolute -inset-1 rounded-full border-2 border-amber-400/80 pointer-events-none shadow-[0_0_30px_rgba(245,158,11,0.6)]"></div>
                        <div className="absolute -inset-0.5 rounded-full border border-yellow-500/60 pointer-events-none"></div>

                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30">
                          <div className="relative group/star">
                            <div className="absolute inset-0 scale-150 rounded-full bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
                            <div className="absolute inset-0 scale-125 rounded-full bg-amber-500 blur-lg opacity-60 group-hover/star:opacity-80 transition-opacity"></div>

                            <div
                              className="absolute inset-0 animate-pulse"
                              style={{ animationDuration: "3s" }}
                            >
                              <div className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-0"></div>
                              <div className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                              <div className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
                              <div className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-[135deg]"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <Avatar className="relative h-28 w-28 mx-auto">
                      {imageToShow ? (
                        <Image
                          src={imageToShow as string}
                          width={112}
                          height={112}
                          alt="Profile"
                          className="rounded-full object-cover h-full w-full relative z-10 ring-2 ring-white/10"
                        />
                      ) : (
                        <div
                          className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl relative z-10 ${
                            isPro
                              ? "bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600"
                              : "bg-gradient-to-br from-blue-600 to-cyan-500"
                          }`}
                        >
                          <User className="w-14 h-14 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </Avatar>

                    {isPro && (
                      <div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-sm border border-yellow-500/30 hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] z-20"
                        style={{
                          background:
                            "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #eab308 100%)",
                          color: "#000",
                          boxShadow:
                            "0 8px 20px rgba(234, 179, 8, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 drop-shadow-sm"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3 7h7l-5.5 4.1L18 21l-6-4-6 4 1.5-7.9L2 9h7z" />
                        </svg>
                        <span className="drop-shadow-sm">PRO</span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20 pointer-events-none"></div>
                      </div>
                    )}
                  </div>

                  <h2
                    className={`text-xl font-semibold mb-1 ${
                      isPro
                        ? "bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(234,179,8,0.3)]"
                        : "dark:text-white"
                    }`}
                  >
                    {nameToShow}
                    {isPro && (
                      <svg
                        className="inline-block ml-2 w-5 h-5 text-yellow-500 drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    )}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {user.email}
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      isPro
                        ? "text-yellow-500/70 font-medium"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    Role:{" "}
                    <strong className={isPro ? "text-yellow-400" : ""}>
                      {user.role}
                    </strong>
                  </p>

                  <div className="m-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          isPro
                            ? "text-slate-600 font-medium"
                            : "dark:text-slate-300"
                        }`}
                      >
                        Profile completion:{" "}
                        <span
                          className={`font-bold ${
                            isPro ? "text-yellow-400" : "font-semibold"
                          }`}
                        >
                          27%
                        </span>
                      </span>
                      <Link
                        href="/settings/profile/my-profile"
                        className={`text-sm font-medium flex items-center gap-1 group/link transition-all ${
                          isPro
                            ? "text-yellow-400 hover:text-yellow-300"
                            : "text-blue-700 dark:text-blue-400"
                        }`}
                      >
                        Edit
                        <svg
                          className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>

                    <div className="relative">
                      {isPro && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full blur-md"></div>
                      )}
                      <Progress
                        value={27}
                        className={`h-2 rounded-full relative ${
                          isPro ? "bg-slate-700/50" : ""
                        }`}
                        style={
                          isPro
                            ? {
                                background:
                                  "linear-gradient(to right, rgba(234, 179, 8, 0.2), rgba(245, 158, 11, 0.2))",
                              }
                            : {}
                        }
                      />
                    </div>
                  </div>

                  {isPro && (
                    <div className="mt-6 p-3 mb-4 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm">
                      <div className="flex items-center justify-center gap-2 text-xs text-yellow-500/90 font-medium">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Exclusive PRO Features Unlocked</span>
                        <svg
                          className="w-4 h-4 animate-pulse"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 11.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" />
                          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                <style jsx>{`
                  @keyframes spin {
                    from {
                      transform: rotate(0deg);
                    }
                    to {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
              </CardContent>
            </Card>

            <Card
              className="
      border rounded-2xl shadow-lg backdrop-blur-xl
      bg-white/70 dark:bg-white/5 
      border-gray-200 dark:border-white/10
      
    "
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold dark:text-white flex items-center gap-2">
                  💎 Subscriptions
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                {!isPro && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#fbd158]/30 to-[#e9a701]/30 dark:from-[#fbd158]/10 dark:to-[#e9a701]/10 border border-yellow-300/40 dark:border-yellow-300/20">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold dark:text-white">
                        ⭐ Taskoria Pro
                      </p>
                      <Badge
                        className="text-white"
                        style={{
                          background:
                            "linear-gradient(to right, #fbd158, #e9a701)",
                        }}
                      >
                        PRO
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Verified badge, weekly free leads & more.
                    </p>

                    <Link href="/settings/billing/taskoria_pro">
                      <Button
                        className="mt-3 w-full bg-gradient-to-r from-[#fbd158] to-[#e9a701] hover:opacity-90 text-black font-medium"
                        size="sm"
                      >
                        Activate
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-gradient-to-r from-[#3C7DED]/20 to-[#46CBEE]/20 dark:from-[#3C7DED]/10 dark:to-[#46CBEE]/10 border border-blue-300/30 dark:border-blue-300/20">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold dark:text-white">
                      🎯 Starter Pack
                    </p>
                    <Badge
                      className="text-white"
                      style={{
                        background:
                          "linear-gradient(to right, #3C7DED, #46CBEE)",
                      }}
                    >
                      -20%
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Respond to 10 customers & boost credibility.
                  </p>

                  <Link href="/settings/billing/my_credits">
                    <Button
                      className="mt-3 w-full bg-gradient-to-r from-[#3C7DED] to-[#46CBEE] hover:opacity-90 text-white"
                      size="sm"
                    >
                      Get Offer
                    </Button>
                  </Link>
                </div>
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
