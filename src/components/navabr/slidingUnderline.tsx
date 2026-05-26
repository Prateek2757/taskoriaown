"use client";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────
interface NavLink {
  href: string;
  name: string;
}

interface Position {
  width: number;
  left: number;
}

function SlidingUnderlineNav({
  currentLinks,
  pathname,
}: {
  currentLinks: NavLink[];
  pathname: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculate = () => {
      const c = containerRef.current;
      if (!c) return;
      const containerRect = c.getBoundingClientRect();
      const items = c.querySelectorAll<HTMLElement>("[data-nav-item]");
      const newPos: Record<string, Position> = {};

      items.forEach((el) => {
        const key = el.dataset.navItem;
        if (!key) return;
        const rect = el.getBoundingClientRect();
        newPos[key] = {
          width: rect.width,
          left: rect.left - containerRect.left,
        };
      });

      setPositions(newPos);
    };

    // Use ResizeObserver on the container itself — simpler and covers all children
    const observer = new ResizeObserver(() => requestAnimationFrame(calculate));
    observer.observe(container);
    requestAnimationFrame(calculate); // initial measurement

    return () => observer.disconnect();
  }, [currentLinks]);

  const activeKey =
    hovered ??
    currentLinks.find((l) => {
      if (l.href === pathname) return true;
      if (l.href.startsWith("/messages") && pathname.startsWith("/messages")) return true;
      return false;
    })?.href;
  const activePos = activeKey ? positions[activeKey] : null;

  return (
    <div ref={containerRef} className="relative flex">
      {currentLinks.map((link) => (
        <Link
          key={link.href}
          prefetch
          href={link.href}
          data-nav-item={link.href}
          onMouseEnter={() => setHovered(link.href)}
          onMouseLeave={() => setHovered(null)}
          className={`relative py-3.5 px-6 font-medium text-sm transition-colors ${
            pathname === link.href || (link.href.startsWith("/messages") && pathname.startsWith("/messages"))
              ? "text-[#2563EB] dark:text-[#4d86e7]"
              : "text-gray-700 dark:text-gray-300 hover:text-[#2563EB] dark:hover:text-[#4d86e7]"
          }`}
        >
          {link.name}
        </Link>
      ))}

      {/* AnimatePresence handles the indicator mounting/unmounting cleanly */}
      <AnimatePresence>
        {activePos && (
          <motion.span
            key="underline"
            className="absolute bottom-[-3px] h-[3px] bg-[#2563EB] dark:bg-[#4d86e7] rounded-full"
            initial={{ opacity: 0, width: activePos.width - 48, left: activePos.left + 24 }}
            animate={{ opacity: 1, width: activePos.width - 48, left: activePos.left + 24 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default SlidingUnderlineNav;