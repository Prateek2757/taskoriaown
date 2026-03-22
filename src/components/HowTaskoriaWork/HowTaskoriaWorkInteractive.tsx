"use client";


import { useRef } from "react";
import { motion } from "motion/react";
import { Sparkles, Users, Shield, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AnimatedBeam, Circle } from "../ui/animated-beam";
import { Button } from "../ui/button";

const steps = [
  {
    id: 1,
    title: "Post Your Job",
    description:
      "Describe your job, location, and preferred timing in a few simple steps so providers know exactly what you need.",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Receive Provider Responses",
    description:
      "Get quotes from relevant local professionals based on your service type, location, and job details.",
    icon: Users,
  },
  {
    id: 3,
    title: "Compare and Hire",
    description:
      "Review profiles, pricing, and scope, then choose the provider that best fits your timeline and budget.",
    icon: Shield,
  },
];

const cardVariant = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
};

export default function HowTaskoriaWorksInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      className="max-w-7xl mx-auto relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* ── Animated beam connector ── */}
      <div
        className="relative flex max-w-6xl h-16 mx-auto items-center justify-center overflow-hidden"
        ref={containerRef}
        aria-label="Step progression visualization"
      >
        <div className="flex h-full w-full items-stretch justify-between gap-10">
          <div className="flex flex-row justify-between">
            <Circle
              className="p-2 shadow-none border-[#41A6EE]"
              ref={div1Ref}
              aria-label="Step 1"
            >
              <span className="dark:text-gray-900 text-[#41A6EE] font-bold text-lg">1</span>
            </Circle>
          </div>
          <div className="flex flex-row justify-between">
            <Circle
              className="p-2 shadow-none border-purple-700"
              ref={div2Ref}
              aria-label="Step 2"
            >
              <span className="dark:text-gray-900 text-purple-700 font-bold text-lg">2</span>
            </Circle>
          </div>
          <div className="flex flex-row justify-between">
            <Circle
              className="p-2 shadow-none border-green-500"
              ref={div3Ref}
              aria-label="Step 3"
            >
              <span className="dark:text-gray-900 text-green-500 font-bold text-lg">3</span>
            </Circle>
          </div>
        </div>

        <AnimatedBeam
          duration={6}
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={div2Ref}
          gradientStartColor="#41A6EE"
          gradientStopColor="#41A6EE"
        />
        <AnimatedBeam
          duration={6}
          containerRef={containerRef}
          fromRef={div2Ref}
          toRef={div3Ref}
          gradientStartColor="oklch(49.6% 0.265 301.924)"
          gradientStopColor="oklch(49.6% 0.265 301.924)"
        />
      </div>

      {/* ── Animated step cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-10 lg:gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <article
            key={step.id}
            className="flex flex-col items-center relative"
            id={`step-${step.id}`}
          >
            <motion.div
              variants={cardVariant}
              transition={{ duration: 0.6, delay: index * 0.25 }}
              className="group relative w-full rounded-xl p-4
                bg-white/70 dark:bg-white/5
                border border-black/10 dark:border-white/20
                dark:before:from-white/10 dark:before:via-white/5 dark:before:to-transparent"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4" />

                <h2 className="text-xl max-sm:mb-0 text-[#2563EB] sm:text-xl font-semibold mb-3">
                  {step.title}
                </h2>

                <p className="max-sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          </article>
        ))}
      </div>

      {/* ── Animated CTA ── */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center mt-12"
      >
        <Link href="/signin" aria-label="Start setting up your account">
          <Button
            size="lg"
            className="group bg-white dark:bg-transparent border-2 border-blue-500
              text-blue-500 dark:text-blue-300 font-medium
              hover:bg-blue-600 hover:text-white transition-all duration-300
              shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
          >
            <span className="flex items-center gap-2">
              Post a Job Free
              <ArrowUpRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300 group-hover:rotate-45"
                aria-hidden="true"
              />
            </span>
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}