"use client";
import { cn } from "@/lib/utils";
import { Quote, QuoteIcon } from "lucide-react";
import { motion } from "motion/react";
import Marquee from "./ui/marquee";
import Image from "next/image";

const reviews = [
  {
    id: "1",
    name: "Chong",
    username: "Brisbane, QLD",
    body: "My first time using Taskoria and it was smooth from start to finish. The provider was professional and communication was easy. A great overall experience.",
    img: "/chongmin.png",
  },
  {
    id: "2",
    name: "Aayuskha",
    username: "Gold Coast, QLD",
    body: "I needed an electrician urgently and found great options quickly. Comparing quotes was simple and the job was completed on time.",
    img: "/aayushka.png",
  },
  {
    id: "3",
    name: "Zaya",
    username: "Sydney, NSW",
    body: "I hired a graphic designer and received highly relevant matches. The work matched my brief perfectly and the process was seamless.",
    img: "/zaya.png",
  },
];
const firstRow = reviews.slice(0, reviews.length);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/10 bg-gray-950/1 hover:bg-gray-950/5",
        // dark styles
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
      )}
      
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-lg"
          width={52}
          height={32}
          alt="Taskoria customer review"
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-[11px] text-gray-500 text-justify dark:text-gray-300">
            - {username}
          </p>
        </div>
        <Quote className="absolute top-4 right-4 h-4 w-4 text-gray-500 dark:text-gray-300" />
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Testomonail() {
  return (
    <section
      className="bg-card dark:bg-[radial-gradient(circle_at_top,_rgba(76,112,255,0.18)_0%,_rgba(0,0,0,1)_70%)] py-16 px-4"
      id="customer-reviews"
    >
     <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-3 border border-blue-100 dark:border-blue-800">
          {/* <QuoteIcon className="w-3.5 h-3.5" /> */}
          Testimonials
        </div>
        <h2 className="text-3xl font-semibold text-center text-foreground">
          What customers say after hiring on Taskoria
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
          Scannable proof from real locations, so you can evaluate fit quickly.
        </p>
      </div>
      <div className="mt-8  max-w-6xl mx-auto">
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review, i) => (
              <ReviewCard key={review.username + i} {...review} />
            ))}
          </Marquee>
          {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review , i) => (
              <ReviewCard key={review.username + i} {...review} />
            ))}
          </Marquee> */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-white dark:from-background"></div>
        </div>
      </div>
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Taskoria", 
      "url": "https://www.taskoria.com",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": reviews.length.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": reviews.map((r) => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": r.name,
        },
        "reviewBody": r.body,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      })),
    }),
  }}
/>
    </section>
  );
}
