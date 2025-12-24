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
import NotificationBell from "../notification/NotificationBell";

export default function ProviderDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile } = useLeadProfile();

  const [showStats, setShowStats] = useState(false);
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const isPro = profile?.is_pro;
  const activeSubscription = profile?.active_subscription;
  console.log(profile?.company_size);

  const imageToShow = profile?.has_company && profile?.company_size !== "Sole-Trader" ? profile?.logo_url : profile?.profile_image_url
  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, router]);
  const nameToShow = profile?.has_company && profile?.company_size !== "Sole-Trader" ? profile?.company_name : profile?.display_name

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
                <Avatar className="relative h-28 w-28 mx-auto mb-4 group">
                  {isPro && (
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-500 dark:border-yellow-500 animate-puse shadow-[0_0_25px_rgba(255,204,0,0.7)] pointer-events-none"></div>
                  )}

                  {imageToShow ? (
                    <Image
                      src={imageToShow as string}
                      width={112}
                      height={112}
                      alt="Profile"
                      className="rounded-full object-cover h-full w-full"
                    />
                  ) : (
                    <div className="w-30 h-28 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-15 h-15 text-white" />
                  </div>
                  )}

                  {isPro && (
                    <div
                      className="absolute bottom-0 right-7 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg "
                      style={{
                        background: "linear-gradient(135deg,#EAB308)",
                        color: "#000",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3 7h7l-5.5 4.1L18 21l-6-4-6 4 1.5-7.9L2 9h7z" />
                      </svg>
                      PRO
                    </div>
                  )}
                </Avatar>

                <h2 className="text-xl font-semibold dark:text-white">{nameToShow}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>

                <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                  Role: <strong>{user.role}</strong>
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-slate-300">
                      Profile completion: <span className="font-semibold">27%</span>
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
      border rounded-2xl shadow-lg backdrop-blur-xl
      bg-white/70 dark:bg-white/5
      border-gray-200 dark:border-white/10
      p-4
    "
            >
              <CardHeader className="pb-">
                <CardTitle className="text-lg font-semibold dark:text-white flex items-center gap-2">
                  💎 Subscriptions
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">


                {
                  !isPro && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#fbd158]/30 to-[#e9a701]/30 dark:from-[#fbd158]/10 dark:to-[#e9a701]/10 border border-yellow-300/40 dark:border-yellow-300/20">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold dark:text-white">⭐ Taskoria Pro</p>
                        <Badge
                          className="text-white"
                          style={{ background: "linear-gradient(to right, #fbd158, #e9a701)" }}
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
                  )
                }


                <div className="p-4 rounded-xl bg-gradient-to-r from-[#3C7DED]/20 to-[#46CBEE]/20 dark:from-[#3C7DED]/10 dark:to-[#46CBEE]/10 border border-blue-300/30 dark:border-blue-300/20">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold dark:text-white">🎯 Starter Pack</p>
                    <Badge
                      className="text-white"
                      style={{
                        background: "linear-gradient(to right, #3C7DED, #46CBEE)",
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
