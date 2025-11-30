'use client';

import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef } from 'react';
import Image from 'next/image';

const projects = [
  {
    title: 'AI-Powered Matching',
    description:
      'Experience the future of service discovery with our intelligent matching algorithm. Our AI analyzes thousands of data points to connect you with providers who perfectly match your specific requirements, budget, and timeline.',
    link: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    color: '#5196fd',
    icon: '🤖',
  },
  {
    title: 'Professional Verification',
    description:
      'Trust verified. Every provider undergoes rigorous background checks, credential verification, and quality assessments. Our blockchain-based verification system ensures complete transparency and authenticity.',
    link: 'https://plus.unsplash.com/premium_photo-1674669009418-2643aa58b11b?auto=format&fit=crop&q=80',
    color: '#8f89ff',
    icon: '✓',
  },
  {
    title: 'Smart Quoting System',
    description:
      'Get instant, accurate quotes powered by machine learning. Our system analyzes your project requirements and provides detailed cost breakdowns, helping you make informed decisions with confidence.',
    link: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    color: '#13006c',
    icon: '💰',
  },
  {
    title: 'Community Hub',
    description:
      'Join thousands of satisfied customers and expert providers in our thriving community. Share experiences, get advice, and discover insights that help you make the best choices for your projects.',
    link: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    color: '#ed649e',
    icon: '👥',
  }
];

export default function FeaturesStacking() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, duration: 1.2 }}>
      <main
        ref={container}
        className="bg-white dark:bg-black transition-colors duration-300"
      >
        <div className="pt-14 pb-5 md:pt-3 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-xl lg:text-6xl font-extrabold tracking-tight mb-6
                bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500
                dark:from-white dark:via-gray-200 dark:to-gray-500
                bg-clip-text text-transparent drop-shadow-sm">
              Discover Amazing<br />
              <span className="bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE]  bg-clip-text text-transparent">
                Features Below
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Explore the powerful tools and intelligent systems that make Taskoria the ultimate platform for modern hiring.
            </p>
          </motion.div>
        </div>

        <section className="relative 
          bg-gradient-to-b from-transparent via-gray-50/50 to-white
          dark:via-neutral-950/50 dark:to-black">
          {projects.map((project, i) => {
            const targetScale = 1 - i * 0.05;

            return (
              <Card
                key={i}
                i={i}
                title={project.title}
                description={project.description}
                url={project.link}
                color={project.color}
                icon={project.icon}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
      </main>
    </ReactLenis>
  );
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  icon: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

export const Card = ({
  i,
  title,
  description,
  url,
  icon,
  progress,
  range,
  targetScale,
}: CardProps) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  });

  // Keep transforms at top level - Framer Motion optimizes these internally
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={ref}
      className="h-[80vh] flex items-center justify-center sticky top-0 px-4"
    >
      <motion.div
        style={{ 
          scale,
          willChange: 'transform'
        }}
        className="
          w-full max-w-6xl h-auto md:h-[400px] rounded-2xl overflow-hidden
          
          bg-white/95 backdrop-blur-xl
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
          <div className="flex flex-col justify-center space-y-4">
            {/* <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{icon}</span>
            </div> */}

            <h2 className="text-2xl md:text-3xl font-extrabold 
              bg-gradient-to-br from-gray-900 to-gray-700
              dark:from-white dark:to-gray-300
              bg-clip-text text-transparent">
              {title}
            </h2>

            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </p>

            <div className="pt-2 pb-3">
              <a
                href="#"
                className="group inline-flex items-center gap-2 px-5 py-3.5 rounded-full
                  bg-gradient-to-r from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] text-white
                  font-semibold text-sm
                  shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                  transition-all duration-300 transform hover:scale-105
                  active:scale-95"
              >
                Learn More
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          <motion.div
            className="relative h-64 md:h-full rounded-xl overflow-hidden
              shadow-2xl shadow-black/20 dark:shadow-black/40
              border-2 border-white/20 dark:border-white/10
              transform-gpu"
            style={{ 
              scale: imageScale,
              willChange: 'transform'
            }}
          >
            <Image
              src={url}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading={i === 0 ? "eager" : "lazy"}
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};