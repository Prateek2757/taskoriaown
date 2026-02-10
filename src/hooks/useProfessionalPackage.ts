"use client";

import useSWR from "swr";
import { useMemo } from "react";

export interface ProfessionalPackage {
  package_id: number;
  name: string;
  description: string;
  price: number;
  duration_months: number | null;
  visibility_stars: number;
  visibility_description: string;
  badge: string | null;
  free_enquiries: number;
  enquiry_price: number;
  discount_percentage: number;
  stripe_price_id?:string;
  free_trail_days?:string;
  has_performance_insights: boolean;
  has_verified_badge: boolean;
  has_unlocked_inbox: boolean;
  display_order: number;
}

interface PackageResponse {
  success: boolean;
  packages: ProfessionalPackage[];
}

const fetcher = async (url: string): Promise<PackageResponse> => {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json();
};

export function useProfessionalPackages() {
  const { data, error, isLoading, mutate } = useSWR<PackageResponse>(
    "/api/professional-package",
    fetcher,
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryInterval: 3000,
      errorRetryCount: 2,
    }
  );

  const packages = useMemo(() => data?.packages ?? [], [data]);

  return {
    packages,
    isLoading,
    error,
    hasError: Boolean(error),
    refresh: mutate,
  };
}