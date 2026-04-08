"use client";
import { cn } from "@/lib/utils";
import { Quote, QuoteIcon } from "lucide-react";
import { Star } from "lucide-react";
import Marquee from "./ui/marquee";
import Image from "next/image";

const reviews = [
  {
    id: "1",
    name: "Chong",
    username: "Brisbane, QLD",
    service: "Home Cleaning",
    rating: 4,
    body: "My first time using Taskoria and it was smooth from start to finish. The provider was professional and communication was easy. A great overall experience.",
    img: "/chongmin.png",
  },
  {
    id: "2",
    name: "Aayuskha",
    username: "Gold Coast, QLD",
    service: "Electrical Services",
    rating: 5,
    body: "I needed an electrician urgently and found great options quickly. Comparing quotes was simple and the job was completed on time.",
    img: "/aayushka.png",
  },
  {
    id: "3",
    name: "Zaya",
    username: "Sydney, NSW",
    service: "Graphic Design",
    rating: 5,
    body: "I hired a graphic designer and received highly relevant matches. The work matched my brief perfectly and the process was seamless.",
    img: "/zaya.png",
  },
  {
    id: "4",
    name: "Arjun",
    username: "Melbourne, VIC",
    service: "Web Development",
    rating: 5,
    body: "I posted a project for a website redesign and got quality responses within minutes. The developer I chose delivered exactly what I needed on time. Super smooth experience!",
    img: "/nimesh.png",
  }
];
const firstRow = reviews.slice(0, reviews.length);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
  rating,
  service,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  rating: number;
  service: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-77 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/10 bg-gray-950/1 hover:bg-gray-950/5",
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
      )}
    >
      <div className="flex items-center gap-2">
        <Image
          className="rounded-lg"
          width={52}
          height={32}
          alt="Taskoria customer review"
          src={img}
        />

        <div className="flex flex-col flex-1">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>

          <p className="text-[11px] text-gray-500 dark:text-gray-300">
            - {username}
            <span className="text-[11px] mx-1   py-0.5   text-blue-600  dark:text-blue-300">
              .{""} {service}
            </span>
          </p>

          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
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
      className="bg-card dark:bg-[radial-gradient(circle_at_center,rgba(19,50,102,1)_0%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_90%)] py-10 px-4"
      id="customer-reviews"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-3 border border-blue-100 dark:border-blue-800">
          {/* <QuoteIcon className="w-3.5 h-3.5" /> */}
          Customer stories{" "}
        </div>
        <h2 className="text-3xl font-semibold text-center text-foreground">
          What customers say about Taskoria{" "}
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
          Real hiring experiences from local customers.
        </p>
      </div>
      <div className="mt-8  max-w-7xl mx-auto">
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:35s]">
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
            name: "Taskoria",
            url: "https://www.taskoria.com",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5",
              reviewCount: reviews.length.toString(),
              bestRating: "5",
              worstRating: "1",
            },
            review: reviews.map((r) => ({
              "@type": "Review",
              author: {
                "@type": "Person",
                name: r.name,
              },
              reviewBody: r.body,
              reviewRating: {
                "@type": "Rating",
                ratingValue: "5",
                bestRating: "5",
                worstRating: "1",
              },
            })),
          }),
        }}
      />
    </section>
  );
}
