"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const reviews = [
  {
    id: "olivia-thompson",
    name: "Olivia Thompson",
    time: "2 weeks ago",
    rating: "5",
    bookedService: "Verified House Cleaning",
    reviewDetail:
      "Taskoria made it incredibly easy to find a reliable cleaner in Melbourne. The booking process was simple, transparent, and only took a few minutes from start to finish. I appreciated how easy it was to compare options and choose a professional that matched my needs.I'll definitely be using Taskoria again for future home services and wouldn't hesitate to recommend it to friends and family looking for dependable, high-quality service.",
    photo: "/images/reviewimage1.avif",
  },
  {
    id: "liam-anderson",
    name: "Liam Anderson",
    time: "2 weeks ago ",
    rating: "4",
    bookedService: "Emergency Electrical Repair",
    reviewDetail:
      "I needed an electrician urgently, and Taskoria connected me with a verified professional within minutes. Great experience from start to finish.",
    photo: "/images/reviewimage2.avif",
  },
  {
    id: "charlotte-wilson",
    name: "Charlotte Wilson",
    time: "1 month ago",
    rating: "5",
    bookedService: "Garden Maintenance",
    reviewDetail:
      "Fantastic platform! I hired a gardener through Taskoria, and the quality of work was excellent. The reviews helped me choose the right person.",
    photo: "/images/reviewimage3.avif",
  },
  {
    id: "noah-mitchell",
    name: "Noah Mitchell",
    time: "2 months ago",
    rating: "5",
    bookedService: "Home Maintenance",
    reviewDetail:
      "I've used Taskoria multiple times for home maintenance services, and every experience has been smooth and professional. It's now my go-to platform.",
    photo: "/images/olivreviewimage(1).png",
  },
  {
    name: "Ethana",
    time: "3 months ago",
    rating: "4",
    bookedService: "Handyman Service",
    reviewDetail:
      "Taskoria made finding a skilled handyman quick and stress-free. The professional arrived on time, completed the job perfectly, and the whole experience was seamless.",
    photo: "/images/user4.png",
  },
  {
    name: "James Bennett",
    time: "4 months ago",
    rating: "5",
    bookedService: "Plumbing Repair",
    reviewDetail:
      "I had a leaking kitchen pipe that needed immediate attention, and Taskoria made the entire process incredibly simple. Within a short time, I found a verified plumber with excellent reviews and transparent pricing.The quality of service and the smooth booking experience gave me complete confidence in using Taskoria again for future home service needs.",
    photo: "/images/user6.png",
  },
];

type Review = (typeof reviews)[number];

export default function CustomersReview() {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const visibleValues = showAll ? reviews : reviews.slice(0, 5);
  const moreContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showAll) {
      moreContentRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
  function ReviewCard({
    bookedService,
    photo,
    name,
    reviewDetail,
    rating,
    time,
    featured = false,
  }: Review & { featured?: boolean }) {
    return (
      <figure
        className={cn(
          "relative flex flex-col rounded-2xl border",
          "border-gray-950/10 bg-white shadow-sm hover:shadow-md",
          "dark:border-gray-50/10 dark:bg-gray-50/5",
          "transition-shadow duration-200",
          featured ? "p-6 lg:row-span-2 justify-between" : "p-5 ",
        )}
        ref={moreContentRef}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < Number(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300",
                  )}
                />
              ))}
              <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">
                ({rating}/5)
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {time}
            </span>
          </div>

          <blockquote
            className={cn(
              "text-gray-800 dark:text-gray-200 leading-relaxed",
              featured ? "text-base" : "text-sm",
            )}
          >
            "{reviewDetail}"
          </blockquote>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Image
            className="w-10 h-10 rounded-full object-cover shrink-0"
            width={40}
            height={40}
            alt={`${name} review`}
            src={photo}
            sizes="40px"
          />
          <div className="flex flex-col min-w-0">
            <figcaption className="text-sm font-semibold truncate text-gray-900 dark:text-white">
              {name}
            </figcaption>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {bookedService}
            </p>
          </div>
        </div>
      </figure>
    );
  }

  return (
    <section
      className="bg-card dark:bg-[radial-gradient(circle_at_center,rgba(19,50,102,1)_0%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_90%)] py-16 px-4"
      id="customer-reviews"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
        <div>
 
  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              <span className="w-5 h-px bg-blue-600 inline-block" />
              Trusted by Our Customers
              <span className="w-5 h-px bg-blue-600 inline-block" />
            </div>

  <div className="font-bold bg-clip-text text-transparent">
    <h1 className="text-4xl text-gray-950 dark:text-white mt-1">
      What Our <span className="text-[#2563EB]">Customers Say...</span>
    </h1>
  </div>

  <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
    Genuine feedback from people who use Taskoria every day.
  </p>
</div>

          <div className="flex flex-col items-start gap-2">
            <div className="flex -space-x-3">
              {reviews.map((review) => (
                <Image
                  key={review.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-gray-900"
                  width={44}
                  height={44}
                  alt={`${review.name} review`}
                  src={review.photo}
                  sizes="44px"
                />
              ))}
            </div>

            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 max-w-xs">
              <span className="font-semibold text-gray-900 dark:text-white">
                100+
              </span>{" "}
              users already using our services.
            </p>

            <div className="flex items-center gap-3">
              <Button className="flex items-center gap-1.5 px-5 rounded-xl  shadow-sm hover:shadow-md transition-shadow">
                <span
                  className="text-sm font-medium"
                  onClick={() => router.push("/signin")}
                >
                  Get a free trial
                </span>
                <MdOutlineArrowRightAlt size={18} />
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-1.5 px-5 rounded-full border-blue-600 text-blue-600 dark:text-blue-300 shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setShowAll(!showAll)}
              >
                <span className="text-sm font-medium">
                  {showAll ? "Read less reviews" : "Read more reviews"}
                </span>
                <MdOutlineArrowRightAlt size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
          {visibleValues.map((review, i) => (
            <ReviewCard
              key={review.name + review.time}
              {...review}
              featured={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
