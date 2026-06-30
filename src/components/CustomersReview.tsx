"use client"

import { cn } from "@/lib/utils";
import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const reviews = [
  {
    name: "Olivia Thompson",
    time: "2 weeks ago",
    rating:"5",
    reviewDetail:
      "Taskoria made it incredibly easy to find a reliable cleaner in Melbourne. The booking process was simple, and the service exceeded my expectations. Highly recommended!",
    photo: "/images/reviewimage1.avif",
  },
  {
    name: "Liam Anderson",
    time: "1 month ago",
     rating:"4",
    reviewDetail:
      "I needed an electrician urgently, and Taskoria connected me with a verified professional within minutes. Great experience from start to finish.",
    photo: "/images/reviewimage2.avif",
  },
  {
    name: "Charlotte Wilson",
    time: "5 days ago",
     rating:"5",
    reviewDetail:
      "Fantastic platform! I hired a gardener through Taskoria, and the quality of work was excellent. The reviews helped me choose the right person.",
    photo: "/images/reviewimage3.avif",
  },
  {
    name: "Noah Mitchell",
    time: "3 weeks ago",
     rating:"5",
    reviewDetail:
      "I've used Taskoria multiple times for home maintenance services, and every experience has been smooth and professional. It's now my go-to platform.",
    photo: "/images/reviewimage4oliva.jpg",
  },
];
export default function CustomersReview() {
    function ReviewCard({ photo, name,  reviewDetail, rating, time }: Review) {
  const [expanded, setExpanded] = useState(false);

  return (
    <figure
      className={cn(
        "relative w-76 shrink-0 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/10 bg-gray-950/[0.01] hover:bg-gray-950/5",
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15",
        "transition-colors duration-200"
      )}
    >
      <div className="flex items-start gap-3">
        <Image
          className="relative w-12 h-12 overflow-hidden rounded-full object-cover shrink-0"
          width={44}
          height={44}
          alt={`${name} review`}
          src={photo}
          sizes="44px"
        
        />

        <div className="flex flex-col flex-1 min-w-0">
          <figcaption className="text-base font-semibold truncate dark:text-white">
            {name}
          </figcaption>

          <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-0.5">
            {time && <span className="ml-1 text-gray-400">{time}</span>}
          </p>

          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"
                )}
              />
            ))}
          </div>
        </div>

        <Quote className="shrink-0 h-4 w-4 text-blue-400 dark:text-blue-400 opacity-60" />
      </div>

      <blockquote
        className={cn(
          "mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed",
          !expanded && "line-clamp-3"
        )}
      >
       {reviewDetail}
      </blockquote>

      {reviewDetail.length > 180 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs font-medium text-blue-500 hover:opacity-75"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </figure>
  );
}

  return (
    <section
      className="bg-card dark:bg-[radial-gradient(circle_at_center,rgba(19,50,102,1)_0%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_90%)] py-14 px-4"
      id="customer-reviews"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900 dark:to-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-3 border border-blue-100 dark:border-blue-800">
          Customer stories
        </div>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white ">
          What customers say about {" "}
          <span className="bg-[#2563EB] bg-clip-text text-transparent">
              Taskoria ...
            </span>{" "}
        </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Real hiring experiences from local customers.
        </p>
      </div>
        <div className="max-w-7xl flex shrink-0 gap-4 pr-4 mx-auto overflow-x-auto md:overflow-hidden">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>

    </section>
  );
}
