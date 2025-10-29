"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchProviders } from "@/utils/api";

interface Provider {
    user_id: number;
    name: string;
    services: string[];
    rating: number;
    reviews_count: number;
    image?: string;
    hourly_rate: number;
    badges?: string[];
  }

export const useProviders = (limit?: number) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProviders = async () => {
      try {
        const data = await fetchProviders(limit);
        setProviders(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load providers.");
      } finally {
        setLoading(false);
      }
    };
    getProviders();
  }, [limit]);

  return { providers, loading };
};