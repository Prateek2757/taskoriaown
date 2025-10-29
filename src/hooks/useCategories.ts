
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchCategories } from "@/utils/api";

interface Category {
    category_id: number;
    name: string;
    slug: string;
  }

export const useCategories = (limit?: number) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProviders = async () => {
      try {
        const data = await fetchCategories(limit);
        setCategories(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load providers.");
      } finally {
        setLoading(false);
      }
    };
    getProviders();
  }, [limit]);

  return { categories, loading };
};