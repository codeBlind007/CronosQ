import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  iconColor?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  className,
  iconColor = "text-indigo-400",
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-green-400"
      : trend === "down"
        ? "text-red-400"
        : "text-zinc-400";

  return (
    <div
      className={cn(
        "card card-hover p-5 flex flex-col gap-4 fade-in",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-400">{label}</span>
        <div
          className={cn(
            "p-2 rounded-lg bg-zinc-800/60",
            iconColor.replace("text-", "bg-").replace("400", "400/10")
          )}
        >
          <Icon size={16} className={iconColor} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-3xl font-semibold tracking-tight text-zinc-50">
          {value}
        </span>

        {trend && trendValue && (
          <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
            <TrendIcon size={12} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
