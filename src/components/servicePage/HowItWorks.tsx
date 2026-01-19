"use client";
import {
  CheckCircle,
  Info,
  HelpCircle,
  DollarSign,
  Lightbulb,
  Sparkles,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";

export function ServiceDetailsSection({ serviceDetails }) {
  // Parse HTML content safely
  const parseHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body;
  };

  const extractSections = (htmlString) => {
    const doc = parseHTML(htmlString);
    const sections = {
      title: "",
      subtitle: "",
      howItWorks: [],
      whatsIncluded: [],
      pricing: { description: "", factors: [] },
      tips: [],
      faqs: [],
    };

    // Extract title and subtitle
    const h1 = doc.querySelector("h1");
    const firstP = doc.querySelector("p");
    if (h1) sections.title = h1.textContent;
    if (firstP) sections.subtitle = firstP.textContent;

    // Extract "Get quotes" section (How it works)
    const headers = doc.querySelectorAll("h2");
    headers.forEach((h2) => {
      const text = h2.textContent.toLowerCase();
      const nextElement = h2.nextElementSibling;

      if (text.includes("get quotes") || text.includes("how")) {
        if (nextElement && nextElement.tagName === "OL") {
          const items = nextElement.querySelectorAll("li");
          sections.howItWorks = Array.from(items).map((li) => li.textContent);
        }
      } else if (text.includes("included")) {
        if (nextElement && nextElement.tagName === "UL") {
          const items = nextElement.querySelectorAll("li");
          sections.whatsIncluded = Array.from(items).map(
            (li) => li.textContent
          );
        }
      } else if (text.includes("pricing")) {
        let current = nextElement;
        while (current && current.tagName !== "h2") {
          if (current.tagName === "p") {
            sections.pricing.description = current.textContent;
          } else if (current.tagName === "UL") {
            const items = current.querySelectorAll("li");
            sections.pricing.factors = Array.from(items).map(
              (li) => li.textContent
            );
          }
          current = current.nextElementSibling;
        }
      } else if (text.includes("tips")) {
        if (nextElement && nextElement.tagName === "UL") {
          const items = nextElement.querySelectorAll("li");
          sections.tips = Array.from(items).map((li) => li.textContent);
        }
      }
    });
    // console.log(sections.pricing.factors);

    // Extract FAQs
    const details = doc.querySelectorAll("details");
    sections.faqs = Array.from(details).map((detail) => ({
      question: detail.querySelector("summary")?.textContent || "",
      answer: detail.querySelector("p")?.textContent || "",
    }));

    return sections;
  };

  const sections = extractSections(serviceDetails);

  const gradients = [
    {
      num: "from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-500 dark:via-purple-500 dark:to-fuchsia-500",
      bg: "from-violet-50/80 via-purple-50/60 to-fuchsia-50/80 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-fuchsia-950/40",
      border: "border-violet-300/50 dark:border-violet-700/50",
      shadow: "shadow-violet-200/50 dark:shadow-violet-900/30",
    },
    {
      num: "from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500",
      bg: "from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40",
      border: "border-blue-300/50 dark:border-blue-700/50",
      shadow: "shadow-blue-200/50 dark:shadow-blue-900/30",
    },
    {
      num: "from-cyan-600 via-teal-600 to-emerald-600 dark:from-cyan-500 dark:via-teal-500 dark:to-emerald-500",
      bg: "from-cyan-50/80 via-teal-50/60 to-emerald-50/80 dark:from-cyan-950/40 dark:via-teal-950/30 dark:to-emerald-950/40",
      border: "border-cyan-300/50 dark:border-cyan-700/50",
      shadow: "shadow-cyan-200/50 dark:shadow-cyan-900/30",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* How It Works Section */}
      {sections.howItWorks.length > 0 && (
        <div className="mb-14">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-full text-sm mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white mb-6">
              Three Simple Steps
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
              Getting the help you need has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent dark:via-indigo-800 z-0" />

            {sections.howItWorks.map((step, i) => (
              <div
                key={i}
                className={`relative bg-gradient-to-br ${gradients[i]?.bg} rounded-3xl p-8 border-2 ${gradients[i]?.border} hover:shadow-2xl ${gradients[i]?.shadow} transition-all hover:-translate-y-2 duration-500 backdrop-blur-sm group z-10`}
              >
                <div
                  className={`absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br ${gradients[i]?.num} rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  {i + 1}
                </div>
                <div className="pt-10">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-medium">
                    {step}
                  </p>
                </div>
                {/* Decorative element */}
                <div
                  className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${gradients[i]?.num} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What's Included Section - Premium Card Design */}
      {sections.whatsIncluded.length > 0 && (
        <div className="mb-14">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3C7DED] border border-emerald-200/50 dark:border-emerald-700/50 text-white font-bold rounded-full text-sm mb-6 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4" />
              WHAT'S INCLUDED
            </div>
            <h2 className="text-5xl md:text-5xl pb-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#070707] via-[#41A6EE] to-[#052e39] mb-6">
              Everything You Need
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
              Comprehensive service features designed for your peace of mind
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sections.whatsIncluded.map((item, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-7 border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 transition-all hover:-translate-y-2 duration-500 overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-emerald-500/5 group-hover:via-teal-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />

                {/* Icon with animated ring */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-[#3C7DED] via-[#41A6EE] to-[#46CBEE] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <CheckCircle
                      className="w-7 h-7 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>

                <p className="relative text-gray-800 dark:text-gray-200 leading-relaxed font-semibold text-base">
                  {item}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3C7DED] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Section - Real-world Scenario Design */}
      {sections.pricing.factors.length >= 0 && (
        <div className="mb-14">
          <div className="text-center ">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3C7DED] [#46CBEE]  to-[#46CBEE]  border border-amber-200/50 dark:border-amber-700/50 text-white dark:tex-white font-bold rounded-full text-sm mb-6 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4" />
              TRANSPARENT PRICING
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold pb-2 text-transparent bg-clip-text bg-[#3C7DED]  mb-6">
              Fair & Clear Pricing
            </h2>
            {sections.pricing.description && (
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium mb-8">
                {sections.pricing.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Star className="w-5 h-5 text-white fill-blue-500" />
              <span className="font-semibold">
                Compare quotes from multiple professionals
              </span>
              <Star className="w-5 h-5 text-white fill-blue-500" />
            </div>
          </div>

          {/* Premium pricing cards with real scenario feel */}
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {sections.pricing.factors.map((factor, i) => (
                <div
                  key={i}
                  className="group relative bg-gradient-to-br from-white via-amber-50/30 to-[#46CBEE]  dark:from-gray-800/80 dark:via-amber-950/20 dark:to-orange-950/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-amber-200/50 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-2xl hover:shadow-amber-500/20 dark:hover:shadow-amber-500/10 transition-all duration-500 overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-[#46CBEE]/0 to-[#46CBEE]  group-hover:from-amber-500/5 group-hover:via-[#46CBEE]/5 group-hover:to-red-500/5 transition-all duration-500" />

                  <div className="relative flex items-start gap-5">
                    {/* Icon with pulse effect */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-[#46CBEE] rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 animate-pulse" />
                      <div className="relative w-14 h-14 bg-gradient-to-br from-amber-500 via-[#46CBEE] to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <DollarSign
                          className="w-7 h-7 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    <div className="flex-1 pt-1">
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-semibold">
                        {factor}
                      </p>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500" />
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="bg-gradient-to-br from-amber-50 via-blue-50/50 to-[#46CBEE]/30 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/30 rounded-3xl p-8 border-2 border-amber-200/50 dark:border-amber-800/50 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-around gap-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#256779] to-[#46CBEE] rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle
                      className="w-7 h-7 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    No Hidden Fees
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    What you see is what you pay
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#46CBEE] to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Star
                      className="w-7 h-7 text-white fill-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    Vetted Professionals
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All providers are verified
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#46CB] to-[#46CBEE] rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles
                      className="w-7 h-7 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    Best Value
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Competitive market rates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {sections.tips.length > 0 && (
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-teal-500/20 border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 font-bold rounded-full text-sm mb-6 backdrop-blur-sm">
              <Lightbulb className="w-4 h-4" />
              PRO TIPS
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 mb-6">
              Get Better Results
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
              Expert advice to maximize value and get accurate quotes faster
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-5">
            {sections.tips.map((tip, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-r from-blue-50/80 via-cyan-50/60 to-teal-50/80 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-teal-950/40 backdrop-blur-sm rounded-3xl p-8 border-l-4 border-blue-500 dark:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-x-2 overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-teal-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-teal-500/5 transition-all duration-500" />

                <div className="relative flex items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500">
                      <span className="text-white font-black text-lg">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-medium pt-2">
                    {tip}
                  </p>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Example usage with your HTML data
const exampleHTML = `<h1>House Cleaning in Australia</h1> <p>Professional domestic cleaning services across Australia</p> <h2>Get quotes on Taskoria</h2> <ol><li>Post your job in minutes with photos and a clear description.</li><li>Receive quotes from local, reviewed professionals.</li><li>Compare price, availability and experience, then hire with confidence.</li></ol> <h2>What's typically included</h2> <ul><li>Surface wiping and sanitising</li><li>Kitchen and bathroom cleaning</li><li>Vacuuming and mopping</li><li>Optional add-ons (oven, windows, inside cabinets)</li></ul> <h2>How pricing usually works</h2> <p>Costs vary by job and location. Quotes are usually influenced by:</p> <ul><li>Property size (rooms / m²)</li><li>Condition (standard vs deep clean)</li><li>Add-ons (oven, windows, carpets)</li><li>Preferred date/time (weekend or short notice)</li></ul> <h2>Tips for a faster, accurate quote</h2> <ul><li>Share measurements, photos, and any brand/model details.</li><li>Tell providers about access (parking, stairs, strata rules).</li><li>Be clear on timelines and whether you need disposal/removal.</li></ul>`;

// Demo component
function Howitwork({ servicedetails }: any) {
  return (
    <div className="min-h-screen ">
      <ServiceDetailsSection serviceDetails={servicedetails} />
    </div>
  );
}

export default Howitwork;
