"use client";
import { useState } from "react";
import { Toaster } from "sonner";
import { SettingsPage } from "@/components/affiliate-dashboard/SettingsPage";
import { ResourcesPage } from "@/components/affiliate-dashboard/ResourcesPage";
import { PayoutsPage } from "@/components/affiliate-dashboard/PayoutsPage";
import { ReferralsPage } from "@/components/affiliate-dashboard/ReferralsPage";
import { AnalyticsPage } from "@/components/affiliate-dashboard/AnalyticsPage";
import { DashboardOverview } from "@/components/affiliate-dashboard/DashboardOverview";
import { DashboardLayout } from "@/components/affiliate-dashboard/DashboardLayout";
import { useSession } from "next-auth/react";

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

  return (
    <DashboardLayout activeView={dashboardView} onViewChange={setDashboardView}>
      {/* {dashboardView === "dashboard" && <DashboardOverview />}
      {dashboardView === "analytics" && <AnalyticsPage />} */}
      {dashboardView === "referrals" && <ReferralsPage />}
      {/* {dashboardView === "payouts" && <PayoutsPage />}
      {dashboardView === "resources" && <ResourcesPage />}
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
