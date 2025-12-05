"use client";

import { motion } from "motion/react";
import {
  Sparkles,
  Users,
  Shield,
  ArrowBigDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const steps = [
  {
    id: 1,
    title: "Post Your Job",
    description:
      "Use our AI assistant to describe your project effortlessly and publish instantly.",
    icon: Sparkles,
    color: "blue",
  },
  {
    id: 2,
    title: "Get Matched Instantly",
    description:
      "Our AI connects you with verified professionals who match your specific needs.",
    icon: Users,
    color: "red",
  },
  {
    id: 3,
    title: "Start Collaborating",
    description:
      "Work seamlessly with real-time chat, milestone tracking, and secure payments.",
    icon: Shield,
    color: "green",
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
        relative py-14 px-4 sm:px-6 lg:px-8 overflow-hidden
        text-black bg-white 
        dark:text-white dark:bg-gray-900
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
        className="max-w-8xl mx-auto relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 relative z-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            How it works?
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            "I dream of one URL that sums it all up to share with Business"
          </p>
        </motion.div>
        <div className="relative z-10 -top-48 md:top-0 -mb-80 md:mb-0 flex flex-col md:flex-row justify-center items-center mx-auto">
          <div className="relative h-72 w-72 border-r-6 md:border-b-6 md:border-r-0 border-blue-400 rounded-full flex justify-center items-center p-7">
            <div className="absolute -right-1/2 bottom-32 md:right-1/2 md:-bottom-3 h-40 md:h-72 w-72 bg-white dark:bg-gray-900"></div>
          </div>
          <div className="relative h-72 w-72 border-l-6 md:border-l-0 md:border-t-6 border-blue-400 rounded-full flex justify-center items-center p-7">
            <span className="absolute z-10 -top-4 md:-left-4 md:top-auto border-2 border-gray-400  rounded-full h-8 w-8 flex justify-center items-center bg-white">
              <ChevronUp className="text-gray-400 hidden md:block" />
              <ChevronDown className="text-gray-400 block md:hidden" />
            </span>
            <div className="flex flex-col gap-3 justify-center items-center bg-blue-400 w-full h-full rounded-full shadow-[9px_20px_20px_-15px_rgba(0,0,0,.5)]">
              <span
                className="text-white text-[100px] font-bold"
                style={{
                  textShadow: "2px 2px 3px rgba(255,255,255,0.8)",
                  backgroundColor: "#444",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: "1",
                }}
              >
                1
              </span>
              <span className="text-white font-bold text-sm">
                Post Your Job
              </span>
            </div>
          </div>
          <div className="relative h-72 w-72 border-r-6 md:border-r-0 md:border-b-6 border-green-400 rounded-full flex justify-center items-center p-7">
            <span className="absolute z-10 -top-4 md:top-auto md:-left-4 border-2 border-gray-400  rounded-full h-8 w-8 flex justify-center items-center bg-white">
              <ChevronDown className="text-gray-400" />
            </span>
            <div className="flex flex-col gap-3 justify-center items-center bg-green-400 w-full h-full rounded-full shadow-[9px_20px_20px_-15px_rgba(0,0,0,.5)]">
              <span
                className=" text-white text-[100px] font-bold"
                style={{
                  textShadow: "2px 2px 3px rgba(255,255,255,0.8)",
                  backgroundColor: "#555",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: "1",
                }}
              >
                2
              </span>
              <span className="text-white font-bold text-sm">
                Get Matched Instantly
              </span>
            </div>
          </div>
          <div className="relative h-72 w-72 border-l-6 md:border-l-0 md:border-t-6 border-cyan-500 rounded-full flex justify-center items-center p-7">
            <span className="absolute z-10 -top-4 md:top-auto md:-left-4 border-2 border-gray-400  rounded-full h-8 w-8 flex justify-center items-center bg-white">
              <ChevronUp className="text-gray-400 hidden md:block" />
              <ChevronDown className="text-gray-400 block md:hidden" />
            </span>
            <div className="flex flex-col gap-3 justify-center items-center bg-cyan-500 w-full h-full rounded-full shadow-[9px_20px_20px_-15px_rgba(0,0,0,.5)]">
              <span
                className="text-white text-[100px] font-bold"
                style={{
                  textShadow: "2px 2px 3px rgba(255,255,255,0.8)",
                  backgroundColor: "#555",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: "1",
                }}
              >
                3
              </span>
              <span className="text-white font-bold text-sm">
                Start Collaborating
              </span>
            </div>
            <span className="absolute z-10 -bottom-4 md:bottom-auto md:-right-4 border-2 border-gray-400  rounded-full h-8 w-8 flex justify-center items-center bg-white">
              <ChevronDown className="text-gray-400" />
            </span>
          </div>
          <div className="relative h-72 w-72 border-r-6 md:border-b-6 border-cyan-500 rounded-full flex justify-center items-center p-7">
            <div className="absolute -right-1/2 bottom-0 md:left-1/2 md:-bottom-3 h-40 md:h-82 w-72 bg-white dark:bg-gray-900"></div>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-4 max-w-6xl mx-auto mt-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative">
              <motion.div
                variants={cardVariant}
                transition={{ duration: 0.6, delay: index * 0.25 }}
                className="
                  group relative w-full rounded-2xl md:rounded-3xl
                  bg-white/70 dark:bg-white/5
                  border border-black/10 dark:border-white/20 
                  backdrop-blur-2xl shadow-2xl
                  
                  transition-all duration-500
                  before:absolute before:inset-0 before:rounded-2xl md:before:rounded-3xl
                  before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-transparent
                  dark:before:from-white/10 dark:before:via-white/5 dark:before:to-transparent
                  before:pointer-events-none before:transition-opacity before:duration-500
                  after:absolute after:inset-0 after:rounded-2xl md:after:rounded-3xl
                  after:bg-gradient-to-br after:from-[#41A6EE]/20 after:via-[#41A6EE]/5 after:to-transparent
                  after:opacity-0 after:transition-all after:duration-500
                  after:pointer-events-none
                  items-center
                "
                style={{
                  boxShadow:
                    "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
                }}
              >
                <div className="p-4 md:p-5">
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 leading-relaxed">
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
          className="text-center mt-17 relative z-20"
        >
          <Button className="px-8 md:px-10 py-6 md:py-4 text-base md:text-lg">
            Start my 1-minute setup
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
