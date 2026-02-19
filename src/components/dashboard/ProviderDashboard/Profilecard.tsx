"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { User, Mail, ShieldAlert, ShieldCheck, Copy, Check, Share2, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EmailVerificationDialog } from "./Emailverificationdialog";
import { toast } from "sonner";

interface ProfileCardProps {
  user: {
    email: string;
    role: string;
  };
  profile: {
    is_email_verified?: boolean;
    display_name?: string;
    profile_image_url?: string;
    is_pro?: boolean;
    referral_code?: string;

  };
  nameToShow: string;
  imageToShow?: string;
  isPro?: boolean;
  onVerificationSuccess?: () => void;
}

export function ProfileCard({
  user,
  profile,
  nameToShow,
  imageToShow,
  isPro = false,
  onVerificationSuccess,
}: ProfileCardProps) {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralLink = profile.referral_code
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${profile.referral_code}`
    : null;



  const handleCopyCode = () => {
    if (!profile.referral_code) return;
    navigator.clipboard.writeText(profile.referral_code);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Taskoria to find trusted professionals easily!",
          text: `Use my referral code ${profile.referral_code} to sign up.`,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied!");
    }
  };

  return (
    <>
      <Card className="border rounded-2xl shadow-lg backdrop-blur bg-white/80 dark:bg-white/5 py-0 border-gray-200 dark:border-white/10 overflow-hidden">
        <CardContent className="pt-6 pb-0 text-center relative">
          {isPro && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-yellow-600/5 pointer-events-none" />
              <div className="absolute top-0 right-0 w-full h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="p-2 z-10">
            <div className="relative h-28 w-28 mx-auto mb-4 group">
              {isPro && (
                <>
                  <div
                    className="absolute -inset-4 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "conic-gradient(from 0deg, #eab308, #f59e0b, #d97706, #ca8a04, #eab308)",
                      animation: "spin 5s linear infinite",
                      filter: "blur(16px)",
                    }}
                  />
                  <div className="absolute -inset-2 rounded-full border-[3px] border-yellow-400/70 animate-pulse shadow-[0_0_50px_rgba(234,179,8,0.8),0_0_100px_rgba(234,179,8,0.4)] pointer-events-none" />
                  <div className="absolute -inset-1 rounded-full border-2 border-amber-400/80 pointer-events-none shadow-[0_0_30px_rgba(245,158,11,0.6)]" />
                  <div className="absolute -inset-0.5 rounded-full border border-yellow-500/60 pointer-events-none" />
                </>
              )}

              <Avatar className="relative h-28 w-28 mx-auto">
                {imageToShow ? (
                  <Image
                    src={imageToShow}
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
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-sm border border-yellow-500/30 hover:scale-110 transition-transform duration-300 z-20"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #eab308 100%)",
                    color: "#000",
                    boxShadow: "0 8px 20px rgba(234, 179, 8, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3 7h7l-5.5 4.1L18 21l-6-4-6 4 1.5-7.9L2 9h7z" />
                  </svg>
                  <span>Plus</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20 pointer-events-none" />
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
                <svg className="inline-block ml-2 w-5 h-5 text-yellow-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              )}
            </h2>

            <div className="space-y-3 mb-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{user.email}</p>

              {profile?.is_email_verified ? (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 shadow-lg">
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">Email Verified</span>
                </div>
              ) : (
                <div className="mx-auto max-w-sm">
                  <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-2 border border-red-200 dark:border-red-800/50 shadow-sm">
                    <div className="flex items-start gap-2.5 mb-3">
                      <div className="p-1 rounded-lg bg-red-100 dark:bg-red-900/40">
                        <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-bold text-red-900 dark:text-red-100">Email Not Verified</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowVerificationDialog(true)}
                      size="sm"
                      className="w-full text-xs font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                      Verify Email Now
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <p className={`text-xs ${isPro ? "text-yellow-500/70 font-medium" : "text-slate-500 dark:text-slate-400"}`}>
              Role:{" "}
              <strong className={isPro ? "text-yellow-400" : ""}>{user.role}</strong>
            </p>

            <div className="mx-3 mt-4 mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isPro ? "text-slate-600 dark:text-slate-400 font-medium" : "text-slate-700 dark:text-slate-300"}`}>
                  Profile completion:{" "}
                  <span className={`font-bold ${isPro ? "text-yellow-400" : "font-semibold"}`}>27%</span>
                </span>
                <Link
                  href="/settings/profile/my-profile"
                  className={`text-sm font-medium flex items-center gap-1 group/link transition-all ${
                    isPro ? "text-yellow-400 hover:text-yellow-300" : "text-blue-700 dark:text-blue-400"
                  }`}
                >
                  Edit
                  <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                {isPro && <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full blur-md" />}
                <Progress
                  value={27}
                  className={`h-2 rounded-full relative ${isPro ? "bg-slate-700/50" : ""}`}
                  style={isPro ? { background: "linear-gradient(to right, rgba(234, 179, 8, 0.2), rgba(245, 158, 11, 0.2))" } : {}}
                />
              </div>
            </div>

            {isPro && (
              <div className="mx-3 mb-4 p-2 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-xs text-yellow-500/90 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Exclusive PRO Features Unlocked</span>
                </div>
              </div>
            )}
          </div>

          {profile.referral_code && (
            <div className={`mx-0 px-5 py-4 border-t ${
              isPro
                ? "border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 via-amber-400/5 to-transparent"
                : "border-gray-100 dark:border-white/8 bg-gradient-to-br from-blue-50/60 via-cyan-50/40 to-transparent dark:from-blue-950/20 dark:via-cyan-950/10 dark:to-transparent"
            }`}>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    isPro
                      ? "bg-yellow-500/15 text-yellow-500"
                      : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                  }`}>
                    <Gift className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-xs font-semibold tracking-wide uppercase ${
                    isPro ? "text-yellow-500/80" : "text-slate-500 dark:text-slate-400"
                  }`}>
                    Your Referral Code
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-all ${
                    isPro
                      ? "text-yellow-400 hover:bg-yellow-500/10"
                      : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  }`}
                >
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
              </div>

              <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${
                isPro
                  ? "bg-yellow-500/8 border-yellow-500/25"
                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
              }`}>
                <span className={`flex-1 text-center font-mono text-lg font-bold tracking-[0.2em] select-all ${
                  isPro
                    ? "text-yellow-400"
                    : "text-blue-700 dark:text-blue-300"
                }`}>
                  {profile.referral_code}
                </span>

                <button
                  onClick={handleCopyCode}
                  title="Copy code"
                  className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    copied
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900"
                      : isPro
                      ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <p className={`mt-2.5 text-xs leading-relaxed ${
                isPro ? "text-yellow-500/60" : "text-slate-400 dark:text-slate-500"
              }`}>
                Share your code and earn rewards when friends join.
              </p>
            </div>
          )}
        </CardContent>

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </Card>

      <EmailVerificationDialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
        onSuccess={onVerificationSuccess}
        userEmail={user.email}
      />
    </>
  );
}