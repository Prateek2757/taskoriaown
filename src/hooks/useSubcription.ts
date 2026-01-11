"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscriptionDetails: {
    subscription_id?: number;
    package_id?: number;
    status?: string;
    end_date?: string;
    cancel_at_period_end?: boolean;
  } | null;
  loading: boolean;
  error: string | null;
}

export function useSubscription() {
  const { data: session, status } = useSession();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    hasActiveSubscription: false,
    subscriptionDetails: null,
    loading: true,
    error: null,
  });

  const checkSubscription = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id) {
      setSubscriptionStatus({
        hasActiveSubscription: false,
        subscriptionDetails: null,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      const response = await fetch(`/api/subcriptioncheck/${session.user.id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus({
          hasActiveSubscription: data.hasActiveSubscription,
          subscriptionDetails: data.subscription,
          loading: false,
          error: null,
        });
      } else {
        setSubscriptionStatus({
          hasActiveSubscription: false,
          subscriptionDetails: null,
          loading: false,
          error: data.error || "Failed to check subscription",
        });
      }
    } catch (err: any) {
      console.error("Subscription check error:", err);
      setSubscriptionStatus({
        hasActiveSubscription: false,
        subscriptionDetails: null,
        loading: false,
        error: err.message || "Error checking subscription",
      });
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    ...subscriptionStatus,
    refetch: checkSubscription,
  };
}