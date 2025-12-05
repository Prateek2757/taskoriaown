"use client";
import { motion, Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staticImages = [
  {
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    gradient: "from-red-500/20 to-orange-500/20",
  },
  {
    url: "https://images.unsplash.com/photo-1728808668131-76d40d112271?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=772",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    url: "https://images.unsplash.com/photo-1621460248083-6271cc4437a8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
    gradient: "from-slate-500/20 to-gray-500/20",
  },
  {
    url: "https://plus.unsplash.com/premium_photo-1663045495725-89f23b57cfc5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    url: "https://plus.unsplash.com/premium_photo-1661340932540-c285e730728a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState("Services");
  const { categories, loading } = useCategories(5);

  return (
    <section
      className="min-h-screen 
 py-10 px-4 sm:px-6 lg:px-8 dark:bg-[radial-gradient(circle_at_center,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_50%,rgba(0,0,0,1)_90%)] "
    >
      <div className="max-w-7xl relative mx-auto">
        
        {/* <motion.div
          className="flex gap-3 mb-10 justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => setActiveTab("Services")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "Services"
                ? "bg-white/40 text-gray-900 backdrop-blur-md border border-gray-200 shadow-lg shadow-blue-200/30"
                : "bg-white/10 text-gray-300 border border-gray-100 hover:bg-white/20"
            }`}
          >
            Services
          </button>
        </motion.div> */}

        <motion.div
          className="flex gap-8 items-start mb-10 flex-col lg:flex-row
          bg-white/30 dark:bg-white/5  backdrop-blur-xl shadow-lg shadow-blue-100/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full lg:w-2/3  flex-col  ">
            <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight drop-shadow-sm">
              All Your Skills,
              <br />
              <span className="text-blue-400">Empowered and Rewarded</span>
            </h1>
          </div>

          <div className="lg:pt-4 flex-col flex-1">
            <p className="text-gray-700 dark:text-gray-300 pb-3 text-lg leading-relaxed max-w-xl">
              Connect with trusted experts for every task — from home repairs to
              creative work — all in one place on Taskoria.
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-3xl bg-gray-200 animate-pulse ${
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                } ${index === 3 ? "lg:col-span-2" : ""}`}
              >
                <div className="h-full min-h-[320px] lg:min-h-[400px]" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.category_id}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-3xl ${
                  index === 0 ? "lg:col-span-2 lg:row-span-" : ""
                } ${index === 3 ? "lg:col-span-3  " : ""}`}
              >
                <Link
                  href={`/services/${
                    category.slug ||
                    category.name.toLowerCase().replace(/\s+/g, "-")
                  }`}
                  className="block"
                >
                  <div className="relative h-full min-h-[320px] lg:min-h-[300px]">
                    <div className="absolute inset-0">
                      <img
                        src={staticImages[index]?.url || staticImages[0].url}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${
                          staticImages[index]?.gradient ||
                          staticImages[0].gradient
                        } to-transparent opacity-60`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
                      <div className="flex justify-end">
                        <button className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-45">
                          <ArrowUpRight className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
                          {category.name}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed max-w-md">
                          {
                            "Professional services tailored to your needs with quality and expertise."
                          }
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              No categories available at the moment.
            </p>
          </div>
        )}

        {!loading && categories.length > 0 && (
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/services">
              <button className="group px-8 py-3 bg-white dark:bg-transparent border-2 border-blue-500 text-blue-500 dark:text-blue-300 rounded-full font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30">
                <span className="flex items-center gap-2">
                  View All Services
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300 group-hover:rotate-45" />
                </span>
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
