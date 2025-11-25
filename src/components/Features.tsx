"use client";

import { ArrowRight } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI-Powered Matching",
      description:
        "Our advanced AI connects you with the perfect service providers based on your needs and preferences.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
      color: "from-[#3C7DED] to-[#41A6EE]",
    },
    {
      title: "Professional Verification",
      description:
        "Every provider is verified through our tamper-proof system, ensuring trust and transparency.",
      image:
        "https://plus.unsplash.com/premium_photo-1674669009418-2643aa58b11b?auto=format&fit=crop&q=80",
      color: "from-[#3C7DED] to-[#41A6EE]",
    },
    {
      title: "Smart Quoting",
      description:
        "Get instant, highly accurate quotes powered by AI analysis of your project details.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
      color: "from-[#3C7DED] to-[#41A6EE]",
    },
    {
      title: "Community Driven",
      description:
        "Join our vibrant forum where providers share insights and customers ask questions.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      color: "from-[#3C7DED] to-[#41A6EE]",
    },
  ];

  return (
    <div className="bg-white dark:bg-black transition-colors">
      <section
        className="
          py-20
          bg-gradient-to-b 
          from-[#F7F9FC] 
          via-white 
          to-[#EEF2F7]

              dark:bg-[radial-gradient(circle_at_bottom,_rgba(76,112,255,0.18)_0%,_rgba(0,0,0,1)_70%)]
        
        "
      >
        <div className="max-w-7xl mx-auto px-4">
          
          <h1
            className="
              text-center text-5xl md:text-6xl font-extrabold mb-6
              text-transparent bg-clip-text 
              bg-gradient-to-r from-[#2563EB] to-[#3B82F6]
              dark:from-[#3C7DED] dark:to-[#41A6EE]
            "
          >
            Why Choose Taskoria?
          </h1>

          <h2
            className="
              text-center text-2xl md:text-3xl font-semibold 
              text-gray-700 dark:text-gray-200 
              mb-14
            "
          >
           Powerful Features That Make Taskoria Stand Out
          </h2> 

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="
                  group relative rounded-2xl overflow-hidden p-[1px]

                  bg-white/60 backdrop-blur-xl
                  shadow-[0_4px_20px_rgba(0,0,0,0.08)]

                  dark:bg-white/10 dark:backdrop-blur-xl
                  dark:shadow-[0_0_25px_rgba(0,0,0,0.4)]
                  dark:hover:shadow-[0_0_40px_rgba(60,125,237,0.4)]

                  transition-all duration-500
                "
              >
                <div className="relative h-56 overflow-hidden rounded-xl">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="
                      w-full h-full object-cover 
                      transform group-hover:scale-110 
                      transition-transform duration-700
                    "
                  />

                  <div
                    className="
                      absolute inset-0 
                      bg-gradient-to-t from-black/60 to-transparent
                      dark:from-black/80
                    "
                  ></div>
                </div>

                <div className="p-5 flex flex-col justify-between h-[220px]">

                  <div>
                    <h3
                      className="
                        text-xl font-bold

                        /* LIGHT MODE TEXT */
                        text-gray-900 
                        bg-clip-text

                        /* DARK MODE TEXT - NEON GRADIENT */
                        dark:text-transparent 
                        dark:bg-gradient-to-r dark:from-[#6CA8FF] dark:to-[#8BC3FF] 
                        dark:bg-clip-text
                      "
                    >
                      {feature.title}
                    </h3>

                    <p
                      className="
                        mt-2 leading-relaxed 

                        /* Light mode text */
                        text-gray-600

                        /* Dark mode text */
                        dark:text-gray-300
                      "
                    >
                      {feature.description}
                    </p>
                  </div>

                  <button
                    className="
                      mt-5 flex items-center gap-2 font-semibold

                      /* Light mode text gradient */
                      bg-gradient-to-r from-[#2563EB] to-[#3B82F6]
                      text-transparent bg-clip-text

                      /* Dark mode glow text */
                      dark:from-[#3C7DED] dark:to-[#41A6EE]
                    "
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </button>

                     <div
                     className={`
                      absolute bottom-0 left-0 right-0 h-1
                      bg-gradient-to-r ${feature.color}
                      transform scale-x-0 group-hover:scale-x-100
                      transition-transform duration-500
                    `}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}