"use client";

import { useTransform, motion, useScroll, MotionValue } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { AnimatedBeam, Circle, Icons } from "./ui/animated-beam";
import { BrainCircuit, ShieldCheck, Star, Users } from "lucide-react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  return (
    <main className="bg-white dark:bg-black transition-colors duration-300 sm:mt-30">
      <style>{`
        @keyframes borderRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .animated-border {
          position: relative;
          overflow: hidden;
        }
        
        .animated-border::before {
          content: '';
          position: absolute;
          inset: -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 260deg,
            #1e40af 270deg,
            #3b82f6 290deg,
            #60a5fa 310deg,
            #93c5fd 330deg,
            #dbeafe 345deg,
            transparent 350deg
          );
          animation: borderRotate 6s linear infinite;
        }
        
        .animated-border::after {
          content: '';
          position: absolute;
          inset: 2px;
          background: #ffffff;
          border-radius: calc(1rem - 2px);
          z-index: 1;
        }
        
        .dark .animated-border::after {
          background: #171717;
        }
        
        .animated-border > * {
          position: relative;
          z-index: 2;
        }
      `}</style>

      <div className="pt-4 pb-5 md:pt-3 px-4">
        <div className="sm:text-center mx-auto">
          <h1
            className="text-4xl md:text-xl lg:text-5xl font-extrabold tracking-tight mb-6
                bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500
                dark:from-white dark:via-gray-200 dark:to-gray-500
                bg-clip-text text-transparent "
          >
            Discover Amazing
            <br />
            <span className="bg-[#3C7DED]  bg-clip-text text-transparent">
              Features Below
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Explore the powerful tools and intelligent systems that make
            Taskoria the ultimate platform for modern hiring.
          </p>
        </div>
      </div>

      <section className="max-w-7xl m-auto relative bg-linear-to-b from-transparent via-gray-50/50 to-white dark:via-neutral-950/50 dark:to-black flex flex-col md:flex-row gap-0 py-20 px-4 md:px-0 items-center">
        <div className="order-2 md:order-1 flex flex-col gap-8 mb-8 md:mb-0 md:gap-40 flex-1">
          {projects.map((project, i) => {
            const isEven = i % 2 === 0;
            if (!isEven) return;
            return (
              <Card
                key={i}
                i={i}
                title={project.title}
                description={project.description}
                url={project.link}
                color={project.color}
                icon={project.icon}
                isEven={isEven}
              />
            );
          })}
        </div>
        <div className="order-1 mb-8 md:mb-0 md:order-2 -ml-10 -mr-10">
          <div
            className="relative flex w-[320px] items-center justify-center"
            ref={containerRef}
          >
            <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
              <div className="flex flex-row items-center justify-between">
                <Circle ref={div1Ref}>
                  <BrainCircuit className="text-blue-600" />
                </Circle>
                <Circle ref={div5Ref} className="p-2">
                  <ShieldCheck className="text-blue-600" />
                </Circle>
              </div>
              <div className="flex flex-row items-center justify-center">
                <Circle ref={div4Ref} className="h-16 w-16 p-3">
                  <Image
                    src="/taskoria-logo.png"
                    alt="logo taskoria"
                    height={0}
                    width={28}
                  />
                </Circle>
              </div>
              <div className="flex flex-row items-center justify-between">
                <Circle ref={div3Ref} className="p-2">
                  <Star className="text-blue-600" />
                </Circle>
                <Circle ref={div7Ref} className="p-2">
                  <Users className="text-blue-600" />
                </Circle>
              </div>
            </div>

            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div1Ref}
              toRef={div4Ref}
              curvature={-75}
              endYOffset={-10}
              dotted
              gradientStartColor="#00ac47"
              gradientStopColor="#ffba00"
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div3Ref}
              toRef={div4Ref}
              curvature={75}
              endYOffset={10}
              dotted
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div5Ref}
              toRef={div4Ref}
              curvature={-75}
              endYOffset={-10}
              reverse
              gradientStartColor="#48b0d9"
              gradientStopColor="#67aeff"
              dotted
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div7Ref}
              toRef={div4Ref}
              curvature={75}
              endYOffset={10}
              reverse
              dotted
              gradientStartColor="#48b0d9"
              gradientStopColor="#67aeff"
            />
          </div>
        </div>
        <div className="order-3 md:order-3 flex flex-col gap-8 md:gap-40 flex-1">
          {projects.map((project, i) => {
            const isEven = i % 2 === 0;
            if (isEven) return;
            return (
              <Card
                key={i}
                i={i}
                title={project.title}
                description={project.description}
                url={project.link}
                color={project.color}
                icon={project.icon}
                isEven={isEven}
              />
            );
          })}
        </div>
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
  isEven: boolean;
}

export const Card = ({ i, title, description, url, isEven }: CardProps) => {
  return (
    <>
      <div className="flex items-center justify-center">
        <div
          className="
        w-full rounded-2xl
        animated-border
        bg-white backdrop-blur-xl
        shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        
        dark:bg-neutral-900/95 dark:backdrop-blur-xl
        dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
        
        transition-shadow duration-300
        hover:shadow-[0_20px_60px_rgb(0,0,0,0.15)]
        dark:hover:shadow-[0_20px_60px_rgb(0,0,0,0.6)]
        "
        >
          <div className="flex flex-col gap-0 md:gap-6 h-full p-6 md:p-8">
            <div
              className={`flex flex-col space-y-4 ali ${
                isEven == true ? "md:text-end" : "text-start"
              }`}
            >
              <h2 className="text-2xl md:text-2xl font-extrabold dark:text-blue-400">
                {title}
              </h2>

              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {description}
              </p>

              <div className="pt-2 pb-3">
                <Button>Learn More</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
