import { getAvatarColor, getInitials } from "./helpers";

interface AvatarProps {
  name: string;
  picture?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-9 h-9 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-base",
};

export default function Avatar({ name, picture, size = "md" }: AvatarProps) {
  const sizeClass = SIZE_CLASSES[size];
  const colorClass = getAvatarColor(name);
  const initials = getInitials(name);

  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ring-2 ring-white dark:ring-gray-800`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ring-2 ring-white dark:ring-gray-800`}
    >
      {initials}
    </div>
  );
}
