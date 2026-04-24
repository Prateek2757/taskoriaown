"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  BadgePercent,
  Wallet,
  ReceiptText,
  ArrowRight,
  Clock,
  CheckCircle,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/refund/spinner";
import { usePendingPayouts } from "@/hooks/Admin/usePendingPayouts";
import { useCommissions } from "@/hooks/Admin/useCommissions";
import { useAffiliateAdmin } from "@/hooks/Admin/useAffiliatesAdmin";

interface HubStats {
  pendingPayouts: number;
  pendingCommissions: number;
  totalAffiliates: number;
  approvedBalance: number;
  totalPaidOut: number;
  loading: boolean;
}

function useHubStats(): HubStats {
  const { payouts } = usePendingPayouts();
  const { commissions } = useCommissions("pending");
  const { affiliates } = useAffiliateAdmin();

  const [stats, setStats] = useState<HubStats>({
    pendingPayouts: 0,
    pendingCommissions: 0,
    totalAffiliates: 0,
    approvedBalance: 0,
    totalPaidOut: 0,
    loading: true,
  });

  useEffect(() => {
    if (!payouts || !commissions || !affiliates) return;

    setStats({
      pendingPayouts: payouts.length,
      pendingCommissions: commissions.length,
      totalAffiliates: affiliates.length,
      approvedBalance: affiliates.reduce(
        (s: number, a: any) => s + Number(a.approved_earnings ?? 0),
        0
      ),
      totalPaidOut: affiliates.reduce(
        (s: number, a: any) => s + Number(a.total_paid_out ?? 0),
        0
      ),
      loading: false,
    });
  }, [payouts, commissions, affiliates]);

  return stats;
}

