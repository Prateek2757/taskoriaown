export function StatCard({
    label,
    value,
    color,
    icon,
    active,
    onClick,
  }: {
    label: string;
    value: number;
    color: string;
    icon: string;
    active?: boolean;
    onClick?: () => void;
  }) {
    return (
      <div
        onClick={onClick}
        className={`bg-white dark:bg-zinc-900 border rounded-2xl p-5 flex items-center gap-4 transition-all
          ${onClick ? "cursor-pointer" : ""}
          ${
            active
              ? "border-[#2563EB] dark:border-[#3B82F6] ring-2 ring-[#2563EB]/20"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
      >
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-none">
            {value}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{label}</p>
        </div>
      </div>
    );
  }