import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export const useTasksWithoutBudget = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/tasks-without-budget",
    fetcher
  );

  return {
    tasks: data || [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
};