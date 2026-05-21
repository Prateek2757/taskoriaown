"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface Provider {
  user_id: number;
  name: string;
  public_id?: string;
  services: string[];
  company_name?: string;
  logo_url?: string;
  company_slug?: string;
  avg_rating?: number;
  total_reviews?: number;
  rating: number;
  reviews_count: number;
  image?: string;
  joineddate?: string;
  locationname?: string;
  nationwide?: boolean;
  hourly_rate: number;
  badges?: string[];
  slug?: string;
  isPro?: boolean;
}

export const useProviders = (limit?: number) => {
  const { data, error, isLoading } = useSWR<Provider[]>(
    "/api/providers",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 1000 * 60 * 5,
    }
  );

  const providers =
    isLoading || !data ? [] : limit ? data.slice(0, limit) : data;

  return {
    providers,
    loading: isLoading,
    error: error?.message ?? null,
  };
};