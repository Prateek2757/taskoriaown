import { getStatusConfig } from "./helpers";

interface StatusBadgeProps {
  status: string;
  showDot?: boolean;
}

export default function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />
      )}
      {config.label}
    </span>
  );
}
