import useSWR from "swr";
import axios from "axios";
import { Lead } from "@/components/showinglead/Leadpage";



const fetcher = (url: string) => axios.get<Lead[]>(url).then((res) => res.data);

export function useLeads() {
  const { data, error, isLoading, mutate } = useSWR<Lead[]>("/api/leads", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  });

  const leads: Lead[] = Array.isArray(data) ? data : [];

  const markAsSeen = async (taskId: number) => {
    const seenAt = new Date().toISOString();

    mutate(
      leads.map((l) =>
        l.task_id === taskId ? { ...l, is_seen: true, seen_at: seenAt } : l
      ),
      false
    );

    try {
      await axios.put(`/api/lead/${taskId}`, { seen: true });
    } catch (err) {
      console.error("Failed to mark lead as seen:", err);
      mutate(); 
    }
  };

  return {
    leads,
    error: error ? "Failed to fetch leads." : null,
    isLoading,
    mutate,
    markAsSeen,
  };
}