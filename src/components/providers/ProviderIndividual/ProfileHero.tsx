"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Shield,
  Award,
  Star,
  MapPin,
  CheckCircle2,
  MessageCircle,
  CalendarCheck,
  Share2,
  Users,
  Zap,
  Clock,
  X,
  ImagePlus,
  Check,
  Link as LinkIcon,
} from "lucide-react";

type ShareState = "idle" | "copied" | "shared";

function ShareButton({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  const [state, setState] = useState<ShareState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    timerRef.current = setTimeout(() => setState("idle"), 2200);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleShare = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const url = window.location.href;
    const shareData: ShareData = {
      title: name,
      text: description ?? `Check out ${name}'s profile`,
      url,
    };
    if (
      typeof navigator.share === "function" &&
      navigator.canShare?.(shareData)
    ) {
      try {
        await navigator.share(shareData);
        setState("shared");
        reset();
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      reset();
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setState("copied");
      reset();
    }
  }, [name, description, reset]);

  const label =
    state === "copied"
      ? "Link copied!"
      : state === "shared"
        ? "Shared!"
        : "Share";

  const Icon =
    state === "copied" || state === "shared" ? Check : Share2;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        aria-label={label}
        className={`
          w-9 h-9 rounded-full border mt-2 flex items-center justify-center transition-all duration-200
          ${
            state !== "idle"
              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              : "border-[#c5c5c5] dark:border-white/20 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8"
          }
        `}
      >
        <Icon className="w-4 h-4" />
      </button>
      {state !== "idle" && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap
            flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
            bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-lg
            animate-in fade-in slide-in-from-bottom-1 duration-150 pointer-events-none"
        >
          {state === "copied" ? (
            <><LinkIcon className="w-3 h-3" /> Link copied</>
          ) : (
            <><Check className="w-3 h-3" /> Shared!</>
          )}
        </div>
      )}
    </div>
  );
}

interface Provider {
  name?: string;
  image?: string;
  cover_image?: string;
  coverImage?: string;
  company_name?: string;
  verified?: boolean;
  ispro?: boolean;
  services?: string[];
  specialBadges?: string[];
  avg_rating?: number | string;
  rating?: number | string;
  total_reviews?: number;
  reviewCount?: number;
  jobscompleted?: number;
  completedJobs?: number;
  followers?: number;
  locationname?: string;
  responseTime?: string;
  memberSince?: string;
  description?: string;
  acceptingWork?: boolean;
  availability?: string;
}

