"use client";


import { useTheme } from "next-themes";
import { SparklesCore } from "../ui/sparkles";
import { SparklesCoreLight } from "../ui/sparklesLight";

interface SparklesThemedProps {
  variant: "underline" | "fullbleed";
  particleDensity?: number;
  speed?: number;
  minSize?: number;
  maxSize?: number;
}

export default function SparklesThemed({
  variant,
  particleDensity = 800,
  speed = 1,
  minSize = 0.4,
  maxSize = 1.7,
}: SparklesThemedProps) {
  const { resolvedTheme } = useTheme();
  const particleColor = resolvedTheme === "dark" ? "#fff" : "#000";

  if (variant === "underline") {
    // Compact sparkle bar — rendered inside the headline span
    return (
      <SparklesCore
        background="transparent"
        minSize={minSize}
        maxSize={maxSize}
        particleDensity={particleDensity}
        className="w-full h-full"
        particleColor={particleColor}
      />
    );
  }

  // "fullbleed" — the decorative bottom field.
  // SparklesCoreLight is used in light mode, SparklesCore in dark.
  // Both rendered with CSS visibility toggling to avoid a flash on hydration.
  return (
    <>
      {/* Light-mode sparkles (hidden in dark via Tailwind) */}
      <SparklesCoreLight
        particleDensity={particleDensity}
        speed={speed}
        maxSize={maxSize}
        particleColor={particleColor}
        className="absolute inset-x-0 bottom-0 h-full w-full
          mask-[radial-gradient(50%_50%,black,transparent_85%)]
          dark:mask-[radial-gradient(50%_50%,white,transparent_85%)]
          dark:hidden"
      />
      {/* Dark-mode sparkles (hidden in light via Tailwind) */}
      <SparklesCore
        background="transparent"
        particleDensity={particleDensity}
        speed={speed}
        maxSize={maxSize}
        particleColor={particleColor}
        className="absolute inset-x-0 bottom-0 h-full w-full
          mask-[radial-gradient(50%_50%,black,transparent_85%)]
          dark:mask-[radial-gradient(50%_50%,white,transparent_85%)]
          hidden dark:block"
      />
    </>
  );
}