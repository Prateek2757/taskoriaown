"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants, easeOut } from "motion/react";
import Image from "next/image";
import type { Metadata } from "next";

// export const dynamic = "force-static";


type Props = {
  params: { slug: string };
};

// export async function generateMetadata(
//   { params }: Props
// ): Promise<Metadata> {
//   try {
//     const { slug } = params;

//     const res = await axios.get(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${slug}`
//     );

//     const category = res.data;

//     return {
//       title: `${category.name} Services | Hire Verified Professionals – Taskoria`,
//       description: `Browse verified ${category.name.toLowerCase()} service providers on Taskoria. Secure booking, trusted professionals, and payment protection guaranteed.`,
//       keywords: [
//         `${category.name} services`,
//         `${category.name} providers`,
//         "hire professionals",
//         "verified service providers",
//         "Taskoria categories",
//         "secure service marketplace"
//       ],
//       openGraph: {
//         title: `${category.name} Services | Taskoria`,
//         description: `Find trusted and verified ${category.name.toLowerCase()} professionals on Taskoria.`,
//         url: `https://www.taskoria.com/categories/${slug}`,
//         siteName: "Taskoria",
//         type: "website",
//         locale: "en_AU",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: `${category.name} Services | Taskoria`,
//         description: `Hire verified ${category.name.toLowerCase()} professionals with secure payments.`,
//       },
//       alternates: {
//         canonical: `https://www.taskoria.com/categories/${slug}`,
//       },
//     };
//   } catch (error) {
//     return {
//       title: "Service Categories | Taskoria",
//       description:
//         "Browse service categories and hire verified professionals on Taskoria with secure payments and trusted providers.",
//     };
//   }
// }

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

export default function CategoryPage({
  initialCategory,
}: {
  initialCategory: Category | null;
}) {
  const [category] = useState<Category | null>(initialCategory);
  const [providers, setProviders] = useState<Provider[]>([]);

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
                title="profile"
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
