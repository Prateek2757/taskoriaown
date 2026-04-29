"use client";
import { cn } from "@/lib/utils";

interface NewMarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  speed?: number;
}

export default function NewMarquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  speed = 40,
}: NewMarqueeProps) {
  return (
    <div
      className={cn(
        "relative flex ", // ✅ added overflow-hidden
        pauseOnHover && "group",          // ✅ added group here
        className
      )}
      // style={{
      //   maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
      //   WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
      // }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            "flex shrink-0 gap-4 pr-4",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]" // ✅ now works
          )}
          style={{
            animationDuration: `${speed}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}