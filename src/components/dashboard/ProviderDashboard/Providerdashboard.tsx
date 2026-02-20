"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useLeadProfile } from "@/hooks/useLeadProfile";
import { DashboardStats } from "./Dashboardstats";
import { ProfileCard } from "./Profilecard";
import { UpgradeOffersCard } from "./Upgradeofferscard";
import LeadSettingsCard from "@/components/Lead-setting/leadsetting";
import { LeadsOverviewCard } from "./Leadsoverviewcard";
import { ResponsesCard } from "./Responsescard";
import axios from "axios";
import LoadingSpinner from "@/components/showinglead/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";


export default function ProviderDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile, mutate: mutateProfile , loading} = useLeadProfile();

  const [showStats, setShowStats] = useState(false);
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [totalNewCount, setTotalNewCount] = useState<number | null>(null);
const totalResponses = profile?.response_stats?.total_responses
  const isPro = profile?.is_pro;
  const imageToShow =
    profile?.has_company && profile?.company_size !== "Sole-Trader"
      ? profile?.logo_url
      : profile?.profile_image_url;

  const nameToShow =
    profile?.has_company && profile?.company_size !== "Sole-Trader"
      ? profile?.company_name
      : profile?.display_name;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/signin");
  }, [status, router]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/api/leads");
      const data = await res.data;
      setTotalLeads(data.length ?? 0);
      setTotalNewCount(data.new_leads_count);
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

  const handleVerificationSuccess = () => {
    mutateProfile();
  };

  if (loading || !session?.user) return <Skeleton className="h-full w-full"/>;

  const user = session.user;

  return (
    <div className="min-h-screen py-6 bg-gray-50 dark:bg-[#0d1117] transition-colors duration-300">
      <main className="container mx-auto rounded-2xl px-6 space-y-10 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#3C7DED] bg-clip-text">
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
            className="border-cyan-600 text-cyan-700 dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-400/10"
            onClick={() => setShowStats((prev) => !prev)}
          >
            {showStats ? "Hide Insights" : "View Insights"}
          </Button>
        </div>

        {showStats && <DashboardStats totalLeads={totalLeads} />}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <ProfileCard
              user={{ ...user, email: user.email || "" }}
              profile={profile || {}}
              nameToShow={nameToShow || user.name || "User"}
              imageToShow={imageToShow}
              isPro={isPro}
              onVerificationSuccess={handleVerificationSuccess}
            />
            <UpgradeOffersCard isPro={isPro} />
          </div>

          <LeadSettingsCard />

          <div className="space-y-6">
            <LeadsOverviewCard totalLeads={totalLeads} totalNewCount={totalNewCount} />
            <ResponsesCard totalResponse={totalResponses ?? 0} />
          </div>
        </div>
      </main>
    </div>
  );
}