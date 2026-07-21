"use client";
import useSWR from "swr";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";

interface Category {
  category_id: number;
  name: string;
  slug: string;
  keywords: string[] | null;
  main_category?: string;
  image_url?: string;
}


export const useCategories = (limit?: number) => {
  const { data, error, isLoading } = useSWR<Category[]>(
    "/api/signup/category-selection?v=2",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 1000 * 60 * 60, 
    }
  );

  
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load categories.");
    }
  }, [error]);

  const categories = isLoading
    ? undefined
    : limit && data
      ? data.slice(0, limit)
      : (data ?? []);

  return {
    categories,
    loading: isLoading,
  };
};
