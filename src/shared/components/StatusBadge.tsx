import { cn } from "@/shared/lib/utils";

export type StatusBadgeTone = "success" | "warning" | "danger" | "neutral";

const toneStyles: Record<StatusBadgeTone, string> = {
  success: "text-(--accent-green)",
  warning: "text-(--accent-yellow)",
  danger: "text-destructive",
  neutral: "text-muted-foreground",
};

interface StatusBadgeProps {
  tone: StatusBadgeTone;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap",
        toneStyles[tone],
        className
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {children}
    </span>
  );
}
