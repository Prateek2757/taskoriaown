import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export const usePendingPayouts = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/affiliates/payouts",
    fetcher
  );

  return {
    payouts: data || [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
};