"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { motion, Variants, easeOut } from "framer-motion";
import { toast } from "sonner";

interface Category {
  category_id: number;
  name: string;
  slug: string;
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/signup/category-selection");
        if (Array.isArray(response.data)) {
          // ✅ Limit to 6 for homepage
          setCategories(response.data.slice(0, 6));
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <motion.section
      id="categories"
      className="py-16 px-4 text-center"
      
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <h2 className="text-3xl font-semibold text-foreground">
        Explore Service Categories
      </h2>
      <p className="text-muted-foreground mt-2">
        Find experts for every need — from home repair to digital marketing
      </p>

      <motion.div
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
        variants={containerVariants}
      >
        {isLoading ? (
          // 🌀 Elegant skeletons for loading
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl border border-gray-200 dark:border-gray-700"
            />
          ))
        ) : categories.length > 0 ? (
          categories.map((c) => (
            <motion.div
              key={c.category_id}
              variants={itemVariants}
              className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-transform transform hover:-translate-y-1"
            >
              <Link
                href={`/categories/${c.slug || c.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex justify-between items-center"
              >
                <div className="font-medium text-foreground">{c.name}</div>
                <span className="text-xs text-primary border border-primary px-3 py-1 rounded-full">
                  Browse
                </span>
              </Link>
            </motion.div>
          ))
        ) : (
          // ❌ No categories found
          <p className="text-muted-foreground col-span-full">
            No categories available at the moment.
          </p>
        )}
      </motion.div>
    </motion.section>
  );
} 