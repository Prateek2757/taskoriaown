"use client";

import { ArrowRight, CheckCircle } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI-Powered Matching",
      description:
        "Our advanced AI connects you with the perfect service providers based on your specific needs and preferences.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Professional Verification",
      description:
        "Every provider is verified through our tamper-proof system, ensuring trust and transparency.",
      image:
        "https://plus.unsplash.com/premium_photo-1674669009418-2643aa58b11b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Smart Quoting",
      description:
        "Get instant, accurate quotes powered by AI analysis of your project requirements.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Community Driven",
      description:
        "Join our vibrant community forums where providers share knowledge and customers find insights.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      color: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600">
      {/* ======================= HERO SECTION ======================= */}
      {/* <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>

        <div className="relative container max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-500/20">
              <CheckCircle className="w-4 h-4" />
              Trusted by thousands of professionals
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Taskoria
              </span>
              ?
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Experience the next generation of service marketplaces with
              cutting-edge technology, verified professionals, and a thriving
              community.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold backdrop-blur-sm border border-white/20 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* ======================= FEATURES SECTION ======================= */}
      <section className="py-12 bg-gradient-to-r from-slate-50 to-gray-100">
        <div className="container max-w-7xl mx-auto px-4">
        <h1 className="text-5xl text-center md:text-5xl font-bold text-black mb-6 leading-tight">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3C7DED] to-[#41A6EE]">
                Taskoria
              </span>
              ?
            </h1>
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Powerful Features That Make Taskoria Stand Out
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mt-2">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}