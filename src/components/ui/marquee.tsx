import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: ReactNode;
  vertical?: boolean;
  repeat?: number;
  duration?: string;
  gap?: string;
}

export default function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = "40s",
  gap = "1rem",
  style,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      style={
        {
          "--duration": duration,
          "--gap": gap,
          ...style,
        } as CSSProperties
      }
      className={cn(
        "group flex overflow-hidden p-2 gap-(--gap)",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around gap-(--gap)", {
              "animate-marquee flex-row": !vertical && !reverse,
              "animate-marquee-vertical flex-col": vertical && !reverse,
              "animate-marquee-reverse flex-row": !vertical && reverse,
              "animate-marquee-vertical-reverse flex-col": vertical && reverse,
              "group-hover:paused": pauseOnHover,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
