import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "./_components/LoadingState";
import { OnboardingContent } from "./_components/OnboardingContent";

export const metadata: Metadata = {
  title: { absolute: "Create Your Taskoria Account" },
  description:
    "Create a Taskoria account to post jobs, compare quotes, message professionals, and manage your service requests.",
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OnboardingContent />
    </Suspense>
  );
}
