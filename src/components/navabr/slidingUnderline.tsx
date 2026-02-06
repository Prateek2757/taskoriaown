"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

function SlidingUnderlineNav({ currentLinks, pathname }: { currentLinks: any; pathname: string; }) {
    const [hovered, setHovered] = useState<string | null>(null);
    const [positions, setPositions] = useState<Record<string, { width: number; left: number }>>({});
    const containerRef = useRef<HTMLDivElement>(null);

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

    const activeLink = currentLinks.find((link: any) => link.href === pathname);
    const activeKey = hovered || (activeLink?.href);
    const activePos = activeKey ? positions[activeKey] : null;

  

    return (
        <div ref={containerRef} className="relative flex">
            {currentLinks.map((link: any) => (
                <Link
                    key={link.href}
                    data-nav-item={link.href}
                    href={link.href}
                    onMouseEnter={() => setHovered(link.href)}
                    onMouseLeave={() => setHovered(null)}
                    className={`relative py-3.5 font-medium text-sm px-6 transition-colors ${
                        pathname === link.href 
                            ? "text-[#3C7DED]" 
                            : "text-gray-700 dark:text-gray-300"
                    }`}
                >
                    {link.name}
                </Link>
            ))}

            {activePos && (
                <motion.span
                    className="absolute bottom-[-3px] h-[3px] bg-[#3C7DED] rounded-full"
                    initial={false}
                    animate={{
                        width: activePos.width - 48,
                        left: activePos.left + 24,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                />
            )}
        </div>
    );
}
export default SlidingUnderlineNav;