"use client";
import { useState } from "react";
import { Toaster } from "sonner";
import { SettingsPage } from "@/components/affiliate-dashboard/components/SettingsPage";
import { ResourcesPage } from "@/components/affiliate-dashboard/components/ResourcesPage";
import { PayoutsPage } from "@/components/affiliate-dashboard/components/PayoutPage/PayoutsPage";
import { ReferralsPage } from "@/components/affiliate-dashboard/components/ReferralsPage";
import { AnalyticsPage } from "@/components/affiliate-dashboard/components/AnalyticsPage";
import { DashboardOverview } from "@/components/affiliate-dashboard/components/DashboardOverview";
import { DashboardLayout } from "@/components/affiliate-dashboard/components/DashboardLayout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";

type AuthView = "login" | "register" | "forgot-password" | "otp-verification";
type DashboardView =
  | "dashboard"
  | "analytics"
  | "referrals"
  | "payouts"
  | "resources"
  | "settings";

function AppContent() {
  const { data: session, status } = useSession();

  const [authView, setAuthView] = useState<AuthView>("login");
  const [dashboardView, setDashboardView] =
    useState<DashboardView>("referrals");

  // Show OTP verification if user exists but not verified
  //   if (sess && user && !user.isVerified && authView !== 'otp-verification') {
  //     setAuthView('otp-verification');
  //   }

  //   if (!session ) {
  //     switch (authView) {
  //       case 'login':
  //         return (
  //           <LoginPage
  //             onRegisterClick={() => setAuthView('register')}
  //             onForgotPasswordClick={() => setAuthView('forgot-password')}
  //           />
  //         );
  //       case 'register':
  //         return (
  //           <RegisterPage
  //             onLoginClick={() => setAuthView('login')}
  //           />
  //         );
  //       case 'forgot-password':
  //         return (
  //           <ForgotPasswordPage
  //             onBackToLogin={() => setAuthView('login')}
  //           />
  //         );
  //       case 'otp-verification':
  //         return (
  //           <OTPVerificationPage
  //             onComplete={() => setAuthView('login')}
  //           />
  //         );
  //       default:
  //         return <LoginPage onRegisterClick={() => setAuthView('register')} onForgotPasswordClick={() => setAuthView('forgot-password')} />;
  //     }
  //   }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="w-12 h-12 text-amber-400" />
        <p className="text-slate-600 font-medium">
          Please login to access your affiliate dashboard.
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout activeView={dashboardView} onViewChange={setDashboardView}>
      {/* {dashboardView === "dashboard" && <DashboardOverview />}
      {dashboardView === "analytics" && <AnalyticsPage />} */}
      {dashboardView === "referrals" && <ReferralsPage />}
      {dashboardView === "payouts" && <PayoutsPage />}
      {/* {dashboardView === "resources" && <ResourcesPage />}
      {dashboardView === "settings" && <SettingsPage />} */}
    </DashboardLayout>
  );
}

function Page() {
  return (
    <>
      <AppContent />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default Page;
