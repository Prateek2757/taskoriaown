"use client";

import { memo } from "react";
import Image from "next/image";
import { User, Star } from "lucide-react";

export interface AvatarProps {
  src?: string | null;
  size?: "sm" | "md";
  isPro?: boolean;
}

const NavAvatar = memo(function NavAvatar({
  src,
  size = "md",
  isPro,
}: AvatarProps) {
  const dim = size === "sm" ? "w-8 h-8" : "w-11 h-11";
  const starDim = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${dim} relative rounded-full flex items-center justify-center
          bg-gradient-to-br from-blue-100 to-cyan-100
          dark:from-blue-900 dark:to-cyan-900 overflow-hidden
          ${isPro ? "ring-2 ring-yellow-400" : ""}`}
      >
        {src ? (
          <Image
            src={src}
            alt="Profile"
            fill
            className="object-cover rounded-full"
            sizes={size === "sm" ? "32px" : "40px"}
            priority
          />
        ) : (
          <User className={`${iconSize} text-blue-600 dark:text-blue-300`} />
        )}
      </div>
      {isPro && (
        <div
          className={`absolute -bottom-1 -right-1 ${starDim} rounded-full
            bg-gradient-to-br from-yellow-400 to-orange-500
            flex items-center justify-center
            ring-2 ring-white dark:ring-slate-900 shadow-md`}
        >
          <Star className="w-2.5 h-2.5 text-white fill-white" />
        </div>
      )}
    </div>
  );
});

export default NavAvatar;
