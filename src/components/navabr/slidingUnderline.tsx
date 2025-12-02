"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

function SlidingUnderlineNav({ currentLinks, pathname }: { currentLinks: any; pathname: any; }) {
    const [hovered, setHovered] = useState<string | null>(null);
    const [positions, setPositions] = useState<Record<string, { width: number; left: number }>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    // measure item widths + offsets
    useEffect(() => {
        if (!containerRef.current) return;

        const items = containerRef.current.querySelectorAll<HTMLElement>("[data-nav-item]");
        const pos: Record<string, { width: number; left: number }> = {};

        items.forEach((el) => {
            pos[el.dataset.navItem!] = {
                width: el.offsetWidth,
                left: el.offsetLeft,
            };
        });

        setPositions(pos);
    }, [currentLinks]);

    const activeKey = hovered || pathname;
    const activePos = positions[activeKey];

    return (
        <div ref={containerRef} className="relative flex">
            {currentLinks.map((link: any) => (
                <Link
                    key={link.href}
                    data-nav-item={link.href}
                    href={link.href}
                    onMouseEnter={() => setHovered(link.href)}
                    onMouseLeave={() => setHovered(null)}
                    className="relative py-3.5 font-medium text-sm text-gray-700 dark:text-gray-300 px-6"
                >
                    {link.name}
                </Link>
            ))}

            {activePos && (
                <motion.span
                    className="absolute bottom-[-3px] h-[3px] bg-[#3C7DED] "
                    animate={{
                        width: activePos.width - 48,
                        left: activePos.left + 24,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 38,
                    }}
                />
            )}
        </div>
    );
}
export default SlidingUnderlineNav;