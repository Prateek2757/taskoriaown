import { GoTag } from "react-icons/go";

interface BadgeItem {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
}

export function ServicesBadges() {
  const badges: BadgeItem[] = [
    {
      icon: (
        <div className="flex flex-col gap-0.5">
          <GoTag size={26} className="text-[#2563EB]" />
        </div>
      ),
      label: "",
      sublabel: "No Obligation to Book",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
      label: "Verified",
      sublabel: "Local professionals",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-[#2563EB]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
          />
        </svg>
      ),
      label: "Fast Response",
      sublabel: "Quotes in minutes",
    },
  ];

  return (
<div className="inline-flex items-center divide-x divide-white/20 rounded-2xl z-10   bg-white/15 px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-2xl">      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center gap-2.5 px-4">
          <div className="shrink-0 ">{badge.icon}</div>

          {badge.label && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white leading-tight">
                {badge.label}
              </span>
              <span className="text-[14px] text-white">{badge.sublabel}</span>
            </div>
          )}

          {!badge.label && (
            <span className="text-[14px] text-white ">{badge.sublabel}</span>
          )}
        </div>
      ))}
    </div>
  );
}
