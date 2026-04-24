import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export const useAffiliateAdmin = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/affiliates/affiliate-admin`,
    fetcher
  );

  return {
    affiliates: data || [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
};
