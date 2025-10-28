"use client";

import { motion, Variants, easeOut } from "framer-motion";
import Link from "next/link";

const categories = [
  { name: "Home Services", icon: "🏠", count: "500+ providers", slug: "home-services" },
  { name: "Professional", icon: "💼", count: "300+ providers", slug: "professional" },
  { name: "Creative", icon: "🎨", count: "200+ providers", slug: "creative" },
  { name: "Technology", icon: "💻", count: "150+ providers", slug: "technology" },
  { name: "Health & Wellness", icon: "🏥", count: "100+ providers", slug: "health-wellness" },
  { name: "Education", icon: "📚", count: "80+ providers", slug: "education" },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export default function Categories() {
  return (
    <motion.section
      id="categories"
      className="py-16 px-4 text-center"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <h2 className="text-3xl font-semibold text-foreground">Explore Service Categories</h2>
      <p className="text-muted-foreground mt-2">
        Find experts for every need — from home repair to digital marketing
      </p>

      <motion.div className="mt-8 grid gap-6 sm:grid-cols-2  lg:grid-cols-3 max-w-6xl mx-auto">
        {categories.map((c) => (
          <motion.div
            key={c.name}
            className="bg-card border border-gray-200 rounded-xl p-5 hover:shadow-lg transition  transform hover:-translate-y-1"
            variants={itemVariants}
          >
            <Link
              href={`/categories/${c.slug ?? c.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex justify-between items-center  rounded-lg"
            >
              <div>
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-medium text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.count}</div>
              </div>
              <span className="text-xs text-primary border border-primary px-3 py-1 rounded-full">
                Browse
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}