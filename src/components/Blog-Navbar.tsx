import Link from "next/link";
import { MdOutlineArrowRightAlt } from "react-icons/md";

export default function BlogNavbar() {
  const navLinks = [{ name: "WWW.TASKORIA.COM", href: "/" }];

  return (
    <header className="bg-white/95 backdrop-blur-md sticky w-full top-0 z-[9999]  ">
      <div className=" container max-w-7xl mx-auto px-4 py-3 flex justify-between items-center sm:justify-between">
        <p className="text-base md:text-2xl font-bold text-blue-600 sm:md">
          The Taskoria
          <span className="text-black"> Blog</span>
        </p>

        <nav className="flex items-center gap-4">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-blue-600 md:text-sm text-xs flex items-center gap-1 hover:underline"
            >
              <span className="hidden md:block">{link.name}</span>

              <MdOutlineArrowRightAlt size={26} />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
