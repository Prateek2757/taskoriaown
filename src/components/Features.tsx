"use client";

import { useTransform, motion, useScroll, MotionValue } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

const projects = [
  {
    title: "AI-Powered Matching",
    description:
      "Experience the future of service discovery with our intelligent matching algorithm. Our AI analyzes thousands of data points to connect you with providers who perfectly match your specific requirements, budget, and timeline.",
    link: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
    color: "#5196fd",
    icon: "🤖",
  },
  {
    title: "Professional Verification",
    description:
      "Trust verified. Every provider undergoes rigorous background checks, credential verification, and quality assessments. Our blockchain-based verification system ensures complete transparency and authenticity.",
    link: "https://plus.unsplash.com/premium_photo-1674669009418-2643aa58b11b?auto=format&fit=crop&q=80",
    color: "#8f89ff",
    icon: "✓",
  },
  {
    title: "Smart Quoting System",
    description:
      "Get instant, accurate quotes powered by machine learning. Our system analyzes your project requirements and provides detailed cost breakdowns, helping you make informed decisions with confidence.",
    link: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    color: "#13006c",
    icon: "💰",
  },
  {
    title: "Community Hub",
    description:
      "Join thousands of satisfied customers and expert providers in our thriving community. Share experiences, get advice, and discover insights that help you make the best choices for your projects.",
    link: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    color: "#ed649e",
    icon: "👥",
  },
];

export default function FeaturesStacking() {
  return (
    <main className="bg-white dark:bg-black transition-colors duration-300 mt-30">
      <div className="pt-14 pb-5 md:pt-3 px-4">
        <div className="text-center mx-auto">
          <h1
            className="text-5xl md:text-xl lg:text-6xl font-extrabold tracking-tight mb-6
                bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500
                dark:from-white dark:via-gray-200 dark:to-gray-500
                bg-clip-text text-transparent "
          >
            Discover Amazing
            <br />
            <span className="bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE]  bg-clip-text text-transparent">
              Features Below
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Explore the powerful tools and intelligent systems that make
            Taskoria the ultimate platform for modern hiring.
          </p>
        </div>
      </div>

      <section
        className="relative 
          bg-gradient-to-b from-transparent via-gray-50/50 to-white
          dark:via-neutral-950/50 dark:to-black"
      >
        {projects.map((project, i) => {
          return (
            <Card
              key={i}
              i={i}
              title={project.title}
              description={project.description}
              url={project.link}
              color={project.color}
              icon={project.icon}
            />
          );
        })}
      </section>
    </main>
  );
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  icon: string;
  progress?: MotionValue<number>;
  range?: [number, number];
  targetScale?: number;
}

export const Card = ({ i, title, description, url }: CardProps) => {
  return (
    <>
      <div className="flex items-center justify-center px-4 mb-30 mt-20">
        <div
          className="
        w-full max-w-7xl  rounded-2xl
        
        bg-white backdrop-blur-xl
        shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        border border-gray-200/50
        
        dark:bg-neutral-900/95 dark:backdrop-blur-xl
        dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
        dark:border-white/10
        
        transition-shadow duration-300
        hover:shadow-[0_20px_60px_rgb(0,0,0,0.15)]
        dark:hover:shadow-[0_20px_60px_rgb(0,0,0,0.6)]
        "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 items-center h-full p-6 md:p-8">
            <div className="flex flex-col text-end space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>

              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {description}
              </p>

              <div className="pt-2 pb-3">
                <Button>Learn More</Button>
              </div>
            </div>
            <div className="absolute right-0 to-0  h-85 w-[620px]">
              <Image
                fill
                src={url}
                alt={title}
                className="object-cover shadow-2xl border-2 border-white/20 dark:border-white/10 rounded-xl"
                loading={i === 0 ? "eager" : "lazy"}
                priority={i === 0}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 mb-30 mt-20">
        <div
          className="
          w-full max-w-7xl  rounded-2xl
          
          bg-white backdrop-blur-xl
          shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          border border-gray-200/50
          
          dark:bg-neutral-900/95 dark:backdrop-blur-xl
          dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
          dark:border-white/10
          
          transition-shadow duration-300
          hover:shadow-[0_20px_60px_rgb(0,0,0,0.15)]
          dark:hover:shadow-[0_20px_60px_rgb(0,0,0,0.6)]
        "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 items-center h-full p-6 md:p-8">
            <div></div>
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>

              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {description}
              </p>

              <div className="pt-2 pb-3">
                <Button>Learn More</Button>
              </div>
            </div>
            <div className="absolute left-0 to-0  h-85 w-[620px]">
              <Image
                fill
                src={url}
                alt={title}
                className="object-cover shadow-2xl border-2 border-white/20 dark:border-white/10 rounded-xl"
                loading={i === 0 ? "eager" : "lazy"}
                priority={i === 0}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
