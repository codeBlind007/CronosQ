import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 72;
  const height = 24;
  const padding = 2;

  const points = data
    .map((value, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y =
        height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="opacity-60"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="#6366F1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  sparkline?: number[];
  variant?: "featured" | "compact";
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendValue,
  sparkline,
  variant = "compact",
  className,
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-[#22C55E]"
      : trend === "down"
        ? "text-[#EF4444]"
        : "text-[#71717A]";

  if (variant === "featured") {
    return (
      <div className={cn("card card-hover p-6 flex flex-col gap-4", className)}>
        <span className="text-sm font-medium text-[#A1A1AA]">{label}</span>
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[40px] font-bold tracking-tight text-[#FAFAFA] leading-none">
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {trend && trendValue && (
              <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
                <TrendIcon size={14} />
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          {sparkline && sparkline.length > 1 && <Sparkline data={sparkline} />}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("card card-hover p-5 flex flex-col gap-3", className)}>
      <span className="text-sm font-medium text-[#A1A1AA]">{label}</span>
      <span className="text-2xl font-semibold tracking-tight text-[#FAFAFA]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </div>
  );
}
