"use client";

import { motion } from "motion/react";
import { Sparkles, Users, Shield, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Post Your Job",
    description:
      "Use our AI assistant to describe your project effortlessly and publish instantly.",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Get Matched Instantly",
    description:
      "Our AI connects you with verified professionals who match your specific needs.",
    icon: Users,
  },
  {
    id: 3,
    title: "Start Collaborating",
    description:
      "Work seamlessly with real-time chat, milestone tracking, and secure payments.",
    icon: Shield,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
};

const lineVariant = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1 },
};

const arrowVariant = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const arrowMobileVariant = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

export default function HowTaskoriaWorks() {
  return (
    <section
      className="
        relative py-14 px-4 sm:px-6 lg:px-8
        text-black bg-white 
        dark:text-white dark:bg-[radial-gradient(circle_at_left,rgba(19,50,102,1)_0%,rgba(22,23,22,1)_30%,rgba(0,0,0,1)_100%)]
      "
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
        }}
      />

      <div
        className="absolute inset-0 opacity-50 pointer-events-none dark:opacity-20 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
        }}
      />

      <motion.div
        className="max-w-7xl mx-auto relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.7 }}
          className="sm:text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            How it works?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            "I dream of one URL that sums it all up to share with Business"
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-10 lg:gap-8 max-w-6xl mx-auto max-sm:pl-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative">
              <motion.div
                variants={cardVariant}
                transition={{ duration: 0.6, delay: index * 0.25 }}
                className="
                  group relative w-full rounded-3xl p-8
                  bg-white/70 dark:bg-white/5
                  border border-black/10 dark:border-white/20 
                  backdrop-blur-2xl shadow-2xl
                  hover:border-[#41A6EE]/60 hover:shadow-[0px_8px_60px_rgba(65,166,238,0.25)]
                  hover:scale-[1.02]
                  transition-all duration-500
                  before:absolute before:inset-0 before:rounded-3xl
                  before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-transparent
                  dark:before:from-white/10 dark:before:via-white/5 dark:before:to-transparent
                  before:pointer-events-none before:transition-opacity before:duration-500
                  after:absolute after:inset-0 after:rounded-3xl
                  after:bg-gradient-to-br after:from-[#41A6EE]/20 after:via-[#41A6EE]/5 after:to-transparent
                  after:opacity-0 after:transition-all after:duration-500
                  hover:after:opacity-100
                  after:pointer-events-none
                "
                style={{
                  boxShadow:
                    "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                }}
              >
                <div className="relative z-10">
                  <div className="bg-white  dark:bg-accent absolute -left-12 -top-16 w-16 h-16 rounded-lg flex items-center justify-center border-2 border-[#41A6EE]  text-[#41A6EE] font-bold text-2xl mb-6 shadow-lg group-hover:shadow-[0px_0px_30px_rgba(65,166,238,0.6)] group-hover:scale-110 transition-all duration-500">
                    {step.id}
                  </div>

                  <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-[#41A6EE] dark:group-hover:text-[#41A6EE] transition-colors duration-500">
                    {step.title}
                  </h3>

                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-7"
        >
          <Link href="/signin">
            <button className="group px-8 py-3 bg-white dark:bg-transparent border-2 border-blue-500 text-blue-500 dark:text-blue-300 rounded-full font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30">
              <span className="flex items-center gap-2">
                Start My 1-Minute Setup
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300 group-hover:rotate-45" />
              </span>
            </button>
          </Link>
          {/* <Link href="/signin">
            <button
              className="sm:mt-16
              px-10 py-4 rounded-full bg-[#41A6EE] hover:bg-[#41A6EE]/80
              text-white font-semibold  text-lg shadow-xl 
              hover:shadow-[#41A6EE]/40 transition-all duration-300 hover:scale-105
            "
            >
              Start My 1-Minute Setup
            </button>
          </Link> */}
        </motion.div>
      </motion.div>
    </section>
  );
}
