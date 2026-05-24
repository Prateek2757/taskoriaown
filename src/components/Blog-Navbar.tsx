import Link from "next/link";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { ThemeToggle } from "./theme-toggle";

export default function BlogNavbar() {
  const navLinks = [{ name: "WWW.TASKORIA.COM", href: "/" }];

  return (
    <header className="bg-white/95 backdrop-blur-md sticky w-full top-0 z-[9999] dark:bg-gray-900/70 dark:border-white/10  ">
      <div className=" container max-w-7xl mx-auto px-4 py-3 flex justify-between items-center sm:justify-between">
        <p className="text-2xl md:text-2xl font-bold text-[#2563EB] sm:md">
          The Taskoria
          <span className="text-black dark:text-white"> Blog</span>
        </p>

        <nav className="flex items-center gap-4">
          <div suppressHydrationWarning>
            <ThemeToggle />
          </div>
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-[#2563EB] md:text-sm text-xs flex items-center gap-1 hover:underline"
            >
              <span className="hidden md:block">{link.name}</span>

              <MdOutlineArrowRightAlt size={30} />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
