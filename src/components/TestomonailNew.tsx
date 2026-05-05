"use client";
import { cn } from "@/lib/utils";
import { Quote, Star, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import {  useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  body: string;
  img: string;
  time: string;
}

interface Meta {
  rating: number;
  total: number;
}

const AVATAR_BASE =
  "https://ui-avatars.com/api/?background=3b82f6&color=fff&bold=true&name=";

function avatarFallback(name: string) {
  return `${AVATAR_BASE}${encodeURIComponent(name)}`;
}

function transform(r: any, i: number): Review {
  return {
    id: String(i),
    name: r.author_name ?? "Anonymous",
    location: "Google Review",
    rating: r.rating ?? 5,
    body: r.text ?? "",
    img: r.profile_photo_url ?? avatarFallback(r.author_name ?? "A"),
    time: r.relative_time_description ?? "",
  };
}

function ReviewCard({ img, name, location, body, rating, time }: Review) {
  const [expanded, setExpanded] = useState(false);

  return (
    <figure
      className={cn(
        "relative w-76 shrink-0 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/10 bg-gray-950/[0.01] hover:bg-gray-950/5",
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15",
        "transition-colors duration-200",
      )}
    >
      <div className="flex items-start gap-3">
        <Image
          className="rounded-lg object-cover shrink-0"
          width={44}
          height={44}
          alt={`${name} review`}
          src={img}
          onError={(e) => {
            (e.target as HTMLImageElement).src = avatarFallback(name);
          }}
        />

        <div className="flex flex-col flex-1 min-w-0">
          <figcaption className="text-base font-semibold truncate dark:text-white">
            {name}
          </figcaption>

          <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-0.5">
            {location}
            {time && <span className="ml-1 text-gray-400">· {time}</span>}
          </p>

          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300",
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
        {body}
      </blockquote>

      {body.length > 180 && (
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

export default function Testimonial() {
  // const [reviews, setReviews] = useState<Review[]>([]);
  // const [meta, setMeta] = useState<Meta | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   async function fetchReviews() {
  //     try {
  //       const res = await fetch("/api/google-reviews");
  //       if (!res.ok) throw new Error(`HTTP ${res.status}`);
  //       const data = await res.json();

  //       const raw: any[] = data?.reviews ?? [];
  //       const filtered = raw
  //         .filter((r) => r.text && r.text.length > 20)
  //         .map(transform);

  //       setReviews(filtered);
  //       if (data.ratings) {
  //         setMeta({ rating: data.ratings, total: data.totalRatings });
  //       }
  //     } catch (err: any) {
  //       setError(err.message ?? "Failed to load reviews");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchReviews();
  // }, []);

  const { data, error, isLoading:loading } = useSWR(
    "/api/google-reviews",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      revalidateIfStale: false,
      dedupingInterval: 86_400_000,
    }
  );

  const raw = data?.reviews ?? [];

const reviews = raw
  .filter((r: any) => r.text && r.text.length > 20)
  .map(transform);

const meta = {
  rating: data?.ratings,
  total: data?.totalRatings,
};

  return (
    <section
      className="bg-card dark:bg-[radial-gradient(circle_at_center,rgba(19,50,102,1)_0%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_90%)] py-14 px-4"
      id="customer-reviews"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold mb-3 border border-blue-100 dark:border-blue-800">
          Customer stories
        </div>

        <h2 className="text-3xl font-semibold text-foreground">
          What customers say about Taskoria
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Real hiring experiences from local customers.
        </p>
      </div>
      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-16">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading reviews…
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-red-500 py-16">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-16">
          No reviews found.
        </p>
      )}
      {!loading && reviews.length > 0 && (
        <div className="max-w-7xl flex shrink-0 gap-4 pr-4 mx-auto overflow-x-auto md:overflow-hidden">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>
      )}
      {reviews.length > 0 && (
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
                ratingValue: meta?.rating.toFixed(1) ?? "5",
                reviewCount: (meta?.total ?? reviews.length).toString(),
                bestRating: "5",
                worstRating: "1",
              },
              review: reviews.map((r) => ({
                "@type": "Review",
                author: { "@type": "Person", name: r.name },
                reviewBody: r.body,
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: r.rating.toString(),
                  bestRating: "5",
                  worstRating: "1",
                },
              })),
            }),
          }}
        />
      )}
    </section>
  );
}
