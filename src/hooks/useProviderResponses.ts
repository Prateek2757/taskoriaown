import { useState, useEffect } from "react";
import axios from "axios";
import { ProviderResponse, ResponsesStats } from "@/types";


export function useProviderResponses() {
  const [responses, setResponses] = useState<ProviderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/api/provider-responses");
      setResponses(res.data.responses);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ?? err.message ?? "Failed to fetch responses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const stats: ResponsesStats = {
    total: responses.length,
    open: responses.filter((r) => r.status?.toLowerCase() === "open").length,
    inProgress: responses.filter(
      (r) => r.status?.toLowerCase() === "in progress"
    ).length,
    completed: responses.filter((r) => r.status?.toLowerCase() === "completed")
      .length,
    totalCreditsSpent: responses.reduce(
      (sum, r) => sum + (r.credits_spent || 0),
      0
    ),
  };

  return { responses, loading, error, stats, refetch: fetchResponses };
}
