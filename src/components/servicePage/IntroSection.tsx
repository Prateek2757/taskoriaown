"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  serviceName: string;
  cityName: string;

};

export default function ServiceIntro({ serviceName , cityName }: Props) {
  return (
    <section className="relative dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800    py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
            Find trusted{" "}
            <span className="text-blue-500">{serviceName}</span>{" "}
            professionals in {cityName}
          </h1>
          {/* <Image
                src="/taskoria-logo.png"
                width="80"
                height="80"
                alt={` Logo`}
                className="mx-auto"
              /> */}
          <p className="dark:text-slate-300 text-gray-600 mb-6">
            Searching for reliable {serviceName}s doesn’t have to be difficult.
            We help you connect with experienced local professionals who match
            your needs — quickly and at no cost.
          </p>

          <ul className="space-y-3 mb-8 ">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-primary w-5 h-5 mt-1" />
              Receive multiple quotes from vetted providers
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-primary w-5 h-5 mt-1" />
              View ratings, past work, and customer feedback
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-primary w-5 h-5 mt-1" />
              Choose only when you’re confident — no commitment
            </li>
          </ul>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-xl">
              Start Your Free Search
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl dark:text-white border-white text-gray-950 hover:bg-white hover:text-slate-900"
            >
              Browse {serviceName}s
            </Button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            How it works
          </h3>

          <ol className="space-y-4 ">
            <li>
              <span className="font-semibold ">1.</span> Tell us what
              you’re looking for and your requirements.
            </li>
            <li>
              <span className="font-semibold ">2.</span> We match you
              with suitable {serviceName}s in West Yorkshire.
            </li>
            <li>
              <span className="font-semibold ">3.</span> Compare
              responses, ask questions, and decide in your own time.
            </li>
          </ol>

          <p className=" mt-6">
            It’s fast, transparent, and completely free to use.
          </p>
        </div>

      </div>
    </section>
  );
}