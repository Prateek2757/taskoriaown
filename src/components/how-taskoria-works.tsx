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
        className="max-w-8xl mx-auto relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            How it works?
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            "I dream of one URL that sums it all up to share with Business"
          </p>
        </motion.div>

        {/* Desktop Circular Flow - Hidden on Mobile */}
        <div className="hidden md:flex justify-center mx-auto">
          <div className="relative h-72 w-72 border-b-6 border-blue-400 rounded-full flex justify-center items-center p-7">
            <div className="absolute right-1/2 -bottom-3 h-72 w-72 bg-white dark:bg-transparent"></div>
          </div>
          <div className="relative h-72 w-72 border-t-6 border-blue-400 rounded-full flex justify-center items-center p-7">
            <span className="absolute z-10 -left-4 border-2 border-gray-400 rounded-full h-8 w-8 flex justify-center items-center bg-white">
              <ChevronUp className="text-gray-400" />
            </span>
            <div className="flex flex-col gap-0 justify-center items-center bg-blue-200 w-full h-full rounded-full shadow-[9px_20px_20px_-15px_rgba(0,0,0,.5)]">
              <span
                className="text-white text-[100px] font-bold"
                style={{
                  textShadow: "2px 2px 3px rgba(255,255,255,0.5)",
                  backgroundColor: "#b9b9b9",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: "1",
                }}
              >
                1
              </span>
              <span className="text-blue-500 font-bold text-sm">
                Post Your Job
              </span>
            </div>
          </div>
        <div className="relative h-72 w-72 border-b-6 border-red-400 rounded-full flex justify-center items-center p-7">
  <span className="absolute z-10 -left-4 border-2 border-gray-400 rounded-full h-8 w-8 flex justify-center items-center bg-white">
    <ChevronDown className="text-gray-400" />
  </span>

  <div className="flex flex-col  justify-center items-center bg-red-200 w-full h-full rounded-full shadow-[9px_20px_20px_-15px_rgba(0,0,0,.5)]">
    
    <span
      className="text-white text-[100px] font-bold leading-none flex justify-center items-center"
      style={{
        textShadow: "2px 2px 3px rgba(255,255,255,0.5)",
        backgroundColor: "#b9b9b9",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      2
    </span>

    <span className="text-red-400 font-bold text-sm">
      Get Matched Instantly
    </span>

  </div>
</div>
          <div className="relative h-72 w-72 border-t-6 border-green-400 rounded-full flex justify-center items-center p-7">
            <span className="absolute z-10 -left-4 border-2 border-gray-400 rounded-full h-8 w-8 flex justify-center items-center bg-white">
              <ChevronUp className="text-gray-400" />
            </span>
            <div className="flex flex-col gap-3 justify-center items-center bg-green-200 w-full h-full rounded-full shadow-[9px_20px_20px_-15px_rgba(0,0,0,.5)]">
              <span
                className="text-white text-[100px] font-bold"
                style={{
                  textShadow: "2px 2px 3px rgba(255,255,255,0.5)",
                  backgroundColor: "#b9b9b9",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: "1",
                }}
              >
                3
              </span>
              <span className="text-green-500 font-bold text-sm">
                Start Collaborating
              </span>
            </div>
            <span className="absolute z-10 -right-4 border-2 border-gray-400 rounded-full h-8 w-8 flex justify-center items-center bg-white">
              <ChevronDown className="text-gray-400" />
            </span>
          </div>
          <div className="relative h-72 w-72 border-b-6 border-green-400 rounded-full flex justify-center items-center p-7">
            <div className="absolute left-1/2 -bottom-3 h-72 w-72 bg-white dark:bg-transparent"></div>
          </div>
        </div>

        <div className="flex md:hidden flex-col items-center gap-6 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={cardVariant}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative flex flex-col items-center"
            >
              <div
                className={`
                  relative h-36 w-36 rounded-full flex flex-col justify-center items-center
                  ${step.color === 'blue' ? 'bg-blue-200 border-t-4 border-blue-400' : ''}
                  ${step.color === 'red' ? 'bg-red-200 border-b-4 border-red-400' : ''}
                  ${step.color === 'green' ? 'bg-green-200 border-t-4 border-green-400' : ''}
                  shadow-[5px_10px_15px_-8px_rgba(0,0,0,.3)]
                `}
              >
                <span
                  className="text-white text-5xl font-bold"
                  style={{
                    textShadow: "2px 2px 3px rgba(255,255,255,0.5)",
                    backgroundColor: "#b9b9b9",
                    backgroundClip: "text",
                    color: "transparent",
                    lineHeight: "1",
                  }}
                >
                  {step.id}
                </span>
                <span
                  className={`
                    font-bold text-xs mt-2
                    ${step.color === 'blue' ? 'text-blue-500' : ''}
                    ${step.color === 'red' ? 'text-red-400 pl-8 ' : ''}
                    ${step.color === 'green' ? 'text-green-500' : ''}
                  `}
                >
                  {step.title}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <motion.div
                  variants={arrowMobileVariant}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className="my-2"
                >
                  <ChevronDown className="text-gray-400 h-8 w-8" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 lg:gap-4 max-w-6xl mx-auto mt-8 md:mt-10">
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
          className="text-center mt-10 md:mt-17"
        >
          <Button className="px-8 md:px-10 py-3 md:py-4 text-base md:text-lg">
            Start my 1-minute setup
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}