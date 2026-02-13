"use client";

import useSWR from "swr";
import { toast } from "sonner";
import { fetchCategories } from "@/utils/api";
import axios from "axios";

interface Category {
  category_id: number;
  name: string;
  slug: string;
}

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};
export const useCategories = (limit?: number) => {
  const { data, error, isLoading } = useSWR<Category[]>(
    "/api/signup/category-selection",
    fetcher,
    {
      revalidateOnFocus: false,    
      revalidateOnReconnect: false,
      dedupingInterval: 1000 * 60 * 60, 
    }
  );

  if (error) {
    toast.error(error.message || "Failed to load categories.");
  }

  const categories = limit && data ? data.slice(0, limit) : data || [];

  return {
    categories,
    loading: isLoading,
  };
};