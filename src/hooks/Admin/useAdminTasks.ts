import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export const useAdminTasks = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/tasks",
    fetcher
  );

  return {
    tasks: data || [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
};