interface ProfileHeroProps {
  provider: Provider;
  onBookClick?: () => void;
  onMessageClick?: () => void;
}

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function Lightbox({ src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Full size view of ${alt}`}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close image preview"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div
        className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full">
          <Image
            src={src || "coverimage"}
            alt={alt}
            fill
            className="object-contain rounded-lg select-none"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function ProBadge({ size = 28 }: { size?: number }) {
  const half = size / 2;
  const R = half * 0.84; 
  const r = half * 0.38;   
  const pts = Array.from({ length: 5 }, (_, i) => {
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const innerAngle = (i * 72 - 90 + 36) * (Math.PI / 180);
    return [
      `${half + R * Math.cos(outerAngle)},${half + R * Math.sin(outerAngle)}`,
      `${half + r * Math.cos(innerAngle)},${half + r * Math.sin(innerAngle)}`,
    ];
  }).flat().join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        {/* <linearGradient id="pb-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#FFF5C0" />
          <stop offset="45%"  stopColor="#C97B08" />
          <stop offset="100%" stopColor="#FFE070" />
        </linearGradient> */}
        {/* Dark shell */}
        <linearGradient id="pb-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FF9800" />
          <stop offset="100%" stopColor="#FF9800" />
        </linearGradient>
        {/* Gold disc */}
        <linearGradient id="pb-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FF9800" />
          
          <stop offset="100%" stopColor="#FF9800" />
        </linearGradient>
        {/* Gloss shine */}
        {/* <linearGradient id="pb-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient> */}
      </defs>

      {/* 1. Outer glow ring (stroke only) */}
      <circle
        cx={half} cy={half} r={half - 0.5}
        fill="url(#pb-shell)"
        stroke="url(#pb-ring)"
        strokeWidth="1.6"
      />

      <circle
        cx={half} cy={half} r={half - 2.4}
        fill="url(#pb-gold)"
      />

      {/* 3. Gloss shine — top-center ellipse */}
      {/* <ellipse
        cx={half - 0.5}
        cy={half * 0.52}
        rx={half * 0.55}
        ry={half * 0.28}
        fill="url(#pb-shine)"
      /> */}

      {/* 4. Star — mathematically centered */}
      <polygon
        points={pts}
        fill="#ffffff"
        opacity="0.92"
      />
    </svg>
  );
}

export function ProfileHero({
  provider,
  onBookClick,
  onMessageClick,
}: ProfileHeroProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  }, []);

  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  const services = Array.isArray(provider.services) ? provider.services : [];
  const specialBadges = Array.isArray(provider.specialBadges)
    ? provider.specialBadges
    : [];
  const rating = provider.avg_rating ?? provider.rating ?? "4.8";
  const reviewCount = provider.total_reviews ?? provider.reviewCount ?? 0;
  const completedJobs = provider.jobscompleted ?? provider.completedJobs;
  const companySrc = provider.cover_image ?? provider.coverImage;
  const hasCover = Boolean(companySrc);

  const initials = (provider.company_name ?? "")
    .split(" ")
    .map((w: string) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} alt={lightboxAlt} onClose={closeLightbox} />
      )}

      <div className="bg-white dark:bg-[#1d2226]  border border-[#e2e2e2] dark:border-white/10 rounded-xl shadow-sm overflow-hidden">

        <div className="relative h-36 sm:h-52 w-full overflow-hidden rounded-t-xl">
          {hasCover ? (
            <button
              type="button"
              aria-label="View cover photo"
              className="absolute inset-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
              onClick={() =>
                openLightbox(
                  companySrc!,
                  `${provider.name ?? "Provider"} cover photo`
                )
              }
            >
              <Image
                src={companySrc! || "coverphoto"}
                alt={`${provider.name ?? "Provider"} cover photo`}
                fill
                className="object-cover brightness-90 saturate-105 transition-transform duration-300 group-hover:scale-[1.02]"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
            </button>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-100 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900 flex items-center justify-center">
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                aria-hidden="true"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern
                    id="hero-dots"
                    x="0" y="0" width="24" height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1.5" cy="1.5" r="1.5" fill="#3b82f6" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-dots)" />
              </svg>
              <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-black/30 text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 backdrop-blur-sm transition-all shadow-sm select-none cursor-default">
                <ImagePlus className="w-4 h-4" />
                Oops! This pro forgot to upload their company photo 😅
              </div>
            </div>
          )}
        </div>

        <div
          className="relative px-5 sm:px-6 flex items-end justify-between"
          style={{ marginTop: "-52px" }}
        >
         <div className="w-24 h-24  relative z-10 group">

<button
  type="button"
  aria-label="View profile photo"
  className={`
    w-full h-full block rounded-full focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-blue-500 focus-visible:ring-offset-2
    ${provider.image ? "cursor-zoom-in" : "cursor-default pointer-events-none"}
  `}
  onClick={
    provider.cover_image
      ? () =>
          openLightbox(
            provider.cover_image!,
            `${provider.name ?? "Provider"} profile photo`
          )
      : undefined
  }
  disabled={!provider.cover_image}
>
  {provider.cover_image ? (
    <div
      className={`
        w-full h-full rounded-full overflow-hidden shadow-xl
        ${provider.ispro ? "ring-2 ring-yellow-400" : ""}
        transition-transform duration-200 group-hover:scale-105
      `}
    >
      <div className="relative w-full h-full">
        <Image
          src={provider.cover_image}
          alt={provider.name ?? "Provider"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, 128px"
          priority
        />
      </div>
    </div>
  ) : (
    <div className="h-full w-full shrink-0 text-2xl rounded-full bg-linear-to-br from-blue-600 via-blue-400 to-[#2536EB] text-white grid place-content-center font-semibold uppercase">
    {provider.company_name
      ?.split(" ")
      .map((w: string) => w[0])
      .join("")}
  </div>
  )}
</button>

{provider.ispro && (
  <div className="absolute bottom-0 right-1 z-20" title="Pro member" aria-label="Pro member">
    <ProBadge size={30} />
  </div>
)}

{provider.verified && (
  <div
    className={`absolute z-20 rounded-full p-0.5  bg-white dark:bg-[#1d2226] shadow-md ring-2 ring-white dark:ring-[#1d2226] ${
      provider.ispro ? "bottom-2 left-0" : "bottom-1 right-1"
    }`}
  >
    <CheckCircle2
      className="w-5 h-5 sm:w-6 sm:h-6 fill-blue-600 text-white"
      strokeWidth={1.5}
    />
  </div>
)}
</div>

          <div className="flex items-center gap-2 pt-2">
            <ShareButton
              name={provider.company_name ?? "Provider"}
              description={provider.description}
            />
            {onMessageClick && (
              <button
                type="button"
                onClick={onMessageClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Message
              </button>
            )}
            {onBookClick && (
              <button
                type="button"
                onClick={onBookClick}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all"
              >
                <CalendarCheck className="w-3.5 h-3.5" /> Book Now
              </button>
            )}
          </div>
        </div>

        <div className="px-5 sm:px-6 pt-3 pb-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
              {provider.company_name}
            </h1>
            {provider.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700">
                <Shield className="w-3 h-3" /> Verified
              </span>
            )}
          </div>

          {services.length > 0 && (
            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {services.join(" · ")}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {provider.locationname ?? "Nationwide"}
            </span>
            {provider.responseTime && (
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <Zap className="w-3 h-3" /> Responds in {provider.responseTime}
              </span>
            )}
            {provider.memberSince && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" /> Since {provider.memberSince}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-3">
            {Number(reviewCount) > 0 && (
              <button type="button" className="flex items-center gap-1.5 group">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  {rating}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {reviewCount} reviews
                </span>
              </button>
            )}
            {completedJobs != null && (
              <button type="button" className="flex items-center gap-1.5 group">
                <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  {completedJobs}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  jobs done
                </span>
              </button>
            )}
            {provider.followers != null && (
              <button type="button" className="flex items-center gap-1.5 group">
                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  {provider.followers}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  followers
                </span>
              </button>
            )}
          </div>

          {specialBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {specialBadges.map((b: string) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                >
                  <CheckCircle2 className="w-3 h-3" /> {b}
                </span>
              ))}
            </div>
          )}

          {provider.description && (
            <p className="mt-4 pt-4 border-t border-gray-100 dark:border-white/8 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 font-light">
              {provider.description}
            </p>
          )}
        </div>

        {provider.acceptingWork !== false && (
          <div className="mx-4 sm:mx-5 mb-4 px-4 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              ✦ Open to new bookings
              {provider.availability && (
                <span className="font-normal text-emerald-600 dark:text-emerald-500">
                  {" "}
                  · {provider.availability}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  );
}