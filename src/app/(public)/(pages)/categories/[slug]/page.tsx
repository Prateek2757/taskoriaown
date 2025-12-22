"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, Variants, easeOut } from "motion/react";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";

interface Provider {
  provider_id: number;
  name: string;
  company_name?: string;
  avatar_url?: string;
  category_slug: string;
}

interface Category {
  category_id: number;
  name: string;
  slug: string;
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch category info by slug
        const categoryRes = await axios.get(`/api/categories/${slug}`);
        setCategory(categoryRes.data);

        // Fetch providers linked to this category
        // const providerRes = await axios.get(`/api/providers?category=${slug}`);
        // setProviders(providerRes.data);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load category or providers.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchCategoryData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20 px-4 text-center">
        <h2 className="text-3xl font-semibold text-foreground animate-pulse">
          Loading category...
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl border border-gray-200 dark:border-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-semibold text-red-600">
          Category not found
        </h2>
      </div>
    );
  }

  return (
    <motion.section
      className="py-16 px-4 text-center"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <h1 className="text-4xl font-bold text-foreground">{category.name}</h1>
      <p className="text-muted-foreground mt-2">
        Explore providers for {category.name}
      </p>

      <motion.div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {providers.length === 0 ? (
          <p className="text-muted-foreground col-span-full">
            No providers found in this category.
          </p>
        ) : (
          providers.map((p) => (
            <motion.div
              key={p.provider_id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1 will-change-transform"
            >
              <Link
                href={`/providers/${p.provider_id}`}
                className="flex items-center gap-4"
              >
                <Image
                height={12}
                width={12}
                  src={p.avatar_url || "/default-avatar.png"}
                  alt={p.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-medium text-foreground">{p.name}</div>
                  {p.company_name && (
                    <div className="text-sm text-muted-foreground">
                      {p.company_name}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.section>
  );
}