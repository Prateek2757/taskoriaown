"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, ShieldCheck, Briefcase, Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Response = {
  id: number;
  public_id:string;
  company_slug:string;
  display_name: string;
  profile_title: string;
  title: string;
  profile_image_url?: string;
  rating?: number;
  review_count?: number;
  completed_jobs?: number;
  response_time?: string;
  is_verified?: boolean;
  is_featured?: boolean;
  proposal?: string;
  bid_amount?: number;
};

interface TaskResponseCardProps {
  response: Response;
  index: number;
  onMessageClick: (responseId: number) => void;
  onViewProfile?: (responseId: string) => void;
}

const AVATAR_GRADIENTS = [
  ["#0ea5e9", "#0284c7"],
  ["#8b5cf6", "#7c3aed"],
  ["#f59e0b", "#d97706"],
  ["#10b981", "#059669"],
  ["#f43f5e", "#e11d48"],
];

function StarRating({ rating = 0, count = 0 }: { rating: number; count: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              "h-4 w-4 transition-colors",
              s <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200"
            )}
          />
        ))}
      </div>
      {count > 0 && (
        <span className="text-[13px] font-medium text-slate-500">
          {count} {count === 1 ? "review" : "reviews"}
        </span>
      )}
    </div>
  );
}

export function TaskResponseCard({
  response,
  index,
  onMessageClick,
  onViewProfile,
}: TaskResponseCardProps) {
  const initials = response.display_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

//   const [from, to] = AVATAR_GRADIENTS[response.id % AVATAR_GRADIENTS.length];
  const isFeatured = response.is_featured;
  // console.log(response,"responsesssss");
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-auto overflow-y-auto overflow-x-auto "
    >
      <div
        className={cn(
          "relative flex flex-col items-center overflow-hidden rounded-2xl  border  text-center transition-all duration-300",
          "hover:shadow-2xl hover:-translate-y-1","backdrop-blur-sm",
"group-hover:shadow-blue-400","hover:ring-1 hover:ring-blue-200/50",
          isFeatured
            ? "border-blue-300 shadow-lg shadow-blue-100"
            : "border-slate-200 shadow-md shadow-blue-300 hover:border-slate-300"
        )}
      >
        {isFeatured && (
          <div className="absolute left-0 top-0 z-10 flex w-[32%] flex-col items-center rounded-br-2xl bg-gradient-to-br from-[#2563EB] to-blue-500 p-1 shadow-md">
            <Star className="h-4 w-4 fill-white text-white" />
            <span className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-white">
              Featured
            </span>
          </div>
         )} 

        <div
          className="absolute inset-x-0 top-0 h-1 opacity-80"
          style={{ background: `linear-gradient(90deg` }}
        />

        <div className="flex w-full flex-col items-center px-9 pb-5 pt-4">
          <div className="relative mb-3">
            <div
              className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-xl font-bold text-white shadow-md ring-4 ring-white"
              style={{
                background: response.profile_image_url
                  ? undefined
                  : `linear-gradient(135deg`,
              }}
            >
              {response.profile_image_url ? (
                <Image
                  src={response.profile_image_url}
                  alt={response.display_name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            {response.is_verified && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
              </div>
            )}
          </div>

          <h3 className="mb-0.5 line-clamp-1 w-full text-[15px] font-bold ">
            {response.display_name}
          </h3>

          {response.profile_title && (
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {response.profile_title}
            </p>
          )}

          {/* <StarRating rating={response.rating ?? 0} count={response.review_count ?? 0} /> */}

          <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {(response.proposal || response.title) && (
            <p className="mb-3 line-clamp-2 text-[13px] font-semibold leading-snug text-slate-700">
              {response.proposal || response.title}
            </p>
          )}

          <div className="mb-4 flex w-full items-center justify-center gap-4">
            {response.completed_jobs !== undefined && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Briefcase className="h-3 w-3" />
                <span>{response.completed_jobs} jobs</span>
              </div>
            )}
            {response.response_time && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{response.response_time}</span>
              </div>
            )}
            {response.bid_amount && (
              <div className="text-[11px] font-bold text-slate-700">
                ${response.bid_amount.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={() => onMessageClick(response.id)}
            className={cn(
              "w-full rounded-xl p-2.5 text-[13px] font-bold text-white shadow-sm transition-all duration-200",
              "active:scale-[0.98] hover:brightness-40",
              isFeatured
                ? "bg-linear-to-r from-[#2563EB] to-blue-600 shadow-blue-200"
                : "bg-linear-to-r from-slate-700 to-slate-800 shadow-slate-200"
            )}
          >
            <span className="flex items-center justify-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              View Response
            </span>
          </button>

          {onViewProfile && (
            <button
              onClick={() => onViewProfile(response.company_slug)}
              className="mt-2 text-[11px] font-medium text-slate-400 underline-offset-2 hover:text-blue-600 hover:underline transition-colors"
            >
              View Profile
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}