function fmt(n: number) {
  return n.toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function Skel({ w = "w-16" }: { w?: string }) {
  return (
    <span
      className={`inline-block h-5 ${w} bg-white/10 rounded animate-pulse`}
    />
  );
}

const SECTIONS = [
  {
    label: "Affiliates",
    href: "/admin/adminaffiliatespage",
    icon: Users,
    accent: "from-blue-500 to-blue-700",
    ring: "ring-blue-500/20",
    shadow: "shadow-blue-500/10",
    desc: "View all affiliate accounts, bank details, referral pipelines, and process pending payout requests.",
    actions: ["View affiliates", "Process payouts", "Check bank details"],
    badgeKey: "pendingPayouts" as const,
    badgeLabel: "payouts need action",
  },
  {
    label: "Commissions",
    href: "/admin/admincommissionstab",
    icon: BadgePercent,
    accent: "from-emerald-500 to-emerald-700",
    ring: "ring-emerald-500/20",
    shadow: "shadow-emerald-500/10",
    desc: "Approve or reject commission records generated from subscription purchases. 20% for 12 months.",
    actions: [
      "Approve commissions",
      "Review rejections",
      "Check 12-month window",
    ],
    badgeKey: "pendingCommissions" as const,
    badgeLabel: "awaiting review",
  },
  {
    label: "Budget Manager",
    href: "/admin/adminbudgetmanager",
    icon: Wallet,
    accent: "from-amber-500 to-amber-700",
    ring: "ring-amber-500/20",
    shadow: "shadow-amber-500/10",
    desc: "Track total affiliate spend, approved balances, payout thresholds, and commission rate configuration.",
    actions: ["View spend breakdown", "Set thresholds", "Export reports"],
    badgeKey: null,
    badgeLabel: null,
  },
  {
    label: "Refunds",
    href: "/admin/refunds",
    icon: ReceiptText,
    accent: "from-rose-500 to-rose-700",
    ring: "ring-rose-500/20",
    shadow: "shadow-rose-500/10",
    desc: "Handle subscription refund requests, credit reversals, and payout rejections from this panel.",
    actions: ["Process refunds", "Reverse credits", "Reject payouts"],
    badgeKey: null,
    badgeLabel: null,
  },
] as const;

export default function AdminHubPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const { payouts } = usePendingPayouts();
  const { commissions } = useCommissions("pending");
  const { affiliates } = useAffiliateAdmin();

  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "unauthenticated") {
      router.replace("/signin");
      return;
    }
    if (session?.user.adminrole !== "admin") {
      router.replace("/provider/dashboard");
    }
  }, [authStatus, session, router]);

  const stats = useHubStats();
  const totalAlerts = stats.pendingPayouts + stats.pendingCommissions;

  const isReady =
    authStatus === "authenticated" && session?.user.adminrole === "admin";

  if (!isReady) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
          <Spinner />
          <span className="text-sm">Checking permissions…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 p-10">
      <div>
        <h1 className="text-2xl font-bold  tracking-tight">Admin Hub</h1>
        <p className="dark:text-slate-400  text-sm mt-1">
          Everything in one place — pick a section below to get started.
        </p>
      </div>

      {!stats.loading && totalAlerts > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl  bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-600 dark:text-amber-300">
            <span className="font-semibold">
              {totalAlerts} item{totalAlerts !== 1 ? "s" : ""}
            </span>{" "}
            need{totalAlerts === 1 ? "s" : ""} your attention —{" "}
            {stats.pendingPayouts > 0 && (
              <Link
                href="/admin/adminaffiliatespage"
                className="underline underline-offset-2 hover:text-amber-600"
              >
                {stats.pendingPayouts} payout
                {stats.pendingPayouts !== 1 ? "s" : ""}
              </Link>
            )}
            {stats.pendingPayouts > 0 &&
              stats.pendingCommissions > 0 &&
              " and "}
            {stats.pendingCommissions > 0 && (
              <Link
                href="/admin/admincommissionstab"
                className="underline underline-offset-2 hover:text-amber-200"
              >
                {stats.pendingCommissions} commission
                {stats.pendingCommissions !== 1 ? "s" : ""}
              </Link>
            )}
            .
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            icon: Users,
            label: "Total Affiliates",
            value: stats.loading ? null : String(stats.totalAffiliates),
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            icon: Clock,
            label: "Pending Payouts",
            value: stats.loading ? null : String(stats.pendingPayouts),
            color: "text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            icon: BadgePercent,
            label: "Pending Commissions",
            value: stats.loading ? null : String(stats.pendingCommissions),
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            icon: DollarSign,
            label: "Total Paid Out",
            value: stats.loading ? null : `$${fmt(stats.totalPaidOut)}`,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-xl bg-white/3 border border-white/6 p-4"
          >
            <div
              className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}
            >
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-xl font-bold">
              {value === null ? <Skel w="w-10" /> : value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const count = section.badgeKey
            ? (stats[section.badgeKey as keyof HubStats] as number)
            : 0;

          return (
            <Link
              key={section.href}
              href={section.href}
              className={`
                group relative flex flex-col rounded-2xl
                bg-white/[0.03] border border-white/[0.06]
                hover:bg-white/[0.06] hover:border-white/10
                ring-1 ${section.ring} hover:ring-2
                shadow-lg ${section.shadow}
                transition-all duration-200 overflow-hidden
                p-5
              `}
            >
              {/* Gradient top strip */}
              {/* <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${section.accent} opacity-60 group-hover:opacity-100 transition-opacity`} /> */}

              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.accent} flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {count > 0 && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-xs font-semibold flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {count} {section.badgeLabel}
                  </span>
                )}
                {count === 0 && section.badgeKey && !stats.loading && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 text-xs font-medium flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    All clear
                  </span>
                )}
              </div>

              {/* Title + desc */}
              <h2 className=" font-semibold text-base mb-1.5">
                {section.label}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                {section.desc}
              </p>

              {/* Action bullets */}
              <div className="mt-4 mb-4 space-y-1.5">
                {section.actions.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                    {a}
                  </div>
                ))}
              </div>

              {/* Go button */}
              <div className="flex items-center justify-between pt-3 border-t border-white/6">
                <span className="text-xs text-slate-600">Click to open</span>
                <span
                  className={`
                  flex items-center gap-1.5 text-xs font-semibold
                  bg-linear-to-r ${section.accent}
                  bg-clip-text text-transparent
                  group-hover:gap-2.5 transition-all
                `}
                >
                  Open{" "}
                  <ArrowRight className="w-3.5 h-3.5 text-current opacity-70" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
