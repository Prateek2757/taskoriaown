"use client"
import Link from "next/link";
import { motion, Variants, easeOut } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";


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
  const { categories, loading } = useCategories(6);

  return (
    <motion.section
  id="categories"
  className="py-16 px-4 text-center"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
  variants={containerVariants}
>
  <div className="max-w-6xl mx-auto">
    {/* Desktop Header */}
    <h2 className="text-3xl font-semibold text-foreground text-center mb-2">
      Explore Service Categories
    </h2>
    <p className="text-muted-foreground text-sm sm:text-base text-center mb-10">
      Find experts for every need — from home repair to digital marketing
    </p>

    {/* Categories Grid */}
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
    >
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl border border-gray-200 dark:border-gray-700"
            />
          ))
        : categories.length > 0
        ? categories.map((c) => (
            <motion.div
              key={c.category_id}
              variants={itemVariants}
              className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-transform transform hover:-translate-y-1"
            >
              <Link
                href={`/services/${c.slug || c.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex justify-between items-center"
              >
                <div className="font-medium text-foreground">{c.name}</div>
                <span className="text-xs text-primary border border-primary px-3 py-1 rounded-full">
                  Browse
                </span>
              </Link>
            </motion.div>
          ))
        : (
          <p className="text-muted-foreground col-span-full">
            No categories available at the moment.
          </p>
        )}
    </motion.div>

    {/* View All Button */}
    <div className="mt-8 flex justify-center ">
      <Link href="/services">
        <button className="text-sm px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition">
          View All
        </button>
      </Link>
    </div>
  </div>
</motion.section>
  );
}
