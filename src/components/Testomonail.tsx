"use client";
import { cn } from "@/lib/utils";
import { Quote, QuoteIcon } from "lucide-react";
import { motion } from "motion/react";
import Marquee from "./ui/marquee";
import Image from "next/image";

const reviews = [
  {
    name: "Pranika",
    username: "Brisbane, QLD",
    body: "This was my first time using Taskoria and I was a bit unsure at first, but it turned out great. The process was straightforward, and I liked that everything was handled in one place. The service provider was professional and responsive. Overall, a very positive experience.",
    img: "/pranika.png",
  },
  {
    name: "Aayuskha",
    username: "Gold Coast, QLD",
    body: "Taskoria saved me a lot of time. I needed an electrician urgently and didn’t want to call around. Within a short time, I had a couple of good options and could compare them easily. The job was completed on time and communication was solid throughout. Very convenient platform.",
    img: "/aayushka.png",
  },
  {
    name: "Zaya",
    username: "Sydney, NSW",
    body: "I hired a graphic designer through Taskoria for a small business project. What stood out was how relevant the matches were — I didn’t get random quotes. The designer understood the brief well and delivered exactly what I needed. The platform feels well thought out and easy to use.",
    img: "/zaya.png",
  },

];

const firstRow = reviews.slice(0, reviews.length );
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
        <Image  className="rounded-lg" width={42} height={42} alt="mianc" src={img} />
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
      id="community"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-3 border border-blue-100 dark:border-blue-800"
        >
          <QuoteIcon className="w-3.5 h-3.5" />
          Testimonials
        </motion.div>
        <h2 className="text-3xl font-semibold text-center text-foreground">
          What Our Users Say
        </h2>
      </div>
      <div className="mt-8  max-w-6xl mx-auto">
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review , i) => (
              <ReviewCard key={review.username + i } {...review} />
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
    </section>
  );
}
