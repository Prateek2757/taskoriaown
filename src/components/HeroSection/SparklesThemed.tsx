"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
const SparklesCore = dynamic(() => import("../ui/sparkles").then((module) => module.SparklesCore), { ssr: false });
const SparklesCoreLight = dynamic(() => import("../ui/sparklesLight").then((module) => module.SparklesCoreLight), { ssr: false });

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
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timer);
      setEnabled(false);
      if (query.matches) timer = setTimeout(() => setEnabled(true), 3000);
    };
    update();
    query.addEventListener("change", update);
    return () => {
      clearTimeout(timer);
      query.removeEventListener("change", update);
    };
  }, []);

  if (!enabled) return null;
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

  const Field = resolvedTheme === "dark" ? SparklesCore : SparklesCoreLight;
  return (
    <Field
      background="transparent"
      particleDensity={particleDensity}
      speed={speed}
      maxSize={maxSize}
      particleColor={particleColor}
      className="absolute inset-x-0 bottom-0 h-full w-full mask-[radial-gradient(50%_50%,black,transparent_85%)] dark:mask-[radial-gradient(50%_50%,white,transparent_85%)]"
    />
  );
}
