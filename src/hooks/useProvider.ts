"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchProviders } from "@/utils/api";

interface Provider {
    user_id: number;
    name: string;
    public_id?:string;
    services: string[];
    company_name?:string;
    logo_url?:string;
    rating: number;
    reviews_count: number;
    image?: string;
    joineddate?:string;
    locationname?:string;
    nationwide?:boolean;
    hourly_rate: number;
    badges?: string[];
    slug?: string;
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