"use client";

import { useState } from "react";

export function OurStory() {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <div className="relative z-10 max-w-lg mx-12 bg-white rounded-tl-[28px] rounded-tr-[28px] rounded-br-[28px] p-12 shadow-lg dark:bg-black ">
        <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">
          Our Story
        </h2>
        <div
          className={`overflow-hidden transition-all duration-500 mb-8 ${showMore ? "max-h-[1000px] md:max-h-[600px]" : "max-h-[200px]"}`}
        >
          <p className="text-[#2563EB] font-semibold text-lg mb-2">
            We started Taskoria because trust should never be optional.
          </p>
          <p className="text-slate-600 leading-relaxed mb-2 dark:text-slate-300">
            It started with a simple frustration. Too many Australians —
            ourselves included — had been let down by unreliable tradespeople,
            surprise fees, or the uneasy feeling of welcoming a stranger into
            their home. It wasn't a small problem. It was a broken system. So we
            built Taskoria. A marketplace designed from the ground up around one
            thing: genuine trust. Every provider is thoroughly verified. Every
            payment is protected. Every job comes with the accountability that
            homeowners actually deserve. Today, hundreds of thousands of
            Australians use Taskoria to get things done — with confidence. And
            we're just getting started.
          </p>
          <p className="text-[#2563EB] font-semibold text-lg ">
            Taskoria. Home sorted.
          </p>
        </div>
        <button
          className="px-8 py-3 bg-[#2563EB] text-white text-sm font-semibold tracking-widest rounded-full hover:opacity-90 transition"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "LEARN LESS" : "LEARN MORE"}
        </button>
      </div>
    </>
  );
}
